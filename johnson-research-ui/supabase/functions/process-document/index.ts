// Supabase Edge Function to process genealogical documents using Claude API
// Deploy with: supabase functions deploy process-document

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `You are a genealogical research assistant specializing in colonial Virginia and early American history. Your task is to extract structured information from historical documents and research summaries.

When given a document, extract the following information in JSON format:

1. **people**: Array of people mentioned, each with:
   - name (full name as written)
   - given_name (first name)
   - surname (family name)
   - birth_year (if mentioned, use "e" prefix for estimates like "e1729")
   - death_year (if mentioned)
   - role (their role: subject, relative, witness, neighbor, etc.)
   - relationship_to_subject (if applicable: father, mother, spouse, child, sibling, cousin, etc.)
   - bio_facts (array of facts suitable for a biography)

2. **locations**: Array of locations mentioned, each with:
   - name (as written in document)
   - modern_name (if different from historical name)
   - location_type (colony, county, creek, river, region, plantation, fort, etc.)
   - state (Virginia, Tennessee, North Carolina, etc.)
   - context (why this location is mentioned)

3. **events**: Array of key events/dates, each with:
   - date (as specific as possible)
   - event_type (birth, death, marriage, land_purchase, military_service, migration, etc.)
   - description
   - people_involved (names)
   - location (if mentioned)

4. **relationships**: Array of family/social relationships, each with:
   - person1 (name) - the SUBJECT of the relationship
   - person2 (name) - the RELATED person
   - relationship_type - what person2 IS TO person1. Examples:
     * If "Robert is Absalom's father", then person1=Absalom, person2=Robert, relationship_type=father
     * If "Mary is John's spouse", then person1=John, person2=Mary, relationship_type=spouse
     * If "James is William's child", then person1=William, person2=James, relationship_type=child
   - Valid types: father, mother, spouse, sibling, child
   - evidence (quote or reference from document)
   - confidence (confirmed, probable, possible)

   IMPORTANT: relationship_type describes what person2 IS TO person1, not vice versa.

5. **research_questions**: Array of questions or gaps in the data that need further research

6. **bio_summary**: A 2-3 paragraph biographical summary suitable for the subject's bio field

Return ONLY valid JSON. Do not include markdown code blocks or any other text.`

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, personId, personName } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: personId
              ? `Process this document about ${personName || 'a person'} (ID: ${personId}). Extract all relevant genealogical information:\n\n${text}`
              : `Process this genealogical document. Extract all relevant information:\n\n${text}`
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to process document with AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const claudeResponse = await response.json()
    const extractedText = claudeResponse.content[0]?.text || ''

    // Parse the JSON response
    let extracted
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0])
      } else {
        extracted = JSON.parse(extractedText)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', extractedText)
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          raw_response: extractedText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        extracted,
        raw_response: extractedText
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
