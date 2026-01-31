const fs = require('fs');

// Parse GEDCOM file
const gedcom = fs.readFileSync('family.ged', 'utf8');
const lines = gedcom.split('\n');

// Parse into records
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

// Find Scott and trace ancestors
const scottId = '@I13533564275@';
const ancestors = new Set();
const ancestorDetails = [];

function traceAncestors(personId, generation) {
  if (!personId || ancestors.has(personId)) return;
  
  const person = individuals[personId];
  if (!person) return;
  
  ancestors.add(personId);
  ancestorDetails.push({
    id: personId,
    generation,
    name: person.name,
    givn: person.givn,
    surn: person.surn,
    sex: person.sex,
    birthDate: person.birthDate,
    birthPlace: person.birthPlace,
    deathDate: person.deathDate,
    deathPlace: person.deathPlace,
    famc: person.famc
  });
  
  // Find parents through FAMC (family as child)
  if (person.famc) {
    const family = families[person.famc];
    if (family) {
      if (family.husb) traceAncestors(family.husb, generation + 1);
      if (family.wife) traceAncestors(family.wife, generation + 1);
    }
  }
}

traceAncestors(scottId, 1);

// Sort by generation
ancestorDetails.sort((a, b) => a.generation - b.generation);

console.log(`\nFound ${ancestorDetails.length} direct ancestors:\n`);

// Group by generation
const byGen = {};
ancestorDetails.forEach(a => {
  if (!byGen[a.generation]) byGen[a.generation] = [];
  byGen[a.generation].push(a);
});

const genNames = { 1: 'Self', 2: 'Parents', 3: 'Grandparents', 4: 'Great-Grandparents', 5: '2x Great-Grandparents', 6: '3x Great-Grandparents', 7: '4x Great-Grandparents', 8: '5x Great-Grandparents', 9: '6x Great-Grandparents', 10: '7x Great-Grandparents' };

for (const gen of Object.keys(byGen).sort((a,b) => a-b)) {
  console.log(`\n=== Generation ${gen}: ${genNames[gen] || gen + 'x Great-Grandparents'} (${byGen[gen].length} people) ===`);
  byGen[gen].forEach(a => {
    const birth = a.birthDate ? `b. ${a.birthDate}` : '';
    const death = a.deathDate ? `d. ${a.deathDate}` : '';
    const dates = [birth, death].filter(Boolean).join(' - ');
    console.log(`  ${a.name} ${dates ? `(${dates})` : ''}`);
    if (a.birthPlace) console.log(`    Born: ${a.birthPlace}`);
  });
}

// Save to JSON for import
fs.writeFileSync('ancestors.json', JSON.stringify(ancestorDetails, null, 2));
console.log('\n\nSaved to ancestors.json');
