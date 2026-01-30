# UI Audit Fixes and Location Linking

## Context

After reviewing the current state of the app, we identified several issues that need fixing. This task covers UI fixes, data integrity issues, and workflow improvements.

---

## CRITICAL: Location Precision Requirements

**The current location implementation is too general. We need creek-level precision with year-specific data.**

### The Problem

Currently, location data looks like this:
```
Augusta County, Virginia
Resident • 1750 - present
```

But the biography contains specific information:
> "Major Valley settler. Multiple patents 1768-1771: 62 acres 1768, 960 acres 1769, 353 acres 1770, 148 acres 1771. Lands on North Fork South Branch Potomac, Mole Hill, Muddy Creek, Senecar Creek."

### The Solution

Each specific location (creek, landmark, plantation) should be a **separate location_residents entry** with:
- The specific waterway/landmark name
- The specific year(s) documented there
- The evidence for that location
- The residence type (landowner, resident, documented, etc.)

### Correct Structure

For Andrew Johnson, the Locations section should show:

```
📍 Locations

North Fork South Branch Potomac, Augusta County
  Landowner • 1768
  62 acre patent 20 July 1768

Mole Hill, Augusta County  
  Landowner • 1769
  960 acre patent 1769

Muddy Creek, Augusta County
  Landowner • 1770
  353 acre patent 1770

Senecar Creek, Augusta County
  Landowner • 1771
  148 acre patent 1771
```

### Implementation Requirements

1. **Multiple location entries per person** - A person can have 1, 5, or 20 location entries reflecting their movement over time

2. **Year-specific entries** - Each location entry should have specific date_first/date_last, not vague ranges like "1750-present"

3. **Creek-level granularity** - When extraction data includes creek names, landmarks, or specific places, those should be created as locations and linked to the person

4. **Extract from biographies** - If biography text contains location info that wasn't captured in location_residents, parse it and create the entries

5. **Location hierarchy** - Creeks should be linked to their parent county:
   ```
   Augusta County (county)
   ├── North Fork South Branch Potomac (creek)
   ├── Mole Hill (landmark)
   ├── Muddy Creek (creek)
   └── Senecar Creek (creek)
   ```

### Data Model Check

Ensure `location_residents` table supports:
- Multiple entries per person
- Specific dates (not just ranges)
- Evidence field for each entry
- Proper foreign key to locations table

### Extraction JSON Format

When processing extraction batches, look for location data in:
- `new_people_to_create[].location` field
- `new_people_to_create[].notes` field  
- `documents[].location_description` field
- Any biography or notes text mentioning creeks, landmarks, plantations

Create separate `location_residents` entries for each specific place mentioned.

---

---

## Priority 1: Data Integrity (Critical)

### 1.1 Link People to Locations

**Problem:** 92 people in database, 0 assigned to locations. The Locations feature shows "No residents documented yet" everywhere.

**Solution:** Populate the `location_residents` table with known location data.

**Initial data to add:**

```sql
-- First, get location IDs (adjust UUIDs based on your actual data)
-- These should be looked up from your locations table

-- Michael Johnson → Tuckahoe Creek
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'JNSN-UNK-e1673-01', '1702', '1718', 'landowner', 'Patents 1714, 1717 at Tuckahoe Creek; died 1718'
FROM locations l WHERE l.name = 'Tuckahoe Creek';

-- John Johnson → Tuckahoe Creek  
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'JNSN-HEN-e1695-01', '1718', NULL, 'landowner', '1718 patent adjacent to Michael Johnson'
FROM locations l WHERE l.name = 'Tuckahoe Creek';

-- James Johnson → Tuckahoe Creek
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'JNSN-HEN-e1695-02', '1718', NULL, 'landowner', '1718 patent adjacent to Michael Johnson'
FROM locations l WHERE l.name = 'Tuckahoe Creek';

-- John Jones → Tuckahoe Creek (via Edloe Plantation)
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'JNES-UNK-e1670-01', '1702', NULL, 'resident', '1702 St. Peters Parish vestry lists him with Michael Johnson at Edloe Plantation'
FROM locations l WHERE l.name = 'Tuckahoe Creek';

-- William Johnson (1653) → Arrowhattocks
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'JNSN-ENG-e1620-01', '1653', '1665', 'landowner', '1653 patent at Harrahadocks; assigned to Cox by 1665'
FROM locations l WHERE l.name = 'Arrowhattocks';

-- Richard Johnson (1624) → Arrowhattocks (Jordan's Journey)
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'JNSN-ENG-e1595-01', '1624', '1639', 'resident', '1624 muster at Jordan''s Journey; 1639 Tobacco Viewer'
FROM locations l WHERE l.name = 'Arrowhattocks';

-- Edward Hatcher → Tuckahoe Creek area
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'HTCR-VA-e1650-01', '1675', '1699', 'landowner', 'Patents at Cornelius Creek area; land deserted by 1699'
FROM locations l WHERE l.name = 'Cornelius Creek';

-- Robert Burton Sr. → Cornelius Creek / Lily Valley
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'BRTN-VA-e1660-01', '1699', NULL, 'landowner', '1699 patent for Hatcher''s deserted land at Lily Valley/Cornelius Creek'
FROM locations l WHERE l.name = 'Cornelius Creek';

-- William Burton → Tuckahoe Creek area
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'BRTN-HEN-e1685-01', '1714', NULL, 'landowner', 'Adjacent to Michael Johnson in 1714 patent'
FROM locations l WHERE l.name = 'Tuckahoe Creek';

-- John Watson → Henrico County (general)
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'WTSN-UNK-e1650-01', NULL, '1702', 'resident', 'Will dated 1702 in Henrico County'
FROM locations l WHERE l.name = 'Henrico County';

-- Sarah Watson → Tuckahoe Creek (via marriage)
INSERT INTO location_residents (location_id, person_id, date_first, date_last, residence_type, evidence)
SELECT l.id, 'WTSN-UNK-e1675-01', '1702', NULL, 'resident', 'Married Michael Johnson; resided at Tuckahoe Creek'
FROM locations l WHERE l.name = 'Tuckahoe Creek';
```

**Also:** Update the import scripts to include location linking when importing new people.

### 1.2 Fix Michael Johnson Family Relationships

**Problem:** Only spouse Sarah Watson showing. Missing children and in-laws.

**Solution:** Add missing family relationships:

```sql
-- Check if these relationships already exist before inserting

-- John Johnson as likely child
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, evidence)
VALUES (
    'JNSN-HEN-e1695-01',  -- John Johnson
    'JNSN-UNK-e1673-01',  -- Michael Johnson
    'father',
    'likely',
    '1718 patent adjacent to Michael Johnson; 1719 estate inventory presented by John and James together'
);

-- James Johnson as likely child
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, evidence)
VALUES (
    'JNSN-HEN-e1695-02',  -- James Johnson
    'JNSN-UNK-e1673-01',  -- Michael Johnson
    'father',
    'likely',
    '1718 patent adjacent to Michael Johnson; 1719 estate inventory presented by John and James together'
);

-- John Watson as father-in-law (Sarah's father)
INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, evidence)
VALUES (
    'JNSN-UNK-e1673-01',  -- Michael Johnson
    'WTSN-UNK-e1650-01',  -- John Watson
    'father_in_law',
    'confirmed',
    'Watson Will (1702) names daughter Sarah wife of Michael Johnson'
);

-- Note: May need to add 'father_in_law' and 'mother_in_law' to the relationship_type enum if not present
```

**Schema check:** Verify that `relationship_type` enum includes: `father_in_law`, `mother_in_law`. If not, add them:

```sql
-- If using CHECK constraint, update it:
ALTER TABLE family_relationships 
DROP CONSTRAINT IF EXISTS family_relationships_relationship_type_check;

ALTER TABLE family_relationships 
ADD CONSTRAINT family_relationships_relationship_type_check 
CHECK (relationship_type IN (
    'father', 'mother', 'spouse', 'child', 'sibling',
    'father_in_law', 'mother_in_law', 'son_in_law', 'daughter_in_law'
));
```

---

## Priority 2: UI Fixes

### 2.1 Add Location Display to Person Page

**Problem:** Person page shows no geographic information.

**Solution:** Add a "Locations" or "Resided" section to the Person detail page.

**Display format:**
```
📍 Locations
  Tuckahoe Creek, Henrico County
  Landowner • 1714-1718
  Evidence: Patents 1714, 1717 at Tuckahoe Creek
```

**Implementation:**
1. Query `location_residents` joined with `locations` for the person
2. Display location name with parent hierarchy (Creek → County)
3. Show residence_type, date range, and evidence
4. Link location name to Location detail page

**Component location:** `src/pages/PersonDetail.jsx` - add new section

### 2.2 Move Research Questions Section

**Problem:** Open Research Questions appears above Family Relationships - should be lower.

**Solution:** Reorder sections in PersonDetail.jsx:

**Current order:**
1. Vital Facts
2. Biography
3. Open Research Questions ← wrong position
4. Family Relationships
5. Associations

**Correct order:**
1. Vital Facts
2. Biography
3. Locations (NEW)
4. Family Relationships
5. Associations
6. Documents (if not already present)
7. Open Research Questions ← move to bottom

### 2.3 Reorder Sidebar Menu

**Problem:** Locations appears after Sources in the sidebar menu.

**Solution:** Reorder menu items in the sidebar component.

**Current order:**
- Dashboard
- People
- Families
- Documents
- Sources
- Locations ← should be higher
- Chapters
- Identity Queue
- Research Questions
- Gap Analysis

**Correct order:**
- Dashboard
- People
- Families
- Documents
- Locations ← move up
- Sources
- Chapters
- Identity Queue
- Research Questions
- Gap Analysis

**File to edit:** Likely `src/components/Sidebar.jsx` or `src/App.jsx` (wherever navigation is defined)

### 2.4 Add Location to Family Page Header

**Problem:** Family page doesn't show primary location.

**Solution:** Display primary location in the family group header.

**Current:**
```
Michael Johnson of Tuckahoe Creek
Nuclear Family | confirmed | active
Anchor: Michael Johnson
📅 1702 - 1718 | 🧬 White Oak
```

**Should be:**
```
Michael Johnson of Tuckahoe Creek
Nuclear Family | confirmed | active
Anchor: Michael Johnson
📍 Tuckahoe Creek, Henrico County | 📅 1702 - 1718 | 🧬 White Oak
```

**Implementation:** 
1. Family groups have `primary_location_id` field
2. Join with `locations` table to get name
3. Display in header metadata row

---

## Priority 3: Locations Page Improvements

### 3.1 Show Residents on Location Page

**Problem:** Arrowhattocks shows "No residents documented yet" even though we're adding residents.

**Solution:** The UI component exists but needs data. After running the SQL in 1.1, verify the query is working.

**Check:** The Location detail page should query `location_residents` and display:
- Person name (linked)
- Residence type
- Date range
- Evidence snippet

### 3.2 Link Documents to Locations

**Problem:** "No documents linked yet" on Location pages.

**Solution:** Populate `document_locations` table.

```sql
-- Michael Johnson 1714 patent → Tuckahoe Creek
INSERT INTO document_locations (document_id, location_id, location_role)
SELECT d.id, l.id, 'subject'
FROM documents d, locations l
WHERE d.title LIKE '%Michael Johnson%1714%' 
AND l.name = 'Tuckahoe Creek';

-- Similar for other patents...
```

**Better approach:** Update import scripts to include location tagging for documents.

---

## Priority 4: Workflow Improvements - LOCATION PRECISION IS CRITICAL

### 4.1 Update Import Scripts for Location Linking

**THE CURRENT APPROACH IS TOO GENERAL. We need creek-level precision with year-specific data.**

When importing people from extraction batches, the script should:

1. **Parse location data from multiple fields:**
   - `new_people_to_create[].location` - may contain comma-separated locations
   - `new_people_to_create[].notes` - often contains creek names, patent descriptions
   - `documents[].location_description` - specific location details from patents/deeds
   - `documents[].transcription_excerpt` - may mention waterways, landmarks
   - Biography text - often contains specific locations with dates

2. **Create location hierarchy:**
   - If a creek is mentioned, create it as a location with parent = county
   - Don't just use county-level locations when more specific data exists
   - Example: "North Fork South Branch Potomac" should be a location under Augusta County

3. **Create MULTIPLE location_residents entries per person:**
   - Each specific place = separate entry
   - Each entry has specific year(s), not vague ranges
   
   Example - Andrew Johnson should have 4 entries, not 1:
   ```
   Biography says: "Multiple patents 1768-1771: 62 acres 1768, 960 acres 1769, 
   353 acres 1770, 148 acres 1771. Lands on North Fork South Branch Potomac, 
   Mole Hill, Muddy Creek, Senecar Creek."
   
   Should create:
   - North Fork South Branch Potomac | Landowner | 1768 | 62 acre patent
   - Mole Hill | Landowner | 1769 | 960 acre patent  
   - Muddy Creek | Landowner | 1770 | 353 acre patent
   - Senecar Creek | Landowner | 1771 | 148 acre patent
   
   NOT just:
   - Augusta County | Resident | 1750-present
   ```

4. **Avoid generic date ranges** - Use specific years from documents:
   - WRONG: "1750-present" 
   - RIGHT: "1768" or "1768-1771"

### 4.2 Retroactively Fix Existing Location Data

