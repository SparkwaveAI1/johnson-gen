# CLAUDE_CODE_FEATURE_SPEC: Location Geocoding & Visualizations

## Overview

This spec covers three interconnected features:
1. **Location geocoding** - Adding coordinates and verification to all locations
2. **Migration visualization** - Showing person movement over time on Person pages
3. **Network graphs** - Dynamic rendering of family and witness relationships

All visualizations must be dynamically rendered from current database state, as data changes frequently.

---

## 1. Location Geocoding

### Database Changes

**Update `locations` table - add fields:**

```sql
ALTER TABLE locations ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS modern_name TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS verification_status TEXT CHECK (verification_status IN ('confirmed', 'probable', 'possible')) DEFAULT 'possible';
ALTER TABLE locations ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS gnis_id TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS location_type TEXT; -- creek, river, county, town, plantation, fort, cemetery, etc.
```

### GNIS Integration

The USGS Geographic Names Information System (GNIS) provides authoritative data on US place names.

**API endpoint:** `https://geonames.usgs.gov/api/search`

**Lookup workflow:**

```javascript
async function lookupGNIS(locationName, stateCode) {
  // 1. Search GNIS
  const response = await fetch(
    `https://geonames.usgs.gov/api/search?name=${encodeURIComponent(locationName)}&state=${stateCode}&format=json`
  );
  const results = await response.json();
  
  // 2. Filter by feature type (stream, valley, summit, etc.)
  // 3. If single clear match: return coordinates + 'confirmed'
  // 4. If multiple candidates: return best match + 'probable' + notes
  // 5. If no match: return null + 'possible' + notes
  
  return {
    latitude: result.lat,
    longitude: result.lon,
    gnis_id: result.gnis_id,
    modern_name: result.name, // if different from search term
    verification_status: 'confirmed' | 'probable' | 'possible',
    verification_notes: 'Matched GNIS ID 12345; single result for creek name in Augusta County'
  };
}
```

**Feature type mapping:**
- creek, run, branch → GNIS class "Stream"
- river → GNIS class "Stream"
- valley, cove → GNIS class "Valley"
- mountain, hill → GNIS class "Summit"
- town, settlement → GNIS class "Populated Place"
- county → GNIS class "Civil"

**Batch processing:**

Create a function to process all ungeocoded locations:

```javascript
async function geocodeAllLocations() {
  // Get all locations where latitude IS NULL
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .is('latitude', null);
  
  for (const loc of locations) {
    const result = await lookupGNIS(loc.name, loc.state_code);
    
    await supabase
      .from('locations')
      .update({
        latitude: result.latitude,
        longitude: result.longitude,
        modern_name: result.modern_name,
        gnis_id: result.gnis_id,
        verification_status: result.verification_status,
        verification_notes: result.verification_notes
      })
      .eq('id', loc.id);
    
    // Rate limit: GNIS asks for reasonable request rates
    await sleep(500);
  }
}
```

### Manual Override

Some locations won't match GNIS (historic names, destroyed places, etc.). UI should allow manual coordinate entry:

- Edit location → enter lat/long manually
- Set verification_status to 'confirmed' or 'probable'
- Add verification_notes explaining source (historic map, local history, etc.)

### Historic Name Variants

The `name_variants` field (already in schema) stores alternate spellings:
- "Looney's Mill Creek" = "Lunie's Creek" = "Luney's Mill Creek"

When searching GNIS, try all variants if primary fails.

---

## 2. Migration Visualization (Person Page)

### Purpose

Show a person's movement through locations over time, displayed on their Person page.

### Data Source

Pull from `location_residents` table:

```sql
SELECT 
  lr.date_first,
  lr.date_last,
  lr.residence_type,
  lr.evidence,
  l.name,
  l.latitude,
  l.longitude,
  l.parent_location_id,
  pl.name as parent_name
FROM location_residents lr
JOIN locations l ON lr.location_id = l.id
LEFT JOIN locations pl ON l.parent_location_id = pl.id
WHERE lr.person_id = $person_id
ORDER BY lr.date_first ASC;
```

### Visualization Component

**Option A: Simple Timeline with Map**

Two-panel display:
- Left: Vertical timeline showing locations chronologically
- Right: Map with points for each location, connected by lines

**Option B: Animated Map**

Single map that can "play" through time, highlighting current location.

**Recommendation:** Start with Option A - simpler, still effective, easier to debug.

### Implementation (React + Leaflet)

```jsx
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

