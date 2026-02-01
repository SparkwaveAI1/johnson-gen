const fs = require('fs');

// Parse GEDCOM file
const gedcom = fs.readFileSync('family.ged', 'utf8');
const lines = gedcom.split('\n');

const individuals = {};
const families = {};
let currentRecord = null;
let currentLevel1 = null;

for (const line of lines) {
  const match = line.match(/^(\d+)\s+(@\w+@)?\s*(\w+)\s*(.*)?$/);
  if (!match) continue;
  
  const [, level, id, tag, value] = match;
  const lvl = parseInt(level);
  
  if (lvl === 0) {
    if (id && tag === 'INDI') {
      currentRecord = { id, type: 'INDI', name: '', givn: '', surn: '', sex: '', birthDate: '', birthPlace: '', deathDate: '', deathPlace: '', famc: '', fams: [] };
      individuals[id] = currentRecord;
    } else if (id && tag === 'FAM') {
      currentRecord = { id, type: 'FAM', husb: '', wife: '', children: [] };
      families[id] = currentRecord;
    } else {
      currentRecord = null;
    }
    currentLevel1 = null;
  } else if (lvl === 1 && currentRecord) {
    currentLevel1 = tag;
    if (currentRecord.type === 'INDI') {
      if (tag === 'NAME') currentRecord.name = (value || '').replace(/\//g, '');
      if (tag === 'SEX') currentRecord.sex = value;
      if (tag === 'FAMC') currentRecord.famc = value;
      if (tag === 'FAMS') currentRecord.fams.push(value);
    } else if (currentRecord.type === 'FAM') {
      if (tag === 'HUSB') currentRecord.husb = value;
      if (tag === 'WIFE') currentRecord.wife = value;
      if (tag === 'CHIL') currentRecord.children.push(value);
    }
  } else if (lvl === 2 && currentRecord) {
    if (currentRecord.type === 'INDI') {
      if (tag === 'GIVN') currentRecord.givn = value;
      if (tag === 'SURN') currentRecord.surn = value;
      if (currentLevel1 === 'BIRT' && tag === 'DATE') currentRecord.birthDate = value;
      if (currentLevel1 === 'BIRT' && tag === 'PLAC') currentRecord.birthPlace = value;
      if (currentLevel1 === 'DEAT' && tag === 'DATE') currentRecord.deathDate = value;
      if (currentLevel1 === 'DEAT' && tag === 'PLAC') currentRecord.deathPlace = value;
    }
  }
}

console.log(`Parsed ${Object.keys(individuals).length} individuals and ${Object.keys(families).length} families`);

// Helper functions
const esc = (s) => s ? s.replace(/'/g, "''") : null;

const parseYear = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(1[0-9]{3}|[0-9]{3,4})\b/);
  return match ? parseInt(match[1]) : null;
};

// Generate ID from old GEDCOM ID
const generateId = (gedId) => {
  // Extract number from @I12345@ format
  const num = gedId.replace(/@/g, '').replace(/[^0-9]/g, '');
  return `GED-${num}`;
};

// Build ID map
const idMap = {};
Object.keys(individuals).forEach(gedId => {
  idMap[gedId] = generateId(gedId);
});

// Generate people SQL
let peopleSql = `-- Import ${Object.keys(individuals).length} people from GEDCOM\n\n`;

Object.values(individuals).forEach(p => {
  const newId = idMap[p.id];
  const birthYear = parseYear(p.birthDate);
  const deathYear = parseYear(p.deathDate);
  const surname = p.surn || (p.name ? p.name.split(' ').pop() : 'Unknown');
  
  peopleSql += `INSERT INTO people (id, surname, given_name, birth_year, birth_year_type, birthplace_detail, death_year, death_place_detail, workspace_id, bio) VALUES (\n`;
  peopleSql += `  '${newId}',\n`;
  peopleSql += `  '${esc(surname) || 'Unknown'}',\n`;
  peopleSql += `  ${p.givn ? `'${esc(p.givn)}'` : 'NULL'},\n`;
  peopleSql += `  ${birthYear || 'NULL'},\n`;
  peopleSql += `  ${birthYear ? "'b'" : "'e'"},\n`;
  peopleSql += `  ${p.birthPlace ? `'${esc(p.birthPlace)}'` : 'NULL'},\n`;
  peopleSql += `  ${deathYear || 'NULL'},\n`;
  peopleSql += `  ${p.deathPlace ? `'${esc(p.deathPlace)}'` : 'NULL'},\n`;
  peopleSql += `  '22222222-2222-2222-2222-222222222222',\n`;
  peopleSql += `  'Imported from Ancestry GEDCOM. Original ID: ${p.id}'\n`;
  peopleSql += `) ON CONFLICT (id) DO NOTHING;\n`;
});

fs.writeFileSync('full_people.sql', peopleSql);
console.log('Saved full_people.sql');

// Generate relationships SQL
let relSql = `-- Import all family relationships\n\n`;
let relCount = 0;

Object.values(families).forEach(fam => {
  const husbId = fam.husb ? idMap[fam.husb] : null;
  const wifeId = fam.wife ? idMap[fam.wife] : null;
  
  // Spouse relationships
  if (husbId && wifeId) {
    relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${husbId}', '${wifeId}', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
    relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${wifeId}', '${husbId}', 'spouse', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
    relCount += 2;
  }
  
  // Parent-child relationships
  fam.children.forEach(childGedId => {
    const childId = idMap[childGedId];
    if (!childId) return;
    
    if (husbId) {
      relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${childId}', '${husbId}', 'father', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
      relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${husbId}', '${childId}', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
      relCount += 2;
    }
    if (wifeId) {
      relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${childId}', '${wifeId}', 'mother', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
      relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${wifeId}', '${childId}', 'child', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
      relCount += 2;
    }
  });
  
  // Sibling relationships
  for (let i = 0; i < fam.children.length; i++) {
    for (let j = i + 1; j < fam.children.length; j++) {
      const sib1 = idMap[fam.children[i]];
      const sib2 = idMap[fam.children[j]];
      if (sib1 && sib2) {
        relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${sib1}', '${sib2}', 'sibling', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
        relSql += `INSERT INTO family_relationships (person_id, related_person_id, relationship_type, relationship_status, workspace_id) VALUES ('${sib2}', '${sib1}', 'sibling', 'confirmed', '22222222-2222-2222-2222-222222222222') ON CONFLICT DO NOTHING;\n`;
        relCount += 2;
      }
    }
  }
});

fs.writeFileSync('full_relationships.sql', relSql);
console.log(`Saved full_relationships.sql (${relCount} relationships)`);

// Save ID map for reference
fs.writeFileSync('full_id_mapping.json', JSON.stringify(idMap, null, 2));
console.log('Saved full_id_mapping.json');