**Run a migration script to:**
1. Query all people with biography text or notes
2. Parse for creek/landmark names (look for patterns like "Creek", "Branch", "River", "Hill", "Valley")
3. Check if those locations exist in locations table (create if not, with proper parent county)
4. Create location_residents entries for each specific place mentioned
5. Extract year from context when available

**Keywords to search for in biographies/notes:**
- Creek, Branch, Fork, River, Run, Spring
- Hill, Mountain, Valley, Gap, Cove
- Plantation, Manor, Tract
- Patent descriptions with acreage

### 4.3 Add Location Field to Person Entry Form

When manually adding a person via the UI:
- Add location selector (searchable dropdown of existing locations)
- Allow adding MULTIPLE locations (not just one)
- For each location specify: residence_type, date_first, date_last, evidence
- Create separate `location_residents` records for each
- Create `location_residents` record on save

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/PersonDetail.jsx` | Add Locations section; reorder Research Questions |
| `src/components/Sidebar.jsx` | Reorder menu items |
| `src/pages/FamilyDetail.jsx` | Add location to header |
| Import scripts | Add location linking |
| Database | Run SQL to populate location_residents, fix relationships |

---

## CRITICAL: Location Specificity Requirements

**The Problem:** Locations are being stored at county level (e.g., "Augusta County, Virginia - Resident 1750-present") when the extraction data contains creek-level specifics. The biography text often has the detail but the Locations section does not.

**Example of what's wrong:**
Andrew Johnson shows:
- Biography: "Lands on North Fork South Branch Potomac, Mole Hill, Muddy Creek, Senecar Creek"
- Locations: Just "Augusta County, Virginia - Resident 1750-present"

**What we need:**
Each person should have MULTIPLE location entries at the creek/landmark level with specific years:

```
📍 Locations

North Fork South Branch Potomac, Augusta County
  Landowner • 1768
  Evidence: 62 acre patent 20 July 1768

Mole Hill, Augusta County  
  Landowner • 1769
  Evidence: 960 acre patent 1769

Muddy Creek, Augusta County
  Landowner • 1770
  Evidence: 353 acre patent 1770

Senecar Creek, Augusta County
  Landowner • 1771
  Evidence: 148 acre patent 1771
```

**Implementation Requirements:**

1. **Parse extraction batches for specific locations** - The data IS in the extraction JSONs. Look for:
   - `location_description` in documents (e.g., "south side of main branch of Tuckahoe Creek")
   - `location` fields in people records
   - Creek names, plantation names, landmarks mentioned in transcriptions

2. **Create location_residents entries for EACH specific location** - Not one county-level entry, but multiple creek-level entries

3. **Include year data** - Use `date_first` and `date_last` from the document dates. If a patent is dated 1768, that's the year for that location.

4. **Build location hierarchy** - Creeks should have parent_location pointing to their county:
   ```
   Augusta County (county)
   ├── North Fork South Branch Potomac (creek)
   ├── Mole Hill (landmark)
   ├── Muddy Creek (creek)
   └── Senecar Creek (creek)
   ```

5. **Evidence field** - Pull from the document that establishes the location (e.g., "62 acre patent 20 July 1768")

**When importing people from extraction batches:**

For each person, scan:
- Their `location` field
- All documents they appear in
- The `location_description` of those documents

Create a `location_residents` entry for EACH distinct creek/landmark found, with the appropriate year.

**People move** - A person may have 5+ location entries over their lifetime. This is correct and expected.

---

## Verification Checklist

After implementing, verify:

- [ ] Michael Johnson page shows "Tuckahoe Creek, Henrico County" in Locations section (not just "Henrico County")
- [ ] Michael Johnson has MULTIPLE location entries: Tuckahoe Creek 1714, Tuckahoe Creek 1717 (separate patents)
- [ ] Andrew Johnson shows 4 separate creek-level locations with years (North Fork South Branch Potomac 1768, Mole Hill 1769, Muddy Creek 1770, Senecar Creek 1771)
- [ ] Michael Johnson page shows John Johnson and James Johnson as children (likely)
- [ ] Michael Johnson page shows John Watson as father-in-law
- [ ] Research Questions section appears after Associations
- [ ] Sidebar shows Locations before Sources
- [ ] Arrowhattocks location page shows Michael Johnson, William Johnson, Richard Johnson as residents
- [ ] Tuckahoe Creek location page shows Michael Johnson, John Johnson, James Johnson as residents
- [ ] Family page header shows primary location
- [ ] Location hierarchy works: clicking "Tuckahoe Creek" shows it's in Henrico County which is in Virginia
- [ ] People with multiple locations show ALL locations with year ranges, not just one county-level entry
