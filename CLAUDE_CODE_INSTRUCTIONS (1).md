# Claude Code Instructions: Johnson Family Research Interface

## Overview

You are building a genealogical research interface for the Johnson/Johnston family book project. The complete implementation plan is in `johnson-research-ui-plan-v2.md` in the project folder. Read that document thoroughly before starting.

**Key principle**: Every claim needs evidence. "Tony's research file" is never a source - trace to the actual document (deed book, will, patent record) that Tony cited.

---

## Step 1: Database Schema Updates

Before building the UI, update the Supabase database with new tables and fields.

### 1.1 Run these SQL migrations in Supabase SQL Editor:

```sql
-- ============================================
-- UPDATED SOURCES TABLE
-- ============================================

-- First, check if old sources table exists and back up data if needed
-- Then drop and recreate with proper citation fields

DROP TABLE IF EXISTS sources CASCADE;

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source classification
    source_type TEXT CHECK (source_type IN (
        'primary',           -- Original record (deed book, will, patent)
        'derivative',        -- Abstract, transcription, index (Cavaliers & Pioneers)
        'authored',          -- Published genealogy, analysis
        'research_notes'     -- Working files (NOT evidence, just context)
    )),
    
    -- For primary sources
    repository TEXT,         -- "Henrico County Courthouse" or "Library of Virginia"
    collection TEXT,         -- "Deed Books" or "Will Books"
    volume TEXT,             -- "Book 3" or "Vol. 1"
    page TEXT,               -- "45" or "45-47"
    item_description TEXT,   -- "Michael Johnson to James Johnson, deed"
    record_date DATE,        -- Date of the actual record
    
    -- For published sources
    author TEXT,
    title TEXT,              -- Book or article title
    publication_place TEXT,  -- "Richmond"
    publisher TEXT,          -- "Virginia State Library"
    publication_year INTEGER,
    page_range TEXT,         -- Where in the publication
    
    -- For online sources
    url TEXT,
    access_date DATE,
    website_name TEXT,
    
    -- Formatted citations
    full_citation TEXT,      -- Complete citation string
    abbreviation TEXT,       -- Short form: "CPv1" or "Henrico DB 3:45"
    
    -- Research tracking
    original_examined BOOLEAN DEFAULT FALSE,
    cited_in TEXT,           -- If derivative: what source cited this?
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sources_type ON sources(source_type);
CREATE INDEX idx_sources_abbreviation ON sources(abbreviation);

-- ============================================
-- EVIDENCE LINKING TABLE
-- ============================================

CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What this evidence supports (polymorphic)
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'family_relationship',
        'association', 
        'document_person',
        'migration',
        'military_service',
        'person_attribute'    -- For birth, death, occupation claims
    )),
    entity_id UUID NOT NULL,  -- ID of the related record
    
    -- The source
    source_id UUID REFERENCES sources(id),
    
    -- What the source says
    source_excerpt TEXT,      -- Relevant quote from source
    interpretation TEXT,      -- How this supports the claim
    
    -- Classification
    evidence_type TEXT CHECK (evidence_type IN (
        'direct',             -- Source explicitly states the fact
        'indirect',           -- Source implies the fact
        'negative'            -- Absence of expected record
    )),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_entity ON evidence(entity_type, entity_id);
CREATE INDEX idx_evidence_source ON evidence(source_id);

-- ============================================
-- IDENTITY CANDIDATES TABLE
-- ============================================

CREATE TABLE identity_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id_1 TEXT NOT NULL REFERENCES people(id),
    person_id_2 TEXT NOT NULL REFERENCES people(id),
    likelihood TEXT CHECK (likelihood IN ('likely', 'possible', 'unlikely')),
    evidence_for TEXT,
    evidence_against TEXT,
    source_ids UUID[],
    status TEXT CHECK (status IN ('unresolved', 'confirmed_same', 'confirmed_different')),
    resolved_date DATE,
    resolved_by TEXT,
    resolution_evidence TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(person_id_1, person_id_2)
);

CREATE INDEX idx_identity_candidates_status ON identity_candidates(status);
CREATE INDEX idx_identity_candidates_person1 ON identity_candidates(person_id_1);
CREATE INDEX idx_identity_candidates_person2 ON identity_candidates(person_id_2);

-- ============================================
-- RESEARCH QUESTIONS TABLE
-- ============================================

CREATE TABLE research_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    context TEXT,
    person_ids TEXT[],        -- Related people
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'cannot_resolve')),
    resolution TEXT,
    resolution_source_id UUID REFERENCES sources(id),
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADD CONFIDENCE FIELDS TO EXISTING TABLES
-- ============================================

-- Family relationships (may already have relationship_status, but ensure consistency)
ALTER TABLE family_relationships 
ADD COLUMN IF NOT EXISTS confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')),
ADD COLUMN IF NOT EXISTS evidence_summary TEXT;

-- Associations
ALTER TABLE associations
ADD COLUMN IF NOT EXISTS confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')) DEFAULT 'confirmed',
ADD COLUMN IF NOT EXISTS evidence_summary TEXT;

-- Document people
ALTER TABLE document_people
ADD COLUMN IF NOT EXISTS confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')) DEFAULT 'confirmed',
ADD COLUMN IF NOT EXISTS evidence_summary TEXT;

-- Migrations
ALTER TABLE migrations
ADD COLUMN IF NOT EXISTS confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')),
ADD COLUMN IF NOT EXISTS evidence_summary TEXT;

-- Military service
ALTER TABLE military_service
ADD COLUMN IF NOT EXISTS confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')),
ADD COLUMN IF NOT EXISTS evidence_summary TEXT;

-- ============================================
-- RESEARCH NOTES TABLE (separate from evidence)
-- ============================================

CREATE TABLE research_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id TEXT REFERENCES people(id),
    note_text TEXT NOT NULL,
    note_type TEXT CHECK (note_type IN ('theory', 'speculation', 'question', 'todo', 'observation')),
    source_file TEXT,         -- Which of Tony's files this came from
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_research_notes_person ON research_notes(person_id);

-- ============================================
-- UPDATE TIMESTAMP TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_identity_candidates_updated_at BEFORE UPDATE ON identity_candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_questions_updated_at BEFORE UPDATE ON research_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_notes_updated_at BEFORE UPDATE ON research_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Verify the migrations worked
Run these queries to confirm:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sources';
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'evidence';
```

