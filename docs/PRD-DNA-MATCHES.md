# PRD: DNA Match Tracker & Segment Visualizer

## Overview
Add DNA match tracking to the Johnson Genealogy App, enabling users to record DNA matches with segment data, visualize chromosome overlaps, and track mystery surnames that appear across matches but aren't yet connected to the family tree.

## Goals
1. **Capture DNA match data** — matches, segments, surnames from match trees
2. **Visualize overlaps** — see which matches share chromosome regions
3. **Track mystery surnames** — identify recurring surnames not yet in tree
4. **Support brick wall research** — use DNA patterns to guide research on unknown ancestors

## Non-Goals (Future Phases)
- Automated triangulation detection
- AI-powered analysis
- Automatic person discovery/creation
- Chromosome painting (full genome view)

---

## Database Schema

### Table: `dna_matches`
Core match record from any testing company.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| workspace_id | uuid | FK to workspaces |
| match_name | text | Name of the DNA match |
| testing_company | text | ancestry, 23andme, ftdna, myheritage, gedmatch, other |
| shared_cm | decimal | Total shared cM |
| shared_segments | integer | Number of shared segments |
| largest_segment_cm | decimal | Largest segment size |
| predicted_relationship | text | Company's prediction (e.g., "2nd-3rd cousin") |
| match_tree_url | text | Link to match's tree (if available) |
| match_tree_size | integer | Number of people in match's tree |
| notes | text | Free-form notes |
| contact_status | text | not_contacted, contacted, responded, no_response, collaborative |
| confirmed_mrca_id | uuid | FK to people (if MRCA confirmed) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Table: `dna_segments`
Individual chromosome segments for each match.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| match_id | uuid | FK to dna_matches |
| chromosome | text | '1'-'22', 'X' |
| start_position | bigint | Start position (base pairs) |
| end_position | bigint | End position (base pairs) |
| cm | decimal | Segment size in cM |
| snps | integer | Number of SNPs (if available) |
| created_at | timestamptz | |

### Table: `dna_match_surnames`
Surnames observed in a match's tree (even without confirmed connection).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| match_id | uuid | FK to dna_matches |
| surname | text | Surname from match's tree |
| frequency | integer | How many times it appears in their tree |
| notes | text | e.g., "appears in Virginia line" |
| created_at | timestamptz | |

### Table: `mystery_surnames`
Aggregated tracking of surnames appearing across matches but not in user's tree.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| workspace_id | uuid | FK to workspaces |
| surname | text | The mystery surname |
| match_count | integer | How many matches have this surname |
| total_shared_cm | decimal | Sum of cM from matches with this surname |
| in_tree | boolean | Is this surname in user's tree? (default false) |
| notes | text | Research notes |
| priority | text | high, medium, low |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Indexes
```sql
CREATE INDEX idx_dna_matches_workspace ON dna_matches(workspace_id);
CREATE INDEX idx_dna_matches_shared_cm ON dna_matches(shared_cm DESC);
CREATE INDEX idx_dna_segments_match ON dna_segments(match_id);
CREATE INDEX idx_dna_segments_chromosome ON dna_segments(chromosome, start_position);
CREATE INDEX idx_dna_match_surnames_match ON dna_match_surnames(match_id);
CREATE INDEX idx_dna_match_surnames_surname ON dna_match_surnames(surname);
CREATE INDEX idx_mystery_surnames_workspace ON mystery_surnames(workspace_id);
CREATE INDEX idx_mystery_surnames_count ON mystery_surnames(match_count DESC);
```

---

## Frontend Design

### Navigation
- Add "DNA" section to sidebar with icon (Dna from lucide-react)
- Sub-items: Matches, Segments, Mystery Surnames

### Page: DNA Matches (`/dna/matches`)

**Header:**
- Title: "DNA Matches"
- Button: "+ Add Match"
- Stats bar: Total matches | Avg shared cM | Matches with segments | Unlinked matches

**Filters:**
- Testing company (dropdown)
- cM range (min/max sliders)
- Has segments (yes/no/all)
- Contact status
- Search by name

**Table columns:**
| Match Name | Company | Shared cM | Segments | Largest | Predicted | MRCA | Actions |

**Row actions:**
- View/Edit
- Add segments
- View in overlap visualizer

### Page: Add/Edit Match (`/dna/matches/new`, `/dna/matches/:id`)

**Form sections:**

1. **Basic Info**
   - Match name (required)
   - Testing company (dropdown)
   - Shared cM (required)
   - Shared segments count
   - Largest segment cM
   - Predicted relationship

2. **Match's Tree**
   - Tree URL
   - Tree size
   - Surnames (tag input — add multiple)

3. **Connection**
   - MRCA (person selector from tree)
   - Contact status
   - Notes (rich text)

4. **Segments** (expandable section)
   - Table of segments
   - "+ Add Segment" button
   - Segment row: Chromosome | Start | End | cM | SNPs | Delete

