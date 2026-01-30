-- Fix John Jones - set generation to NULL for associated members
UPDATE family_group_members
SET generation = NULL
WHERE family_group_id = 'fb0f9a4f-b080-49c9-9d9d-275604f527c3'
  AND person_id = 'JNES-UNK-e1670-01';

-- Add Edward Hatcher as associated (adjacent landowner)
-- Using HTCR-UNK-e1680-01 (Edward Hatcher, b. ~1680)
INSERT INTO family_group_members (family_group_id, person_id, role, generation, notes)
VALUES (
  'fb0f9a4f-b080-49c9-9d9d-275604f527c3',
  'HTCR-UNK-e1680-01',
  'associated',
  NULL,
  'Edward Hatcher, adjacent landowner on Tuckahoe Creek.'
)
ON CONFLICT DO NOTHING;

-- Add William Burton as associated (adjacent landowner)
-- Using BRTN-HEN-e1685-01 (William Burton, b. ~1685, Henrico County)
INSERT INTO family_group_members (family_group_id, person_id, role, generation, notes)
VALUES (
  'fb0f9a4f-b080-49c9-9d9d-275604f527c3',
  'BRTN-HEN-e1685-01',
  'associated',
  NULL,
  'William Burton, adjacent landowner on Tuckahoe Creek.'
)
ON CONFLICT DO NOTHING;

-- Verify the updates
SELECT fgm.role, fgm.generation, fgm.notes, p.given_name, p.surname
FROM family_group_members fgm
JOIN people p ON fgm.person_id = p.id
WHERE fgm.family_group_id = 'fb0f9a4f-b080-49c9-9d9d-275604f527c3'
ORDER BY
  CASE fgm.role
    WHEN 'anchor' THEN 1
    WHEN 'spouse' THEN 2
    WHEN 'child' THEN 3
    WHEN 'in_law' THEN 4
    WHEN 'associated' THEN 5
  END,
  fgm.generation NULLS LAST;