function MigrationMap({ personId }) {
  const [locations, setLocations] = useState([]);
  
  useEffect(() => {
    // Fetch location_residents for this person
    fetchPersonLocations(personId).then(setLocations);
  }, [personId]);
  
  // Filter to only locations with coordinates
  const mappableLocations = locations.filter(l => l.latitude && l.longitude);
  
  // Create path as array of [lat, lng] pairs in chronological order
  const path = mappableLocations.map(l => [l.latitude, l.longitude]);
  
  return (
    <div className="migration-visualization">
      <div className="timeline-panel">
        {locations.map((loc, i) => (
          <div key={i} className="timeline-entry">
            <span className="date">{loc.date_first}{loc.date_last ? ` - ${loc.date_last}` : ''}</span>
            <span className="location">{loc.name}</span>
            <span className="type">{loc.residence_type}</span>
          </div>
        ))}
      </div>
      
      <MapContainer center={[37.5, -79]} zoom={7} className="map-panel">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Draw migration path */}
        <Polyline positions={path} color="blue" weight={2} dashArray="5,10" />
        
        {/* Plot each location */}
        {mappableLocations.map((loc, i) => (
          <Marker key={i} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <strong>{loc.name}</strong><br />
              {loc.date_first} - {loc.date_last || 'present'}<br />
              {loc.residence_type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
```

### Display Rules

- Only show locations that have coordinates (skip ungeocoded)
- Show verification_status indicator (checkmark for confirmed, ? for possible)
- If no geocoded locations exist, show message: "Locations not yet mapped"
- Path lines should be dashed (not solid) to indicate these are inferred travel routes, not actual paths

---

## 3. Network Graphs

### Purpose

Visualize relationships between people:
- Family connections (parent, child, spouse, sibling)
- Witness/legal connections (witnessed deed, posted bond, security for estate)
- Neighbor networks (people at same location/time)

### Data Sources

**Family relationships:**
```sql
SELECT 
  p1.id as person1_id,
  p1.given_name || ' ' || p1.surname as person1_name,
  r.relationship_type,
  p2.id as person2_id,
  p2.given_name || ' ' || p2.surname as person2_name
FROM relationships r
JOIN people p1 ON r.person1_id = p1.id
JOIN people p2 ON r.person2_id = p2.id
WHERE r.person1_id = $person_id OR r.person2_id = $person_id;
```

**Document connections:**
```sql
SELECT 
  dp1.person_id as person1_id,
  dp1.role as person1_role,
  dp2.person_id as person2_id,
  dp2.role as person2_role,
  d.title as document_title,
  d.date as document_date
FROM document_people dp1
JOIN document_people dp2 ON dp1.document_id = dp2.document_id AND dp1.person_id != dp2.person_id
JOIN documents d ON dp1.document_id = d.id
WHERE dp1.person_id = $person_id;
```

**Location neighbors:**
```sql
SELECT DISTINCT
  lr2.person_id,
  p.given_name || ' ' || p.surname as name,
  l.name as location_name,
  lr1.date_first,
  lr1.date_last
FROM location_residents lr1
JOIN location_residents lr2 ON lr1.location_id = lr2.location_id 
  AND lr1.person_id != lr2.person_id
  AND (lr1.date_first <= lr2.date_last OR lr2.date_last IS NULL)
  AND (lr2.date_first <= lr1.date_last OR lr1.date_last IS NULL)
JOIN people p ON lr2.person_id = p.id
JOIN locations l ON lr1.location_id = l.id
WHERE lr1.person_id = $person_id;
```

### Implementation (D3.js Force Graph)

```jsx
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

function NetworkGraph({ personId, graphType = 'family' }) {
  const svgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  
  useEffect(() => {
    // Fetch appropriate data based on graphType
    if (graphType === 'family') {
      fetchFamilyNetwork(personId).then(setGraphData);
    } else if (graphType === 'witnesses') {
      fetchWitnessNetwork(personId).then(setGraphData);
    } else if (graphType === 'neighbors') {
      fetchNeighborNetwork(personId).then(setGraphData);
    }
  }, [personId, graphType]);
  
  useEffect(() => {
    if (!graphData.nodes.length) return;
    
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    
    // Clear previous
    svg.selectAll('*').remove();
    
    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter().append('line')
      .attr('stroke', d => linkColor(d.type))
      .attr('stroke-width', 2);
    
    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .enter().append('circle')
      .attr('r', d => d.id === personId ? 12 : 8)
      .attr('fill', d => d.id === personId ? '#e74c3c' : '#3498db')
      .call(drag(simulation));
    
    // Labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .enter().append('text')
      .text(d => d.name)
      .attr('font-size', 10);
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labels
        .attr('x', d => d.x + 10)
        .attr('y', d => d.y + 3);
    });
  }, [graphData]);
  
  return (
    <div className="network-graph">
      <div className="graph-controls">
        <button onClick={() => setGraphType('family')}>Family</button>
        <button onClick={() => setGraphType('witnesses')}>Witnesses</button>
        <button onClick={() => setGraphType('neighbors')}>Neighbors</button>
      </div>
      <svg ref={svgRef} width={600} height={400} />
      <div className="legend">
        {/* Color legend for relationship types */}
      </div>
    </div>
  );
}

function linkColor(type) {
  const colors = {
    spouse: '#e74c3c',
    parent: '#2ecc71',
    child: '#2ecc71',
    sibling: '#9b59b6',
    witness: '#f39c12',
    security: '#f39c12',
    neighbor: '#95a5a6',
    associated: '#bdc3c7'
  };
  return colors[type] || '#bdc3c7';
}
```

### Graph Types

**Family Network:**
- Central person highlighted
- Immediate family (parents, spouse, children, siblings) in inner ring
- Extended family (grandparents, aunts/uncles, cousins) in outer ring
- Edge colors indicate relationship type

**Witness/Legal Network:**
- Central person highlighted
- Connected to everyone who appeared in same documents
- Edge labels show document type (deed, will, estate, etc.)
- Useful for identifying associates and potential relatives

**Neighbor Network:**
- Central person highlighted
- Connected to everyone at same locations during overlapping time periods
- Edge labels show location name and years
- Helps identify migration groups

### Placement in UI

**Person Page:**
- Add "Relationships" section with tabbed graph view
- Tabs: Family | Document Connections | Neighbors
- Graph renders dynamically on tab selection

**Standalone Network Explorer (optional future):**
- Full-page network visualization
- Search for any person, see their full network
- Filter by relationship type, time period, location

---

## 4. Locations Section Updates

### Current State
Locations section exists but lacks map view.

### Add Map View

```jsx
function LocationsMapView() {
  const [locations, setLocations] = useState([]);
  
  useEffect(() => {
    // Fetch all locations with coordinates
    supabase
      .from('locations')
      .select('*')
      .not('latitude', 'is', null)
      .then(({ data }) => setLocations(data));
  }, []);
  
  return (
    <MapContainer center={[37.5, -79]} zoom={6}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {locations.map(loc => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
          <Popup>
            <Link to={`/locations/${loc.id}`}>
              <strong>{loc.name}</strong>
            </Link>
            <br />
            {loc.location_type} • {loc.parent_name}
            <br />
            <small>{loc.verification_status}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

### Location Detail Page

Each location page should show:
- Name (and modern name if different)
- Coordinates with verification status
- Map centered on this location
- Parent location (county/state)
- **Residents list**: All people linked via location_residents, with dates
- **Documents list**: All documents linked via document_locations
- Verification notes

---

## 5. Implementation Priority

### Phase 1: Database + Geocoding
1. Add new fields to locations table
2. Implement GNIS lookup function
3. Run batch geocoding on existing locations
4. Add manual coordinate entry to location edit UI

### Phase 2: Location Map View
1. Add map view toggle to Locations section
2. Implement LocationsMapView component
3. Update Location detail page with centered map

### Phase 3: Migration Visualization
1. Create MigrationMap component
2. Add to Person page (new section or tab)
3. Handle edge cases (no coordinates, single location, etc.)

### Phase 4: Network Graphs
1. Implement data fetching functions for each graph type
2. Create NetworkGraph component with D3
3. Add to Person page as tabbed view
4. Add legend and interaction (click node to navigate)

---

## 6. Dependencies

**npm packages needed:**
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "d3": "^7.8.5"
}
```

**External APIs:**
- USGS GNIS: https://geonames.usgs.gov/api
- OpenStreetMap tiles (free, no API key)

---

## 7. Data Quality Rules

### Location Verification
- **confirmed**: GNIS match with single clear result, OR manually verified against primary source/historic map
- **probable**: GNIS match with some ambiguity, OR reasonable inference from context
- **possible**: No GNIS match, location inferred from document but not independently verified

### Display Rules
- Always show verification status indicator
- Unverified locations (no coordinates) appear in lists but not on maps
- Allow filtering by verification status

### Ongoing Maintenance
- New locations added during extraction get queued for geocoding
- Batch geocoding can be re-run as new locations accumulate
- Manual review queue for 'possible' status locations
