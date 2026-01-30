// Geocode locations using Nominatim (OpenStreetMap)
// Run with: node scripts/geocode-locations.js

const SUPABASE_URL = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_';

// Sleep helper for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Nominatim geocoding
async function geocodeWithNominatim(name, state = 'Virginia', type = null) {
  const query = `${name}, ${state}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=us`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'JohnsonResearchProject/1.0 (genealogy research)' }
  });

  if (!response.ok) {
    console.error(`Nominatim error for ${name}: ${response.status}`);
    return null;
  }

  const results = await response.json();

  if (!results.length) {
    return null;
  }

  // Try to find best match based on type
  let match = results[0];

  if (type === 'creek' || type === 'river' || type === 'swamp') {
    const waterMatch = results.find(r => r.class === 'waterway' || r.type === 'stream' || r.type === 'river');
    if (waterMatch) match = waterMatch;
  } else if (type === 'county') {
    const countyMatch = results.find(r => r.type === 'administrative' || r.addresstype === 'county');
    if (countyMatch) match = countyMatch;
  }

  return {
    latitude: parseFloat(match.lat),
    longitude: parseFloat(match.lon),
    modern_name: match.name !== name ? match.name : null,
    display_name: match.display_name,
    osm_type: match.type
  };
}

// Update location in Supabase
async function updateLocation(id, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/locations?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to update ${id}: ${error}`);
    return false;
  }
  return true;
}

// Get all ungeocoded locations
async function getLocations() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/locations?latitude=is.null&select=id,name,location_type`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  return response.json();
}

// Known historical to modern name mappings
const HISTORICAL_MAPPINGS = {
  'Arrowhattocks': { modernSearch: 'Bermuda Hundred, Virginia', notes: 'Colonial settlement area near confluence of James and Appomattox rivers' },
  'Warrosquoyacke County': { modernSearch: 'Isle of Wight County, Virginia', notes: 'Renamed to Isle of Wight County in 1637' },
  'Lower Norfolk County': { modernSearch: 'Norfolk, Virginia', notes: 'Split into Norfolk County and Princess Anne County in 1691' },
  'Elizabeth City County': { modernSearch: 'Hampton, Virginia', notes: 'Merged with Hampton in 1952' },
  "Jordan's Journey": { modernSearch: 'Jordan Point, Virginia', notes: 'Historic plantation on James River, now archaeological site' },
  'Edloe Plantation': { modernSearch: 'Tuckahoe, Virginia', notes: 'Near Tuckahoe Creek, Goochland/Henrico border' },
  'Curles Plantation': { modernSearch: 'Curles Neck, Virginia', notes: 'Historic plantation on James River in Henrico County' },
  'Jenetoe Creek': { modernSearch: 'Genito Creek, Virginia', notes: 'Now spelled Genito Creek' },
  'Machunk Creek': { modernSearch: 'Machunk Creek, Virginia', notes: 'Still exists in Louisa/Hanover area' },
  'Lickinghole Creek': { modernSearch: 'Lickinghole Creek, Virginia', notes: 'Still exists in Goochland County' },
  'Stonehorse Creek': { modernSearch: 'Tomahawk Creek, Virginia', notes: 'Historic name, near Henrico/Chesterfield' },
  'Strawberry Banks': { modernSearch: 'Strawberry Banks, Virginia', notes: 'Historic settlement near James River' },
  'Pamunkey Neck': { modernSearch: 'Pamunkey River, Virginia', notes: 'Region between Pamunkey and Mattaponi rivers' },
  "Looney's Mill Creek": { modernSearch: 'Looneys Creek, Virginia', notes: 'In Augusta/Rockbridge area' },
  'Stanley Valley': { modernSearch: 'Stanley Valley, Tennessee', notes: 'In Hawkins County, TN' },
  'Carters Valley': { modernSearch: 'Carter Valley, Tennessee', notes: 'Historic settlement in Hawkins County, TN' },
  'Sinking Spring': { modernSearch: 'Sinking Spring, Virginia', notes: 'In Augusta County area' },
  'Longfield': { modernSearch: 'Longfield, Virginia', notes: 'Historic area in Augusta County' }
};

