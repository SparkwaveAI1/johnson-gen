# Johnson Family Research Interface - Implementation Plan

## Project Overview

**Purpose**: A web interface for managing genealogical research on Johnson/Johnston families in colonial Virginia, connected to a Supabase database.

**Primary User**: Scott (solo researcher, possibly adding Tony later)

**Core Problem**: Organizing decades of research, resolving identity questions ("Is this John Johnson the same as that John Johnson?"), and developing comprehensive bios for a book.

---

## Genealogical Standards for Evidence

### Source Hierarchy

All claims must cite actual sources, not research files. When extracting from Tony's files, trace back to what he cited:

| Type | Definition | Example | Evidentiary Weight |
|------|------------|---------|-------------------|
| **Primary Source** | Original record created at/near time of event | Henrico County Deed Book 3, p. 45 (1718) | Highest |
| **Derivative Source** | Copy, abstract, or transcription of primary | Cavaliers & Pioneers Vol. 1, p. 123 | High (verify against original when possible) |
| **Authored Work** | Analysis, compilation, genealogy | Johnson Family of Virginia (1952) | Medium (claims need verification) |
| **Research Notes** | Working theories, speculation | Tony L. Johnson research files | Context only (not evidence) |

### Citation Format

Follow standard genealogical citation (based on *Evidence Explained* by Elizabeth Shown Mills):

**Primary source example:**
> Henrico County, Virginia, Deed Book 3:45, Michael Johnson to James Johnson, 22 January 1718; Henrico County Courthouse, Richmond.

**Published abstract example:**
> Nell Marion Nugent, *Cavaliers and Pioneers: Abstracts of Virginia Land Patents and Grants*, vol. 1 (Richmond: Virginia State Library, 1934), 123, John Johnson patent, 12 January 1624.

**When original not examined:**
> Henrico County, Virginia, Deed Book 3:45, Michael Johnson to James Johnson, 22 January 1718; cited in Nell Marion Nugent, *Cavaliers and Pioneers*, vol. 3 (1979), 256.

### Handling Unsubstantiated Claims

Tony's files contain mix of:
- **Documented facts** (with citations) → Extract the citation, enter as evidence
- **Reasonable inferences** (unmarked) → Enter as "Likely" with reasoning explained
- **Speculation/theories** (sometimes noted) → Enter as "Possible" or omit until verified
- **Family traditions** → Note as tradition, not fact; confidence = Possible at best

**Rule**: If Tony didn't cite a source, we don't have evidence. Note the claim, mark confidence appropriately, add to research questions.

---

## Confidence System

Every piece of information needs a confidence level tied to actual evidence:

| Level | Label | Criteria | Example |
|-------|-------|----------|---------|
| **Confirmed** | Direct documentary evidence | Will names "my son John"; deed signed by Michael Johnson | Primary source explicitly states the fact |
| **Likely** | Strong circumstantial evidence | Same name, place, time, associates; logical inference from documents | Patent shows adjacent landowners with same surname = probable family |
| **Possible** | Reasonable but unverified | Could be this person, but common name or gaps in record | "John Johnson" in Augusta 1756 militia - which one? |

### Evidence Requirements by Confidence Level

**Confirmed** requires:
- At least one primary or derivative source
- Source directly states the claimed fact
- No significant contradicting evidence

**Likely** requires:
- Circumstantial evidence from primary/derivative sources
- Logical reasoning documented
- Acknowledgment of what would confirm/refute

**Possible** requires:
- Some basis for the connection (not pure speculation)
- Clear statement of uncertainty
- Ideally: what research would resolve this

---

## Technology Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Frontend** | React + Vite | Fast development, component reuse |
| **Styling** | Tailwind CSS | Rapid styling, consistent design |
| **Database** | Supabase (PostgreSQL) | Already set up with schema |
| **Auth** | Supabase Auth | Simple, built-in |
| **Hosting** | Vercel or Netlify | Free tier, easy deploy |
| **Rich Text** | TipTap or Slate | Bio editing |
| **Visualization** | D3.js or Vis.js | Family trees, network graphs |

---

## Design Direction

