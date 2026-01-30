import { Link } from 'react-router-dom'
import { BookOpen, FileText, ScrollText, NotebookPen } from 'lucide-react'

/**
 * SourceCitation - Displays a formatted citation
 *
 * Props:
 * - source: source object from database
 * - format: 'full' | 'short' | 'footnote' (default: 'short')
 * - showLink: whether to link to source detail page (default: true)
 * - showIcon: whether to show source type icon (default: false)
 */

const sourceTypeConfig = {
  primary: {
    icon: FileText,
    label: 'Primary Source',
    color: 'text-confidence-confirmed'
  },
  derivative: {
    icon: BookOpen,
    label: 'Derivative',
    color: 'text-confidence-likely'
  },
  authored: {
    icon: ScrollText,
    label: 'Authored Work',
    color: 'text-sepia'
  },
  research_notes: {
    icon: NotebookPen,
    label: 'Research Notes',
    color: 'text-confidence-possible'
  }
}

function formatFullCitation(source) {
  // If we have a pre-formatted full citation, use it
  if (source.full_citation) {
    return source.full_citation
  }

  // Otherwise build one from parts
  const parts = []

  if (source.source_type === 'primary') {
    // Primary source format: Repository, Collection, Volume:Page, Description, Date
    if (source.repository) {
      parts.push(source.repository)
    }
    if (source.collection) {
      let collectionPart = source.collection
      if (source.volume) {
        collectionPart += ` ${source.volume}`
      }
      if (source.page) {
        collectionPart += `:${source.page}`
      }
      parts.push(collectionPart)
    }
    if (source.item_description) {
      parts.push(source.item_description)
    }
    if (source.record_date) {
      parts.push(new Date(source.record_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }
  } else {
    // Published source format: Author, Title (Place: Publisher, Year), Page
    if (source.author) {
      parts.push(source.author)
    }
    if (source.title) {
      let titlePart = source.title
      if (source.publication_place || source.publisher || source.publication_year) {
        const pubParts = []
        if (source.publication_place) pubParts.push(source.publication_place)
        if (source.publisher) pubParts.push(source.publisher)
        if (source.publication_year) pubParts.push(source.publication_year)
        titlePart += ` (${pubParts.join(': ')})`
      }
      parts.push(titlePart)
    }
    if (source.page_range) {
      parts.push(source.page_range)
    }
  }

  return parts.join(', ')
}

function formatShortCitation(source) {
  // Use abbreviation if available
  if (source.abbreviation) {
    return source.abbreviation
  }

  // Otherwise create a short form
  if (source.source_type === 'primary') {
    const parts = []
    if (source.collection) {
      parts.push(source.collection)
    }
    if (source.volume) {
      parts.push(source.volume)
    }
    if (source.page) {
      parts.push(`:${source.page}`)
    }
    return parts.join(' ') || source.title?.substring(0, 30) || 'Unknown source'
  }

  // For published sources, use author + short title
  if (source.author) {
    const lastName = source.author.split(',')[0]
    return lastName
  }

  return source.title?.substring(0, 30) || 'Unknown source'
}

function formatFootnoteCitation(source) {
  // Footnote style - similar to full but formatted for notes
  const full = formatFullCitation(source)

  // Add "cited in" note if original not examined
  if (!source.original_examined && source.cited_in) {
    return `${full}; cited in ${source.cited_in}`
  }

  return full
}

function SourceCitation({ source, format = 'short', showLink = true, showIcon = false }) {
  if (!source) {
    return <span className="text-faded-ink italic">No source cited</span>
  }

  const config = sourceTypeConfig[source.source_type] || sourceTypeConfig.authored
  const Icon = config.icon

  let citation
  switch (format) {
    case 'full':
      citation = formatFullCitation(source)
      break
    case 'footnote':
      citation = formatFootnoteCitation(source)
      break
    case 'short':
    default:
      citation = formatShortCitation(source)
  }

  const content = (
    <span className="inline-flex items-center gap-1.5">
      {showIcon && <Icon size={14} className={config.color} />}
      <span className={format === 'short' ? 'font-mono text-sm' : ''}>
        {citation}
      </span>
      {source.source_type === 'research_notes' && (
        <span className="text-xs text-confidence-possible italic ml-1">
          (not evidence)
        </span>
      )}
    </span>
  )

  if (showLink && source.id) {
    return (
      <Link
        to={`/sources/${source.id}`}
        className="text-sepia hover:underline"
      >
        {content}
      </Link>
    )
  }

  return content
}

// Export helper functions for use elsewhere
export { formatFullCitation, formatShortCitation, formatFootnoteCitation }
export default SourceCitation
