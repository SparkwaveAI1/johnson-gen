# IMPORT SPECIFICATION: Extraction JSON → Database

## CRITICAL REQUIREMENTS

This specification is **non-negotiable**. Every rule must be followed exactly. No interpretation. No shortcuts. No "close enough."

### Core Principles

1. **EVERY** item in the JSON becomes a database record
2. **EVERY** relationship is bidirectional - both directions must be created
3. **EVERY** record has a confidence level: `confirmed`, `probable`, or `possible`
4. **AFTER** import, verification queries MUST be run to confirm success
5. **IF** verification fails, stop and report - do not proceed

---

## SECTION 1: LOCATIONS (location_residents table)

### The Problem We're Fixing

Extraction JSON contains detailed location data:
```json
"locations": [
  {
    "location_name": "Abbs Valley",
    "parent_location": "Tazewell County, Virginia",
    "date_first": "1753",
    "date_last": "1756",
    "residence_type": "temporary",
    "evidence": "Lived in cave while hunting/harvesting ginseng"
  }
]
```

But the database only shows county-level entries like "Augusta County 1750-1770". The detailed locations are lost.

### The Rule

**FOR EACH** object in a person's `locations` array, create ONE `location_residents` record.

No exceptions. No merging. No summarizing. If the JSON has 9 location entries, the database gets 9 `location_residents` records.

### Import Process

```
FOR EACH location_entry IN person.locations:

    1. FIND OR CREATE the location:
       - Search locations table for location_entry.location_name
       - If not found, CREATE new location record:
         - name = location_entry.location_name
         - parent_location = location_entry.parent_location (resolve to parent_location_id)
         - location_type = location_entry.type (creek, county, town, etc.)
         - modern_name = location_entry.modern_location (if provided)
         - verification_status = 'possible' (until geocoded)
       - Get the location_id

    2. CREATE location_residents record:
       - person_id = [the person being imported]
       - location_id = [from step 1]
       - date_first = location_entry.date_first
       - date_last = location_entry.date_last (can be NULL)
       - residence_type = location_entry.residence_type
       - evidence = location_entry.evidence
       - confidence = location_entry.confidence OR 'probable' (default)
       - notes = location_entry.notes (if provided)

    3. LOG the creation:
       OUTPUT: "Created location_resident: [person_name] → [location_name], [date_first]-[date_last], [residence_type]"
```

### Residence Types (valid values)

- `resident` - lived there
- `landowner` - owned land there (may or may not have lived there)
- `landowner_nonresident` - owned land but did NOT live there
- `temporary` - short-term stay
- `childhood_home` - grew up there
- `military` - stationed/served there
- `captive` - held prisoner there
- `visitor` - brief visit
- `birthplace` - born there
- `deathplace` - died there

### Verification Query (MUST RUN AFTER IMPORT)

```sql
SELECT 
    p.given_name || ' ' || p.surname as person_name,
    COUNT(lr.id) as location_count
FROM people p
LEFT JOIN location_residents lr ON p.id = lr.person_id
WHERE p.id = [imported_person_id]
GROUP BY p.id;
```

**EXPECTED**: location_count = number of items in JSON locations array

**IF MISMATCH**: Stop. Report error. Do not proceed.

---

## SECTION 2: FAMILY RELATIONSHIPS (relationships table)

### The Problem We're Fixing

1. Relationships are created in one direction only (A→B but not B→A)
2. Relationships are sometimes reversed (child listed as parent)
3. Some relationships from JSON never get created

### The Rule

**FOR EACH** relationship in `relationships_to_add`, create **TWO** database records - the relationship AND its inverse.

### Relationship Types and Their Inverses

| If A is... | Then B is... |
|------------|--------------|
| father | child |
| mother | child |
| child | father OR mother (use parent if unknown) |
| parent | child |
| spouse | spouse |
| sibling | sibling |
| cousin | cousin |

### Import Process