// State mappings for non-Virginia locations
const STATE_OVERRIDES = {
  'Tennessee': 'Tennessee',
  'North Carolina': 'North Carolina',
  'Georgia': 'Georgia',
  'Pennsylvania': 'Pennsylvania',
  'Delaware': 'Delaware',
  'Hawkins County': 'Tennessee',
  'Sullivan County': 'Tennessee',
  'Maury County': 'Tennessee',
  'Dickson County': 'Tennessee',
  'Wayne County': 'Tennessee',
  'Cumberland Gap': 'Tennessee',
  'Holston River': 'Tennessee',
  'Cumberland River': 'Tennessee',
  'Knoxville': 'Tennessee',
  'Rogersville': 'Tennessee',
  'Big Creek (Hawkins)': 'Tennessee',
  'Sinking Creek (Hawkins)': 'Tennessee',
  'Bartons Creek': 'Tennessee',
  'Stanley Valley': 'Tennessee',
  'Carters Valley': 'Tennessee',
  "Stephen Rentfroes Fort": 'Tennessee',
  'Bertie County': 'North Carolina',
  'Edgecombe County': 'North Carolina',
  'Chester County': 'Pennsylvania',
  'New Castle County': 'Delaware',
  'Washington County': 'Virginia',
  'Bedford County': 'Virginia',
  'Botetourt County': 'Virginia',
  'Montgomery County': 'Virginia',
  'Isle of Man': 'United Kingdom'
};

async function main() {
  console.log('Fetching ungeocoded locations...');
  const locations = await getLocations();
  console.log(`Found ${locations.length} locations to geocode\n`);

  let geocoded = 0;
  let failed = 0;

  for (const loc of locations) {
    console.log(`Processing: ${loc.name} (${loc.location_type})`);

    // Determine state
    let state = STATE_OVERRIDES[loc.name] || 'Virginia';

    // Check for historical mapping
    let searchName = loc.name;
    let verificationNotes = '';
    let verificationStatus = 'probable';

    if (HISTORICAL_MAPPINGS[loc.name]) {
      const mapping = HISTORICAL_MAPPINGS[loc.name];
      searchName = mapping.modernSearch.replace(/, (Virginia|Tennessee|North Carolina)$/, '');
      state = mapping.modernSearch.includes('Tennessee') ? 'Tennessee' :
              mapping.modernSearch.includes('North Carolina') ? 'North Carolina' : 'Virginia';
      verificationNotes = mapping.notes;
      verificationStatus = 'probable';
    }

    // Clean up name for search
    searchName = searchName
      .replace(/ \(.*\)$/, '')  // Remove parenthetical notes
      .replace(' County', '')
      .replace(' Parish', '');

    // Add type hint for better results
    if (loc.location_type === 'county') {
      searchName += ' County';
    } else if (loc.location_type === 'creek') {
      if (!searchName.toLowerCase().includes('creek')) {
        searchName += ' Creek';
      }
    } else if (loc.location_type === 'river') {
      if (!searchName.toLowerCase().includes('river')) {
        searchName += ' River';
      }
    }

    try {
      const result = await geocodeWithNominatim(searchName, state, loc.location_type);

      if (result) {
        const updateData = {
          latitude: result.latitude,
          longitude: result.longitude,
          verification_status: verificationStatus,
          verification_notes: verificationNotes || `Geocoded via Nominatim: ${result.display_name}`
        };

        if (result.modern_name && result.modern_name !== loc.name) {
          updateData.modern_name = result.modern_name;
        }

        const success = await updateLocation(loc.id, updateData);
        if (success) {
          console.log(`  ✓ ${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`);
          geocoded++;
        } else {
          console.log(`  ✗ Failed to save`);
          failed++;
        }
      } else {
        console.log(`  ? No results found for "${searchName}, ${state}"`);
        failed++;
      }
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      failed++;
    }

    // Rate limit: 1 request per second for Nominatim
    await sleep(1100);
  }

  console.log(`\nComplete: ${geocoded} geocoded, ${failed} failed`);
}

main().catch(console.error);