**Aesthetic**: Scholarly/archival with modern usability
- Warm, aged paper tones (not stark white)
- Serif fonts for content (readable, historical feel)
- Clean sans-serif for UI elements
- Subtle texture/grain backgrounds
- Card-based layouts for records
- Dark mode option for long research sessions

**Inspiration**: Library card catalogs, archival finding aids, academic journals

---

## Phase 1: Foundation (MVP)

### 1.1 Project Setup
- [ ] Initialize React + Vite project
- [ ] Configure Tailwind CSS
- [ ] Set up Supabase client connection
- [ ] Create environment variables for Supabase keys
- [ ] Basic routing structure

### 1.2 Database Schema Updates
- [ ] Update sources table for proper citations
- [ ] Add evidence linking table
- [ ] Add confidence/evidence fields to all relationship tables
- [ ] Run migrations on Supabase

### 1.3 Authentication
- [ ] Login/logout with Supabase Auth
- [ ] Protected routes
- [ ] User session management

### 1.4 Core Components: Evidence Infrastructure
Build reusable components for confidence and evidence display:

- [ ] `<ConfidenceIndicator>` - Visual badge (●/◐/○) with label
- [ ] `<EvidenceBlock>` - Expandable evidence summary
- [ ] `<SourceCitation>` - Formatted citation display
- [ ] `<SourceSelector>` - Search/select existing source or add new
- [ ] `<EvidenceForm>` - Add/edit evidence for any claim

**EvidenceBlock Component:**
```
┌─────────────────────────────────────────────────────┐
│ ● CONFIRMED                                         │
├─────────────────────────────────────────────────────┤
│ Source: Henrico County Deed Book 3:45 (1718)        │
│                                                     │
│ "...unto James Johnson, son of Michael Johnson..."  │
│                                                     │
│ [View Full Source] [Edit Evidence]                  │
└─────────────────────────────────────────────────────┘
```

### 1.5 People Browser
Core view for exploring individuals in the database.

**Features:**
- [ ] Paginated list of all people
- [ ] Search by name, ID, location
- [ ] Filter by:
  - Surname (Johnson, Johnston, allied families)
  - Time period (birth year range)
  - Location (county/state)
  - DNA group
  - Confidence level
- [ ] Sort by name, date, location
- [ ] Quick stats (total count, by confidence level)
- [ ] Confidence indicator on each person card

**UI Components:**
- SearchBar
- FilterPanel
- PersonCard (compact view with confidence indicator)
- PersonTable (list view)
- Pagination

### 1.6 Person Detail View
Full record for one individual.

**Sections (each with confidence + evidence):**
- [ ] Header: Name, ID, dates, locations, overall confidence badge
- [ ] Bio panel (editable rich text)
- [ ] Vital Facts (birth, death, burial) - each with evidence
- [ ] Family relationships - each with confidence + evidence
- [ ] Associations - each with confidence + evidence  
- [ ] Documents - each link with role + evidence
- [ ] Migration timeline - each location with evidence
- [ ] Military service - each record with evidence
- [ ] Research notes (working theories, not evidence)
- [ ] Identity candidates ("possibly same as...")
- [ ] Source bibliography (all sources cited for this person)

**Visual Pattern for All Linked Items:**
```
┌─────────────────────────────────────────────────────┐
│ FAMILY RELATIONSHIPS                          [Add] │
├─────────────────────────────────────────────────────┤
│ ● Father: Michael Johnson (d. 1718)          [View] │
│   ├─ Henrico Deed Book 3:45 (1718)                  │
│   └─ "unto James Johnson, son of Michael..."        │
│                                            [Expand] │
│                                                     │
│ ◐ Mother: Sarah Watson                       [View] │
│   ├─ Watson Will (date unknown)                     │
│   └─ "daughter Sarah, wife of Michael Johnson"      │
│   ⚠ Note: Small bequest; original not examined     │
│                                            [Expand] │
│                                                     │
│ ● Brother: James Johnson                     [View] │
│   ├─ Henrico Deed Book 3:45 (1718)                  │
│   └─ Same patent names both as sons of Michael      │
│                                            [Expand] │
└─────────────────────────────────────────────────────┘

● = Confirmed (direct evidence)
◐ = Likely (indirect/circumstantial)  
○ = Possible (unverified)
```

