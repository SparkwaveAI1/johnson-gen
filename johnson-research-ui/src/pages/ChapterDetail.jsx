import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Save, Download, Plus, Trash2, GripVertical,
  Users, MapPin, User, ChevronDown, ChevronUp, Check, Clock
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useChapter } from '../hooks/useChapters'
import { useFamilyGroups } from '../hooks/useFamilyGroups'
import { useLocations } from '../hooks/useLocations'

const STATUS_OPTIONS = [
  { value: 'outline', label: 'Outline', color: 'bg-gray-100 text-gray-600' },
  { value: 'draft', label: 'Draft', color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'Review', color: 'bg-purple-100 text-purple-800' },
  { value: 'final', label: 'Final', color: 'bg-green-100 text-green-800' }
]

const CONTENT_TYPE_ICONS = {
  family_group: Users,
  location: MapPin,
  person: User
}

function ChapterDetail() {
  const { slug } = useParams()
  const [chapterId, setChapterId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Form state
  const [introduction, setIntroduction] = useState('')
  const [body, setBody] = useState('')
  const [conclusion, setConclusion] = useState('')
  const [status, setStatus] = useState('outline')

  // Adding content
  const [showAddContent, setShowAddContent] = useState(false)
  const [contentType, setContentType] = useState('family_group')
  const [selectedEntityId, setSelectedEntityId] = useState('')

  // Data sources for adding content
  const { groups: familyGroups } = useFamilyGroups()
  const { locations } = useLocations()
  const [people, setPeople] = useState([])

  // Load chapter ID from slug
  useEffect(() => {
    async function loadChapterId() {
      const { data } = await supabase
        .from('book_chapters')
        .select('id')
        .eq('slug', slug)
        .single()

      if (data) {
        setChapterId(data.id)
      }
    }
    if (slug) {
      loadChapterId()
    }
  }, [slug])

  // Load people for selector
  useEffect(() => {
    async function loadPeople() {
      const { data } = await supabase
        .from('people')
        .select('id, given_name, surname, bio_status')
        .order('surname')
        .limit(100)

      setPeople(data || [])
    }
    loadPeople()
  }, [])

  const {
    chapter,
    contents,
    loading,
    error,
    updateChapter,
    addContent,
    removeContent
  } = useChapter(chapterId)

  // Initialize form when chapter loads
  useEffect(() => {
    if (chapter) {
      setIntroduction(chapter.introduction || '')
      setBody(chapter.body || '')
      setConclusion(chapter.conclusion || '')
      setStatus(chapter.status || 'outline')
    }
  }, [chapter])

  const calculateWordCount = () => {
    const text = [introduction, body, conclusion].join(' ')
    return text.split(/\s+/).filter(Boolean).length
  }

  const saveChapter = async () => {
    if (!hasChanges) return

    setSaving(true)
    const wordCount = calculateWordCount()

    const { error } = await updateChapter({
      introduction,
      body,
      conclusion,
      status,
      word_count: wordCount
    })

    if (!error) {
      setLastSaved(new Date())
      setHasChanges(false)
    }
    setSaving(false)
  }

  const handleAddContent = async () => {
    if (!selectedEntityId) return

    const contentData = {
      content_type: contentType,
      section_title: '',
      section_content: ''
    }

    if (contentType === 'family_group') {
      contentData.family_group_id = selectedEntityId
    } else if (contentType === 'location') {
      contentData.location_id = selectedEntityId
    } else if (contentType === 'person') {
      contentData.person_id = selectedEntityId
    }

    await addContent(contentData)
    setSelectedEntityId('')
    setShowAddContent(false)
  }

  const exportChapter = () => {
    let markdown = `# Chapter ${chapter.chapter_number || ''}: ${chapter.title}\n\n`

    if (introduction) {
      markdown += `## Introduction\n\n${introduction}\n\n`
    }

    contents.forEach(content => {
      const name = content.family_group?.name || content.location?.name || (content.person ? `${content.person.given_name} ${content.person.surname}` : null)
      if (content.section_title || name) {
        markdown += `### ${content.section_title || name}\n\n`
      }
      if (content.section_content) {
        markdown += content.section_content + '\n\n'
      }
    })

    if (body) {
      markdown += body + '\n\n'
    }

    if (conclusion) {
      markdown += `## Conclusion\n\n${conclusion}\n\n`
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapter.slug || 'chapter'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading || !chapter) {
    return (
      <div className="p-8 text-center text-faded-ink">
        Loading chapter...
      </div>
    )
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/chapters" className="text-faded-ink hover:text-ink flex items-center gap-1 mb-2">
            <ArrowLeft size={16} />
            Back to Chapters
          </Link>
          <h1 className="text-2xl font-display">
            {chapter.chapter_number && `Chapter ${chapter.chapter_number}: `}
            {chapter.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-faded-ink flex items-center gap-1">
              <Check size={12} className="text-green-600" />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {hasChanges && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <Clock size={12} />
              Unsaved
            </span>
          )}
          <button
            onClick={exportChapter}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={saveChapter}
            disabled={!hasChanges || saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-faded-ink">Status:</span>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setHasChanges(true)
          }}
          className={`text-sm px-2 py-1 rounded border-0 font-medium ${currentStatus?.color}`}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="text-sm text-faded-ink">
          {calculateWordCount().toLocaleString()} words
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Introduction */}
          <div className="card">
            <h2 className="font-display mb-3">Introduction</h2>
            <textarea
              value={introduction}
              onChange={(e) => {
                setIntroduction(e.target.value)
                setHasChanges(true)
              }}
              placeholder="Write the chapter introduction..."
              className="w-full h-32 p-3 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif resize-y"
            />
          </div>

          {/* Sections from linked content */}
          {contents.length > 0 && (
            <div className="card">
              <h2 className="font-display mb-3">Sections</h2>
              <div className="space-y-4">
                {contents.map(content => {
                  const Icon = CONTENT_TYPE_ICONS[content.content_type] || Users
                  const entityName = content.family_group?.name ||
                    content.location?.name ||
                    (content.person ? `${content.person.given_name} ${content.person.surname}` : null) ||
                    'Unknown'

                  return (
                    <div key={content.id} className="border border-sepia/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-accent" />
                          <span className="font-medium">{entityName}</span>
                          <span className="text-xs text-faded-ink uppercase">{content.content_type}</span>
                        </div>
                        <button
                          onClick={() => removeContent(content.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={content.section_title || ''}
                        onChange={async (e) => {
                          // Update in real-time (simplified for now)
                          await supabase
                            .from('chapter_contents')
                            .update({ section_title: e.target.value })
                            .eq('id', content.id)
                        }}
                        placeholder="Section title..."
                        className="w-full mb-2 p-2 border border-sepia/20 rounded focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                      <textarea
                        value={content.section_content || ''}
                        onChange={async (e) => {
                          await supabase
                            .from('chapter_contents')
                            .update({ section_content: e.target.value })
                            .eq('id', content.id)
                        }}
                        placeholder="Write section content..."
                        className="w-full h-24 p-2 border border-sepia/20 rounded focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif resize-y"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="card">
            <h2 className="font-display mb-3">Body</h2>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                setHasChanges(true)
              }}
              placeholder="Write the main chapter content..."
              className="w-full h-64 p-3 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif resize-y"
            />
          </div>

          {/* Conclusion */}
          <div className="card">
            <h2 className="font-display mb-3">Conclusion</h2>
            <textarea
              value={conclusion}
              onChange={(e) => {
                setConclusion(e.target.value)
                setHasChanges(true)
              }}
              placeholder="Write the chapter conclusion..."
              className="w-full h-32 p-3 border border-sepia/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 font-serif resize-y"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Content */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display">Add Section</h3>
              <button
                onClick={() => setShowAddContent(!showAddContent)}
                className="p-1 hover:bg-sepia/10 rounded"
              >
                {showAddContent ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showAddContent && (
              <div className="space-y-3">
                <div>
                  <label className="label">Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => {
                      setContentType(e.target.value)
                      setSelectedEntityId('')
                    }}
                    className="input w-full"
                  >
                    <option value="family_group">Family Group</option>
                    <option value="location">Location</option>
                    <option value="person">Person</option>
                  </select>
                </div>

                <div>
                  <label className="label">Select</label>
                  <select
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Choose...</option>
                    {contentType === 'family_group' && familyGroups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                    {contentType === 'location' && locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                    {contentType === 'person' && people.map(p => (
                      <option key={p.id} value={p.id}>{p.given_name} {p.surname}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddContent}
                  disabled={!selectedEntityId}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>
            )}
          </div>

          {/* Linked Content Summary */}
          <div className="card">
            <h3 className="font-display mb-3">Linked Content</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-faded-ink flex items-center gap-1">
                  <Users size={14} /> Family Groups
                </dt>
                <dd>{contents.filter(c => c.content_type === 'family_group').length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faded-ink flex items-center gap-1">
                  <MapPin size={14} /> Locations
                </dt>
                <dd>{contents.filter(c => c.content_type === 'location').length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-faded-ink flex items-center gap-1">
                  <User size={14} /> People
                </dt>
                <dd>{contents.filter(c => c.content_type === 'person').length}</dd>
              </div>
            </dl>
          </div>

          {/* Tips */}
          <div className="card bg-amber-50 border-amber-200">
            <h3 className="font-display text-amber-800 mb-2">Writing Tips</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>Add sections to reference family groups, locations, or people</li>
              <li>Use the introduction to set context</li>
              <li>Export to Markdown for external editing</li>
              <li>Progress through: Outline → Draft → Review → Final</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterDetail
