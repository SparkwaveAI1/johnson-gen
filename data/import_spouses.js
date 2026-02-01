const fs = require('fs');

// Load data
const ancestors = JSON.parse(fs.readFileSync('ancestors.json', 'utf8'));
const idMap = JSON.parse(fs.readFileSync('id_mapping.json', 'utf8'));

// Parse GEDCOM for family structures (marriages)
const gedcom = fs.readFileSync('family.ged', 'utf8');
const lines = gedcom.split('\n');

const families = {};
let currentFam = null;

for (const line of lines) {
  const match = line.match(/^(\d+)\s+(@\w+@)?\s*(\w+)\s*(.*)?$/);
  if (!match) continue;
  
  const [, level, id, tag, value] = match;
  const lvl = parseInt(level);
  
  if (lvl === 0 && id && tag === 'FAM') {
    currentFam = { id, husb: '', wife: '', marriageDate: '', marriagePlace: '' };
    families[id] = currentFam;
  } else if (lvl === 1 && currentFam) {
    if (tag === 'HUSB') currentFam.husb = value;
    if (tag === 'WIFE') currentFam.wife = value;
    if (tag === 'MARR') currentFam.inMarriage = true;
  } else if (lvl === 2 && currentFam && currentFam.inMarriage) {
    if (tag === 'DATE') currentFam.marriageDate = value;
    if (tag === 'PLAC') currentFam.marriagePlace = value;
  } else if (lvl === 0) {
    currentFam = null;
  }
}

// Create ancestor set
const ancestorIds = new Set(ancestors.map(a => a.id));

let sql = `-- Import spouse relationships for direct ancestors\n\n`;
let count = 0;

// Find marriages where both spouses are in our ancestor set
Object.values(families).forEach(fam => {
  if (!fam.husb || !fam.wife) return;
  if (!ancestorIds.has(fam.husb) || !ancestorIds.has(fam.wife)) return;
  
  const husbId = idMap[fam.husb];
  const wifeId = idMap[fam.wife];
  
  if (!husbId || !wifeId) return;
  
  // Husband -> Wife (spouse)
  sql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES\n`;
  sql += `  ('${husbId}', '${wifeId}', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')\n`;
  sql += `ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;\n`;
  
  // Wife -> Husband (spouse)
  sql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES\n`;
  sql += `  ('${wifeId}', '${husbId}', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222')\n`;
  sql += `ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;\n\n`;
  
  count += 2;
});

fs.writeFileSync('import_spouses.sql', sql);
console.log(`Generated ${count} spouse relationship records`);
