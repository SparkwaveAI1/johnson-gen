// Supabase Edge Function to extract stated relationships from genealogical documents
// Deploy with: supabase functions deploy extract-relationships

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Relationship patterns to detect
// Each pattern returns: [fullMatch, person1, person2 (optional)]
const RELATIONSHIP_PATTERNS: Array<{
  pattern: RegExp,
  type: string,
  person1Role: string,
  person2Role: string | null,
  extractNames: (match: RegExpMatchArray) => { person1: string, person2: string | null }
}> = [
  // "John JOHNSON son of Robert JOHNSON"
  {
    pattern: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})\s+son\s+of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})/gi,
    type: 'parent_child',
    person1Role: 'child',
    person2Role: 'parent',
    extractNames: (m) => ({ person1: m[1], person2: m[2] })
  },
  // "John JOHNSON daughter of Robert JOHNSON"
  {
    pattern: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})\s+daughter\s+of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})/gi,
    type: 'parent_child',
    person1Role: 'child',
    person2Role: 'parent',
    extractNames: (m) => ({ person1: m[1], person2: m[2] })
  },
  // "son and heir of said John JOHNSON" or "son and heir of John JOHNSON"
  {
    pattern: /son\s+and\s+heir\s+of\s+(?:said\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})/gi,
    type: 'parent_child',
    person1Role: 'child',
    person2Role: 'parent',
    extractNames: (m) => ({ person1: 'HEIR (see context)', person2: m[1] })
  },
  // "my son John" or "my son John JOHNSON"
  {
    pattern: /my\s+son\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'parent_child',
    person1Role: 'parent',
    person2Role: 'child',
    extractNames: (m) => ({ person1: 'TESTATOR (see context)', person2: m[1] })
  },
  // "my daughter Mary" or "my daughter Mary JOHNSON"
  {
    pattern: /my\s+daughter\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'parent_child',
    person1Role: 'parent',
    person2Role: 'child',
    extractNames: (m) => ({ person1: 'TESTATOR (see context)', person2: m[1] })
  },
  // "my grandson John"
  {
    pattern: /my\s+grandson\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'grandparent',
    person1Role: 'grandparent',
    person2Role: 'grandchild',
    extractNames: (m) => ({ person1: 'TESTATOR (see context)', person2: m[1] })
  },
  // "grandson John JOHNSON"
  {
    pattern: /grandson\s+([A-Z][a-z]+\s+[A-Z]{2,})/gi,
    type: 'grandparent',
    person1Role: 'grandparent',
    person2Role: 'grandchild',
    extractNames: (m) => ({ person1: 'CONTEXT (see document)', person2: m[1] })
  },
  // "John JOHNSON married Mary SMITH" or "John JOHNSON married Mary"
  {
    pattern: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})\s+married\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'spouse',
    person1Role: 'spouse',
    person2Role: 'spouse',
    extractNames: (m) => ({ person1: m[1], person2: m[2] })
  },
  // "wife of John JOHNSON"
  {
    pattern: /wife\s+of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})/gi,
    type: 'spouse',
    person1Role: 'spouse',
    person2Role: 'spouse',
    extractNames: (m) => ({ person1: 'WIFE (see context)', person2: m[1] })
  },
  // "his wife Mary" or "his wife, Mary"
  {
    pattern: /his\s+wife,?\s+([A-Z][a-z]+)/gi,
    type: 'spouse',
    person1Role: 'spouse',
    person2Role: 'spouse',
    extractNames: (m) => ({ person1: 'HUSBAND (see context)', person2: m[1] })
  },
  // "her husband John"
  {
    pattern: /her\s+husband,?\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'spouse',
    person1Role: 'spouse',
    person2Role: 'spouse',
    extractNames: (m) => ({ person1: 'WIFE (see context)', person2: m[1] })
  },
  // "brother of John"
  {
    pattern: /brother\s+of\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'sibling',
    person1Role: 'sibling',
    person2Role: 'sibling',
    extractNames: (m) => ({ person1: 'SIBLING (see context)', person2: m[1] })
  },
  // "sister of John"
  {
    pattern: /sister\s+of\s+([A-Z][a-z]+(?:\s+[A-Z]{2,})?)/gi,
    type: 'sibling',
    person1Role: 'sibling',
    person2Role: 'sibling',
    extractNames: (m) => ({ person1: 'SIBLING (see context)', person2: m[1] })
  },
  // "2a. Ann JOHNSON" or "2b. John JOHNSON" (numbered children in genealogy format)
  {
    pattern: /\d+[a-z]\.\s+([A-Z][a-z]+\s+[A-Z]{2,})\s+was\s+born/gi,
    type: 'parent_child',
    person1Role: 'child',
    person2Role: 'parent',
    extractNames: (m) => ({ person1: m[1], person2: 'PARENT (see numbered entry above)' })
  },
  // "children: John, Mary, Robert"
  {
    pattern: /children:?\s+([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)*)/gi,
    type: 'parent_child',
    person1Role: 'parent',
    person2Role: 'child',
    extractNames: (m) => ({ person1: 'PARENT (see context)', person2: m[1] })
  }
]

