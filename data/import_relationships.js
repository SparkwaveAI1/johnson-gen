const fs = require('fs');

// Load data
const ancestors = JSON.parse(fs.readFileSync('ancestors.json', 'utf8'));
const idMap = JSON.parse(fs.readFileSync('id_mapping.json', 'utf8'));

// Parse GEDCOM again to get family structures
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
    currentFam = { id, husb: '', wife: '', children: [] };
    families[id] = currentFam;
  } else if (lvl === 1 && currentFam) {
    if (tag === 'HUSB') currentFam.husb = value;
    if (tag === 'WIFE') currentFam.wife = value;
    if (tag === 'CHIL') currentFam.children.push(value);
  } else if (lvl === 0) {
    currentFam = null;
  }
}

// Create ancestor set for filtering
const ancestorIds = new Set(ancestors.map(a => a.id));

let sql = `-- Import family relationships for direct ancestors\n\n`;
let relCount = 0;

// For each ancestor, find their parents in the family structure
ancestors.forEach(person => {
  if (!person.famc) return;
  
  const family = families[person.famc];
  if (!family) return;
  
  const personNewId = idMap[person.id];
  
  // Father relationship
  if (family.husb && ancestorIds.has(family.husb) && idMap[family.husb]) {
    const fatherNewId = idMap[family.husb];
    sql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES\n`;
    sql += `  ('${personNewId}', '${fatherNewId}', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222')\n`;
    sql += `ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;\n`;
    sql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES\n`;
    sql += `  ('${fatherNewId}', '${personNewId}', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')\n`;
    sql += `ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;\n\n`;
    relCount += 2;
  }
  
  // Mother relationship
  if (family.wife && ancestorIds.has(family.wife) && idMap[family.wife]) {
    const motherNewId = idMap[family.wife];
    sql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES\n`;
    sql += `  ('${personNewId}', '${motherNewId}', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222')\n`;
    sql += `ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;\n`;
    sql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES\n`;
    sql += `  ('${motherNewId}', '${personNewId}', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222')\n`;
    sql += `ON CONFLICT (person_id, related_person_id, relationship_type) DO NOTHING;\n\n`;
    relCount += 2;
  }
});

fs.writeFileSync('import_relationships.sql', sql);
console.log(`Generated ${relCount} relationship records`);