```
FOR EACH rel IN relationships_to_add:

    1. RESOLVE person IDs:
       - person1_id = find person matching rel.person_1_name (or rel.person_1_temp)
       - person2_id = find person matching rel.person_2_name (or rel.person_2_temp)
       - IF either not found: LOG ERROR and continue to next

    2. DETERMINE inverse relationship type:
       - IF rel.relationship_type = 'father' THEN inverse = 'child'
       - IF rel.relationship_type = 'mother' THEN inverse = 'child'
       - IF rel.relationship_type = 'child' THEN inverse = 'parent'
       - IF rel.relationship_type = 'parent' THEN inverse = 'child'
       - IF rel.relationship_type = 'spouse' THEN inverse = 'spouse'
       - IF rel.relationship_type = 'sibling' THEN inverse = 'sibling'
       - IF rel.relationship_type = 'cousin' THEN inverse = 'cousin'

    3. CHECK if relationship already exists:
       - Query: SELECT id FROM relationships 
                WHERE person1_id = [person1_id] AND person2_id = [person2_id]
       - IF exists: LOG "Relationship already exists" and SKIP creation (but still check inverse)

    4. CREATE primary relationship (if not exists):
       - person1_id = person1_id
       - person2_id = person2_id
       - relationship_type = rel.relationship_type
       - confidence = rel.confidence OR 'probable'
       - evidence = rel.evidence_summary
       - marriage_date = rel.marriage_date (if applicable)
       - marriage_location = rel.marriage_location (if applicable)

    5. CHECK if inverse relationship already exists:
       - Query: SELECT id FROM relationships 
                WHERE person1_id = [person2_id] AND person2_id = [person1_id]
       - IF exists: LOG "Inverse relationship already exists" and SKIP

    6. CREATE inverse relationship (if not exists):
       - person1_id = person2_id  [SWAPPED]
       - person2_id = person1_id  [SWAPPED]
       - relationship_type = inverse  [CALCULATED IN STEP 2]
       - confidence = rel.confidence OR 'probable'
       - evidence = rel.evidence_summary
       - marriage_date = rel.marriage_date (if applicable, for spouse)
       - marriage_location = rel.marriage_location (if applicable, for spouse)

    7. LOG both creations:
       OUTPUT: "Created relationship: [person1_name] [type] [person2_name]"
       OUTPUT: "Created relationship: [person2_name] [inverse_type] [person1_name]"
```

### CRITICAL: Direction Matters

When JSON says:
```json
{
  "person_1_name": "Absalom Looney",
  "person_2_name": "Benjamin Looney",
  "relationship_type": "father"
}
```

This means: Absalom Looney IS THE FATHER OF Benjamin Looney.

Create:
- Absalom Looney [father of] Benjamin Looney
- Benjamin Looney [child of] Absalom Looney

**DO NOT** create "Benjamin Looney [father of] Absalom Looney" - that is backwards and wrong.

### Verification Query (MUST RUN AFTER IMPORT)

```sql
-- Check relationships for a person appear in BOTH directions
SELECT 
    p1.given_name || ' ' || p1.surname as person1,
    r.relationship_type,
    p2.given_name || ' ' || p2.surname as person2
FROM relationships r
JOIN people p1 ON r.person1_id = p1.id
JOIN people p2 ON r.person2_id = p2.id
WHERE p1.id = [imported_person_id] OR p2.id = [imported_person_id]
ORDER BY p1.surname, r.relationship_type;
```

**VERIFY**: For every "A [father] B" there must be a "B [child] A"

**IF MISSING INVERSE**: Stop. Create missing inverse. Report.

---

## SECTION 3: ASSOCIATED PERSONS (associated_persons table)

### The Problem We're Fixing

Documents mention people who interacted but aren't family. These connections are being ignored.

Examples:
- "Absalom told Captain James Moore about Abbs Valley"
- "Near Mocksville, where the Boone and Johnson families lived"
- "Cousin Peter Looney captured at Fort Vause"
- "Walter Johnson served as guardian for Benjamin Looney's children"

### The Rule

**FOR EACH** non-family connection mentioned in documents, create an `associated_persons` record.

### Association Types

- `witness` - witnessed a document together
- `neighbor` - lived near each other
- `business` - business transaction
- `guardian` - legal guardian relationship
- `informant` - shared information (like Absalom telling Moore about Abbs Valley)
- `military` - served together
- `church` - attended same church
- `migration` - migrated together
- `legal` - legal proceedings together (not witness)
- `other` - other documented connection

