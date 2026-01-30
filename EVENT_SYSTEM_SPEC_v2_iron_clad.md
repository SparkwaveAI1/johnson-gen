# EVENT-BASED DOCUMENT PROCESSING: Iron-Clad Specification v2

## EXECUTIVE SUMMARY

This system processes genealogical documents by extracting **Events** (documented occurrences) and linking **Participants** to person profiles with appropriate confidence levels. The key principle: **capture everything, force nothing**. Evidence accumulates over time; identifications strengthen as more documents are processed.

---

## PART 1: DATA MODEL (Simplified)

### Three Tables Only

```
DOCUMENTS → contain → EVENTS → have → EVENT_PARTICIPANTS → link to → PEOPLE
```

### Table: events

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source document
    document_id UUID REFERENCES documents(id) NOT NULL,
    
    -- When
    event_date DATE,                        -- Parsed date (NULL if unparseable)
    event_date_text TEXT NOT NULL,          -- Date exactly as written in document
    event_year INTEGER,                     -- Extracted year for queries (NULL if unknown)
    
    -- Where  
    location_id UUID REFERENCES locations(id),
    location_text TEXT,                     -- Location exactly as written
    
    -- What
    event_type TEXT NOT NULL,               -- See event types below
    title TEXT NOT NULL,                    -- Brief: "Absalom Looney will 1791"
    description TEXT,                       -- Fuller description
    transcription TEXT,                     -- Relevant excerpt from document
    
    -- Position in source
    line_start INTEGER,
    line_end INTEGER,
    section_marker TEXT,                    -- e.g., "#1756" year marker
    
    -- Confidence of the EVENT itself (is this a real documented occurrence?)
    confidence TEXT NOT NULL DEFAULT 'probable' 
        CHECK (confidence IN ('confirmed', 'probable', 'possible')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_events_document ON events(document_id);
CREATE INDEX idx_events_year ON events(event_year);
CREATE INDEX idx_events_location ON events(location_id);
CREATE INDEX idx_events_type ON events(event_type);
```

**Event Types (exhaustive list):**
- `land_patent` - Original grant from colony/state
- `land_deed` - Transfer between parties
- `land_survey` - Survey record
- `will` - Will document
- `estate_admin` - Estate administration, inventory, settlement
- `court_case` - Lawsuit, judgment
- `court_order` - Court order (road order, apprenticeship, etc.)
- `petition` - Petition to government
- `bond` - Bond posting (administration, marriage, etc.)
- `tax_list` - Tax or tithable list
- `militia_list` - Militia muster or list
- `census` - Census record
- `church_membership` - Church membership record
- `baptism` - Baptism record
- `church_marriage` - Marriage record from church
- `church_burial` - Burial record
- `vital_birth` - Birth certificate/record
- `vital_death` - Death certificate/record
- `vital_marriage` - Marriage license/certificate
- `pension` - Pension application or record
- `military_service` - Service record
- `narrative` - Story, biography, compiled account
- `list_other` - Other list (jury, subscribers, processioners, etc.)
- `other` - Anything else

### Table: event_participants

```sql
CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- The event
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    
    -- The person profile (NULL if unidentified)
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    
    -- Name as written (ALWAYS captured, even if person_id is set)
    name_as_written TEXT NOT NULL,
    surname_extracted TEXT,                 -- Parsed surname for matching
    given_name_extracted TEXT,              -- Parsed given name for matching
    
    -- Role in the event
    role TEXT NOT NULL,                     -- See roles below
    
    -- Identification confidence (NULL if unidentified)
    confidence TEXT CHECK (confidence IN ('confirmed', 'probable', 'possible')),
    
    -- For possible/unidentified: array of potential profile matches
    -- Each element: {"person_id": "uuid", "score": 72, "reasons": ["name_match", "location"]}
    possible_matches JSONB DEFAULT '[]'::jsonb,
    
    -- Evidence for identification (why we think this is that person)
    identification_evidence TEXT,
    
    -- Additional extracted details (flexible)
    -- e.g., {"acres": 400, "livestock": "5 horses, 20 cattle"}
    details JSONB DEFAULT '{}'::jsonb,
    
    -- Status tracking
    identification_status TEXT NOT NULL DEFAULT 'unidentified'
        CHECK (identification_status IN ('confirmed', 'probable', 'possible', 'unidentified', 'rejected')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by TEXT,
    
    UNIQUE (event_id, name_as_written, role)
);

CREATE INDEX idx_ep_event ON event_participants(event_id);
CREATE INDEX idx_ep_person ON event_participants(person_id);
CREATE INDEX idx_ep_name ON event_participants(name_as_written);
CREATE INDEX idx_ep_surname ON event_participants(surname_extracted);
CREATE INDEX idx_ep_status ON event_participants(identification_status);
CREATE INDEX idx_ep_unidentified ON event_participants(id) 
    WHERE identification_status = 'unidentified';
```

**Participant Roles (exhaustive list):**

*Land/Legal:*
- `grantor` - Seller/transferor
- `grantee` - Buyer/recipient
- `witness` - Witness to document
- `chain_carrier` - Survey chain carrier
- `surveyor` - Surveyor
- `security` - Posted security/bond
- `appraiser` - Appraised estate
- `administrator` - Estate administrator
- `executor` - Will executor
- `testator` - Will maker
- `heir` - Named heir
- `petitioner` - Petition signer
- `plaintiff` - Lawsuit plaintiff
- `defendant` - Lawsuit defendant
- `juror` - Jury member
- `bondsman` - Posted bond
- `guardian` - Legal guardian

*Tax/Census/Lists:*
- `head_of_household` - Head of household
- `household_member` - Member of household
- `taxpayer` - Taxpayer
- `list_member` - Generic list member

*Military:*
- `soldier` - Enlisted soldier
- `officer` - Military officer
- `pensioner` - Pension recipient
- `militia_member` - Militia list member

*Church:*
- `member` - Church member
- `minister` - Minister/pastor
- `baptized` - Person baptized
- `spouse_1` - First spouse in marriage
- `spouse_2` - Second spouse in marriage
- `deceased` - Person buried/deceased
- `sponsor` - Baptism sponsor/godparent
- `parent` - Parent in baptism record

*Narrative:*
- `subject` - Main subject of narrative
- `mentioned` - Mentioned in narrative
- `author` - Author of narrative
- `informant` - Information source

*Generic:*
- `participant` - Generic participant
- `other` - Other role (specify in details)

### Table: documents (modifications)

```sql
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS raw_text TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS line_count INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'uploaded'
    CHECK (processing_status IN (
        'uploaded',      -- File received, not yet processed
        'analyzing',     -- Analyzing structure
        'extracting',    -- Extracting events
        'matching',      -- Matching participants to profiles
        'review',        -- Ready for user review
        'complete',      -- Fully processed
        'error'          -- Processing failed
    ));
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMP;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_completed_at TIMESTAMP;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS participant_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_log JSONB DEFAULT '[]'::jsonb;
```

### Table: people (modifications)

```sql
ALTER TABLE people ADD COLUMN IF NOT EXISTS confirmed_event_count INTEGER DEFAULT 0;
ALTER TABLE people ADD COLUMN IF NOT EXISTS probable_event_count INTEGER DEFAULT 0;
ALTER TABLE people ADD COLUMN IF NOT EXISTS possible_event_count INTEGER DEFAULT 0;
```

---

## PART 2: NAME REGISTRY (Cross-Chunk Tracking)

For long documents (1000+ lines), we need to track names across chunks to avoid treating the same person as different people in different sections.

### How It Works

**BEFORE event extraction, build a Name Registry:**

```sql
CREATE TABLE document_name_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    
    -- The name
    name_as_written TEXT NOT NULL,
    surname TEXT,
    given_name TEXT,
    
    -- First occurrence
    first_line_number INTEGER,
    first_section TEXT,
    
    -- Occurrence count
    mention_count INTEGER DEFAULT 1,
    
    -- Resolved profile (set during matching phase)
    resolved_person_id UUID REFERENCES people(id),
    resolution_confidence TEXT CHECK (resolution_confidence IN ('confirmed', 'probable', 'possible')),
    possible_matches JSONB DEFAULT '[]'::jsonb,
    
    UNIQUE (document_id, name_as_written)
);