interface ExtractedRelationship {
  person1_name: string
  person2_name: string | null
  relationship_type: string
  person1_role: string
  person2_role: string | null
  source_text: string
  line_number: number
}

function extractRelationships(text: string): ExtractedRelationship[] {
  const relationships: ExtractedRelationship[] = []
  const lines = text.split('\n')
  const seen = new Set<string>()  // Deduplicate

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum]

    for (const patternDef of RELATIONSHIP_PATTERNS) {
      // Reset regex lastIndex for global patterns
      patternDef.pattern.lastIndex = 0

      let match
      while ((match = patternDef.pattern.exec(line)) !== null) {
        const names = patternDef.extractNames(match)

        // Create dedup key
        const key = `${names.person1}|${names.person2}|${patternDef.type}`
        if (seen.has(key)) continue
        seen.add(key)

        // Get context (surrounding text)
        const contextStart = Math.max(0, match.index - 50)
        const contextEnd = Math.min(line.length, match.index + match[0].length + 50)
        const sourceText = line.substring(contextStart, contextEnd)

        relationships.push({
          person1_name: names.person1,
          person2_name: names.person2,
          relationship_type: patternDef.type,
          person1_role: patternDef.person1Role,
          person2_role: patternDef.person2Role,
          source_text: sourceText.trim(),
          line_number: lineNum + 1
        })
      }
    }
  }

  return relationships
}

// Try to resolve placeholder names from context
function resolveContextualNames(
  relationships: ExtractedRelationship[],
  text: string
): ExtractedRelationship[] {

  // Find testator name (for wills)
  const testatorMatch = text.match(/will\s+of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})/i)
    || text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,})\s+(?:being\s+)?(?:sick|weak|aged)/i)
    || text.match(/I,?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z]{2,}),?\s+(?:of|do)/i)

  const testatorName = testatorMatch ? testatorMatch[1] : null

  // Find primary subject (first prominent name with surname in all caps)
  const primaryMatch = text.match(/^[\s\d.]*([A-Z][a-z]+\s+[A-Z]{2,})\s+(?:was\s+born|died|married)/m)
  const primaryName = primaryMatch ? primaryMatch[1] : null

  return relationships.map(rel => {
    let person1 = rel.person1_name
    let person2 = rel.person2_name

    // Replace TESTATOR placeholder
    if (person1.includes('TESTATOR') && testatorName) {
      person1 = testatorName
    }
    if (person2?.includes('TESTATOR') && testatorName) {
      person2 = testatorName
    }

    // Replace CONTEXT/PARENT placeholders with primary subject
    if (person1.includes('CONTEXT') || person1.includes('PARENT')) {
      if (primaryName) person1 = primaryName
    }
    if (person2?.includes('CONTEXT') || person2?.includes('PARENT')) {
      if (primaryName) person2 = primaryName
    }

    return {
      ...rel,
      person1_name: person1,
      person2_name: person2
    }
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentId, rawText } = await req.json()

    if (!documentId || !rawText) {
      return new Response(
        JSON.stringify({ error: 'Missing documentId or rawText' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract relationships using regex patterns
    let relationships = extractRelationships(rawText)

    // Try to resolve contextual placeholders
    relationships = resolveContextualNames(relationships, rawText)

    // Filter out relationships that still have unresolved placeholders
    const resolvedRelationships = relationships.filter(rel =>
      !rel.person1_name.includes('(see') &&
      !rel.person2_name?.includes('(see')
    )

    // Store in database
    let insertedCount = 0
    for (const rel of resolvedRelationships) {
      const { error } = await supabase
        .from('extracted_relationships')
        .insert({
          document_id: documentId,
          person1_name: rel.person1_name,
          person2_name: rel.person2_name,
          relationship_type: rel.relationship_type,
          person1_role: rel.person1_role,
          person2_role: rel.person2_role,
          source_text: rel.source_text,
          line_number: rel.line_number,
          confidence: 'probable'  // Stated relationship = probable
        })

      if (!error) {
        insertedCount++
      } else {
        console.error('Error inserting relationship:', error)
      }
    }

    // Update document with relationship count
    await supabase
      .from('documents')
      .update({ relationship_count: insertedCount })
      .eq('id', documentId)

    return new Response(
      JSON.stringify({
        success: true,
        totalFound: relationships.length,
        resolved: resolvedRelationships.length,
        inserted: insertedCount,
        relationships: resolvedRelationships.map(r => ({
          person1: r.person1_name,
          person2: r.person2_name,
          type: r.relationship_type,
          roles: `${r.person1_role} → ${r.person2_role}`
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
