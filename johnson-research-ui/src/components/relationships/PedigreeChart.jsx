import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { User, Users, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useWorkspace } from '../../contexts/WorkspaceContext'

/**
 * PedigreeChart - Classic ancestor pedigree view
 * Shows person -> parents -> grandparents -> great-grandparents
 */

function PedigreeChart({ rootPersonId, onPersonSelect }) {
  const { workspaceId } = useWorkspace()
  const navigate = useNavigate()
  const svgRef = useRef()
  const containerRef = useRef()
  
  const [loading, setLoading] = useState(true)
  const [rootPerson, setRootPerson] = useState(null)
  const [pedigreeData, setPedigreeData] = useState(null)
  const [generations, setGenerations] = useState(4) // How many generations to show
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 })

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ 
          width: Math.max(600, width), 
          height: Math.max(400, Math.min(800, height || 600))
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Fetch pedigree data
  useEffect(() => {
    if (!rootPersonId || !workspaceId) return
    
    async function fetchPedigree() {
      setLoading(true)
      try {
        // Fetch the root person
        const { data: person, error: personError } = await supabase
          .from('people')
          .select('*')
          .eq('id', rootPersonId)
          .single()
        
        if (personError) throw personError
        setRootPerson(person)

        // Build pedigree tree recursively
        const tree = await buildPedigreeTree(rootPersonId, generations)
        setPedigreeData(tree)
      } catch (err) {
        console.error('Error fetching pedigree:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPedigree()
  }, [rootPersonId, workspaceId, generations])

  // Build pedigree tree recursively
  async function buildPedigreeTree(personId, maxGen, currentGen = 1) {
    if (currentGen > maxGen) return null

    // Fetch person
    const { data: person } = await supabase
      .from('people')
      .select('id, given_name, surname, birth_year, death_year, birthplace_detail')
      .eq('id', personId)
      .single()

    if (!person) return null

    // Fetch parents
    const { data: parentRels } = await supabase
      .from('family_relationships')
      .select(`
        relationship_type,
        related_person:related_person_id (
          id, given_name, surname, birth_year, death_year, birthplace_detail
        )
      `)
      .eq('person_id', personId)
      .eq('workspace_id', workspaceId)
      .in('relationship_type', ['father', 'mother'])

    const father = parentRels?.find(r => r.relationship_type === 'father')?.related_person
    const mother = parentRels?.find(r => r.relationship_type === 'mother')?.related_person

    // Recursively get ancestors
    const fatherTree = father ? await buildPedigreeTree(father.id, maxGen, currentGen + 1) : null
    const motherTree = mother ? await buildPedigreeTree(mother.id, maxGen, currentGen + 1) : null

    return {
      ...person,
      generation: currentGen,
      father: fatherTree,
      mother: motherTree
    }
  }

  // Render the pedigree chart
  useEffect(() => {
    if (!pedigreeData || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Calculate positions for pedigree boxes
    const boxWidth = 160
    const boxHeight = 70
    const genGap = (innerWidth - boxWidth) / (generations)

    // Flatten tree to array with positions
    function flattenTree(node, x, y, level, positions = []) {
      if (!node) return positions

      const yOffset = innerHeight / Math.pow(2, level + 1)
      
      positions.push({
        ...node,
        x,
        y,
        level
      })

      if (node.father) {
        flattenTree(node.father, x + genGap, y - yOffset, level + 1, positions)
      }
      if (node.mother) {
        flattenTree(node.mother, x + genGap, y + yOffset, level + 1, positions)
      }

      return positions
    }

    const nodes = flattenTree(pedigreeData, 0, innerHeight / 2, 0)

    // Draw connecting lines
    nodes.forEach(node => {
      if (node.father) {
        const father = nodes.find(n => n.id === node.father.id)
        if (father) {
          g.append('path')
            .attr('d', `M ${node.x + boxWidth} ${node.y + boxHeight/2} 
                        C ${node.x + boxWidth + genGap/2} ${node.y + boxHeight/2},
                          ${father.x - genGap/2 + boxWidth} ${father.y + boxHeight/2},
                          ${father.x} ${father.y + boxHeight/2}`)
            .attr('fill', 'none')
            .attr('stroke', '#8b5a2b')
            .attr('stroke-width', 2)
            .attr('opacity', 0.6)
        }
      }
      if (node.mother) {
        const mother = nodes.find(n => n.id === node.mother.id)
        if (mother) {
          g.append('path')
            .attr('d', `M ${node.x + boxWidth} ${node.y + boxHeight/2} 
                        C ${node.x + boxWidth + genGap/2} ${node.y + boxHeight/2},
                          ${mother.x - genGap/2 + boxWidth} ${mother.y + boxHeight/2},
                          ${mother.x} ${mother.y + boxHeight/2}`)
            .attr('fill', 'none')
            .attr('stroke', '#8b5a2b')
            .attr('stroke-width', 2)
            .attr('opacity', 0.6)
        }
      }
    })

    // Draw person boxes
    const boxGroups = g.selectAll('.person-box')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'person-box')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        // Navigate to person's profile page
        navigate(`/people/${d.id}`)
      })
      .on('dblclick', (event, d) => {
        // Double-click to set as root person
        if (onPersonSelect) {
          onPersonSelect(d.id)
        }
      })

    // Box background
    boxGroups.append('rect')
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('rx', 6)
      .attr('fill', d => d.level === 0 ? '#f4e4bc' : '#fff')
      .attr('stroke', '#8b5a2b')
      .attr('stroke-width', d => d.level === 0 ? 3 : 1.5)

    // Name
    boxGroups.append('text')
      .attr('x', boxWidth / 2)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#2c1810')
      .text(d => {
        const name = `${d.given_name || ''} ${d.surname || ''}`.trim()
        return name.length > 20 ? name.substring(0, 18) + '...' : name
      })

    // Birth year
    boxGroups.append('text')
      .attr('x', boxWidth / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#5c4a3a')
      .text(d => {
        let dates = ''
        if (d.birth_year) dates += `b. ${d.birth_year}`
        if (d.death_year) dates += ` - d. ${d.death_year}`
        else if (d.birth_year) dates += ' -'
        return dates
      })

    // Birthplace (truncated)
    boxGroups.append('text')
      .attr('x', boxWidth / 2)
      .attr('y', 56)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#8b7355')
      .text(d => {
        const place = d.birthplace_detail || ''
        return place.length > 22 ? place.substring(0, 20) + '...' : place
      })

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

  }, [pedigreeData, dimensions, generations, onPersonSelect])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-faded-ink">Loading pedigree...</div>
      </div>
    )
  }

  if (!pedigreeData) {
    return (
      <div className="flex items-center justify-center h-64 text-faded-ink">
        <p>No pedigree data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-sepia/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sepia/20 bg-aged-paper">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-sepia" />
          <h3 className="font-display font-semibold">
            Pedigree Chart: {rootPerson?.given_name} {rootPerson?.surname}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-faded-ink">Generations:</span>
          <button
            onClick={() => setGenerations(Math.max(2, generations - 1))}
            disabled={generations <= 2}
            className="p-1 rounded hover:bg-parchment disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-medium w-6 text-center">{generations}</span>
          <button
            onClick={() => setGenerations(Math.min(6, generations + 1))}
            disabled={generations >= 6}
            className="p-1 rounded hover:bg-parchment disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="relative" style={{ minHeight: '500px' }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-3 bg-parchment/50 border-t border-sepia/20 text-sm text-faded-ink">
        <span>Click to view profile</span>
        <span>•</span>
        <span>Double-click to set as root</span>
        <span>•</span>
        <span>Scroll to zoom, drag to pan</span>
      </div>
    </div>
  )
}

export default PedigreeChart
