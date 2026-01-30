# Feature Spec: Family Groups, Geography, and Narrative Generation

## Context

We're building a genealogical research app for Johnson/Johnston families in colonial Virginia. After processing the first major source file (Arrowhattocks), we've identified gaps in how the app organizes and utilizes information.

**Current strengths:** Storing people, documents, sources, relationships, evidence with proper citations

**Current gaps:**
1. No concept of "family groups" as research units
2. No geographic framework (waterways, landmarks, regions)
3. No tools to transform research data into narrative for the book

---

## Feature 1: Family Groups

### The Problem

We have individual people and pairwise relationships, but no way to define and work with family units. When researching, we think in terms of "The Michael Johnson family of Tuckahoe Creek" - a coherent group that migrated together, owned adjacent land, and appears in each other's documents.

### Data Model

```sql
CREATE TABLE family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity
    name TEXT NOT NULL,                    -- "Michael Johnson of Tuckahoe Creek"
    slug TEXT UNIQUE,                      -- "michael-johnson-tuckahoe" for URLs
    
    -- Classification
    group_type TEXT CHECK (group_type IN (
        'nuclear',          -- Parent(s) + children
        'extended',         -- Multiple generations
        'cluster',          -- Related families (e.g., Johnson-Hatcher-Burton network)
        'unproven'          -- Suspected but not documented connection
    )),
    
    -- Anchor person (the central figure)
    anchor_person_id TEXT REFERENCES people(id),
    
    -- Geographic association
    primary_location_id UUID REFERENCES locations(id),
    
    -- Time span
    date_start TEXT,                       -- "1702" (first documented)
    date_end TEXT,                         -- "1750" (dispersed/migrated)
    
    -- Research status
    confidence TEXT CHECK (confidence IN ('confirmed', 'likely', 'possible')),
    status TEXT CHECK (status IN ('active', 'draft', 'published')),
    
    -- Content
    summary TEXT,                          -- Brief description
    narrative TEXT,                        -- Full write-up for the book
    
    -- DNA
    dna_group TEXT,                        -- "White Oak", "Longleaf Pine", etc.
    
    -- Metadata
    source_files TEXT[],                   -- Which Tony files documented this group
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for group membership
CREATE TABLE family_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES people(id) ON DELETE CASCADE,
    
    role TEXT CHECK (role IN (
        'anchor',           -- The central person
        'spouse',
        'child',
        'parent',
        'sibling',
        'grandchild',
        'in_law',
        'associated'        -- Neighbors, witnesses who aren't family
    )),
    
    generation INTEGER,                    -- 0 = anchor, 1 = children, -1 = parents, etc.
    
    notes TEXT,
    
    UNIQUE(family_group_id, person_id)
);

CREATE INDEX idx_family_group_members_group ON family_group_members(family_group_id);
CREATE INDEX idx_family_group_members_person ON family_group_members(person_id);
```

### UI Components

**Family Group Browser**
- List all defined family groups
- Filter by: location, time period, DNA group, confidence level
- Show member count, document count, research status

**Family Group Detail Page**
- Header: Name, date range, primary location, DNA group
- Members panel: Tree-style or list view of all members with roles
- Documents panel: All documents involving any group member
- Locations panel: All places this family appears
- Timeline: Chronological view of family events
- Narrative panel: Editable write-up for the book
- Research questions: Open questions for this family

**Family Group Editor**
- Add/remove members
- Set roles and generations
- Link to locations
- Edit narrative

### Workflow

1. While researching, identify a family cluster
2. Create family group with anchor person
3. Add members with roles
4. System auto-suggests: "These 3 people share 5 documents with group members - add them?"
5. Write narrative summary
6. Mark as draft → active → published as research progresses

---

## Feature 2: Geographic Framework

### The Problem

Colonial families organized their lives around waterways. Tuckahoe Creek, Cornelius Creek, Beaverdam Swamp - these aren't just locations, they're the skeleton of the social network. To understand who's related to whom, you need to understand who lived on which creek.

Tony emphasizes: "If you want to trace these families, you need to understand the creeks they settled on."