**UI Components:**
- PersonHeader
- VitalFactsPanel (birth, death, burial with evidence)
- RelationshipsList (with confidence + evidence per item)
- AssociationsList (with confidence + evidence per item)
- DocumentsList (with role + evidence per item)
- MigrationTimeline (with evidence per location)
- MilitaryServiceList (with evidence per record)
- ResearchNotesPanel (theories, questions - clearly marked as NOT evidence)
- IdentityCandidatesPanel
- SourceBibliography

### 1.7 Basic Data Entry
Add and edit records with proper source citation.

**Forms:**
- [ ] Add/Edit Person (basic fields)
- [ ] Add/Edit Source (full citation builder)
- [ ] Add/Edit Document (with source citation)
- [ ] Link Person to Document (with role + evidence)
- [ ] Add Family Relationship (with confidence + evidence)
- [ ] Add Association (with confidence + evidence)
- [ ] Add Vital Fact (birth/death/burial with evidence)

**Source Citation Builder:**
```
┌─────────────────────────────────────────────────────┐
│ ADD SOURCE                                          │
├─────────────────────────────────────────────────────┤
│ Source Type: ○ Primary  ○ Derivative  ○ Authored    │
│                                                     │
│ ─── FOR PRIMARY SOURCES ───                         │
│ Repository: [Henrico County Courthouse           ]  │
│ Collection: [Deed Books                          ]  │
│ Volume:     [Book 3                              ]  │
│ Page:       [45                                  ]  │
│ Record Date:[1718-01-22                          ]  │
│ Description:[Michael Johnson to James Johnson    ]  │
│                                                     │
│ ─── OR FOR PUBLISHED SOURCES ───                    │
│ Author:     [Nugent, Nell Marion                 ]  │
│ Title:      [Cavaliers and Pioneers, Vol. 1      ]  │
│ Publisher:  [Virginia State Library              ]  │
│ Place:      [Richmond                            ]  │
│ Year:       [1934                                ]  │
│ Page:       [123                                 ]  │
│                                                     │
│ ─── GENERATED CITATION ───                          │
│ Henrico County, Virginia, Deed Book 3:45, Michael   │
│ Johnson to James Johnson, 22 January 1718.          │
│                                                     │
│ Short form: [Henrico DB 3:45                     ]  │
│                                                     │
│ □ Original record examined                          │
│ If not, cited in: [________________________      ]  │
│                                                     │
│                              [Cancel] [Save Source] │
└─────────────────────────────────────────────────────┘
```

---

## Phase 2: Identity Resolution

The critical "is this the same person?" workflow.

### 2.1 Database Addition
```sql
CREATE TABLE identity_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id_1 TEXT NOT NULL REFERENCES people(id),
    person_id_2 TEXT NOT NULL REFERENCES people(id),
    likelihood TEXT CHECK (likelihood IN ('likely', 'possible', 'unlikely')),
    evidence_for TEXT,        -- Why they might be same
    evidence_against TEXT,    -- Why they might be different
    source_ids UUID[],        -- Sources consulted in making this determination
    status TEXT CHECK (status IN ('unresolved', 'confirmed_same', 'confirmed_different')),
    resolved_date DATE,
    resolved_by TEXT,
    resolution_evidence TEXT, -- What source confirmed/refuted the match
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(person_id_1, person_id_2)
);
```

### 2.2 Record Entry with Match Finding
When entering information from a document, find potential matches.

**Workflow:**
1. Enter document details (source, date, location, transcription)
2. For each person mentioned in document:
   - Enter name as it appears in document
   - System searches for matches
   - User selects: existing person / new person / maybe-match

