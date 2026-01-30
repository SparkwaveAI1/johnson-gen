import { useState, useEffect } from 'react'
import { X, Merge, AlertTriangle, ArrowRight, Check, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { mergeProfiles, findPotentialDuplicates } from '../../services/mergeService'
import PersonSelector from './PersonSelector'
import ConfidenceIndicator from '../common/ConfidenceIndicator'

/**
 * MergeProfilesModal - UI for merging duplicate person profiles
 *
 * Props:
 * - isOpen: boolean to show/hide modal
 * - onClose: callback when modal is closed
 * - primaryPerson: optional pre-selected primary person
 * - onMergeComplete: callback after successful merge
 */
function MergeProfilesModal({ isOpen, onClose, primaryPerson = null, onMergeComplete }) {
  const [primary, setPrimary] = useState(primaryPerson)
  const [secondary, setSecondary] = useState(null)
  const [potentialDuplicates, setPotentialDuplicates] = useState([])
  const [loadingDuplicates, setLoadingDuplicates] = useState(false)
  const [merging, setMerging] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  // Options
  const [mergeBio, setMergeBio] = useState(true)

  // Load potential duplicates when primary is selected
  useEffect(() => {
    if (primary?.id) {
      setLoadingDuplicates(true)
      findPotentialDuplicates(primary.id)
        .then(dupes => {
          setPotentialDuplicates(dupes)
          setLoadingDuplicates(false)
        })
        .catch(() => setLoadingDuplicates(false))
    } else {
      setPotentialDuplicates([])
    }
  }, [primary?.id])

  // Reset when primaryPerson prop changes
  useEffect(() => {
    if (primaryPerson) {
      setPrimary(primaryPerson)
    }
  }, [primaryPerson])

  const handleMerge = async () => {
    if (!primary || !secondary) return

    setMerging(true)
    setError(null)

    const result = await mergeProfiles(primary.id, secondary.id, { mergeBio })

    setMerging(false)

    if (result.success) {
      setResult(result.stats)
      if (onMergeComplete) {
        onMergeComplete(primary.id)
      }
    } else {
      setError(result.error)
    }
  }

  const handleClose = () => {
    setPrimary(primaryPerson)
    setSecondary(null)
    setResult(null)
    setError(null)
    onClose()
  }

  const formatName = (person) => {
    if (!person) return ''
    return `${person.given_name || ''} ${person.surname || ''}`.trim()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sepia/20 sticky top-0 bg-cream">
          <div className="flex items-center gap-2">
            <Merge size={20} className="text-sepia" />
            <h2 className="text-lg font-semibold">Merge Profiles</h2>
          </div>
          <button onClick={handleClose} className="text-faded-ink hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Success message */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                <Check size={20} />
                Profiles merged successfully!
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>Transferred from {secondary?.id}:</p>
                <ul className="list-disc ml-5">
                  {result.relationshipsTransferred > 0 && (
                    <li>{result.relationshipsTransferred} relationships</li>
                  )}
                  {result.locationsTransferred > 0 && (
                    <li>{result.locationsTransferred} locations</li>
                  )}
                  {result.eventsTransferred > 0 && (
                    <li>{result.eventsTransferred} event participations</li>
                  )}
                  {result.associationsTransferred > 0 && (
                    <li>{result.associationsTransferred} associations</li>
                  )}
                  {result.documentsTransferred > 0 && (
                    <li>{result.documentsTransferred} document links</li>
                  )}
                  {result.notesTransferred > 0 && (
                    <li>{result.notesTransferred} research notes</li>
                  )}
                </ul>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 btn-primary"
              >
                Done
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {!result && (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">How merging works:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>All relationships, locations, events, and documents from the <strong>secondary</strong> profile will be transferred to the <strong>primary</strong> profile</li>
                  <li>The secondary profile will be deleted after merge</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>

              {/* Primary Profile Selection */}
              <div>
                <label className="label">Primary Profile (keep this one)</label>
                <PersonSelector
                  value={primary}
                  onChange={setPrimary}
                  placeholder="Search for the profile to keep..."
                  allowCreate={false}
                />
                {primary && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <ConfidenceIndicator level={primary.confidence?.toLowerCase()} size="sm" />
                      <span className="font-medium">{formatName(primary)}</span>
                      {primary.birth_year && <span className="text-faded-ink">(b. {primary.birth_year})</span>}
                    </div>
                    <div className="text-sm text-faded-ink mt-1">{primary.id}</div>
                  </div>
                )}
              </div>

              {/* Potential Duplicates */}
              {primary && (
                <div>
                  <label className="label">Potential Duplicates</label>
                  {loadingDuplicates ? (
                    <div className="flex items-center gap-2 text-faded-ink p-3">
                      <Loader2 size={16} className="animate-spin" />
                      Finding potential duplicates...
                    </div>
                  ) : potentialDuplicates.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {potentialDuplicates.map(dupe => (
                        <button
                          key={dupe.id}
                          onClick={() => setSecondary(dupe)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            secondary?.id === dupe.id
                              ? 'border-sepia bg-sepia/10'
                              : 'border-sepia/20 hover:border-sepia/40 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ConfidenceIndicator level={dupe.confidence?.toLowerCase()} size="sm" />
                              <span className="font-medium">{formatName(dupe)}</span>
                              {dupe.birth_year && <span className="text-faded-ink">(b. {dupe.birth_year})</span>}
                            </div>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                              {dupe.matchScore}% match
                            </span>
                          </div>
                          <div className="text-xs text-faded-ink mt-1">{dupe.id}</div>
                          <div className="text-xs text-sepia mt-1">
                            {dupe.matchReasons.join(' • ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-faded-ink text-sm p-3">
                      No potential duplicates found. Use the search below to select a profile manually.
                    </p>
                  )}
                </div>
              )}

              {/* Secondary Profile Selection */}
              <div>
                <label className="label">Secondary Profile (merge into primary and delete)</label>
                <PersonSelector
                  value={secondary}
                  onChange={setSecondary}
                  placeholder="Search for the profile to merge..."
                  allowCreate={false}
                  excludeIds={primary ? [primary.id] : []}
                />
                {secondary && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <ConfidenceIndicator level={secondary.confidence?.toLowerCase()} size="sm" />
                      <span className="font-medium">{formatName(secondary)}</span>
                      {secondary.birth_year && <span className="text-faded-ink">(b. {secondary.birth_year})</span>}
                    </div>
                    <div className="text-sm text-faded-ink mt-1">{secondary.id}</div>
                    <div className="text-xs text-red-600 mt-2">
                      This profile will be deleted after merge
                    </div>
                  </div>
                )}
              </div>

              {/* Merge Preview */}
              {primary && secondary && (
                <div className="border border-sepia/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Merge Preview</h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="font-medium text-red-600">{formatName(secondary)}</div>
                      <div className="text-xs text-faded-ink">{secondary.id}</div>
                      <div className="text-xs text-red-600 mt-1">Will be deleted</div>
                    </div>
                    <ArrowRight size={24} className="text-sepia" />
                    <div className="text-center">
                      <div className="font-medium text-green-600">{formatName(primary)}</div>
                      <div className="text-xs text-faded-ink">{primary.id}</div>
                      <div className="text-xs text-green-600 mt-1">Will be kept</div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mt-4 pt-4 border-t border-sepia/20">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={mergeBio}
                        onChange={(e) => setMergeBio(e.target.checked)}
                        className="rounded"
                      />
                      Append secondary's bio/notes to primary
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-sepia/20">
                <button onClick={handleClose} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleMerge}
                  disabled={!primary || !secondary || merging}
                  className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                >
                  {merging ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Merge size={16} />
                      Merge Profiles
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MergeProfilesModal