### Data Model

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity
    name TEXT NOT NULL,                    -- "Tuckahoe Creek"
    name_variants TEXT[],                  -- ["Tuckahoe", "Tuckahoe Cr."]
    
    -- Classification
    location_type TEXT CHECK (location_type IN (
        'creek',
        'river', 
        'swamp',
        'plantation',
        'hundred',
        'parish',
        'county',
        'colony',
        'region'            -- e.g., "Arrowhattocks", "Piedmont"
    )),
    
    -- Hierarchy
    parent_location_id UUID REFERENCES locations(id),  -- Tuckahoe Creek → Henrico County → Virginia
    
    -- Geography (optional, for future mapping)
    latitude DECIMAL,
    longitude DECIMAL,
    
    -- Time context
    date_formed TEXT,                      -- When county was formed, etc.
    date_dissolved TEXT,                   -- If county was split
    
    -- Description
    description TEXT,                      -- Historical context, what we know
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link people to locations (beyond the migrations table)
CREATE TABLE location_residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    person_id TEXT REFERENCES people(id) ON DELETE CASCADE,
    
    date_first TEXT,                       -- First documented at this location
    date_last TEXT,                        -- Last documented
    
    residence_type TEXT CHECK (residence_type IN (
        'landowner',
        'tenant',
        'resident',         -- Known to live there, land status unknown
        'adjacent',         -- Owned land adjacent to this creek/area
        'documented'        -- Appears in records here but may not have lived there
    )),
    
    evidence TEXT,                         -- How we know they were there
    source_id UUID REFERENCES sources(id),
    
    UNIQUE(location_id, person_id)
);

-- Link documents to locations
CREATE TABLE document_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    
    location_role TEXT CHECK (location_role IN (
        'subject',          -- The document is about this place (land patent)
        'recorded',         -- Where the document was recorded (county courthouse)
        'mentioned'         -- Referenced in the document
    )),
    
    UNIQUE(document_id, location_id, location_role)
);

CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_parent ON locations(parent_location_id);
CREATE INDEX idx_location_residents_location ON location_residents(location_id);
CREATE INDEX idx_location_residents_person ON location_residents(person_id);
```

### Location Hierarchy Example

```
Virginia (colony)
├── Henrico County (county, formed 1634)
│   ├── Varina Parish (parish)
│   ├── St. Peters Parish (parish)
│   ├── Arrowhattocks (region)
│   │   ├── Tuckahoe Creek (creek)
│   │   ├── Cornelius Creek (creek)
│   │   ├── Beaverdam Creek (creek)
│   │   └── Edloe Plantation (plantation)
│   └── Longfield (region/patent name)
├── Goochland County (county, formed 1728 from Henrico)
│   └── ...
└── ...
```

### UI Components

**Location Browser**
- Hierarchical tree view of all locations
- Click to expand: Virginia → Henrico → Arrowhattocks → Tuckahoe Creek
- Each location shows: resident count, document count, date range

**Location Detail Page**
- Header: Name, type, parent location, date range
- Map placeholder (for future: actual geographic visualization)
- Residents panel: Everyone documented at this location
  - Filter by: date range, residence type
  - Sort by: first appearance, last appearance, alphabetical
- Documents panel: All documents involving this location
- Family groups panel: Which family groups are associated here
- Adjacent locations: Other creeks/areas nearby with shared residents
- Timeline: When did people arrive/leave

**"Creek View"** (Key Feature)
- Select a waterway (e.g., Tuckahoe Creek)
- See all landowners arranged conceptually along the creek
- Show adjacent landowner relationships
- Click any person to see their documents, family
- Filter by time period: "Tuckahoe Creek in 1714" vs "Tuckahoe Creek in 1750"

**Location Network View**
- Visualization showing connections between locations
- "People who lived on Tuckahoe Creek also appear in Goochland County records"
- Helps trace migration patterns

### Workflow

1. When extracting documents, identify and tag locations
2. Build location hierarchy as we go
3. Link people to locations with evidence
4. Use location views to find patterns:
   - "Who else was on Tuckahoe Creek when Michael Johnson was there?"
   - "Where did Tuckahoe Creek families go after 1750?"

---

## Feature 3: Narrative Generation

### The Problem

We're building a book, not just a database. Right now we store facts excellently but have no tools to transform them into readable narrative. The gap between "database of records" and "chapter in a book" is entirely manual.

### Approach

**Not AI-generated text** - We want tools that help a human write, not tools that write for us. The narrative should be authored, not generated.

### Data Model Additions

```sql
-- Add to people table
ALTER TABLE people ADD COLUMN bio_status TEXT CHECK (bio_status IN (
    'no_bio',
    'notes_only',
    'draft',
    'review',
    'final'
)) DEFAULT 'no_bio';

-- Add to family_groups table (already included above)
-- narrative TEXT field for family-level write-ups

-- Chapter organization
CREATE TABLE book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity
    title TEXT NOT NULL,                   -- "The Johnsons of Tuckahoe Creek"
    slug TEXT UNIQUE,
    chapter_number INTEGER,
    
    -- Classification
    chapter_type TEXT CHECK (chapter_type IN (
        'introduction',
        'methodology', 
        'family_narrative',
        'geographic_survey',
        'migration_analysis',
        'appendix'
    )),
    
    -- Content
    introduction TEXT,                     -- Chapter intro
    body TEXT,                             -- Main content (may reference family groups)
    conclusion TEXT,
    
    -- Status
    status TEXT CHECK (status IN ('outline', 'draft', 'review', 'final')),
    word_count INTEGER,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link chapters to family groups, locations, people
CREATE TABLE chapter_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,
    
    -- What this chapter covers (polymorphic)
    content_type TEXT CHECK (content_type IN ('family_group', 'location', 'person')),
    family_group_id UUID REFERENCES family_groups(id),
    location_id UUID REFERENCES locations(id),
    person_id TEXT REFERENCES people(id),
    
    -- Order within chapter
    sequence INTEGER,
    
    -- Section-specific content
    section_title TEXT,
    section_content TEXT
);
```

### UI Components

**Bio Editor** (Person Detail Page)
- Rich text editor for person's biography
- Side panel showing:
  - All documents for this person (click to insert citation)
  - All relationships (click to reference)
  - Timeline of documented events
  - Research questions (what's still unknown)
- Auto-save, version history
- Status indicator: notes → draft → review → final

**Family Narrative Editor** (Family Group Detail Page)
- Rich text editor for family group narrative
- Side panel showing:
  - All members with their bios
  - All documents for the group
  - Timeline of family events
  - Locations associated with family
- Insert member references, document citations
- Export to Markdown/Word

**Chapter Builder**
- Create chapter outline
- Drag family groups, locations, people into chapter
- Each item becomes a section
- Write introduction and transitions between sections
- Preview full chapter
- Export to Markdown/Word

**Research Dashboard Enhancements**
- "Ready to write" queue: People/families with enough documentation for a bio
- "Needs research" queue: Open questions blocking narrative progress
- Progress tracker: X of Y people have bios, X of Y families have narratives

### Writing Aids (Not AI Generation)

**Fact Sheet Generator**
- Select a person or family group
- Generate a structured summary of everything we know:
  - Vital dates and places
  - All documented relationships
  - All documents (with citations)
  - Timeline
  - Open questions
- This becomes the reference sheet for writing the bio

**Citation Inserter**
- While writing, search for documents
- Click to insert properly formatted citation
- Maintains bibliography automatically

**Consistency Checker**
- Flag when narrative contradicts database
- "You wrote Michael Johnson died in 1720, but database says 1718"
- Flag when narrative claims something not in evidence

---

## Implementation Priority

### Phase 1: Geographic Framework
1. Create locations table and hierarchy
2. Build Location Browser (tree view)
3. Build Location Detail page
4. Update document entry to tag locations
5. Add location linking to existing documents

*Why first: Geography is the skeleton. Everything hangs on it.*

### Phase 2: Family Groups
1. Create family_groups and family_group_members tables
2. Build Family Group Browser
3. Build Family Group Detail page
4. Create first family group: Michael Johnson of Tuckahoe Creek
5. Add auto-suggest for potential members

*Why second: Family groups organize people into researchable units.*

### Phase 3: Narrative Tools
1. Add bio_status to people
2. Build Bio Editor with document sidebar
3. Build Fact Sheet Generator
4. Build Family Narrative Editor
5. Build Chapter Builder
6. Add export functionality

*Why third: Writing comes after research is organized.*

---

## Initial Data: Locations from Arrowhattocks

Based on what we extracted, create these locations:

```
Virginia
├── Henrico County (formed 1634)
│   ├── Varina Parish
│   ├── St. Peters Parish
│   ├── Arrowhattocks (region)
│   │   ├── Tuckahoe Creek
│   │   ├── Cornelius Creek
│   │   ├── Beaverdam Creek
│   │   │   └── Beaverdam Swamp
│   │   ├── Edloe Plantation
│   │   ├── Longfield
│   │   ├── Lily Valley
│   │   └── Jordan's Journey
│   └── Strawberry Banks
├── New Kent County (formed 1654)
├── Charles City County (formed 1634)
└── James City County (formed 1634)
```

## Initial Data: Family Group from Arrowhattocks

**Michael Johnson of Tuckahoe Creek**
- Anchor: JNSN-UNK-e1673-01 (Michael Johnson)
- Type: nuclear (with extension to likely sons)
- Primary location: Tuckahoe Creek
- Date range: 1702-1718
- DNA group: White Oak
- Confidence: confirmed (for anchor), likely (for sons)

Members:
- Michael Johnson (anchor, generation 0)
- Sarah Watson Johnson (spouse, generation 0)
- John Johnson (child, generation 1) - likely
- James Johnson (child, generation 1) - likely
- John Watson (parent of spouse, generation -1)
- Alice Watson (parent of spouse, generation -1)

Associated (not family, but part of the network):
- John Jones (associated - possible brother-in-law)
- Edward Hatcher (associated - adjacent landowner)
- William Burton (associated - adjacent landowner)

---

## Design Decisions (Resolved)

**1. Location precision for individuals**
Each person should have home location(s) with as much detail as possible:
- Creek name
- Geographic coordinates (lat/long)
- Landmarks
- Town/settlement names
- Variable detail based on what we know

Geographic coordinates are valuable for proximity queries: "Who lived within 10 miles of this person in 1740?"

**2. Creek View visualization**
Start with coordinate-based approach. If we have lat/long for people's locations, we can:
- Plot on a map (later)
- Calculate distances and proximities (now)
- The actual map visualization can come later

**3. Family narratives vs individual bios**
- Family group narratives are SEPARATE from individual bios
- Individual bios LINK to their family group narrative
- Search results show family groups as distinct entities
- Example: Search "Augusta 1760" → shows William Johnston-Ann Chew family group, and individual members link to that family narrative

**4. Geographic info philosophy**
Capture as much as possible, as precisely as possible:
- Creeks, rivers, swamps
- Coordinates when determinable
- Landmarks, settlement names
- Note that county borders shifted frequently - capture the date context

**5. Priority order**
Confirmed: Geography → Family Groups → Narrative Tools

---

## Additional Requirements (from discussion)

### Nested Family Groups

Family groups can contain other family groups, forming a hierarchy:

```
Scots-Irish Johnston Migration (broad group, spans century)
├── William Johnston-Ann Chew Family (Augusta 1750s)
│   ├── [individual members]
│   └── [children's families]
├── [Another branch]
└── [Possibly related: X family - unproven connection]
```

Key points:
- Some individuals hard to place in specific family groups
- Broader family groups may trace back to Ireland/Scotland
- DNA will inform these connections over time
- Allow "possibly related to Y family group" designations
- Confidence levels at the group-membership level

**Schema addition:**
```sql
-- Add to family_groups table
ALTER TABLE family_groups ADD COLUMN parent_group_id UUID REFERENCES family_groups(id);
ALTER TABLE family_groups ADD COLUMN connection_confidence TEXT CHECK (connection_confidence IN (
    'confirmed',
    'likely', 
    'possible',
    'speculative'
));
ALTER TABLE family_groups ADD COLUMN connection_evidence TEXT;  -- Why we think they're connected
```

### File Uploads

Allow image and file uploads to:
- Individual person pages
- Family group pages

Use cases:
- Historical maps (until we build mapping functionality)
- Modern photos of locations
- Document scans
- Visualizations
- DNA charts

**Schema:**
```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What this is attached to (polymorphic)
    entity_type TEXT CHECK (entity_type IN ('person', 'family_group', 'location', 'document')),
    person_id TEXT REFERENCES people(id),
    family_group_id UUID REFERENCES family_groups(id),
    location_id UUID REFERENCES locations(id),
    document_id UUID REFERENCES documents(id),
    
    -- File info
    filename TEXT NOT NULL,
    file_type TEXT,                        -- 'image', 'pdf', 'map', 'other'
    mime_type TEXT,
    file_size INTEGER,
    storage_path TEXT NOT NULL,            -- Path in Supabase storage
    
    -- Metadata
    title TEXT,
    description TEXT,
    date_taken TEXT,                       -- For photos
    source TEXT,                           -- Where this came from
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attachments_person ON attachments(person_id) WHERE person_id IS NOT NULL;
CREATE INDEX idx_attachments_family ON attachments(family_group_id) WHERE family_group_id IS NOT NULL;
CREATE INDEX idx_attachments_location ON attachments(location_id) WHERE location_id IS NOT NULL;
```

### Enhanced Location Model with Coordinates

```sql
-- Update locations table for coordinate-based queries
ALTER TABLE locations ADD COLUMN coordinates_known BOOLEAN DEFAULT FALSE;
ALTER TABLE locations ADD COLUMN coordinate_precision TEXT CHECK (coordinate_precision IN (
    'exact',            -- We know precisely where this is
    'approximate',      -- Within a mile or so
    'general'           -- General area only
));

-- Add coordinates to person-location links
ALTER TABLE location_residents ADD COLUMN latitude DECIMAL;
ALTER TABLE location_residents ADD COLUMN longitude DECIMAL;
ALTER TABLE location_residents ADD COLUMN coordinate_source TEXT;  -- How we determined this

-- Proximity query function
CREATE OR REPLACE FUNCTION find_nearby_residents(
    center_lat DECIMAL,
    center_lon DECIMAL,
    radius_miles DECIMAL,
    target_year INTEGER
) RETURNS TABLE (
    person_id TEXT,
    distance_miles DECIMAL,
    location_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lr.person_id,
        -- Haversine formula for distance
        (3959 * acos(
            cos(radians(center_lat)) * cos(radians(lr.latitude)) *
            cos(radians(lr.longitude) - radians(center_lon)) +
            sin(radians(center_lat)) * sin(radians(lr.latitude))
        ))::DECIMAL as distance_miles,
        l.name as location_name
    FROM location_residents lr
    JOIN locations l ON lr.location_id = l.id
    WHERE lr.latitude IS NOT NULL
      AND lr.longitude IS NOT NULL
      AND (lr.date_first IS NULL OR lr.date_first::INTEGER <= target_year)
      AND (lr.date_last IS NULL OR lr.date_last::INTEGER >= target_year)
      AND (3959 * acos(
            cos(radians(center_lat)) * cos(radians(lr.latitude)) *
            cos(radians(lr.longitude) - radians(center_lon)) +
            sin(radians(center_lat)) * sin(radians(lr.latitude))
        )) <= radius_miles
    ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;
```

### County Border Changes

Since county borders shifted frequently, we need to track this:

```sql
-- Add to locations table
ALTER TABLE locations ADD COLUMN formed_from TEXT;      -- "Formed from Henrico County"
ALTER TABLE locations ADD COLUMN formation_date TEXT;   -- "1728"
ALTER TABLE locations ADD COLUMN dissolved_into TEXT;   -- If split into other counties
ALTER TABLE locations ADD COLUMN border_notes TEXT;     -- Freeform notes about changes

-- Example: Goochland County
-- name: "Goochland County"
-- location_type: "county"
-- parent_location_id: [Virginia]
-- formed_from: "Henrico County"
-- formation_date: "1728"
-- border_notes: "Western portion of Henrico. Further divided when Albemarle formed 1744."
```

---

## Creek View - Technical Assessment

**Feasibility: Moderate**

If we have coordinates, we can do this relatively easily:

**Option A: Simple map with markers (Easy)**
- Use Leaflet.js or Mapbox
- Plot each person as a marker at their coordinates
- Click marker to see person details
- Filter by date range
- This is straightforward to implement

**Option B: Creek-following visualization (Harder)**
- Would need actual creek/river geographic data (GeoJSON)
- Plot people along the waterway
- More visually meaningful but requires external data

**Recommendation:** Start with Option A (simple map markers). It gives us:
- Visual clustering of who lived near whom
- Distance-based proximity
- Date filtering
- Can upgrade to Option B later if we find good waterway data

**Implementation:** Use Supabase's PostGIS extension for geographic queries, Leaflet.js for frontend map display.