---

## Step 2: Project Setup

### 2.1 Create React + Vite project

```bash
npm create vite@latest johnson-research-ui -- --template react
cd johnson-research-ui
npm install
```

### 2.2 Install dependencies

```bash
# Core
npm install @supabase/supabase-js react-router-dom

# UI & Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Rich text editor (for bios)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder

# Icons
npm install lucide-react

# Date handling
npm install date-fns

# Optional: visualization (add later in Sprint 4-5)
# npm install d3 @visx/visx
```

### 2.3 Configure Tailwind

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Scholarly/archival palette
        parchment: '#f5f0e6',
        ink: '#2c2416',
        sepia: '#704214',
        'faded-ink': '#5c5346',
        'aged-paper': '#e8e0d0',
        'confidence-confirmed': '#166534',   // green-800
        'confidence-likely': '#854d0e',      // yellow-800
        'confidence-possible': '#6b7280',    // gray-500
      },
      fontFamily: {
        'display': ['Crimson Pro', 'Georgia', 'serif'],
        'body': ['Source Sans Pro', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### 2.4 Set up environment variables

Create `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**IMPORTANT**: Ask the user for these values before proceeding.

### 2.5 Create Supabase client

Create `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Step 3: Core Components (Evidence Infrastructure)

Build these components FIRST - they're used everywhere.

### 3.1 ConfidenceIndicator Component

`src/components/common/ConfidenceIndicator.jsx`

Shows visual badge for confidence level:
- ● Confirmed (green)
- ◐ Likely (amber) 
- ○ Possible (gray)

Include tooltip with label.

### 3.2 SourceCitation Component

`src/components/sources/SourceCitation.jsx`

Displays a formatted citation. Props:
- `source` - source object from database
- `format` - 'full' | 'short' | 'footnote'
- `showLink` - whether to link to source detail page

### 3.3 EvidenceBlock Component

`src/components/evidence/EvidenceBlock.jsx`

Expandable block showing evidence for a claim. Props:
- `confidence` - 'confirmed' | 'likely' | 'possible'
- `evidenceItems` - array of evidence records with sources
- `entityType` - what this evidence supports
- `entityId` - ID of the entity

Display:
- Confidence indicator
- Primary source citation
- Source excerpt (if available)
- Expand to show all evidence items
- Edit button (if editable prop is true)

### 3.4 EvidenceForm Component

`src/components/evidence/EvidenceForm.jsx`

Form for adding/editing evidence. Fields:
- Source selector (search existing or add new)
- Source excerpt (text area)
- Interpretation (how this supports the claim)
- Evidence type (direct/indirect/negative)

---

## Step 4: Source Management

### 4.1 SourceForm Component

`src/components/sources/SourceForm.jsx`

Citation builder form with conditional fields based on source type:

**Primary source fields:**
- Repository
- Collection
- Volume
- Page
- Record date
- Item description

**Published source fields:**
- Author
- Title
- Publisher
- Publication place
- Publication year
- Page range

**For all:**
- Full citation (auto-generate from fields, allow override)
- Abbreviation
- Original examined checkbox
- If not examined: "Cited in" field
- Notes

### 4.2 SourceSelector Component

`src/components/sources/SourceSelector.jsx`

Search and select existing source, or create new:
- Search by abbreviation, title, author
- Show recent sources
- "Add new source" button opens SourceForm modal

---

## Step 5: People Browser Page

### 5.1 Create page structure

`src/pages/PeopleBrowser.jsx`

Features:
- Search bar (name, ID)
- Filter panel:
  - Surname dropdown
  - Birth year range
  - Location (county)
  - DNA group
  - Confidence level
- Results list/table
- Pagination
- Stats bar (total count, by confidence)

### 5.2 PersonCard Component

`src/components/people/PersonCard.jsx`

Compact card showing:
- Confidence indicator
- Name with ID
- Dates (birth-death)
- Locations
- DNA group badge (if any)
- Click to navigate to detail

### 5.3 Hooks

Create `src/hooks/usePeople.js`:
- `usePeople(filters)` - fetch people with filters
- `usePerson(id)` - fetch single person with all related data
- `usePersonSearch(query)` - search people by name

---

## Step 6: Person Detail Page

### 6.1 Create page structure

`src/pages/PersonDetail.jsx`

Sections (each showing confidence + evidence):
1. Header - Name, ID, dates, confidence badge
2. Vital Facts Panel - Birth, death, burial (each with evidence)
3. Family Relationships - List with confidence per item
4. Associations - List with confidence per item
5. Documents - List with role per item
6. Migrations - Timeline with evidence per location
7. Military Service - List with evidence
8. Research Notes - CLEARLY MARKED as "not evidence"
9. Identity Candidates - "Possibly same as..." list
10. Source Bibliography - All sources cited for this person

### 6.2 Section Components

Create components for each section:
- `VitalFactsPanel.jsx`
- `RelationshipsList.jsx`
- `AssociationsList.jsx`
- `DocumentsList.jsx`
- `MigrationTimeline.jsx`
- `MilitaryServiceList.jsx`
- `ResearchNotesPanel.jsx` (with warning banner)
- `IdentityCandidatesPanel.jsx`
- `SourceBibliography.jsx`

Each list item should show:
- The fact/relationship
- Confidence indicator
- Primary source citation (abbreviated)
- Expand to see full evidence

---

## Step 7: Basic Data Entry Forms

### 7.1 AddPersonForm

Fields:
- Surname, Given name, Name variants
- Title (Col., Mr., etc.), Suffix (Jr., Sr.)
- Designation ("of Tuckahoe Creek")
- Birth year, type (known/estimated), place
- Death year, type, place
- Burial place
- DNA group (optional)
- Initial confidence rating
- Notes

**Auto-generate ID** using format: `[SURNAME]-[BIRTHPLACE]-[b/e][YEAR]-[##]`

### 7.2 AddDocumentForm

Fields:
- Document type (patent, deed, will, tax list, etc.)
- Date
- County, State
- Source (use SourceSelector)
- Transcription (text area)
- Location description
- Acres (if land record)
- Notes

After saving, prompt to link people.

### 7.3 LinkPersonToDocumentForm

Fields:
- Person selector (search existing or note for new)
- Role (patentee, grantor, grantee, witness, adjacent, etc.)
- Confidence
- Evidence summary
- Source (auto-filled from document)

### 7.4 AddRelationshipForm

Fields:
- Person 1 (current person)
- Relationship type (father, mother, spouse, child, sibling)
- Person 2 (search/select)
- Confidence level
- Evidence (use EvidenceForm)

### 7.5 AddAssociationForm

Fields:
- Person 1 (current person)
- Association type (neighbor, witness, adjacent landowner, etc.)
- Person 2 (search/select)
- Date/date range
- Context
- Confidence level
- Evidence

---

## Step 8: Routing

Set up React Router in `src/App.jsx`:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import Dashboard from './pages/Dashboard'
import PeopleBrowser from './pages/PeopleBrowser'
import PersonDetail from './pages/PersonDetail'
import DocumentBrowser from './pages/DocumentBrowser'
import DocumentDetail from './pages/DocumentDetail'
import SourceBrowser from './pages/SourceBrowser'
import SourceDetail from './pages/SourceDetail'
import IdentityQueue from './pages/IdentityQueue'
import Compare from './pages/Compare'
import ResearchQuestions from './pages/ResearchQuestions'
import GapAnalysis from './pages/GapAnalysis'

// Layout
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="people" element={<PeopleBrowser />} />
          <Route path="people/:id" element={<PersonDetail />} />
          <Route path="documents" element={<DocumentBrowser />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="sources" element={<SourceBrowser />} />
          <Route path="sources/:id" element={<SourceDetail />} />
          <Route path="identity" element={<IdentityQueue />} />
          <Route path="compare/:id1/:id2" element={<Compare />} />
          <Route path="research" element={<ResearchQuestions />} />
          <Route path="gaps" element={<GapAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

---

## Step 9: Layout Component

`src/components/Layout.jsx`

- Sidebar navigation
- Header with search
- Main content area (Outlet)
- Footer

Navigation items:
- Dashboard
- People
- Documents
- Sources
- Identity Queue
- Research Questions
- Gap Analysis

---

## Design Guidelines

### Colors
- Background: parchment (`#f5f0e6`) or aged-paper (`#e8e0d0`)
- Text: ink (`#2c2416`) or faded-ink (`#5c5346`)
- Accents: sepia (`#704214`)
- Confidence indicators:
  - Confirmed: green-800 (`#166534`)
  - Likely: yellow-800 (`#854d0e`)
  - Possible: gray-500 (`#6b7280`)

### Typography
- Headings: Crimson Pro (serif)
- Body: Source Sans Pro (sans-serif)
- IDs/code: JetBrains Mono (monospace)

### Components
- Cards with subtle shadows and aged-paper backgrounds
- Rounded corners (not too sharp, not too round)
- Generous padding
- Clear visual hierarchy

### Confidence Display Pattern
Every item that has a confidence level should show:
1. Confidence indicator (●/◐/○) with color
2. The fact/relationship
3. Primary source in small text below
4. Expand arrow if more detail available

---

## Testing Checklist

After each major component, verify:

1. **Database queries work** - Data loads correctly
2. **Confidence displays** - All three levels render properly
3. **Sources cite properly** - Full and short citations format correctly
4. **Evidence expands** - Click to see full evidence trail
5. **Forms save** - Data persists to Supabase
6. **Navigation works** - All links function

---

## Order of Implementation

1. ✅ Database migrations (Step 1)
2. ✅ Project setup (Step 2)
3. Build core components (Step 3) - ConfidenceIndicator, SourceCitation, EvidenceBlock
4. Build source components (Step 4) - SourceForm, SourceSelector
5. Build People Browser (Step 5)
6. Build Person Detail (Step 6)
7. Build data entry forms (Step 7)
8. Wire up routing (Step 8)
9. Build Layout (Step 9)
10. Test with existing data

---

## Questions to Ask User

Before starting:
1. "What is your Supabase URL?" 
2. "What is your Supabase anon key?"
3. "Should I run the database migrations now, or have you already done that?"

During development:
- "Should I proceed to the next component, or would you like to test this first?"
- "The [component] is ready. Want me to show you how to test it?"

---

## Important Reminders

1. **Sources matter**: Never display a claim without its source. If there's no source, it goes in Research Notes, not as a fact.

2. **Confidence is visible**: Every relationship, association, document link, migration entry must show its confidence level.

3. **Research notes are NOT evidence**: Always display them in a separate section with a clear warning banner.

4. **Tony's files are not sources**: When you see "per Tony's research" - that's a research note, not evidence. The evidence is whatever document Tony was citing.

5. **IDs are sacred**: The person ID format (`JNSN-HEN-e1695-02`) is fixed. Don't change how IDs are generated without discussing.