**Input panel:**
```
┌─────────────────────────────────────────────────────┐
│ PERSON IN DOCUMENT                                  │
├─────────────────────────────────────────────────────┤
│ Name as written: [John Johnson                   ]  │
│ Role in document: [Adjacent landowner         ▼ ]  │
│                                                     │
│ Additional context from document:                   │
│ County: [Goochland        ] Year: [1745        ]   │
│ Other names mentioned: [William Payne, Thos Bird]   │
│                                                     │
│ ─── POTENTIAL MATCHES ───                           │
│                                                     │
│ ┌─ 87% Match ─────────────────────────────────────┐ │
│ │ JNSN-HEN-e1695-02 - John Johnson                │ │
│ │ Son of Michael Johnson (White Oak)              │ │
│ │ ● Active Goochland 1730-1750s                   │ │
│ │ ● Adjacent to Woodson (allied family)           │ │
│ │ ○ No known Payne connection                     │ │
│ │                    [This Person] [Compare]      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─ 45% Match ─────────────────────────────────────┐ │
│ │ JNSN-HAN-e1695-01 - John Johnson                │ │
│ │ Hanover County, 250 acres 1723                  │ │
│ │ ○ Adjacent county                               │ │
│ │ ○ No Goochland records found                    │ │
│ │                    [This Person] [Compare]      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [Create New Person] [Flag as Maybe-Match to #1]     │
└─────────────────────────────────────────────────────┘
```

### 2.3 Matching Algorithm

Score candidates based on documentary evidence:

**Strong positive signals (+3 each):**
- Same county in overlapping time period (per documented records)
- Document names same associated individuals
- Adjacent landowner in multiple documents
- Consistent land description/location

**Moderate positive signals (+2 each):**
- Adjacent/nearby county with plausible migration
- Known family connection to associated individuals
- Same occupation mentioned
- Consistent with known migration corridor

**Weak positive signals (+1 each):**
- Within reasonable age range for document type
- Same surname spelling variant pattern
- Same given name (obviously)

**Negative signals:**
- -3: Documented in different location at same date
- -3: Death date before this document
- -2: Conflicting family information
- -2: Different occupation in same time period

**Key principle**: Matching is based on *documented facts*, not assumptions. If we don't have a document placing someone in Goochland, we can't assume they weren't there.

### 2.4 Comparison View
Side-by-side view showing all documented evidence for two individuals:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ COMPARE: Are these the same person?                                     │
├────────────────────────────────┬────────────────────────────────────────┤
│ JNSN-HEN-e1695-02              │ JNSN-GOO-e1720-01                      │
│ John Johnson                   │ John Johnson                           │
├────────────────────────────────┼────────────────────────────────────────┤
│ DOCUMENTED LOCATIONS           │ DOCUMENTED LOCATIONS                   │
│ ● Henrico 1718 (patent)        │ ● Goochland 1745 (deed witness)        │
│ ● Goochland 1730 (deed)        │ ● Goochland 1748 (patent)              │
│ ● Goochland 1735 (tax list)    │                                        │
├────────────────────────────────┼────────────────────────────────────────┤
│ DOCUMENTED FAMILY              │ DOCUMENTED FAMILY                      │
│ ● Father: Michael Johnson      │ (none documented)                      │
│   (Henrico DB 3:45)            │                                        │
│ ● Brother: James Johnson       │                                        │
│   (same source)                │                                        │
├────────────────────────────────┼────────────────────────────────────────┤
│ DOCUMENTED ASSOCIATES          │ DOCUMENTED ASSOCIATES                  │
│ ● Benjamin Woodson (adjacent)  │ ● William Payne (adjacent)             │
│ ● Thomas Mims (adjacent)       │ ● Thomas Bird (witness)                │
├────────────────────────────────┼────────────────────────────────────────┤
│ ALL SOURCES                    │ ALL SOURCES                            │
│ • Henrico DB 3:45 (1718)       │ • Goochland DB 2:112 (1745)            │
│ • Goochland DB 1:23 (1730)     │ • Patent Book 12:89 (1748)             │
│ • Goochland Tithables 1735     │                                        │
└────────────────────────────────┴────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ EVIDENCE FOR SAME PERSON:                                               │
│ • Both documented in Goochland (1730s-1740s overlap)                    │
│ • Timeline consistent: Henrico 1718 → Goochland 1730+                   │
│ • Age-appropriate for all documents                                     │
│                                                                         │
│ EVIDENCE AGAINST:                                                       │
│ • No shared associates documented                                       │
│ • Second record has no family connections established                   │
│ • 10-year gap in documentation (1735-1745)                              │
│                                                                         │
│ WOULD RESOLVE THIS:                                                     │
│ • Find deed naming "John Johnson son of Michael" in Goochland           │
│ • Find Payne-Woodson connection                                         │
│ • Find record bridging 1735-1745 gap                                    │
└─────────────────────────────────────────────────────────────────────────┘