### Import Process

```
FOR EACH assoc IN associated_persons_to_add:

    1. RESOLVE person IDs:
       - person1_id = find person matching assoc.person_1_name
       - person2_id = find person matching assoc.person_2_name
       - IF either not found AND assoc.create_if_missing = true:
         - Create stub person record
       - IF either not found AND assoc.create_if_missing != true:
         - LOG ERROR and continue

    2. CHECK if association already exists:
       - Query for existing association between these two people
       - IF exists with same association_type: SKIP

    3. CREATE associated_persons record:
       - person1_id = person1_id
       - person2_id = person2_id
       - association_type = assoc.association_type
       - description = assoc.description
       - date = assoc.date (if known)
       - location = assoc.location (if known)
       - confidence = assoc.confidence OR 'probable'
       - evidence = assoc.evidence
       - document_id = assoc.document_id (if from a specific document)

    4. CREATE inverse association:
       - person1_id = person2_id [SWAPPED]
       - person2_id = person1_id [SWAPPED]
       - [all other fields same]

    5. LOG:
       OUTPUT: "Created association: [person1] ↔ [person2] ([type]: [description])"
```

### Verification Query

```sql
SELECT 
    p1.given_name || ' ' || p1.surname as person1,
    ap.association_type,
    ap.description,
    p2.given_name || ' ' || p2.surname as person2
FROM associated_persons ap
JOIN people p1 ON ap.person1_id = p1.id
JOIN people p2 ON ap.person2_id = p2.id
WHERE p1.id = [imported_person_id] OR p2.id = [imported_person_id];
```

---

## SECTION 4: CONFIDENCE LEVELS

### Every Record Must Have a Confidence Level

| Level | Meaning | When to Use |
|-------|---------|-------------|
| `confirmed` | Multiple independent primary sources agree | Birth/death dates from vital records; land grants from patent books; relationships stated in wills |
| `probable` | Good evidence with minor gaps | Single primary source; consistent family tradition; logical inference from solid evidence |
| `possible` | Reasonable inference, needs more research | Circumstantial evidence; conflicting sources; family tradition without documentation |

### Default Confidence

If JSON does not specify confidence, use `probable`.

**NEVER** import a record without a confidence level. If unsure, use `possible`.

---

## SECTION 5: VERIFICATION PROTOCOL

### After Every Import, Run These Checks:

```sql
-- 1. Count location_residents for imported person
SELECT COUNT(*) as db_count FROM location_residents WHERE person_id = [id];
-- Compare to JSON locations array length

-- 2. Count relationships for imported person (both directions)
SELECT COUNT(*) as db_count FROM relationships 
WHERE person1_id = [id] OR person2_id = [id];
-- Should be ~2x the JSON relationships count (both directions)

-- 3. Count associated_persons for imported person
SELECT COUNT(*) as db_count FROM associated_persons 
WHERE person1_id = [id] OR person2_id = [id];
-- Should be ~2x the JSON associations count (both directions)

-- 4. Check for orphaned relationships (one direction only)
SELECT r1.* FROM relationships r1
LEFT JOIN relationships r2 ON r1.person1_id = r2.person2_id AND r1.person2_id = r2.person1_id
WHERE r2.id IS NULL AND (r1.person1_id = [id] OR r1.person2_id = [id]);
-- Should return 0 rows
```

### Verification Output Format

```
IMPORT VERIFICATION FOR: Absalom Looney (id: 123)
================================================
Locations:
  - JSON count: 9
  - Database count: 9
  - STATUS: ✓ PASS

Relationships:
  - JSON count: 6
  - Database count: 12 (6 pairs)
  - Orphaned (one-direction): 0
  - STATUS: ✓ PASS

Associated Persons:
  - JSON count: 3
  - Database count: 6 (3 pairs)
  - STATUS: ✓ PASS

OVERALL: ✓ ALL CHECKS PASSED
```

**IF ANY CHECK FAILS**: Stop. Report specific failure. Do not proceed to next person.

---

## SECTION 6: ERROR HANDLING

### Missing Person Reference

If JSON references a person that doesn't exist in database:

1. Check if person is in `new_people_to_create` in same JSON file
2. If yes: Create that person first, then create relationship/association
3. If no: LOG ERROR with details, continue to next item

### Duplicate Detection

Before creating any record:

1. Check if equivalent record exists
2. If exact duplicate: Skip silently
3. If partial match (same people, different details): LOG WARNING, create anyway with note

### Data Validation

Before creating any record, validate:

- Dates are reasonable (1600-1900 for this project)
- Required fields are present
- Confidence level is valid enum value
- Relationship type is valid enum value

**IF VALIDATION FAILS**: LOG ERROR with details, skip record, continue

---

## SECTION 7: LOGGING REQUIREMENTS

### Every Import Session Must Log:

1. Start time
2. Source file being imported
3. Each record created (type, key fields)
4. Each error encountered
5. Verification results
6. End time and summary counts

### Log Format

```
[2026-01-17 20:30:00] START IMPORT: absalom-looney-comprehensive-extraction.json
[2026-01-17 20:30:01] PERSON: Updating Absalom Looney (id: 123)
[2026-01-17 20:30:01] LOCATION: Created location "Abbs Valley" (id: 456)
[2026-01-17 20:30:01] LOCATION_RESIDENT: Absalom Looney → Abbs Valley, 1753-1756, temporary
[2026-01-17 20:30:01] LOCATION_RESIDENT: Absalom Looney → Rowan County NC, 1759, temporary
[2026-01-17 20:30:02] RELATIONSHIP: Absalom Looney [father] Benjamin Looney
[2026-01-17 20:30:02] RELATIONSHIP: Benjamin Looney [child] Absalom Looney (inverse)
[2026-01-17 20:30:02] ASSOCIATION: Absalom Looney ↔ Captain James Moore (informant: told about Abbs Valley)
[2026-01-17 20:30:03] VERIFICATION: Locations 9/9 ✓
[2026-01-17 20:30:03] VERIFICATION: Relationships 12/12 ✓
[2026-01-17 20:30:03] VERIFICATION: Associations 6/6 ✓
[2026-01-17 20:30:03] END IMPORT: SUCCESS - 9 locations, 6 relationships, 3 associations
```

---

## SECTION 8: TEST CASE - ABSALOM LOONEY

### Before Import - Current State

Query current state and document it.

### Expected After Import

**Locations (9 total):**
1. Looney's Ferry / Fort Looney, 1730-1756, childhood_home
2. Abbs Valley, 1753-1756, temporary
3. Rowan County NC, 1759, temporary
4. Long Run, 1759-1765, landowner
5. Stone Run, 1767+, landowner
6. Craig's Creek, 1769-1791, landowner
7. Abbs Valley, 1771, temporary (second visit)
8. Stony Run, 1787+, landowner
9. Little War Creek TN, 1789+, landowner_nonresident

**Relationships (must appear BOTH directions):**
- Absalom [spouse] Eleanor Margaret Moore / Eleanor [spouse] Absalom
- Absalom [father] Michael Looney / Michael [child] Absalom
- Absalom [father] Benjamin Looney / Benjamin [child] Absalom
- Absalom [child] Robert Looney Sr. / Robert Sr. [father] Absalom
- Absalom [sibling] Robert Looney Jr. / Robert Jr. [sibling] Absalom
- Absalom [sibling] Samuel Looney / Samuel [sibling] Absalom
- Absalom [sibling] David Looney / David [sibling] Absalom
- Absalom [cousin] Peter Looney / Peter [cousin] Absalom

**Associated Persons:**
- Absalom ↔ Captain James Moore (informant: told about Abbs Valley leading to Moore's settlement)
- Absalom ↔ Boone families (neighbor: lived near them in Rowan County NC 1759)
- Absalom ↔ Johnson families (neighbor: lived near them in Rowan County NC 1759)

### Verification

After import, query database and confirm ALL of the above exist with correct values.

---

## FINAL NOTES

This specification exists because previous imports failed. Data was lost. Relationships were reversed. The system did not work.

**This time it must work.**

Follow every step. Log every action. Verify every import. If something fails, stop and fix it before proceeding.

The goal is simple: What's in the JSON ends up in the database. All of it. Correctly.
