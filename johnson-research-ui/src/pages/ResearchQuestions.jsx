import { useEffect, useState } from 'react'
import { HelpCircle, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWorkspace } from '../contexts/WorkspaceContext'

function ResearchQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('research_questions')
        .select('*')
        .order('priority')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching questions:', error)
      } else {
        setQuestions(data || [])
      }
      setLoading(false)
    }

    fetchQuestions()
  }, [])

  const priorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'cannot_resolve': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Research Questions</h1>
          <p className="text-faded-ink mt-1">
            Track open questions and research needs
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-faded-ink">Loading...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="card text-center py-12">
          <HelpCircle size={48} className="mx-auto text-faded-ink mb-4" />
          <p className="text-faded-ink mb-2">No research questions yet.</p>
          <p className="text-sm text-faded-ink">
            Add questions as you discover gaps in the research.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => (
            <div key={q.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs uppercase px-2 py-1 rounded ${priorityColor(q.priority)}`}>
                    {q.priority}
                  </span>
                  <span className={`text-xs uppercase px-2 py-1 rounded ${statusColor(q.status)}`}>
                    {q.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <p className="font-medium">{q.question}</p>
              {q.context && (
                <p className="text-sm text-faded-ink mt-2">{q.context}</p>
              )}
              {q.resolution && (
                <div className="mt-3 p-3 bg-green-50 rounded">
                  <p className="text-sm font-medium text-green-800">Resolution:</p>
                  <p className="text-sm text-green-700">{q.resolution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResearchQuestions
