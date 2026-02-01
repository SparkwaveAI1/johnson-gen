const fs = require('fs');
const crypto = require('crypto');

// Parse GEDCOM file for sources
const gedcom = fs.readFileSync('family.ged', 'utf8');
const lines = gedcom.split('\n');

const sources = {};
let currentSource = null;
let currentLevel1 = null;

for (const line of lines) {
  const match = line.match(/^(\d+)\s+(@\S+@)?\s*(\w+)\s*(.*)?$/);
  if (!match) continue;
  
  const [, level, id, tag, value] = match;
  const lvl = parseInt(level);
  
  if (lvl === 0 && id && tag === 'SOUR') {
    currentSource = { 
      id, 
      title: '', 
      author: '', 
      publisher: '', 
      pubDate: '', 
      pubPlace: '',
      apid: ''
    };
    sources[id] = currentSource;
    currentLevel1 = null;
  } else if (lvl === 1 && currentSource) {
    currentLevel1 = tag;
    if (tag === 'TITL') currentSource.title = value || '';
    if (tag === 'AUTH') currentSource.author = value || '';
    if (tag === 'PUBL') currentSource.publisher = value || '';
    if (tag === '_APID') currentSource.apid = value || '';
  } else if (lvl === 2 && currentSource && currentLevel1 === 'PUBL') {
    if (tag === 'DATE') currentSource.pubDate = value || '';
    if (tag === 'PLAC') currentSource.pubPlace = value || '';
  } else if (lvl === 0) {
    currentSource = null;
  }
}

console.log(`Parsed ${Object.keys(sources).length} sources`);

// Helper function
const esc = (s) => s ? s.replace(/'/g, "''").substring(0, 500) : null;

const parseYear = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
  return match ? parseInt(match[1]) : null;
};

// Generate SQL - let database generate UUIDs
let sql = `-- Import ${Object.keys(sources).length} sources from GEDCOM\n\n`;

Object.values(sources).forEach((s, idx) => {
  const pubYear = parseYear(s.pubDate);
  
  sql += `INSERT INTO sources (title, author, publisher, publication_place, publication_year, source_type, repository, notes, workspace_id) VALUES (\n`;
  sql += `  ${s.title ? `'${esc(s.title)}'` : 'NULL'},\n`;
  sql += `  ${s.author ? `'${esc(s.author)}'` : 'NULL'},\n`;
  sql += `  ${s.publisher ? `'${esc(s.publisher)}'` : 'NULL'},\n`;
  sql += `  ${s.pubPlace ? `'${esc(s.pubPlace)}'` : 'NULL'},\n`;
  sql += `  ${pubYear || 'NULL'},\n`;
  sql += `  'ancestry_record',\n`;
  sql += `  'Ancestry.com',\n`;
  sql += `  'Imported from GEDCOM. Original ID: ${s.id}${s.apid ? `, APID: ${s.apid}` : ''}',\n`;
  sql += `  '22222222-2222-2222-2222-222222222222'\n`;
  sql += `);\n\n`;
});

fs.writeFileSync('import_sources.sql', sql);
console.log(`Saved import_sources.sql`);
