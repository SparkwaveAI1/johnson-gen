/**
 * Import Script: Research Questions
 *
 * This script imports research questions from a JSON file into the
 * research_questions table.
 *
 * Usage:
 *   node scripts/import-research-questions.js <path-to-json-file>
 *
 * Expected JSON format:
 * {
 *   "research_questions": [
 *     {
 *       "person_id": "JNSN-UNK-e1673-01",
 *       "question": "Were John Johnson and James Johnson sons of Michael Johnson?",
 *       "question_type": "relationship",
 *       "status": "open",
 *       "evidence_for": "...",
 *       "evidence_against": "...",
 *       "research_action": "...",
 *       "source_file": "Va-1607-Arrowhattocks.pdf",
 *       "related_people": ["JNSN-HEN-e1695-01", "JNSN-HEN-e1695-02"]
 *     }
 *   ]
 * }
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://oxpkqnmuwqcnmzvavsuz.supabase.co'
const supabaseKey = 'sb_publishable_pOi2Sct8dyN83NSOYYIGHg_oNrW-PD_'
const supabase = createClient(supabaseUrl, supabaseKey)

// Get the file path from command line args
const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node scripts/import-research-questions.js <path-to-json-file>')
  process.exit(1)
}

// Load the JSON file
let data
try {
  const fileContent = readFileSync(filePath, 'utf8')
  data = JSON.parse(fileContent)
} catch (err) {
  console.error('Error reading file:', err.message)
  process.exit(1)
}

const questions = data.research_questions || []

if (questions.length === 0) {
  console.log('No research questions found in file.')
  process.exit(0)
}

async function importQuestions() {
  console.log('========================================')
  console.log('IMPORTING RESEARCH QUESTIONS')
  console.log('========================================')
  console.log(`File: ${filePath}`)
  console.log(`Questions to import: ${questions.length}`)

  let addedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const q of questions) {
    // Check if question already exists (by person_id + question text)
    const { data: existing } = await supabase
      .from('research_questions')
      .select('id')
      .eq('person_id', q.person_id)
      .eq('question', q.question)
      .single()

    if (existing) {
      console.log(`  - Skipping (already exists): ${q.question.substring(0, 50)}...`)
      skippedCount++
      continue
    }

    // Verify person exists
    const { data: person } = await supabase
      .from('people')
      .select('id')
      .eq('id', q.person_id)
      .single()

    if (!person) {
      console.log(`  - Skipping (person not found): ${q.person_id}`)
      skippedCount++
      continue
    }

    // Insert the question
    const questionData = {
      person_id: q.person_id,
      question: q.question,
      question_type: q.question_type || 'verification',
      status: q.status || 'open',
      evidence_for: q.evidence_for || null,
      evidence_against: q.evidence_against || null,
      research_action: q.research_action || null,
      source_file: q.source_file || null,
      related_people: q.related_people || null
    }

    const { error } = await supabase
      .from('research_questions')
      .insert(questionData)

    if (error) {
      console.error(`  ERROR: ${error.message}`)
      errorCount++
    } else {
      console.log(`  ✓ Added: ${q.question.substring(0, 60)}...`)
      addedCount++
    }
  }

  console.log('\n========================================')
  console.log('IMPORT COMPLETE')
  console.log('========================================')
  console.log(`  Added: ${addedCount}`)
  console.log(`  Skipped: ${skippedCount}`)
  console.log(`  Errors: ${errorCount}`)
}

importQuestions()