### Page: Segment Overlap Visualizer (`/dna/segments`)

**Purpose:** See which matches share chromosome regions.

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Chromosome: [1 ▼]  [2] [3] ... [22] [X]                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ──────────────────────────────────────────────────     │  ← Chromosome ruler (Mbp)
│  0        50        100       150       200       250   │
│                                                         │
│  Match A  ████████████                                  │  ← Segment bars
│  Match B       ████████████████                         │
│  Match C            ██████                              │  ← Overlap visible
│  Match D                          ████████              │
│  Match E  ███                               ████        │
│                                                         │
│           └─── 3 matches overlap here ───┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Chromosome tabs (1-22 + X)
- Horizontal bars showing each match's segment on that chromosome
- Color-coded by match or by cM size
- Hover: show match name, segment size, position
- Click overlap region: list matches that share it
- Highlight: select a match to highlight all their segments
- Filter: minimum cM to display

**Overlap detection (visual only):**
- When 2+ segments overlap, show count badge
- Click to see list: "Matches sharing Chr 7: 45M-62M"

### Page: Mystery Surnames (`/dna/surnames`)

**Purpose:** Track surnames appearing in matches but not in user's tree.

**Header:**
- Title: "Mystery Surnames"
- Button: "Refresh from matches" (recalculates counts)
- Toggle: "Hide in-tree surnames"

**Table:**
| Surname | Matches | Total cM | In Tree? | Priority | Actions |

**Sorting:** Default by match_count DESC

**Row actions:**
- Mark as "in tree" (when you discover the connection)
- Set priority
- View matches with this surname
- Add notes

**Auto-population:**
- When viewing, aggregate all surnames from `dna_match_surnames`
- Compare against surnames in `people` table
- Flag those not found as "mystery"

### Component: DNA Stats Card (for Dashboard)

Small card showing:
- Total DNA matches: X
- Segments recorded: X
- Mystery surnames: X
- Top mystery: "Cantrell (12 matches)"

---

## User Flows

### Flow 1: Add a DNA Match
1. User clicks "+ Add Match"
2. Enters basic info (name, company, cM)
3. (Optional) Adds surnames from match's tree
4. (Optional) Adds segment data
5. Saves → appears in match list

### Flow 2: Record Segments
1. User opens a match
2. Expands "Segments" section
3. Clicks "+ Add Segment"
4. Enters: Chromosome, Start, End, cM
5. Repeats for each segment
6. Saves

### Flow 3: View Overlaps
1. User goes to Segments visualizer
2. Selects chromosome (e.g., "7")
3. Sees all matches with segments on Chr 7
4. Notices 3 bars overlapping at position 45M-62M
5. Clicks overlap → sees match names
6. Notes this for research

### Flow 4: Track Mystery Surname
1. User notices "Cantrell" appears in multiple matches
2. Goes to Mystery Surnames page
3. Sees "Cantrell: 12 matches, 847 cM total"
4. Sets priority to "High"
5. Adds note: "Check Virginia/Tennessee records"
6. Later finds Cantrell ancestor → marks "In Tree"

---

## Technical Notes

### Segment Position Format
- Use base pair positions (standard in DNA tools)
- Chromosome lengths (GRCh38): stored as reference data
- cM calculated from segment span (or entered directly)

### Data Import (Future)
- Ancestry: CSV export
- 23andMe: DNA Relatives export
- FTDNA: Chromosome browser export
- GEDmatch: Segment data

### Performance
- Index on (chromosome, start_position) for overlap queries
- Segment visualization: load only selected chromosome
- Mystery surnames: calculate on demand or cache in table

---

## Implementation Phases

### Phase 1: Foundation (This Build)
- [ ] Create database tables + migrations
- [ ] DNA Matches list page
- [ ] Add/Edit match form (basic info + surnames)
- [ ] Segments entry UI

### Phase 2: Visualization
- [ ] Chromosome segment visualizer
- [ ] Overlap highlighting
- [ ] Click-to-see-matches interaction

### Phase 3: Mystery Surnames
- [ ] Mystery surnames page
- [ ] Auto-aggregation from match surnames
- [ ] Comparison against tree surnames
- [ ] Priority/notes tracking

### Phase 4: Integration
- [ ] Dashboard DNA stats card
- [ ] Person detail: "DNA matches through this ancestor"
- [ ] Link MRCA to matches

---

## Success Metrics
- User can record all DNA matches from any testing company
- Segment overlaps are visually apparent
- Mystery surnames surface patterns not visible in raw match lists
- Supports brick wall research by highlighting recurring unknown surnames

---

## Open Questions
1. Import formats — should we support CSV import in Phase 1?
2. Segment visualization library — D3.js? Custom SVG? Existing chromosome viz library?
3. Should mystery surnames auto-refresh or manual trigger?
