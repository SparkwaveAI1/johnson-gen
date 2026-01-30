// Event types and their display labels
export const EVENT_TYPES = {
  // Land
  land_patent: { label: 'Land Patent', category: 'Land', icon: 'file-text' },
  land_deed: { label: 'Land Deed', category: 'Land', icon: 'file-text' },
  land_survey: { label: 'Land Survey', category: 'Land', icon: 'map' },

  // Estate/Legal
  will: { label: 'Will', category: 'Legal', icon: 'scroll' },
  estate_admin: { label: 'Estate Administration', category: 'Legal', icon: 'briefcase' },
  court_case: { label: 'Court Case', category: 'Legal', icon: 'gavel' },
  court_order: { label: 'Court Order', category: 'Legal', icon: 'file-text' },
  petition: { label: 'Petition', category: 'Legal', icon: 'file-signature' },
  bond: { label: 'Bond', category: 'Legal', icon: 'link' },

  // Lists
  tax_list: { label: 'Tax List', category: 'Lists', icon: 'list' },
  militia_list: { label: 'Militia List', category: 'Military', icon: 'shield' },
  census: { label: 'Census', category: 'Lists', icon: 'users' },
  list_other: { label: 'Other List', category: 'Lists', icon: 'list' },

  // Church
  church_membership: { label: 'Church Membership', category: 'Church', icon: 'church' },
  baptism: { label: 'Baptism', category: 'Church', icon: 'droplet' },
  church_marriage: { label: 'Church Marriage', category: 'Church', icon: 'heart' },
  church_burial: { label: 'Church Burial', category: 'Church', icon: 'cross' },

  // Vital
  vital_birth: { label: 'Birth Record', category: 'Vital', icon: 'baby' },
  vital_death: { label: 'Death Record', category: 'Vital', icon: 'tombstone' },
  vital_marriage: { label: 'Marriage Record', category: 'Vital', icon: 'rings' },

  // Military
  pension: { label: 'Pension', category: 'Military', icon: 'medal' },
  military_service: { label: 'Military Service', category: 'Military', icon: 'sword' },

  // Other
  narrative: { label: 'Narrative', category: 'Other', icon: 'book-open' },
  other: { label: 'Other', category: 'Other', icon: 'file' }
}

// Participant roles and their display labels
export const PARTICIPANT_ROLES = {
  // Land/Legal
  grantor: { label: 'Grantor', category: 'Land' },
  grantee: { label: 'Grantee', category: 'Land' },
  witness: { label: 'Witness', category: 'Legal' },
  chain_carrier: { label: 'Chain Carrier', category: 'Land' },
  surveyor: { label: 'Surveyor', category: 'Land' },
  security: { label: 'Security', category: 'Legal' },
  appraiser: { label: 'Appraiser', category: 'Legal' },
  administrator: { label: 'Administrator', category: 'Legal' },
  executor: { label: 'Executor', category: 'Legal' },
  testator: { label: 'Testator', category: 'Legal' },
  heir: { label: 'Heir', category: 'Legal' },
  petitioner: { label: 'Petitioner', category: 'Legal' },
  plaintiff: { label: 'Plaintiff', category: 'Legal' },
  defendant: { label: 'Defendant', category: 'Legal' },
  juror: { label: 'Juror', category: 'Legal' },
  bondsman: { label: 'Bondsman', category: 'Legal' },
  guardian: { label: 'Guardian', category: 'Legal' },

  // Tax/Census
  head_of_household: { label: 'Head of Household', category: 'Census' },
  household_member: { label: 'Household Member', category: 'Census' },
  taxpayer: { label: 'Taxpayer', category: 'Tax' },
  list_member: { label: 'List Member', category: 'List' },

  // Military
  soldier: { label: 'Soldier', category: 'Military' },
  officer: { label: 'Officer', category: 'Military' },
  pensioner: { label: 'Pensioner', category: 'Military' },
  militia_member: { label: 'Militia Member', category: 'Military' },

  // Church
  member: { label: 'Member', category: 'Church' },
  minister: { label: 'Minister', category: 'Church' },
  baptized: { label: 'Baptized', category: 'Church' },
  spouse_1: { label: 'Spouse', category: 'Church' },
  spouse_2: { label: 'Spouse', category: 'Church' },
  deceased: { label: 'Deceased', category: 'Church' },
  sponsor: { label: 'Sponsor', category: 'Church' },
  parent: { label: 'Parent', category: 'Church' },

  // Narrative
  subject: { label: 'Subject', category: 'Narrative' },
  mentioned: { label: 'Mentioned', category: 'Narrative' },
  author: { label: 'Author', category: 'Narrative' },
  informant: { label: 'Informant', category: 'Narrative' },

  // Generic
  participant: { label: 'Participant', category: 'Other' },
  other: { label: 'Other', category: 'Other' }
}

// Identification status display
export const IDENTIFICATION_STATUS = {
  confirmed: { label: 'Confirmed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  probable: { label: 'Probable', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  possible: { label: 'Possible', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  unidentified: { label: 'Unidentified', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  rejected: { label: 'Rejected', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
}

// Confidence level display
export const CONFIDENCE_LEVELS = {
  confirmed: { label: 'Confirmed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  probable: { label: 'Probable', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  possible: { label: 'Possible', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' }
}

// Processing status display
export const PROCESSING_STATUS = {
  uploaded: { label: 'Uploaded', color: 'gray', description: 'File received, not yet processed' },
  analyzing: { label: 'Analyzing', color: 'blue', description: 'Analyzing document structure' },
  extracting: { label: 'Extracting', color: 'blue', description: 'Extracting events' },
  matching: { label: 'Matching', color: 'blue', description: 'Matching participants to profiles' },
  review: { label: 'Ready for Review', color: 'yellow', description: 'Processing complete, awaiting review' },
  complete: { label: 'Complete', color: 'green', description: 'Fully processed and reviewed' },
  error: { label: 'Error', color: 'red', description: 'Processing failed' }
}

// Helper functions
export function getEventTypeLabel(type) {
  return EVENT_TYPES[type]?.label || type
}

export function getEventTypeCategory(type) {
  return EVENT_TYPES[type]?.category || 'Other'
}

export function getRoleLabel(role) {
  return PARTICIPANT_ROLES[role]?.label || role
}

export function getStatusDisplay(status) {
  return IDENTIFICATION_STATUS[status] || IDENTIFICATION_STATUS.unidentified
}

export function getConfidenceDisplay(confidence) {
  return CONFIDENCE_LEVELS[confidence] || CONFIDENCE_LEVELS.possible
}

export function getProcessingStatusDisplay(status) {
  return PROCESSING_STATUS[status] || PROCESSING_STATUS.uploaded
}

// Format event date for display
export function formatEventDate(event) {
  if (event.event_date) {
    return new Date(event.event_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  if (event.event_year) {
    return event.event_year.toString()
  }
  return event.event_date_text || 'Unknown date'
}
