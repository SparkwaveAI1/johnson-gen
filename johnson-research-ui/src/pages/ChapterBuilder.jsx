import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Plus, FileText, Edit2, Trash2,
  ChevronRight, Download
} from 'lucide-react'
import { useChapters } from '../hooks/useChapters'

const CHAPTER_TYPES = [
  { value: 'introduction', label: 'Introduction' },
  { value: 'methodology', label: 'Methodology' },
  { value: 'family_narrative', label: 'Family Narrative' },
  { value: 'geographic_survey', label: 'Geographic Survey' },
  { value: 'migration_analysis', label: 'Migration Analysis' },
  { value: 'appendix', label: 'Appendix' }
]

const STATUS_COLORS = {
  outline: 'bg-gray-100 text-gray-600',
  draft: 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  final: 'bg-green-100 text-green-800'
}

function ChapterBuilder() {
  const { chapters, loading, error, createChapter, deleteChapter } = useChapters()
  const [showNewChapter, setShowNewChapter] = useState(false)
  const [newChapter, setNewChapter] = useState({
    title: '',
    chapter_type: 'family_narrative',
    chapter_number: null
  })

  const handleCreateChapter = async () => {
    if (!newChapter.title.trim()) return

    const slug = newChapter.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { error } = await createChapter({
      ...newChapter,
      slug,
      chapter_number: newChapter.chapter_number || chapters.length + 1
    })

    if (!error) {
      setNewChapter({ title: '', chapter_type: 'family_narrative', chapter_number: null })
      setShowNewChapter(false)
    }
  }

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Delete this chapter? This cannot be undone.')) return
    await deleteChapter(chapterId)
  }

  const exportAllChapters = () => {
    let markdown = '# Johnson Family Research\n\n'

    chapters.forEach(chapter => {
      markdown += `## Chapter ${chapter.chapter_number || ''}: ${chapter.title}\n\n`
      if (chapter.introduction) {
        markdown += chapter.introduction + '\n\n'
      }
      if (chapter.body) {
        markdown += chapter.body + '\n\n'
      }
      if (chapter.conclusion) {
        markdown += chapter.conclusion + '\n\n'
      }
      markdown += '---\n\n'
    })

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'johnson-family-research.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-faded-ink">
        Loading chapters...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <BookOpen className="text-accent" />
          Chapter Builder
        </h1>
        <div className="flex items-center gap-2">
          {chapters.length > 0 && (
            <button
              onClick={exportAllChapters}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={16} />
              Export All
            </button>
          )}
          <button
            onClick={() => setShowNewChapter(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            New Chapter
          </button>
        </div>
      </div>

      {/* New Chapter Form */}
      {showNewChapter && (
        <div className="card bg-accent/5 border-accent/20">
          <h3 className="font-display mb-4">Create New Chapter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="label">Title</label>
              <input
                type="text"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                placeholder="e.g., The Johnsons of Tuckahoe Creek"
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Chapter Number</label>
              <input
                type="number"
                value={newChapter.chapter_number || ''}
                onChange={(e) => setNewChapter({ ...newChapter, chapter_number: parseInt(e.target.value) || null })}
                placeholder="Auto"
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={newChapter.chapter_type}
                onChange={(e) => setNewChapter({ ...newChapter, chapter_type: e.target.value })}
                className="input w-full"
              >
                {CHAPTER_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowNewChapter(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChapter}
              disabled={!newChapter.title.trim()}
              className="btn-primary"
            >
              Create Chapter
            </button>
          </div>
        </div>
      )}

      {/* Chapters List */}
      {chapters.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto text-faded-ink mb-4" />
          <p className="text-faded-ink">No chapters created yet.</p>
          <p className="text-sm text-faded-ink mt-2">
            Create chapters to organize your family research into a book structure.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map(chapter => (
            <div
              key={chapter.id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {chapter.chapter_number && (
                      <span className="text-lg font-mono text-faded-ink">
                        {chapter.chapter_number}.
                      </span>
                    )}
                    <h3 className="font-display text-lg">{chapter.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[chapter.status]}`}>
                      {chapter.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-faded-ink">
                    <span>{CHAPTER_TYPES.find(t => t.value === chapter.chapter_type)?.label}</span>
                    {chapter.word_count && (
                      <span>{chapter.word_count.toLocaleString()} words</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/chapters/${chapter.slug}`}
                    className="btn-secondary text-sm flex items-center gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete chapter"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Writing Progress Summary */}
      {chapters.length > 0 && (
        <div className="card bg-sepia/5">
          <h3 className="font-display mb-4">Writing Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-display">
                {chapters.filter(c => c.status === 'outline').length}
              </div>
              <div className="text-sm text-faded-ink">Outline</div>
            </div>
            <div>
              <div className="text-2xl font-display text-blue-600">
                {chapters.filter(c => c.status === 'draft').length}
              </div>
              <div className="text-sm text-faded-ink">Draft</div>
            </div>
            <div>
              <div className="text-2xl font-display text-purple-600">
                {chapters.filter(c => c.status === 'review').length}
              </div>
              <div className="text-sm text-faded-ink">Review</div>
            </div>
            <div>
              <div className="text-2xl font-display text-green-600">
                {chapters.filter(c => c.status === 'final').length}
              </div>
              <div className="text-sm text-faded-ink">Final</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-sepia/10 text-sm text-faded-ink">
            Total word count: {chapters.reduce((sum, c) => sum + (c.word_count || 0), 0).toLocaleString()} words
          </div>
        </div>
      )}
    </div>
  )
}

export default ChapterBuilder