[Confirm SAME Person]  [Confirm DIFFERENT People]  [Mark as MAYBE - needs research]
```

### 2.5 Merge Workflow
When confirmed same person:
1. Choose which ID to keep as primary (usually earlier/more documented)
2. Review all linked records from both
3. Merge: all documents, relationships, associations transfer to primary
4. Archive secondary ID (don't delete - audit trail)
5. Update identity_candidates table: status = 'confirmed_same'
6. Log the merge with resolution_evidence citing what confirmed it

### 2.6 Unresolved Queue
Dashboard of identity questions needing resolution:
- Filter by likelihood (likely/possible/unlikely)
- Sort by date added, last updated
- Show what evidence exists for each
- Quick action to open comparison view
- "Needs research" flag with notes on what would resolve

---

## Phase 3: Document Management

### 3.1 Document Browser
- List all documents
- Filter by type, county, date range, linked people
- Search transcription text

### 3.2 Document Detail View
- Full transcription
- Linked people with roles
- Source citation
- Upload image/PDF of original (Supabase Storage)

### 3.3 Document Entry Workflow
Streamlined entry for land patents, deeds, wills:

1. Select document type
2. Enter basic info (date, county, source)
3. Paste or type transcription
4. System highlights potential names
5. Click name → match to existing person or create new
6. Assign roles (patentee, witness, adjacent, etc.)

### 3.4 Quick Entry Mode
For rapid data entry from Tony's files:
- Paste excerpt
- Auto-parse common patterns (dates, acreage, county names)
- Name recognition with one-click matching

---

## Phase 4: Visualization

### 4.1 Family Tree View
Interactive tree diagram for a selected person:
- Parents above, children below, siblings alongside
- Spouses connected
- Click any node to navigate
- Color-code by confidence level
- Show "possibly same as" with dotted lines

### 4.2 Network Graph
Show all connections (family + associations) for a person:
- Central person, radiating connections
- Different edge types (family vs. neighbor vs. witness)
- Filter by relationship type
- Expand nodes to see their connections

### 4.3 Migration Map
Show movement patterns:
- Timeline slider
- Plot locations on Virginia/colonial map
- Animate migration paths
- Show family groups moving together

### 4.4 Timeline View
Chronological view of a person's documented life:
- Birth (if known)
- Each document/record as a point
- Relationships (marriage, children's births)
- Death
- Overlay with historical events (county formations, wars)

---

## Phase 5: Bio Development & Book Production

### 5.1 Bio Editor
Rich text editor for each person's bio:
- Formatting (headers, bold, italic, lists)
- Insert citations from linked documents
- Side panel showing all evidence
- Auto-save
- Version history

### 5.2 Research Status Tracking
For each person:
- Research status: Not started / In progress / Draft complete / Ready for publication
- Checklist: Has bio? Has sources? Parents identified? etc.
- Notes/questions log

### 5.3 Chapter Builder
Organize people into book chapters:
- Drag-and-drop people into chapter outline
- Preview chapter with all bios concatenated
- Export to Markdown or Word

### 5.4 Citation Generator
- Auto-generate citations from source records
- Multiple formats (Chicago, genealogical standard)
- Footnote or endnote style

---

## Phase 6: Research Tools

### 6.1 Gap Analysis Dashboard
Show what's missing:
- People with no parents identified
- People with no death date
- People with only one document
- Unlinked documents
- Low-confidence records needing verification
- "Likely" claims that could be upgraded with specific sources

### 6.2 Source File Tracker
Track which of Tony's files have been processed:
- Upload file inventory
- Mark files as: Not started / In progress / Complete
- Notes per file
- **Important**: Track what was *extracted* vs. what was *unverifiable*

### 6.3 Research Questions Log
Track open questions with specific actionable items:
- "Need to examine Watson will - where is original?"
- "Check Henrico deed books 1700-1710 for Michael Johnson"
- "Find source for claim that John Jones was brother-in-law"
- Link to relevant people
- Status: Open / In progress / Resolved / Cannot resolve
- If resolved: what source answered the question?

### 6.4 Research Notes vs. Evidence
**Critical distinction in the interface:**

Research notes are:
- Working theories
- Speculation about connections
- Notes from Tony's files without citations
- "Probably" and "likely" statements without documentary basis
- Questions and hypotheses

Research notes are **clearly marked** and **never displayed as evidence**:
```
┌─────────────────────────────────────────────────────┐
│ ⚠ RESEARCH NOTES (not evidence)                     │
├─────────────────────────────────────────────────────┤
│ Tony's file suggests Michael Johnson may have       │
│ originated in Lower Norfolk County based on         │
│ surname patterns, but no documentary evidence       │
│ has been found to confirm this.                     │
│                                                     │
│ Added: 2024-01-15                                   │
│ Source: Tony L. Johnson research file               │
│ Status: Unverified - needs research                 │
└─────────────────────────────────────────────────────┘
```

### 6.5 Pattern Detection (Advanced)
Automated suggestions based on documented evidence:
- "These 3 John Johnsons have overlapping Goochland records 1740-1760"
- "William Payne appears with Johnsons in both Henrico and Augusta"
- "No records for JNSN-HEN-e1695-02 between 1735-1745"
- "JNSN-GOO-e1720-01 has no documented family - priority for research"

---

## Phase 7: Import/Export

### 7.1 Bulk Import
- CSV upload for people, documents
- SQL paste for Claude Code output
- Validation and preview before commit

### 7.2 Export Options
- GEDCOM for genealogy software
- CSV of any table
- Full database backup
- Chapter/bio export to Markdown/Word

### 7.3 API for Claude Code
REST endpoints for Claude Code to:
- Query people by criteria
- Add new records
- Check for duplicates before inserting

---

## Implementation Sequence

### Sprint 1 (Week 1-2): Foundation + Evidence Infrastructure
- Project setup, auth, basic routing
- **Database schema updates** (sources table, evidence table, confidence fields)
- Core evidence components: ConfidenceIndicator, EvidenceBlock, SourceCitation
- People browser (list, search, filter) with confidence indicators
- Person detail view (read-only, showing evidence for each claim)

### Sprint 2 (Week 3-4): Data Entry with Citations
- Source entry form (citation builder)
- Add/edit person forms
- Add/edit document forms with source linking
- Link people to documents (with role + evidence)
- Family relationships CRUD (with confidence + evidence)
- Associations CRUD (with confidence + evidence)

### Sprint 3 (Week 5-6): Identity Resolution
- identity_candidates table migration
- Match finder algorithm (based on documented evidence)
- Comparison view (side-by-side with all sources)
- Merge workflow with audit trail

### Sprint 4 (Week 7-8): Documents & Research Tools
- Document browser and detail view
- Quick entry mode with name recognition
- Research questions log
- Gap analysis dashboard

### Sprint 5 (Week 9-10): Bio & Visualization
- Bio editor with citation insertion
- Research notes panel (clearly separated from evidence)
- Basic family tree visualization (confidence color-coded)
- Research status tracking

### Sprint 6 (Week 11-12): Advanced Features
- Network graph
- Migration map (if time permits)
- Chapter builder
- Export functionality (GEDCOM, CSV, Markdown)

---

## File Structure

```
johnson-research-ui/
├── src/
│   ├── components/
│   │   ├── common/           # Buttons, cards, modals, forms
│   │   │   ├── ConfidenceIndicator.jsx
│   │   │   ├── EvidenceBlock.jsx
│   │   │   └── ...
│   │   ├── sources/          # SourceCitation, SourceForm, SourceSelector
│   │   ├── evidence/         # EvidenceForm, EvidenceList
│   │   ├── people/           # PersonCard, PersonTable, PersonHeader
│   │   ├── documents/        # DocumentCard, DocumentForm
│   │   ├── relationships/    # RelationshipsList, FamilyTree
│   │   ├── identity/         # MatchFinder, ComparisonView, MergeWorkflow
│   │   ├── bio/              # BioEditor, CitationInserter
│   │   ├── research/         # ResearchNotes, ResearchQuestions
│   │   └── visualization/    # NetworkGraph, MigrationMap, Timeline
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── PeopleBrowser.jsx
│   │   ├── PersonDetail.jsx
│   │   ├── DocumentBrowser.jsx
│   │   ├── DocumentDetail.jsx
│   │   ├── SourceBrowser.jsx      # Browse all sources
│   │   ├── SourceDetail.jsx       # See all claims from a source
│   │   ├── IdentityQueue.jsx
│   │   ├── Compare.jsx
│   │   ├── ResearchQuestions.jsx  # Open questions dashboard
│   │   ├── GapAnalysis.jsx        # What's missing
│   │   └── Settings.jsx
│   ├── hooks/
│   │   ├── useSupabase.js
│   │   ├── usePeople.js
│   │   ├── useDocuments.js
│   │   ├── useSources.js         # Source management
│   │   ├── useEvidence.js        # Evidence linking
│   │   └── useMatching.js
│   ├── lib/
│   │   ├── supabase.js           # Supabase client
│   │   ├── matching.js           # Identity matching algorithm
│   │   ├── citations.js          # Citation formatting helpers
│   │   └── idGenerator.js        # Generate person IDs
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env                          # Supabase keys
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Supabase Configuration Needed

