# UI Audit Fixes and Location Linking

## Context

After reviewing the current state of the app, we identified several issues that need fixing. This task covers UI fixes, data integrity issues, and workflow improvements.

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

## Priority 4: Workflow Improvements

### 4.1 Update Import Scripts for Location Linking

When importing people from extraction JSONs, the script should:

1. Accept location data in the person record:
```json
{
  "suggested_id": "JNSN-HEN-e1695-01",
  "surname": "Johnson",
  "given_name": "John",
  "locations": [
    {
      "location_name": "Tuckahoe Creek",
      "date_first": "1718",
      "residence_type": "landowner",
      "evidence": "1718 patent adjacent to Michael Johnson"
    }
  ]
}
```

2. Look up location by name
3. Create `location_residents` record

### 4.2 Add Location Field to Person Entry Form

When manually adding a person via the UI:
- Add location selector (searchable dropdown of existing locations)
- Allow specifying: residence_type, date_first, date_last, evidence
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

## Verification Checklist

After implementing, verify:

- [ ] Michael Johnson page shows "Tuckahoe Creek, Henrico County" in Locations section
- [ ] Michael Johnson page shows John Johnson and James Johnson as children (likely)
- [ ] Michael Johnson page shows John Watson as father-in-law
- [ ] Research Questions section appears after Associations
- [ ] Sidebar shows Locations before Sources
- [ ] Arrowhattocks location page shows Michael Johnson, William Johnson, Richard Johnson as residents
- [ ] Tuckahoe Creek location page shows Michael Johnson, John Johnson, James Johnson as residents
- [ ] Family page header shows primary location