CREATE INDEX idx_dnr_document ON document_name_registry(document_id);
CREATE INDEX idx_dnr_surname ON document_name_registry(surname);
```

### Processing Sequence for Long Documents

```
STEP 1: SCAN - Build Name Registry
    - Scan entire document
    - Extract every name
    - Record first occurrence and count
    - DO NOT create events yet

STEP 2: MATCH - Resolve Names to Profiles
    - For each name in registry, run matching algorithm
    - Assign resolved_person_id where confident
    - Record possible_matches where uncertain

STEP 3: EXTRACT - Create Events
    - Process document in chunks
    - Create events
    - When creating event_participant, look up name in registry
    - Copy resolution from registry to participant

STEP 4: VERIFY - Check Completeness
    - Every name in registry should appear in at least one event_participant
    - If not, something was missed - flag for review
```

This ensures "Robert Looney" on line 500 and line 75,000 link to the same profile.

---

## PART 3: CONFIDENCE LEVEL RULES

### Event Confidence (Is this event real?)

| Level | Criteria | Examples |
|-------|----------|----------|
| **Confirmed** | Primary source transcription with citation; or multiple sources agree | Will book reference with page number; deed with book/page |
| **Probable** | Secondary source or compilation; single source without full citation | Tony's compiled entries; narrative accounts |
| **Possible** | Researcher interpretation; uncertain transcription; conflicting info | "Researchers Notes" sections; speculative connections |

### Identification Confidence (Is this participant that profile?)

| Level | Who Assigns | Criteria |
|-------|-------------|----------|
| **Confirmed** | USER ONLY | User has reviewed and confirmed this is definitely the person |
| **Probable** | SYSTEM or USER | Strong evidence: unique name in location/time; OR match score >= 75; OR user marks as probable |
| **Possible** | SYSTEM or USER | Some evidence: name matches, dates/location plausible; match score 50-74 |
| **Unidentified** | SYSTEM | No profile link; name recorded with event only |

### System CANNOT Auto-Assign "Confirmed"

The system assigns at most "probable". Only user action elevates to "confirmed".

### Auto-Assignment Rules

```python
def assign_identification_confidence(match_score, match_count):
    """
    match_score: highest score among candidates (0-100)
    match_count: number of candidates with score > 50
    """
    
    if match_score >= 75 and match_count == 1:
        # High score, single candidate
        return 'probable', 'auto'
    
    if match_score >= 85:
        # Very high score even with multiple candidates
        return 'probable', 'auto'
    
    if match_score >= 50:
        # Decent score - possible
        return 'possible', 'auto'
    
    # No good matches
    return 'unidentified', None
```

---

## PART 4: MATCHING ALGORITHM (Detailed)

### Name Parsing

```python
def parse_name(name_as_written):
    """
    Parse name string into surname and given name.
    Handle common patterns in genealogical documents.
    """
    
    name = name_as_written.strip()
    
    # Pattern: "LOONEY, Absalom" (surname caps, comma)
    if ',' in name:
        parts = name.split(',', 1)
        return parts[0].strip().title(), parts[1].strip().title()
    
    # Pattern: "Absalom LOONEY" (surname in ALL CAPS)
    words = name.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 2]
    if caps_words:
        surname = caps_words[-1].title()
        given = ' '.join(w for w in words if w not in caps_words).title()
        return surname, given
    
    # Pattern: "Absalom Looney" (standard Western order)
    if len(words) >= 2:
        return words[-1].title(), ' '.join(words[:-1]).title()
    
    # Single word - assume surname
    return name.title(), None


def normalize_surname(surname):
    """
    Normalize surname variants for matching.
    """
    if not surname:
        return None
    
    s = surname.upper().strip()
    
    # Common substitutions
    s = s.replace('JOHNSTON', 'JOHNSON')
    s = s.replace('JONSON', 'JOHNSON')
    s = s.replace('RENTFRO', 'RENFRO')
    s = s.replace('RENTFROW', 'RENFRO')
    s = s.replace('LOONY', 'LOONEY')
    s = s.replace('LUNEY', 'LOONEY')
    
    return s