### Updated Sources Table

The sources table needs to support proper genealogical citations:

```sql
-- Drop and recreate sources table with proper citation fields
DROP TABLE IF EXISTS sources CASCADE;

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source classification
    source_type TEXT CHECK (source_type IN (
        'primary',           -- Original record
        'derivative',        -- Abstract, transcription, index
        'authored',          -- Published genealogy, analysis
        'research_notes'     -- Working files (not evidence)
    )),
    
    -- For primary sources
    repository TEXT,         -- "Henrico County Courthouse" or "Library of Virginia"
    collection TEXT,         -- "Deed Books" or "Will Books"
    volume TEXT,             -- "Book 3" or "Vol. 1"
    page TEXT,               -- "p. 45" or "45-47"
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
    
    -- Formatted citation (auto-generate or manual)
    full_citation TEXT,      -- Complete citation string
    abbreviation TEXT,       -- Short form: "CPv1" or "Henrico DB 3:45"
    
    -- Research tracking
    original_examined BOOLEAN DEFAULT FALSE,  -- Have we seen the actual record?
    cited_in TEXT,           -- If derivative: what source cited this?
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sources_type ON sources(source_type);
CREATE INDEX idx_sources_abbreviation ON sources(abbreviation);
```

### Evidence Linking Table

Link any claim to its supporting sources:

