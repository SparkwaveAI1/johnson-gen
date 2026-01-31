const fs = require('fs');

// Load ancestors
const ancestors = JSON.parse(fs.readFileSync('ancestors.json', 'utf8'));

// Generate SQL for import
let sql = `-- Import ${ancestors.length} direct ancestors into Scott Johnson Family workspace\n`;
sql += `-- Generated from Ancestry GEDCOM export\n\n`;

// Helper to escape SQL strings
const esc = (s) => s ? s.replace(/'/g, "''") : null;

// Parse dates to extract year
const parseYear = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(1[0-9]{3}|[0-9]{3,4})\b/);
  return match ? parseInt(match[1]) : null;
};

// Generate person ID
const generateId = (p) => {
  const surn = (p.surn || 'UNK').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
  const year = parseYear(p.birthDate) || 'UNK';
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${surn}-ANC-${year}-${rand}`;
};

sql += `-- Clear existing imported data (optional - comment out to append)\n`;
sql += `-- DELETE FROM family_relationships WHERE workspace_id = '22222222-2222-2222-2222-222222222222';\n`;
sql += `-- DELETE FROM people WHERE workspace_id = '22222222-2222-2222-2222-222222222222';\n\n`;

// Track IDs for relationship linking
const idMap = {};

ancestors.forEach((p, i) => {
  const newId = generateId(p);
  idMap[p.id] = newId;
  
  const birthYear = parseYear(p.birthDate);
  const deathYear = parseYear(p.deathDate);
  
  sql += `INSERT INTO people (id, surname, given_name, birth_year, birth_year_type, birthplace_detail, death_year, death_place_detail, workspace_id, notes) VALUES (\n`;
  sql += `  '${newId}',\n`;
  sql += `  ${p.surn ? `'${esc(p.surn)}'` : 'NULL'},\n`;
  sql += `  ${p.givn ? `'${esc(p.givn)}'` : 'NULL'},\n`;
  sql += `  ${birthYear || 'NULL'},\n`;
  sql += `  ${birthYear ? "'b'" : "'e'"},\n`;
  sql += `  ${p.birthPlace ? `'${esc(p.birthPlace)}'` : 'NULL'},\n`;
  sql += `  ${deathYear || 'NULL'},\n`;
  sql += `  ${p.deathPlace ? `'${esc(p.deathPlace)}'` : 'NULL'},\n`;
  sql += `  '22222222-2222-2222-2222-222222222222',\n`;
  sql += `  'Gen ${p.generation} - Imported from Ancestry GEDCOM. Original ID: ${p.id}'\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
});

fs.writeFileSync('import_ancestors.sql', sql);
console.log(`Generated SQL for ${ancestors.length} people`);
console.log('Saved to import_ancestors.sql');

// Also save ID mapping for relationships
fs.writeFileSync('id_mapping.json', JSON.stringify(idMap, null, 2));
