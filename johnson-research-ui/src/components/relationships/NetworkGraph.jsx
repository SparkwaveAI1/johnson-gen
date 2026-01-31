import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { Users, FileText, MapPin, Network, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useWorkspace } from '../../contexts/WorkspaceContext'

// Color palette for different relationship types
const relationshipColors = {
  spouse: '#dc2626',     // red
  parent: '#16a34a',     // green
  child: '#16a34a',      // green
  father: '#16a34a',     // green
  mother: '#16a34a',     // green
  sibling: '#8b5cf6',    // purple
  father_in_law: '#f59e0b', // amber
  mother_in_law: '#f59e0b', // amber
  witness: '#3b82f6',    // blue
  security: '#3b82f6',   // blue
  grantor: '#0891b2',    // cyan
  grantee: '#0891b2',    // cyan
  neighbor: '#6b7280',   // gray
  associated: '#9ca3af', // light gray
  default: '#d1d5db',    // lighter gray
}

const getRelationshipColor = (type) => {
  return relationshipColors[type] || relationshipColors.default
}

function NetworkGraph({ personId, personName, relationships = [], associations = [] }) {
  const svgRef = useRef()
  const containerRef = useRef()
  const navigate = useNavigate()

  const [graphType, setGraphType] = useState('family') // 'family', 'documents', 'neighbors'
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [loading, setLoading] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({ width: Math.max(400, width), height: 400 })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Build family network from relationships
  const buildFamilyNetwork = useCallback(() => {
    const nodes = []
    const links = []
    const nodeMap = new Map()

    // Add center person
    nodeMap.set(personId, {
      id: personId,
      name: personName,
      isCenter: true,
    })

    // Add related people from relationships
    relationships.forEach(rel => {
      const relatedPerson = rel.related_person
      if (relatedPerson && !nodeMap.has(relatedPerson.id)) {
        nodeMap.set(relatedPerson.id, {
          id: relatedPerson.id,
          name: `${relatedPerson.given_name || ''} ${relatedPerson.surname || ''}`.trim(),
          isCenter: false,
        })
      }
      if (relatedPerson) {
        links.push({
          source: personId,
          target: relatedPerson.id,
          type: rel.relationship_type,
          status: rel.relationship_status,
        })
      }
    })

    // Add associated people
    associations.forEach(assoc => {
      const assocPerson = assoc.associated_person
      if (assocPerson && !nodeMap.has(assocPerson.id)) {
        nodeMap.set(assocPerson.id, {
          id: assocPerson.id,
          name: `${assocPerson.given_name || ''} ${assocPerson.surname || ''}`.trim(),
          isCenter: false,
        })
      }
      if (assocPerson) {
        links.push({
          source: personId,
          target: assocPerson.id,
          type: 'associated',
          context: assoc.association_type,
        })
      }
    })

    return { nodes: Array.from(nodeMap.values()), links }
  }, [personId, personName, relationships, associations])

  // Fetch document connections
  const fetchDocumentNetwork = useCallback(async () => {
    setLoading(true)

    const { data: docPeople } = await supabase
      .from('document_people')
      .select(`
        document_id,
        role,
        document:documents(id, title, document_type)
      `)
      .eq('person_id', personId)

    const nodes = []
    const links = []
    const nodeMap = new Map()

    // Add center person
    nodeMap.set(personId, {
      id: personId,
      name: personName,
      isCenter: true,
    })

    if (docPeople) {
      // For each document, get other people in that document
      for (const dp of docPeople) {
        if (!dp.document_id) continue

        const { data: otherPeople } = await supabase
          .from('document_people')
          .select(`
            person_id,
            role,
            person:people(id, given_name, surname)
          `)
          .eq('document_id', dp.document_id)
          .neq('person_id', personId)

        if (otherPeople) {
          otherPeople.forEach(op => {
            if (op.person && !nodeMap.has(op.person.id)) {
              nodeMap.set(op.person.id, {
                id: op.person.id,
                name: `${op.person.given_name || ''} ${op.person.surname || ''}`.trim(),
                isCenter: false,
              })
            }
            if (op.person) {
              links.push({
                source: personId,
                target: op.person.id,
                type: op.role || 'document',
                document: dp.document?.title,
              })
            }
          })
        }
      }
    }

    setLoading(false)
    return { nodes: Array.from(nodeMap.values()), links }
  }, [personId, personName])

  // Fetch neighbor network
  const fetchNeighborNetwork = useCallback(async () => {
    setLoading(true)

    const { data: residencies } = await supabase
      .from('location_residents')
      .select(`
        location_id,
        date_first,
        date_last,
        location:locations(id, name)
      `)
      .eq('person_id', personId)

    const nodes = []
    const links = []
    const nodeMap = new Map()

    // Add center person
    nodeMap.set(personId, {
      id: personId,
      name: personName,
      isCenter: true,
    })

    if (residencies) {
      for (const res of residencies) {
        if (!res.location_id) continue

        // Find other people at the same location with overlapping dates
        const { data: neighbors } = await supabase
          .from('location_residents')
          .select(`
            person_id,
            date_first,
            date_last,
            person:people(id, given_name, surname)
          `)
          .eq('location_id', res.location_id)
          .neq('person_id', personId)

        if (neighbors) {
          neighbors.forEach(n => {
            // Simple overlap check (could be more sophisticated)
            const overlaps = !res.date_first || !n.date_first ||
              (res.date_first <= (n.date_last || '9999') && (res.date_last || '9999') >= n.date_first)

            if (n.person && overlaps && !nodeMap.has(n.person.id)) {
              nodeMap.set(n.person.id, {
                id: n.person.id,
                name: `${n.person.given_name || ''} ${n.person.surname || ''}`.trim(),
                isCenter: false,
              })
            }
            if (n.person && overlaps) {
              // Check if link already exists
              const existingLink = links.find(l =>
                l.source === personId && l.target === n.person.id && l.location === res.location?.name
              )
              if (!existingLink) {
                links.push({
                  source: personId,
                  target: n.person.id,
                  type: 'neighbor',
                  location: res.location?.name,
                })
              }
            }
          })
        }
      }
    }

    setLoading(false)
    return { nodes: Array.from(nodeMap.values()), links }
  }, [personId, personName])

  // Load graph data based on type
  useEffect(() => {
    const loadData = async () => {
      let data
      if (graphType === 'family') {
        data = buildFamilyNetwork()
        setGraphData(data)
      } else if (graphType === 'documents') {
        data = await fetchDocumentNetwork()
        setGraphData(data)
      } else if (graphType === 'neighbors') {
        data = await fetchNeighborNetwork()
        setGraphData(data)
      }
    }
    loadData()
  }, [graphType, buildFamilyNetwork, fetchDocumentNetwork, fetchNeighborNetwork])

  // D3 force simulation
  useEffect(() => {
    if (!graphData.nodes.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const { width, height } = dimensions

    // Clear previous
    svg.selectAll('*').remove()

    // Create container group for zoom
    const g = svg.append('g')

    // Set up zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Draw links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', d => getRelationshipColor(d.type))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )
      .on('click', (event, d) => {
        if (!d.isCenter) {
          navigate(`/people/${d.id}`)
        }
      })

    // Node circles
    node.append('circle')
      .attr('r', d => d.isCenter ? 16 : 12)
      .attr('fill', d => d.isCenter ? '#92400e' : '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Node labels
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', d => d.isCenter ? 30 : 24)
      .attr('text-anchor', 'middle')
      .attr('font-size', d => d.isCenter ? '12px' : '10px')
      .attr('font-weight', d => d.isCenter ? 'bold' : 'normal')
      .attr('fill', '#374151')

    // Link labels (relationship type)
    const linkLabel = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(graphData.links)
      .enter()
      .append('text')
      .text(d => d.type?.replace(/_/g, ' '))
      .attr('font-size', '8px')
      .attr('fill', '#6b7280')
      .attr('text-anchor', 'middle')

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node.attr('transform', d => `translate(${d.x}, ${d.y})`)

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)
    })

    // Store zoom for external controls
    svg.zoom = zoom
    svg.g = g

    return () => simulation.stop()
  }, [graphData, dimensions, navigate])

  // Zoom controls
  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(svg.zoom.scaleBy, 1.3)
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(svg.zoom.scaleBy, 0.7)
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(svg.zoom.transform, d3.zoomIdentity)
  }

  if (graphData.nodes.length <= 1 && !loading) {
    return (
      <div className="bg-parchment/50 rounded-lg p-6 text-center">
        <Network size={32} className="mx-auto mb-3 text-faded-ink opacity-50" />
        <p className="text-faded-ink">No {graphType} connections to visualize</p>
        <p className="text-sm text-faded-ink mt-1">
          Add relationships or associations to see the network
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Graph Type Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-parchment rounded-lg p-1">
          <button
            onClick={() => setGraphType('family')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors ${
              graphType === 'family'
                ? 'bg-white text-sepia shadow-sm'
                : 'text-faded-ink hover:text-ink'
            }`}
          >
            <Users size={14} />
            Family
          </button>
          <button
            onClick={() => setGraphType('documents')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors ${
              graphType === 'documents'
                ? 'bg-white text-sepia shadow-sm'
                : 'text-faded-ink hover:text-ink'
            }`}
          >
            <FileText size={14} />
            Documents
          </button>
          <button
            onClick={() => setGraphType('neighbors')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors ${
              graphType === 'neighbors'
                ? 'bg-white text-sepia shadow-sm'
                : 'text-faded-ink hover:text-ink'
            }`}
          >
            <MapPin size={14} />
            Neighbors
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-parchment text-faded-ink hover:text-ink"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-parchment text-faded-ink hover:text-ink"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-parchment text-faded-ink hover:text-ink"
            title="Reset view"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="relative rounded-lg border border-sepia/20 bg-white overflow-hidden"
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <p className="text-faded-ink">Loading network...</p>
          </div>
        )}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-faded-ink px-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-700" /> Center person
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500" /> Connected person
        </span>
        <span className="font-medium ml-2">Relationship types:</span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5" style={{ backgroundColor: relationshipColors.spouse }} /> Spouse
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5" style={{ backgroundColor: relationshipColors.parent }} /> Parent/Child
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5" style={{ backgroundColor: relationshipColors.sibling }} /> Sibling
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5" style={{ backgroundColor: relationshipColors.witness }} /> Document
        </span>
      </div>

      {/* Stats */}
      <div className="text-xs text-faded-ink">
        {graphData.nodes.length} people • {graphData.links.length} connections
      </div>
    </div>
  )
}

export default NetworkGraph
