import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Users, Calendar, MapPin, AlertTriangle,
  Copy, Check, ChevronDown, ChevronUp
} from 'lucide-react'

function FactSheetGenerator({ person, documents, relationships, associations, researchQuestions }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Build structured fact sheet
  const generateFactSheet = () => {
    const lines = []

    // Header
    const fullName = [person.title, person.given_name, person.surname, person.suffix]
      .filter(Boolean).join(' ')
    lines.push(`# ${fullName}`)
    lines.push(`ID: ${person.id}`)
    lines.push(`Confidence: ${person.confidence || 'Unknown'}`)
    lines.push('')

    // Vital dates
    lines.push('## Vital Facts')
    if (person.birth_year) {
      const prefix = person.birth_year_type === 'e' ? 'c. ' : ''
      const place = person.birthplace_detail || person.birthplace_code || ''
      lines.push(`- Birth: ${prefix}${person.birth_year}${place ? ` at ${place}` : ''}`)
    } else {
      lines.push('- Birth: Unknown')
    }

    if (person.death_year) {
      const prefix = person.death_year_type === 'e' ? 'c. ' : ''
      const place = person.death_place_code || ''
      lines.push(`- Death: ${prefix}${person.death_year}${place ? ` at ${place}` : ''}`)
    } else {
      lines.push('- Death: Unknown')
    }

    if (person.occupation) lines.push(`- Occupation: ${person.occupation}`)
    if (person.religion) lines.push(`- Religion: ${person.religion}`)
    if (person.dna_group) lines.push(`- DNA Group: ${person.dna_group}`)
    if (person.first_documented_date) lines.push(`- First Documented: ${person.first_documented_date}`)
    lines.push('')

    // Family relationships
    lines.push('## Family Relationships')
    if (relationships.length === 0) {
      lines.push('- None documented')
    } else {
      relationships.forEach(rel => {
        const relName = rel.related_person
          ? `${rel.related_person.given_name} ${rel.related_person.surname}`
          : 'Unknown'
        const status = rel.relationship_status || rel.confidence || ''
        lines.push(`- ${rel.relationship_type}: ${relName} [${status}]`)
        if (rel.evidence) lines.push(`  Evidence: ${rel.evidence}`)
        if (rel.marriage_date) lines.push(`  Married: ${rel.marriage_date}${rel.marriage_place ? ` at ${rel.marriage_place}` : ''}`)
      })
    }
    lines.push('')

    // Associations
    if (associations && associations.length > 0) {
      lines.push('## Associations')
      associations.forEach(assoc => {
        const assocName = assoc.associated_person
          ? `${assoc.associated_person.given_name} ${assoc.associated_person.surname}`
          : 'Unknown'
        lines.push(`- ${assoc.association_type}: ${assocName}`)
        if (assoc.context) lines.push(`  Context: ${assoc.context}`)
        if (assoc.location) lines.push(`  Location: ${assoc.location}`)
        if (assoc.date) lines.push(`  Date: ${assoc.date}`)
      })
      lines.push('')
    }

    // Documents
    lines.push('## Documents')
    if (documents.length === 0) {
      lines.push('- None linked')
    } else {
      // Sort by date
      const sortedDocs = [...documents].sort((a, b) => {
        const dateA = a.document?.date || ''
        const dateB = b.document?.date || ''
        return dateA.localeCompare(dateB)
      })

      sortedDocs.forEach(docLink => {
        if (docLink.document) {
          lines.push(`- ${docLink.document.date || 'n.d.'}: ${docLink.document.title || 'Untitled'}`)
          lines.push(`  Role: ${docLink.role || 'Unknown'}`)
          if (docLink.document.county) {
            lines.push(`  Location: ${docLink.document.county}, ${docLink.document.state}`)
          }
          if (docLink.notes) lines.push(`  Notes: ${docLink.notes}`)
        }
      })
    }
    lines.push('')

    // Timeline
    lines.push('## Timeline')
    const events = []
    if (person.birth_year) {
      events.push({ date: person.birth_year, event: 'Born' })
    }
    documents.forEach(docLink => {
      if (docLink.document?.date) {
        events.push({
          date: docLink.document.date,
          event: `${docLink.document.title || 'Document'} (${docLink.role || 'mentioned'})`
        })
      }
    })
    if (person.death_year) {
      events.push({ date: person.death_year, event: 'Died' })
    }

    events.sort((a, b) => {
      const yearA = parseInt(a.date) || 0
      const yearB = parseInt(b.date) || 0
      return yearA - yearB
    })

    if (events.length === 0) {
      lines.push('- No dated events')
    } else {
      events.forEach(e => lines.push(`- ${e.date}: ${e.event}`))
    }
    lines.push('')

    // Research questions
    if (researchQuestions && researchQuestions.length > 0) {
      const openQuestions = researchQuestions.filter(q => q.status === 'open')
      lines.push('## Open Research Questions')
      if (openQuestions.length === 0) {
        lines.push('- All questions resolved')
      } else {
        openQuestions.forEach(q => {
          lines.push(`- ${q.question}`)
          if (q.research_action) lines.push(`  Action: ${q.research_action}`)
        })
      }
      lines.push('')
    }

    // Bio status
    lines.push('## Writing Status')
    lines.push(`- Bio Status: ${person.bio_status || 'no_bio'}`)
    if (person.bio) {
      const wordCount = person.bio.split(/\s+/).filter(Boolean).length
      lines.push(`- Current Bio: ${wordCount} words`)
    } else {
      lines.push('- Current Bio: None written')
    }

    return lines.join('\n')
  }

  const factSheet = generateFactSheet()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(factSheet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display flex items-center gap-2">
          <FileText size={18} className="text-accent" />
          Fact Sheet
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Expand
              </>
            )}
          </button>
        </div>
      </div>

      <div className={`bg-sepia/5 rounded-lg p-4 font-mono text-sm overflow-auto ${
        expanded ? 'max-h-none' : 'max-h-64'
      }`}>
        <pre className="whitespace-pre-wrap">{factSheet}</pre>
      </div>

      <p className="text-xs text-faded-ink mt-2">
        Use this fact sheet as a reference while writing the biography.
        Click "Copy" to paste into external applications.
      </p>
    </div>
  )
}

export default FactSheetGenerator