```

### Matching Algorithm

```python
def find_matches(name_as_written, event):
    """
    Find potential profile matches for a participant.
    Returns list of matches with scores and reasons.
    """
    
    surname, given_name = parse_name(name_as_written)
    normalized_surname = normalize_surname(surname)
    
    if not normalized_surname:
        return []  # Can't match without surname
    
    # Find candidates by surname (including variants)
    candidates = query("""
        SELECT p.*, 
               array_agg(DISTINCT lr.location_id) as location_ids,
               array_agg(DISTINCT r.person2_id) as associate_ids
        FROM people p
        LEFT JOIN location_residents lr ON p.id = lr.person_id
        LEFT JOIN relationships r ON p.id = r.person1_id
        WHERE upper(p.surname) = %s
           OR %s = ANY(SELECT upper(unnest(name_variants)))
        GROUP BY p.id
    """, normalized_surname, normalized_surname)
    
    results = []
    event_year = event.event_year
    event_location_id = event.location_id
    
    for person in candidates:
        score = 0
        reasons = []
        exclusions = []
        
        # ─────────────────────────────────────────────────────────
        # EXCLUSION CHECKS (hard disqualifiers)
        # ─────────────────────────────────────────────────────────
        
        if event_year:
            # Not yet born
            if person.birth_year and person.birth_year > event_year:
                exclusions.append(f'not_born_until_{person.birth_year}')
                continue  # Skip entirely
            
            # Already dead
            if person.death_year and person.death_year < event_year:
                exclusions.append(f'died_{person.death_year}')
                continue  # Skip entirely
            
            # Implausible age (over 100 or under 0)
            if person.birth_year:
                age = event_year - person.birth_year
                if age > 100 or age < 0:
                    exclusions.append(f'implausible_age_{age}')
                    continue
        
        # ─────────────────────────────────────────────────────────
        # SCORING (positive evidence)
        # ─────────────────────────────────────────────────────────
        
        # 1. Name match (required - already filtered by surname)
        score += 30
        reasons.append('surname_match')
        
        # 2. Given name match
        if given_name and person.given_name:
            if person.given_name.upper() == given_name.upper():
                score += 25
                reasons.append('given_name_exact')
            elif person.given_name.upper().startswith(given_name.upper()[:3]):
                score += 15
                reasons.append('given_name_partial')
        
        # 3. Plausible age at event
        if event_year and person.birth_year:
            age = event_year - person.birth_year
            if 18 <= age <= 70:
                score += 10
                reasons.append(f'plausible_age_{age}')
            elif 16 <= age <= 80:
                score += 5
                reasons.append(f'marginal_age_{age}')
        
        # 4. Location overlap
        if event_location_id and person.location_ids:
            event_location = get_location_with_ancestors(event_location_id)
            person_locations = get_locations_with_ancestors(person.location_ids)
            
            # Check for overlap (same location or ancestor/descendant)
            overlap = set(event_location) & set(person_locations)
            if overlap:
                score += 20
                reasons.append(f'location_overlap')
        
        # 5. Other participants match known associates
        other_participants = get_other_participants(event.id, name_as_written)
        for other in other_participants:
            if other.person_id and other.person_id in person.associate_ids:
                score += 15
                reasons.append(f'associate_in_event:{other.name_as_written}')
        
        # 6. Same name appears with this profile in other events
        prior_events = query("""
            SELECT COUNT(*) FROM event_participants 
            WHERE person_id = %s 
              AND name_as_written ILIKE %s
              AND identification_status IN ('confirmed', 'probable')
        """, person.id, name_as_written)
        
        if prior_events > 0:
            score += 20
            reasons.append(f'prior_events:{prior_events}')
        
        # ─────────────────────────────────────────────────────────
        # RECORD RESULT
        # ─────────────────────────────────────────────────────────
        
        if score >= 40:  # Minimum threshold to be considered
            results.append({
                'person_id': str(person.id),
                'person_name': f"{person.given_name} {person.surname}",
                'score': score,
                'reasons': reasons,
                'exclusions': exclusions
            })
    
    # Sort by score descending
    return sorted(results, key=lambda x: -x['score'])
