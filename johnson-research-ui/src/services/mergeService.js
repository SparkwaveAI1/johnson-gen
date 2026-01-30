/**
 * Profile Merge Service
 *
 * Merges two person profiles, transferring all related data from
 * the secondary profile to the primary profile, then deletes the secondary.
 */

import { supabase } from '../lib/supabase'

/**
 * Merge two person profiles
 * @param {string} primaryId - The profile ID to keep
 * @param {string} secondaryId - The profile ID to merge and delete
 * @param {object} options - Merge options
 * @param {boolean} options.mergeBio - Whether to append secondary's bio to primary
 * @param {boolean} options.mergeNotes - Whether to append secondary's notes
 * @returns {Promise<{success: boolean, error?: string, stats?: object}>}
 */
export async function mergeProfiles(primaryId, secondaryId, options = {}) {
  const { mergeBio = true, mergeNotes = true } = options

  if (!primaryId || !secondaryId) {
    return { success: false, error: 'Both primary and secondary profile IDs are required' }
  }

  if (primaryId === secondaryId) {
    return { success: false, error: 'Cannot merge a profile with itself' }
  }

  const stats = {
    relationshipsTransferred: 0,
    locationsTransferred: 0,
    eventsTransferred: 0,
    associationsTransferred: 0,
    documentsTransferred: 0,
    notesTransferred: 0
  }

  try {
    // 1. Get both profiles
    const { data: primary, error: primaryError } = await supabase
      .from('people')
      .select('*')
      .eq('id', primaryId)
      .single()

    if (primaryError || !primary) {
      return { success: false, error: `Primary profile not found: ${primaryId}` }
    }

    const { data: secondary, error: secondaryError } = await supabase
      .from('people')
      .select('*')
      .eq('id', secondaryId)
      .single()

    if (secondaryError || !secondary) {
      return { success: false, error: `Secondary profile not found: ${secondaryId}` }
    }

    // 2. Transfer family_relationships (both directions)
    // Where secondary is the person_id
    const { data: relAsPersonId } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('person_id', secondaryId)

    if (relAsPersonId?.length > 0) {
      const { error } = await supabase
        .from('family_relationships')
        .update({ person_id: primaryId })
        .eq('person_id', secondaryId)

      if (!error) stats.relationshipsTransferred += relAsPersonId.length
    }

    // Where secondary is the related_person_id
    const { data: relAsRelatedId } = await supabase
      .from('family_relationships')
      .select('id')
      .eq('related_person_id', secondaryId)

    if (relAsRelatedId?.length > 0) {
      const { error } = await supabase
        .from('family_relationships')
        .update({ related_person_id: primaryId })
        .eq('related_person_id', secondaryId)

      if (!error) stats.relationshipsTransferred += relAsRelatedId.length
    }

    // 3. Transfer location_residents
    const { data: locations } = await supabase
      .from('location_residents')
      .select('id')
      .eq('person_id', secondaryId)

    if (locations?.length > 0) {
      const { error } = await supabase
        .from('location_residents')
        .update({ person_id: primaryId })
        .eq('person_id', secondaryId)

      if (!error) stats.locationsTransferred = locations.length
    }

    // 4. Transfer event_participants
    const { data: events } = await supabase
      .from('event_participants')
      .select('id')
      .eq('person_id', secondaryId)

    if (events?.length > 0) {
      const { error } = await supabase
        .from('event_participants')
        .update({ person_id: primaryId })
        .eq('person_id', secondaryId)

      if (!error) stats.eventsTransferred = events.length
    }

    // 5. Transfer associations (both directions)
    const { data: assocAsPerson } = await supabase
      .from('associations')
      .select('id')
      .eq('person_id', secondaryId)

    if (assocAsPerson?.length > 0) {
      const { error } = await supabase
        .from('associations')
        .update({ person_id: primaryId })
        .eq('person_id', secondaryId)

      if (!error) stats.associationsTransferred += assocAsPerson.length
    }

    const { data: assocAsAssociated } = await supabase
      .from('associations')
      .select('id')
      .eq('associated_person_id', secondaryId)

    if (assocAsAssociated?.length > 0) {
      const { error } = await supabase
        .from('associations')
        .update({ associated_person_id: primaryId })
        .eq('associated_person_id', secondaryId)

      if (!error) stats.associationsTransferred += assocAsAssociated.length
    }

    // 6. Transfer document_people
    const { data: docs } = await supabase
      .from('document_people')
      .select('id')
      .eq('person_id', secondaryId)

    if (docs?.length > 0) {
      const { error } = await supabase
        .from('document_people')
        .update({ person_id: primaryId })
        .eq('person_id', secondaryId)

      if (!error) stats.documentsTransferred = docs.length
    }

    // 7. Transfer research_notes
    const { data: notes } = await supabase
      .from('research_notes')
      .select('id')
      .eq('person_id', secondaryId)

    if (notes?.length > 0) {
      const { error } = await supabase
        .from('research_notes')
        .update({ person_id: primaryId })
        .eq('person_id', secondaryId)

      if (!error) stats.notesTransferred = notes.length
    }

    // 8. Transfer research_questions
    await supabase
      .from('research_questions')
      .update({ person_id: primaryId })
      .eq('person_id', secondaryId)

    // 9. Merge biographical data if requested
    if (mergeBio && secondary.bio) {
      const newBio = primary.bio
        ? `${primary.bio}\n\n[Merged from ${secondaryId}]\n${secondary.bio}`
        : secondary.bio

      await supabase
        .from('people')
        .update({ bio: newBio })
        .eq('id', primaryId)
    }

    // 10. Add merge note to primary profile
    const mergeNote = `Merged with profile ${secondaryId} (${secondary.given_name} ${secondary.surname}) on ${new Date().toISOString().split('T')[0]}`
    const existingNotes = primary.notes || ''
    const newNotes = existingNotes
      ? `${existingNotes}\n${mergeNote}`
      : mergeNote

    await supabase
      .from('people')
      .update({ notes: newNotes })
      .eq('id', primaryId)

    // 11. Delete the secondary profile
    const { error: deleteError } = await supabase
      .from('people')
      .delete()
      .eq('id', secondaryId)

    if (deleteError) {
      return {
        success: false,
        error: `Data transferred but failed to delete secondary profile: ${deleteError.message}`,
        stats
      }
    }

    return { success: true, stats }

  } catch (err) {
    console.error('Merge error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Find potential duplicate profiles
 * @param {string} personId - Profile ID to find duplicates for
 * @returns {Promise<Array>} - Array of potential duplicates with match scores
 */
export async function findPotentialDuplicates(personId) {
  const { data: person } = await supabase
    .from('people')
    .select('*')
    .eq('id', personId)
    .single()

  if (!person) return []

  // Find people with similar names
  const { data: candidates } = await supabase
    .from('people')
    .select('id, given_name, surname, birth_year, death_year, confidence, bio')
    .neq('id', personId)
    .or(`surname.ilike.%${person.surname}%,given_name.ilike.%${person.given_name}%`)
    .limit(20)

  if (!candidates) return []

  // Score each candidate
  return candidates.map(candidate => {
    let score = 0
    const reasons = []

    // Exact surname match
    if (candidate.surname?.toLowerCase() === person.surname?.toLowerCase()) {
      score += 30
      reasons.push('Same surname')
    }

    // Exact given name match
    if (candidate.given_name?.toLowerCase() === person.given_name?.toLowerCase()) {
      score += 25
      reasons.push('Same given name')
    }

    // Birth year match
    if (candidate.birth_year && person.birth_year) {
      if (candidate.birth_year === person.birth_year) {
        score += 25
        reasons.push('Same birth year')
      } else if (Math.abs(candidate.birth_year - person.birth_year) <= 2) {
        score += 15
        reasons.push('Similar birth year (±2)')
      }
    }

    // Death year match
    if (candidate.death_year && person.death_year) {
      if (candidate.death_year === person.death_year) {
        score += 15
        reasons.push('Same death year')
      }
    }

    return {
      ...candidate,
      matchScore: score,
      matchReasons: reasons
    }
  })
  .filter(c => c.matchScore >= 30) // Only return reasonable matches
  .sort((a, b) => b.matchScore - a.matchScore)
}
