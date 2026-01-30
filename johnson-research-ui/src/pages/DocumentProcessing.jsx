import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, FileText, RefreshCw, CheckCircle, AlertCircle,
  Clock, Loader2, Eye, Play, Filter
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ProcessingStatusCard } from '../components/events'
import { PROCESSING_STATUS } from '../lib/eventTypes'
import { processDocument, retryProcessing } from '../services/documentProcessingService'

function DocumentProcessing() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(null) // Currently processing document ID
  const [processingProgress, setProcessingProgress] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    uploaded: 0,
    processing: 0,
    review: 0,
    complete: 0,
    error: 0
  })

  const fetchDocuments = async () => {
    setLoading(true)

    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter) {
      query = query.eq('processing_status', statusFilter)
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('processing_status')

    if (!error && data) {
      const statCounts = {
        total: data.length,
        uploaded: 0,
        processing: 0,
        review: 0,
        complete: 0,
        error: 0
      }

      data.forEach(doc => {
        if (doc.processing_status === 'uploaded') statCounts.uploaded++
        else if (['analyzing', 'extracting', 'matching'].includes(doc.processing_status)) statCounts.processing++
        else if (doc.processing_status === 'review') statCounts.review++
        else if (doc.processing_status === 'complete') statCounts.complete++
        else if (doc.processing_status === 'error') statCounts.error++
      })

      setStats(statCounts)
    }
  }

  useEffect(() => {
    fetchDocuments()
    fetchStats()
  }, [statusFilter])

  const handleFileUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    let uploadedCount = 0

    for (const file of files) {
      try {
        // Read file content
        const text = await file.text()
        const lines = text.split('\n')

        // Determine file type from extension
        const ext = file.name.split('.').pop()?.toLowerCase()
        let fileType = 'text'
        if (ext === 'json') fileType = 'json'
        else if (ext === 'csv') fileType = 'csv'
        else if (ext === 'tsv') fileType = 'tsv'

        // Create document record
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title: file.name,
            document_type: 'other',
            file_type: fileType,
            raw_text: text,
            line_count: lines.length,
            processing_status: 'uploaded'
          })
          .select()
          .single()

        if (error) {
          console.error('Error creating document:', error)
          alert(`Error uploading ${file.name}: ${error.message}`)
        } else {
          uploadedCount++
          setDocuments(prev => [data, ...prev])
          setStats(prev => ({
            ...prev,
            total: prev.total + 1,
            uploaded: prev.uploaded + 1
          }))
        }
      } catch (err) {
        console.error('Error reading file:', err)
        alert(`Error reading ${file.name}: ${err.message}`)
      }
    }

    setUploading(false)
    e.target.value = '' // Reset input

    // Refetch to ensure consistency
    if (uploadedCount > 0) {
      await fetchDocuments()
      await fetchStats()
    }
  }

  const handleStartProcessing = async (doc) => {
    if (processing) {
      alert('Another document is currently being processed. Please wait.')
      return
    }

    setProcessing(doc.id)
    setProcessingProgress({ phase: 'starting', message: 'Starting processing...' })

    // Update local state immediately
    setDocuments(prev => prev.map(d =>
      d.id === doc.id ? { ...d, processing_status: 'analyzing' } : d
    ))
    setStats(prev => ({
      ...prev,
      uploaded: prev.uploaded - 1,
      processing: prev.processing + 1
    }))

    try {
      const result = await processDocument(doc.id, (progress) => {
        setProcessingProgress(progress)
      })

      if (result.success) {
        // Check if this was a structured JSON import
        if (result.peopleCreated !== undefined) {
          alert(`Import complete!\n\nPeople: ${result.peopleCreated} created, ${result.peopleMatched || 0} matched\nRelationships: ${result.relationshipsCreated || 0}\nEvents: ${result.eventCount}\nLocations: ${result.locationsCreated || 0} (${result.locationResidentsCreated || 0} resident records)`)
        } else {
          alert(`Processing complete!\n\nExtracted ${result.eventCount} events with ${result.participantCount} participants.\n\nMatched: ${result.probable} probable, ${result.possible} possible`)
        }
      } else {
        alert(`Processing failed: ${result.error}`)
      }
    } catch (err) {
      console.error('Processing error:', err)
      alert(`Processing error: ${err.message}`)
    }

    setProcessing(null)
    setProcessingProgress(null)

    // Refresh data
    await fetchDocuments()
    await fetchStats()
  }

  const handleRetry = async (doc) => {
    try {
      await retryProcessing(doc.id)

      setDocuments(prev => prev.map(d =>
        d.id === doc.id ? { ...d, processing_status: 'uploaded', error_message: null } : d
      ))
      setStats(prev => ({
        ...prev,
        error: prev.error - 1,
        uploaded: prev.uploaded + 1
      }))
    } catch (err) {
      console.error('Retry error:', err)
      alert(`Failed to reset document: ${err.message}`)
    }
  }

  // Group documents by status for display
  const pendingDocs = documents.filter(d => d.processing_status === 'uploaded')
  const processingDocs = documents.filter(d =>
    ['analyzing', 'extracting', 'matching'].includes(d.processing_status)
  )
  const reviewDocs = documents.filter(d => d.processing_status === 'review')
  const completeDocs = documents.filter(d => d.processing_status === 'complete')
  const errorDocs = documents.filter(d => d.processing_status === 'error')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1>Document Processing</h1>
          <p className="text-faded-ink mt-1">
            Upload and process historical documents to extract events
          </p>
        </div>
        <label className="btn-primary flex items-center gap-2 cursor-pointer">
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Files'}
          <input
            type="file"
            multiple
            accept=".txt,.csv,.tsv,.json"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter('')}
          className={`card text-center cursor-pointer hover:shadow-md transition-shadow ${
            !statusFilter ? 'ring-2 ring-sepia' : ''
          }`}
        >
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-sm text-faded-ink">Total</div>
        </button>
        <button
          onClick={() => setStatusFilter('uploaded')}
          className={`card text-center cursor-pointer hover:shadow-md transition-shadow ${
            statusFilter === 'uploaded' ? 'ring-2 ring-sepia' : ''
          }`}
        >
          <div className="text-3xl font-bold text-gray-600">{stats.uploaded}</div>
          <div className="text-sm text-faded-ink">Pending</div>
        </button>
        <button
          onClick={() => setStatusFilter('analyzing')}
          className={`card text-center cursor-pointer hover:shadow-md transition-shadow ${
            statusFilter === 'analyzing' ? 'ring-2 ring-sepia' : ''
          }`}
        >
          <div className="text-3xl font-bold text-blue-600">{stats.processing}</div>
          <div className="text-sm text-faded-ink">Processing</div>
        </button>
        <button
          onClick={() => setStatusFilter('review')}
          className={`card text-center cursor-pointer hover:shadow-md transition-shadow ${
            statusFilter === 'review' ? 'ring-2 ring-sepia' : ''
          }`}
        >
          <div className="text-3xl font-bold text-yellow-600">{stats.review}</div>
          <div className="text-sm text-faded-ink">Ready for Review</div>
        </button>
        <button
          onClick={() => setStatusFilter('complete')}
          className={`card text-center cursor-pointer hover:shadow-md transition-shadow ${
            statusFilter === 'complete' ? 'ring-2 ring-sepia' : ''
          }`}
        >
          <div className="text-3xl font-bold text-green-600">{stats.complete}</div>
          <div className="text-sm text-faded-ink">Complete</div>
        </button>
      </div>

      {/* Processing Progress Banner */}
      {processing && processingProgress && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-4">
          <Loader2 className="text-blue-600 animate-spin" size={24} />
          <div className="flex-1">
            <div className="font-medium text-blue-800">
              Processing Document...
            </div>
            <div className="text-sm text-blue-600">{processingProgress.message}</div>
            {processingProgress.progress !== undefined && (
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {stats.error > 0 && (
        <div
          onClick={() => setStatusFilter('error')}
          className="p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors flex items-center gap-3"
        >
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <div className="font-medium text-red-800">
              {stats.error} document{stats.error !== 1 ? 's' : ''} failed processing
            </div>
            <div className="text-sm text-red-600">Click to view and retry</div>
          </div>
        </div>
      )}

      {/* Document Lists */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-sepia" size={32} />
        </div>
      ) : documents.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-faded-ink mb-4" />
          <p className="text-faded-ink mb-4">
            {statusFilter
              ? 'No documents match this filter.'
              : 'No documents uploaded yet. Upload files to begin processing.'}
          </p>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter('')}
              className="btn-secondary"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Documents */}
          {(!statusFilter || statusFilter === 'uploaded') && pendingDocs.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Clock className="text-gray-500" size={20} />
                Pending ({pendingDocs.length})
              </h2>
              <div className="space-y-3">
                {pendingDocs.map(doc => (
                  <ProcessingStatusCard
                    key={doc.id}
                    document={doc}
                    onResume={handleStartProcessing}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {/* Processing Documents */}
          {(!statusFilter || ['analyzing', 'extracting', 'matching'].includes(statusFilter)) && processingDocs.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Loader2 className="text-blue-500 animate-spin" size={20} />
                Processing ({processingDocs.length})
              </h2>
              <div className="space-y-3">
                {processingDocs.map(doc => (
                  <ProcessingStatusCard
                    key={doc.id}
                    document={doc}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ready for Review */}
          {(!statusFilter || statusFilter === 'review') && reviewDocs.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Eye className="text-yellow-500" size={20} />
                Ready for Review ({reviewDocs.length})
              </h2>
              <div className="space-y-3">
                {reviewDocs.map(doc => (
                  <ProcessingStatusCard
                    key={doc.id}
                    document={doc}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {/* Complete */}
          {(!statusFilter || statusFilter === 'complete') && completeDocs.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Complete ({completeDocs.length})
              </h2>
              <div className="space-y-3">
                {completeDocs.map(doc => (
                  <ProcessingStatusCard
                    key={doc.id}
                    document={doc}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {(!statusFilter || statusFilter === 'error') && errorDocs.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Errors ({errorDocs.length})
              </h2>
              <div className="space-y-3">
                {errorDocs.map(doc => (
                  <ProcessingStatusCard
                    key={doc.id}
                    document={doc}
                    onRetry={handleRetry}
                    compact
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DocumentProcessing