```

---

## PART 5: EVENT BOUNDARY DETECTION

### The Problem

In a compilation document, how do we know where one event ends and the next begins?

### Detection Rules (in order of priority)

**1. Explicit Date Markers**
```
Pattern: Line starts with date pattern
Examples:
    "1756 Feb 15: Robert Looney..."
    "#1756" (Tony's year markers)
    "February 15, 1756 -"
    
Rule: New date = new event (or continuation of same-day events)
```

**2. Document Type Markers**
```
Pattern: Line contains document type keywords
Examples:
    "Deed Book A, page 123"
    "Will of Absalom Looney"
    "Patent to Robert Looney"
    
Rule: New document reference = new event
```

**3. Section Headers**
```
Pattern: Line is short, possibly bold/caps, followed by longer text
Examples:
    "**Robert Looney Jr.**"
    "MILITIA LIST 1788"
    
Rule: Header = potential new event or event grouping
```

**4. Paragraph Breaks**
```
Pattern: Blank line(s) between text blocks
Rule: Paragraph break = potential event boundary
```

**5. List Items**
```
Pattern: Lines starting with bullets, numbers, or consistent indentation
Rule: 
    - If list follows a header/intro: entire list = one event with multiple participants
    - If list items have dates: each item = separate event
```

### Algorithm

```python
def detect_event_boundaries(lines, document_type):
    """
    Identify where events start and end in a document.
    Returns list of (start_line, end_line, event_hint) tuples.
    """
    
    boundaries = []
    current_start = 0
    
    for i, line in enumerate(lines):
        is_boundary = False
        hint = None
        
        # Check for year marker (Tony's format)
        if re.match(r'^#\d{4}\b', line):
            is_boundary = True
            hint = {'type': 'year_marker', 'year': int(line[1:5])}
        
        # Check for date at line start
        elif re.match(r'^\d{4}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', line):
            is_boundary = True
            hint = {'type': 'dated_entry'}
        
        # Check for document reference
        elif re.search(r'(Deed Book|Will Book|Patent|Order Book)\s+\w+', line, re.I):
            is_boundary = True
            hint = {'type': 'document_reference'}
        
        # Check for section header (short line, followed by longer text)
        elif len(line.strip()) < 50 and line.strip().endswith(':'):
            is_boundary = True
            hint = {'type': 'section_header'}
        
        if is_boundary and i > current_start:
            boundaries.append((current_start, i - 1, hint))
            current_start = i
    
    # Don't forget the last section
    if current_start < len(lines):
        boundaries.append((current_start, len(lines) - 1, None))
    
    return boundaries
```

---

## PART 6: EXTRACTION PIPELINE (Step by Step)

### Phase 1: Document Upload

```
INPUT: File (docx, pdf, txt)

ACTIONS:
1. Store original file
2. Create document record
3. Extract raw text
4. Count lines
5. Set processing_status = 'uploaded'

OUTPUT: document_id, raw_text stored

VERIFICATION:
- File stored successfully
- Text extracted (length > 0)
- Line count recorded

LOG: "Document uploaded: {filename}, {line_count} lines"
```

### Phase 2: Structure Analysis

```
INPUT: document_id, raw_text

ACTIONS:
1. Detect document format:
   - Tony compilation (has year markers #YYYY)
   - Single document (deed, will, etc.)
   - List format (tax list, militia list)
   - Mixed/unknown
   
2. Identify section markers
3. Detect event boundaries
4. Estimate event count
5. Determine chunking strategy:
   - < 500 lines: process as single chunk
   - 500-5000 lines: chunk by section markers
   - > 5000 lines: chunk by section markers, max 500 lines per chunk
   
6. Set processing_status = 'analyzing'

OUTPUT: 
- document_format
- section_markers[]
- event_boundaries[]
- chunk_plan[]

VERIFICATION:
- At least 1 event boundary detected (or entire doc = 1 event)
- Chunks cover all lines (no gaps)

LOG: "Analysis complete: {format}, {event_count} potential events, {chunk_count} chunks"
```

### Phase 3: Name Registry (for docs > 1000 lines)

```
INPUT: document_id, raw_text

ACTIONS:
1. Scan entire document for names
2. For each unique name:
   - Parse into surname/given
   - Record first occurrence line
   - Count total mentions
   - Create document_name_registry record
   
3. Run matching for each registered name
4. Store possible_matches in registry

OUTPUT: 
- Name registry populated
- Match candidates identified

VERIFICATION:
- Registry count > 0 (unless document has no names)
- Each name has surname extracted

LOG: "Name registry: {count} unique names, {matched} with candidates"
```

### Phase 4: Event Extraction

```
INPUT: document_id, raw_text, event_boundaries, chunk_plan

FOR EACH chunk:
    FOR EACH event_boundary in chunk:
        
        1. Extract event text (lines from boundary)
        
        2. Parse event metadata:
           - event_date_text (as written)
           - event_date (parsed, if possible)
           - event_year
           - location_text
           - location_id (resolve if possible)
           - event_type (classify)
           - title (generate or extract)
        
        3. Extract participant names and roles:
           - Find all names in event text
           - Determine role from context
           - Create event_participant record for each
        
        4. For each participant:
           - Look up in name registry (if exists)
           - Copy resolution from registry
           - OR run matching algorithm
           - Set identification_status and possible_matches
        
        5. Create event record
        6. Link participants to event
        
        7. Update progress

OUTPUT:
- Events created
- Participants created with identifications

VERIFICATION (per chunk):
- Event count matches expected from boundaries
- All names in chunk appear as participants
- No orphan participants (participant without event)

LOG (per event): "Event: {title}, {participant_count} participants, {identified} identified"
```

### Phase 5: Cross-Document Matching

```
INPUT: document_id (just processed)

ACTIONS:
1. For each unidentified participant:
   - Search for same name in OTHER documents' events
   - If found with identification → suggest same identification
   
2. For each 'possible' participant:
   - Check if same person_id has 'probable' or 'confirmed' in other events with same name
   - If yes → upgrade to 'probable'

OUTPUT:
- Updated identification_statuses
- Cross-document links

LOG: "Cross-document: {upgraded} participants upgraded"
```

### Phase 6: Verification

```
INPUT: document_id

CHECKS:
1. Line coverage:
   - Sum of (event.line_end - event.line_start) ≈ document.line_count
   - Gap tolerance: 10% (for headers, blank lines, etc.)
   
2. Name coverage:
   - All names in registry appear in event_participants
   - Any name in registry not in participants = ERROR
   
3. Event validity:
   - Every event has at least 1 participant
   - Every event has event_type
   - Every event has title
   
4. Participant validity:
   - Every participant has name_as_written
   - Every participant has role
   - Every participant has identification_status

IF ANY CHECK FAILS:
- Set processing_status = 'error'
- Record error_message
- LOG ERROR

IF ALL PASS:
- Set processing_status = 'review'
- Update event_count, participant_count

LOG: "Verification: {status}"
```

### Phase 7: User Review

```
INPUT: User reviews extraction results

USER ACTIONS AVAILABLE:
1. Confirm identification (possible → confirmed, probable → confirmed)
2. Reject identification (possible → unidentified, remove from possible_matches)
3. Change identification (assign different person_id)
4. Create new profile (from unidentified participant)
5. Edit event details (date, location, type, title)
6. Split event (one event → multiple)
7. Merge events (multiple → one)
8. Mark complete

ON "Mark Complete":
- Set processing_status = 'complete'
- Update person event counts

LOG: All user actions logged with timestamp
```

---

## PART 7: USER INTERFACE SPECIFICATIONS

### 7.1 Document Upload Page

**Location:** Sources → Upload Document

**Elements:**
- File drop zone (accepts .docx, .pdf, .txt)
- Document title (auto-filled from filename, editable)
- Document type dropdown (required)
- Date field (optional)
- Repository/Collection (optional)
- Notes textarea (optional)
- [Upload] button

**On Upload:**
- Show progress indicator
- Redirect to Processing Status page when upload complete

### 7.2 Processing Status Page

**Location:** Sources → [Document] → Processing

**Elements:**
```
┌─────────────────────────────────────────────────────────────┐
│ Processing: {document_title}                                │
│                                                             │
│ Status: {processing_status}                                 │
│ Progress: ████████░░░░░░░ {percent}%                       │
│                                                             │
│ Statistics:                                                 │
│   Lines: {processed} / {total}                              │
│   Events: {event_count}                                     │
│   Participants: {participant_count}                         │
│   Identified: {identified_count} ({identified_percent}%)    │
│   Possible: {possible_count}                                │
│   Unidentified: {unidentified_count}                        │
│                                                             │
│ Log:                                                        │
│   {timestamp} - {log_message}                               │
│   {timestamp} - {log_message}                               │
│   ...                                                       │
│                                                             │
│ [Pause] [Cancel] [View Results (when ready)]                │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Extraction Review Page

**Location:** Sources → [Document] → Review

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Review: {document_title}                                    │
│ Status: Ready for Review                                    │
├────────────┬────────────────────────────────────────────────┤
│ FILTERS    │                                                │
│            │ RESULTS ({filtered_count} of {total})          │
│ Status:    │                                                │
│ ☑ Probable │ ┌────────────────────────────────────────────┐ │
│ ☑ Possible │ │ EVENT: Absalom Looney will (1791)          │ │
│ ☑ Unident. │ │ Botetourt County, Virginia                 │ │
│            │ │                                            │ │
│ Type:      │ │ PARTICIPANTS:                              │ │
│ ☐ Land     │ │  • Absalom Looney (testator)               │ │
│ ☑ Will     │ │    → Absalom Looney [PROBABLE: 82]         │ │
│ ☐ Tax      │ │    [Confirm] [Reject] [Change]             │ │
│ ☐ Military │ │                                            │ │
│ ...        │ │  • Benjamin Looney (heir)                  │ │
│            │ │    → Benjamin Looney [POSSIBLE: 61]        │ │
│ [Apply]    │ │    [Confirm] [Reject] [Change]             │ │
│            │ │    Also possible:                          │ │
│ BULK:      │ │    - Benjamin Looney (b.1756) [58]         │ │
│ [Confirm   │ │                                            │ │
│  All 75+]  │ │ [View Event] [Edit Event]                  │ │
│            │ └────────────────────────────────────────────┘ │
│ [Mark All  │                                                │
│  Complete] │ ... more events ...                           │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

### 7.4 Person Profile - Events Tab

**Location:** People → [Person] → Events

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ {PERSON NAME}                                               │
│ [Overview] [Events] [Relationships] [Locations] [Documents] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ CONFIRMED EVENTS ({count})                                  │
│ Events where this identification has been confirmed.        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1791 • Will probated                           [View]   │ │
│ │       Botetourt County • Testator                       │ │
│ │       Source: Botetourt Will Book                       │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 1787 • Land acquisition                        [View]   │ │
│ │       Stony Run • Grantee • 70 acres                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ PROBABLE EVENTS ({count})                                   │
│ Strong evidence this is the same person.                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1770s • Tax list                      [Confirm] [View]  │ │
│ │        Botetourt County • Taxpayer                      │ │
│ │        5 horses, 20 cattle                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ POSSIBLE EVENTS ({count})                        [Collapse] │
│ May be this person - evidence inconclusive.                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1758 • Augusta militia - "A. Looney"                    │ │
│ │        Score: 52 • Reasons: surname, location           │ │
│ │        [Confirm] [Probable] [Not This Person] [View]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.5 Merge Duplicates

**Location:** People → [Person] → Merge

**Trigger:** Button on person page: [Merge with Another Person]

**Flow:**
1. Search dialog: Find person to merge with
2. Side-by-side comparison showing all data
3. For conflicts: user selects which value to keep
4. Preview: show merged result
5. Confirm: execute merge

**Merge Execution:**
```sql
-- Given: keep_person_id, remove_person_id

-- Update all event_participants
UPDATE event_participants 
SET person_id = {keep_person_id}
WHERE person_id = {remove_person_id};

-- Update all possible_matches
UPDATE event_participants
SET possible_matches = (
    SELECT jsonb_agg(
        CASE 
            WHEN elem->>'person_id' = '{remove_person_id}' 
            THEN jsonb_set(elem, '{person_id}', '"{keep_person_id}"')
            ELSE elem
        END
    )
    FROM jsonb_array_elements(possible_matches) elem
)
WHERE possible_matches @> '[{"person_id": "{remove_person_id}"}]';

-- Update relationships
UPDATE relationships SET person1_id = {keep_person_id} WHERE person1_id = {remove_person_id};
UPDATE relationships SET person2_id = {keep_person_id} WHERE person2_id = {remove_person_id};

-- Update location_residents
UPDATE location_residents SET person_id = {keep_person_id} WHERE person_id = {remove_person_id};

-- Mark removed person
UPDATE people SET 
    profile_status = 'merged',
    merged_into_id = {keep_person_id}
WHERE id = {remove_person_id};

-- Update event counts on kept person
-- (recalculate from event_participants)
```

---

## PART 8: DOCUMENT PROCESSING DASHBOARD

### Location in App

**Main Navigation:** Sources → Document Processing

This is a dedicated page for managing document uploads, watching extraction progress, and reviewing results.

### 8.1 Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT PROCESSING                                        [Upload New]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ACTIVE PROCESSING (2)                                                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 1692-Johnson-Renfro-Looney.docx                                         │ │
│ │ Status: Extracting ████████████░░░░░ 78%                                │ │
│ │ Events: 234 | Participants: 1,847 | Identified: 89 (4.8%)               │ │
│ │ Started: 10 min ago                                      [View] [Pause] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Bedford-County-Wills-1760-1780.pdf                                      │ │
│ │ Status: Matching ██████░░░░░░░░░░░░ 35%                                 │ │
│ │ Events: 45 | Participants: 312 | Identified: 156 (50%)                  │ │
│ │ Started: 3 min ago                                       [View] [Pause] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ READY FOR REVIEW (3)                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Augusta-County-Militia-1756.docx                         [Review Now]   │ │
│ │ Completed: 2 hours ago | Events: 12 | Participants: 487                 │ │
│ │ Needs resolution: 156 possible matches                                  │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Sullivan-County-Deeds-1780.pdf                           [Review Now]   │ │
│ │ Completed: Yesterday | Events: 67 | Participants: 234                   │ │
│ │ Needs resolution: 45 possible matches                                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ RECENTLY COMPLETED (5)                                         [View All]   │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Botetourt-Wills-1770.docx              ✓ Complete        [View Summary] │ │
│ │ Henrico-Patents-1700-1720.pdf          ✓ Complete        [View Summary] │ │
│ │ Tony-Looney-Research.docx              ✓ Complete        [View Summary] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ FAILED (1)                                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Corrupted-File.docx                    ✗ Error           [View Log]     │ │
│ │ Error: Could not extract text from file                  [Retry]        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Live Processing View

When user clicks [View] on an active processing document:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROCESSING: 1692-Johnson-Renfro-Looney.docx                                 │
│                                                             [Pause] [Cancel]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ PROGRESS                                                                    │
│ ════════════════════════════════════════════════════════════════════════    │
│                                                                             │
│ Phase: EXTRACTING (3 of 5)                                                  │
│ ████████████████████████████████████░░░░░░░░░░░░░ 78%                      │
│                                                                             │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐              │
│ │ ✓ Upload     │ ✓ Analyze    │ ◉ Extract    │ ○ Match      │ ○ Verify    │
│ │ Complete     │ Complete     │ In Progress  │ Pending      │ Pending     │
│ └──────────────┴──────────────┴──────────────┴──────────────┘              │
│                                                                             │
│ STATISTICS                                                                  │
│ ────────────────────────────────────────────────────────────────────────    │
│ Document                          │ Extraction Progress                     │
│   Lines: 88,668                   │   Chunks: 156 / 201                     │
│   Format: Tony Compilation        │   Current section: #1789                │
│   Sections: 201 year markers      │   Lines processed: 69,234 / 88,668      │
│                                   │                                         │
│ Name Registry                     │ Events & Participants                   │
│   Unique names: 1,614             │   Events created: 234                   │
│   Names matched: 89 (5.5%)        │   Participants: 1,847                   │
│   Possible matches: 412 (25.5%)   │   With roles assigned: 1,652 (89%)      │
│   Unmatched: 1,113 (69%)          │                                         │
│                                                                             │
│ LIVE LOG                                                       [Auto-scroll]│
│ ────────────────────────────────────────────────────────────────────────    │
│ 10:23:45 Processing section #1789                                           │
│ 10:23:45 Event: Benjamin Looney killed by Cherokees (1779)                  │
│ 10:23:45   Participant: Benjamin Looney (militia_member) → PROBABLE [82]    │
│ 10:23:45   Participant: Mary Johnson (mentioned) → POSSIBLE [61]            │
│ 10:23:46 Event: Walter Johnson guardian appointment (1793)                  │
│ 10:23:46   Participant: Walter Johnson (guardian) → PROBABLE [78]           │
│ 10:23:46   Participant: Benjamin Looney Jr (heir) → POSSIBLE [54]           │
│ 10:23:47 Processing section #1790                                           │
│ ...                                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Extraction Summary Page

When processing completes, or when user clicks [View Summary]:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ EXTRACTION SUMMARY: 1692-Johnson-Renfro-Looney.docx                         │
│                                                                             │
│ Status: ✓ Complete                                      [Download JSON]     │
│ Processed: Jan 18, 2026 at 10:45 AM                     [View Original Doc] │
│ Duration: 23 minutes                                    [Re-process]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ OVERVIEW                                                                    │
│ ════════════════════════════════════════════════════════════════════════    │
│                                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│ │     EVENTS      │ │  PARTICIPANTS   │ │   IDENTIFIED    │                │
│ │                 │ │                 │ │                 │                │
│ │      312        │ │     1,847       │ │   501 (27%)     │                │
│ │                 │ │                 │ │                 │                │
│ │  Land: 45       │ │ Confirmed: 0    │ │ New profiles    │                │
│ │  Will: 23       │ │ Probable: 89    │ │ suggested: 23   │                │
│ │  Tax: 67        │ │ Possible: 412   │ │                 │                │
│ │  Military: 89   │ │ Unidentified:   │ │ [Review All]    │                │
│ │  Other: 88      │ │   1,346         │ │                 │                │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│ TABS: [Events] [New Individuals] [Existing Individuals] [Locations] [Files]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ EVENTS (312)                                      [Filter ▼] [Sort: Date ▼] │
│ ────────────────────────────────────────────────────────────────────────    │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 1756 Feb 15 • Robert Looney Jr. killed by Shawnee             [View]   │ │
│ │ Type: narrative | Location: Augusta County                             │ │
│ │ Participants: Robert Looney Jr. (subject, PROBABLE)                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 1779 • Benjamin Looney killed at Cumberland Gap                [View]   │ │
│ │ Type: narrative | Location: Cumberland Gap                             │ │
│ │ Participants: Benjamin Looney (subject, PROBABLE),                     │ │
│ │               Mary Johnson (mentioned, POSSIBLE)                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 1788 • Sullivan County militia list                            [View]   │ │
│ │ Type: militia_list | Location: Sullivan County, TN                     │ │
│ │ Participants: 47 (12 identified, 35 unidentified)          [Expand]    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [Load More...]                                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Individuals Tabs

**NEW INDIVIDUALS Tab:**
Shows participants who don't match any existing profile and might need new profiles created.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NEW INDIVIDUALS (1,346 unidentified)                                        │
│                                                                             │
│ SUGGESTED NEW PROFILES (23)                                                 │
│ These names appear in multiple events - may warrant profile creation.       │
│ ────────────────────────────────────────────────────────────────────────    │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Robert Smith                                           [Create Profile] │ │
│ │ Appears in: 7 events (1785-1798)                                        │ │
│ │ Locations: Sullivan County (5), Washington County (2)                   │ │
│ │ Roles: witness (3), militia_member (2), taxpayer (2)                    │ │
│ │ [View All Events]                                                       │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ James Moore                                            [Create Profile] │ │
│ │ Appears in: 5 events (1770-1782)                                        │ │
│ │ Locations: Augusta County (3), Botetourt County (2)                     │ │
│ │ Roles: grantee (2), witness (2), petitioner (1)                         │ │
│ │ [View All Events]                                                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ALL UNIDENTIFIED (1,323)                               [Sort: Frequency ▼]  │
│ Single-event names - retained with events but no profile suggested.         │
│ ────────────────────────────────────────────────────────────────────────    │
│                                                                             │
│ Name                    │ Events │ Locations           │ Actions            │
│ ────────────────────────┼────────┼─────────────────────┼──────────────────  │
│ William Brown           │ 2      │ Sullivan Co         │ [View] [Create]    │
│ Thomas Davis            │ 2      │ Augusta Co          │ [View] [Create]    │
│ John Williams           │ 1      │ Botetourt Co        │ [View] [Create]    │
│ Richard Jones           │ 1      │ Sullivan Co         │ [View] [Create]    │
│ ... (1,319 more)        │        │                     │                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**EXISTING INDIVIDUALS Tab:**
Shows participants matched to existing profiles.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ EXISTING INDIVIDUALS (501 matched)                                          │
│                                                                             │
│ CONFIRMED (0)                                                               │
│ ────────────────────────────────────────────────────────────────────────    │
│ No confirmed identifications yet. Review probable matches to confirm.       │
│                                                                             │
│ PROBABLE (89)                                                [Review All]   │
│ High confidence matches - likely correct.                                   │
│ ────────────────────────────────────────────────────────────────────────    │
│                                                                             │
│ Profile                    │ Events │ Score │ Actions                       │
│ ───────────────────────────┼────────┼───────┼─────────────────────────────  │
│ Absalom Looney (b.1729)    │ 12     │ 82-91 │ [View Profile] [Review]       │
│ Robert Looney Sr. (b.1692) │ 8      │ 78-88 │ [View Profile] [Review]       │
│ Benjamin Looney (b.1756)   │ 7      │ 75-85 │ [View Profile] [Review]       │
│ Walter Johnson (b.1740)    │ 6      │ 76-82 │ [View Profile] [Review]       │
│ Hudson Johnson (b.1770)    │ 5      │ 77-84 │ [View Profile] [Review]       │
│ ... (84 more)              │        │       │                               │
│                                                                             │
│ POSSIBLE (412)                                               [Review All]   │
│ May be correct - needs verification.                                        │
│ ────────────────────────────────────────────────────────────────────────    │
│                                                                             │
│ Name as Written     │ Possible Matches              │ Events │ Actions      │
│ ────────────────────┼───────────────────────────────┼────────┼────────────  │
│ "John Johnson"      │ John Johnson (b.1750) [61]    │ 4      │ [Resolve]    │
│                     │ John Johnson (b.1745) [58]    │        │              │
│                     │ John Johnson (b.1760) [52]    │        │              │
│ ────────────────────┼───────────────────────────────┼────────┼────────────  │
│ "Mary Johnson"      │ Mary Johnson (b.1745) [67]    │ 3      │ [Resolve]    │
│                     │ Mary Johnson (b.1752) [54]    │        │              │
│ ... (410 more)      │                               │        │              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.5 Files Tab

Links to extraction artifacts:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FILES                                                                       │
│                                                                             │
│ SOURCE DOCUMENT                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 📄 1692-Johnson-Renfro-Looney.docx (2.3 MB)                             │ │
│ │    Uploaded: Jan 18, 2026                              [Download]       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ EXTRACTION OUTPUTS                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 📄 extraction-events.json (456 KB)                     [Download]       │ │
│ │    312 events with all metadata                        [View]           │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 📄 extraction-participants.json (892 KB)               [Download]       │ │
│ │    1,847 participants with identifications             [View]           │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 📄 extraction-name-registry.json (234 KB)              [Download]       │ │
│ │    1,614 unique names with match data                  [View]           │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 📄 extraction-log.txt (123 KB)                         [Download]       │ │
│ │    Full processing log                                 [View]           │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ 📄 verification-report.json (12 KB)                    [Download]       │ │
│ │    Verification checks and results                     [View]           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.6 Database Updates

Add table to track extraction files:

```sql
CREATE TABLE extraction_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN (
        'events_json',
        'participants_json', 
        'name_registry_json',
        'processing_log',
        'verification_report'
    )),
    file_path TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_extraction_files_document ON extraction_files(document_id);
```

### 8.7 API Endpoints

```
GET  /api/document-processing
     Returns: List of all documents with processing status

GET  /api/document-processing/:id
     Returns: Full details for one document including stats

GET  /api/document-processing/:id/events
     Returns: Paginated list of events for document
     Query params: page, limit, type, sort

GET  /api/document-processing/:id/participants
     Returns: Paginated list of participants
     Query params: page, limit, status (confirmed/probable/possible/unidentified)

GET  /api/document-processing/:id/new-individuals
     Returns: Unidentified participants grouped by name

GET  /api/document-processing/:id/existing-individuals
     Returns: Matched participants grouped by profile

GET  /api/document-processing/:id/files
     Returns: List of extraction files with download URLs

GET  /api/document-processing/:id/log
     Returns: Processing log (supports streaming for live view)

POST /api/document-processing/:id/pause
     Pauses processing

POST /api/document-processing/:id/resume
     Resumes processing

POST /api/document-processing/:id/cancel
     Cancels processing

POST /api/document-processing/:id/reprocess
     Restarts processing from beginning
```

---

## PART 9: VERIFICATION REQUIREMENTS

### After Every Document Processing

**Automated Checks (system runs automatically):**

```
CHECK 1: Coverage
    Lines in events / Total lines >= 0.9
    FAIL: "Only {percent}% of document lines captured in events"

CHECK 2: Name Registry Match
    FOR each name in document_name_registry:
        EXISTS in event_participants for this document
    FAIL: "Name '{name}' in registry but not in any event"

CHECK 3: Event Integrity  
    FOR each event:
        participant_count >= 1
        event_type IS NOT NULL
        title IS NOT NULL
    FAIL: "Event {id} missing required fields"

CHECK 4: Participant Integrity
    FOR each participant:
        name_as_written IS NOT NULL
        role IS NOT NULL
        identification_status IS NOT NULL
    FAIL: "Participant {id} missing required fields"
```

**Verification Report (shown to user):**

```
EXTRACTION VERIFICATION
═══════════════════════════════════════════════════════════

Document: {title}
Lines: {line_count}
Processing time: {duration}

COVERAGE
  Events extracted: {event_count}
  Lines captured: {captured_lines} / {total_lines} ({percent}%)
  Status: ✓ PASS / ✗ FAIL

PARTICIPANTS
  Total: {participant_count}
  Confirmed: {confirmed} ({percent}%)
  Probable: {probable} ({percent}%)  
  Possible: {possible} ({percent}%)
  Unidentified: {unidentified} ({percent}%)

INTEGRITY
  Events valid: {valid_events} / {total_events}
  Participants valid: {valid_participants} / {total_participants}
  Status: ✓ PASS / ✗ FAIL

OVERALL: ✓ READY FOR REVIEW / ✗ ERRORS DETECTED
```

---

## PART 10: PROFILE CREATION FROM EVENTS

### When to Create a New Profile

**Automatic suggestion when:**
- Same name appears in 3+ events in same general location/time
- Name has no possible_matches (truly new person)

**UI Prompt:**
```
┌─────────────────────────────────────────────────────────────┐
│ CREATE NEW PROFILE?                                         │
│                                                             │
│ "Robert Smith" appears in 5 events with no profile match:   │
│                                                             │
│   • 1788 Sullivan Co militia list                           │
│   • 1790 Sullivan Co tax list                               │
│   • 1792 Sullivan Co deed witness                           │
│   • 1795 Sullivan Co deed grantee                           │
│   • 1798 Sullivan Co deed grantor                           │
│                                                             │
│ This may be a single individual. Create profile?            │
│                                                             │
│ [Create Profile] [Not Now] [These are Different People]     │
└─────────────────────────────────────────────────────────────┘
```

**On "Create Profile":**
1. Create person record with surname, given_name
2. Infer birth_year from earliest event (age ~20-40)
3. Link all suggested events as 'probable'
4. Set primary location from most common event location

**On "These are Different People":**
- Mark these events as "reviewed - distinct individuals"
- System won't suggest again for this name/location combination

---

## PART 11: ERROR HANDLING

### Processing Errors

| Error | Detection | Action |
|-------|-----------|--------|
| File unreadable | Text extraction returns empty | Set status='error', message="Could not extract text" |
| No events detected | Event boundary detection returns 0 | Set status='error', message="No events found in document" |
| Name parsing fails | parse_name returns (None, None) | Log warning, keep original name_as_written, continue |
| Database error | Any DB operation fails | Rollback transaction, set status='error', log full error |
| Timeout (>30min) | Processing exceeds time limit | Pause, save progress, allow resume |

### Recovery

**Resume capability:**
- Processing state saved after each chunk
- If interrupted, can resume from last completed chunk
- User can trigger resume from Processing Status page

---

## PART 12: IMPLEMENTATION SEQUENCE

### Week 1: Database & Core
- [ ] Create events table
- [ ] Create event_participants table
- [ ] Create document_name_registry table
- [ ] Modify documents table
- [ ] Modify people table
- [ ] Create indexes
- [ ] Write migration script
- [ ] Test schema with manual inserts

### Week 2: Upload & Analysis
- [ ] Document upload endpoint
- [ ] File storage
- [ ] Text extraction (docx, pdf, txt)
- [ ] Document format detection
- [ ] Event boundary detection
- [ ] Chunk planning
- [ ] Processing status tracking

### Week 3: Extraction
- [ ] Name parsing
- [ ] Name registry building
- [ ] Event extraction (per chunk)
- [ ] Participant extraction
- [ ] Role detection
- [ ] Progress tracking
- [ ] Verification checks

### Week 4: Matching
- [ ] Matching algorithm implementation
- [ ] Surname normalization
- [ ] Location overlap detection
- [ ] Score calculation
- [ ] Auto-assignment rules
- [ ] Cross-document matching

### Week 5: Review UI
- [ ] Processing status page
- [ ] Extraction review page
- [ ] Event detail modal
- [ ] Confirm/reject/change actions
- [ ] Bulk operations
- [ ] Mark complete workflow

### Week 6: Profile Integration
- [ ] Events tab on profile page
- [ ] Confirmed/Probable/Possible sections
- [ ] Upgrade/downgrade actions
- [ ] Event count caching
- [ ] Profile creation from events
- [ ] Merge duplicates feature

### Week 7: Testing & Refinement
- [ ] Test with Tony's 80k line file
- [ ] Test with single deed
- [ ] Test with militia list
- [ ] Test with will
- [ ] Tune matching thresholds
- [ ] Performance optimization
- [ ] Edge case handling

### Week 8: Polish & Documentation
- [ ] Error handling improvements
- [ ] UI polish
- [ ] Help text / tooltips
- [ ] Admin documentation
- [ ] User guide

---

## SUMMARY

This specification defines:

1. **Simplified data model** - 3 tables (events, event_participants, document_name_registry) plus modifications to existing tables

2. **Name registry** - Ensures same name across 80k lines links to same profile

3. **Clear confidence rules** - System assigns at most 'probable'; only users assign 'confirmed'

4. **Detailed matching algorithm** - Scoring with explicit weights, exclusion rules, threshold-based assignment

5. **Event boundary detection** - Rules for identifying where events start/end in compilations

6. **Step-by-step pipeline** - Upload → Analyze → Registry → Extract → Match → Verify → Review

7. **Complete UI specifications** - Every screen defined with elements and actions

8. **Verification at every step** - Automated checks, verification report, error handling

9. **Profile creation workflow** - When and how to create profiles from accumulated events

10. **8-week implementation plan** - Sequenced, testable milestones

The key principles:
- **Capture everything** - every name, every event, even if unidentified
- **Force nothing** - don't require identification at extraction time
- **Accumulate evidence** - confidence grows as more documents processed
- **User confirms** - system suggests, human decides on 'confirmed'