```sql
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What this evidence supports (polymorphic)
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'family_relationship',
        'association', 
        'document_person',
        'migration',
        'military_service',
        'person_attribute'  -- For birth, death, occupation claims
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
```

### Row Level Security (RLS)
For now, simple authenticated access:
```sql
-- Enable RLS on all tables
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- etc.

-- Policy: authenticated users can do everything
CREATE POLICY "Authenticated users full access" ON people
    FOR ALL USING (auth.role() = 'authenticated');
```

### Storage Bucket
For document images/PDFs:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);
```

### Database Functions
Useful server-side functions:
- `search_people(query text)` - full-text search
- `find_matches(name text, year int, county text)` - identity matching
- `merge_people(keep_id text, merge_id text)` - merge duplicates

---

## Questions Before Starting

1. **Supabase URL and anon key** - Do you have these ready to configure?

2. **Hosting preference** - Vercel, Netlify, or run locally for now?

3. **Start with Phase 1 immediately** or review/adjust the plan first?

4. **Any features to prioritize higher** than my suggested sequence?

5. **Design preference** - Should I create a few mockups/screenshots before coding, or dive straight into building?

---

## Next Step

Once you confirm the plan, I'll create the initial project structure in Claude Code with:
- React + Vite setup
- Tailwind configuration
- Supabase client connection
- Basic routing
- First component: People Browser

Ready to proceed?
