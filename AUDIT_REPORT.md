# Johnson-Gen Codebase Audit Report
**Date:** 2026-01-31
**Auditor:** Rico

## Executive Summary

The codebase is well-structured with good component organization, but has several issues that need addressing before production deployment. The most critical issues are **incomplete workspace filtering** and **missing Row Level Security (RLS)**.

---

## 🔴 Critical Issues

### 1. Incomplete Workspace Filtering
**Severity: HIGH** | **Impact: Data leakage between workspaces**

Most pages and components don't filter by workspace, meaning users could see data from other workspaces.

**Affected Files (29 total):**
- `pages/ChapterDetail.jsx`
- `pages/DocumentBrowser.jsx`
- `pages/DocumentDetail.jsx`
- `pages/DocumentProcessing.jsx`
- `pages/ExtractionReview.jsx`
- `pages/FamilyGroupDetail.jsx`
- `pages/GapAnalysis.jsx`
- `pages/IdentityQueue.jsx`
- `pages/LocationDetail.jsx`
- `pages/PersonDetail.jsx`
- `pages/ResearchQuestions.jsx`
- `pages/SourceBrowser.jsx`
- `pages/SourceDetail.jsx`
- `components/documents/DocumentForm.jsx`
- `components/documents/DocumentLinkForm.jsx`
- `components/documents/DocumentProcessor.jsx`
- `components/evidence/EvidenceForm.jsx`
- `components/locations/LocationMapControls.jsx`
- `components/locations/LocationResidentForm.jsx`
- `components/narrative/BioEditor.jsx`
- `components/people/MergeProfilesModal.jsx`
- `components/people/PersonForm.jsx`
- `components/people/PersonSelector.jsx`
- `components/people/VitalFactsEditor.jsx`
- `components/relationships/AssociationForm.jsx`
- `components/relationships/NetworkGraph.jsx`
- `components/relationships/RelationshipForm.jsx`
- `components/sources/SourceForm.jsx`
- `components/sources/SourceSelector.jsx`

**Fix:** Add `useWorkspace()` hook and filter all queries by `workspace_id`.

### 2. Missing Row Level Security (RLS)
**Severity: HIGH** | **Impact: Security vulnerability**

Most tables have RLS disabled (`rowsecurity = f`). Only 5 of 26 tables have RLS enabled.

**Tables without RLS:**
- `people`, `family_relationships`, `documents`, `sources` (core tables)
- `associations`, `migrations`, `locations`, `evidence`
- `workspaces` itself!

**Fix:** Enable RLS on all tables and create policies that filter by workspace_id.

### 3. Tables Missing workspace_id Column
**Severity: HIGH** | **Impact: Cannot filter by workspace**

These tables need `workspace_id` added:
- `associations`
- `attachments`
- `book_chapters`
- `chapter_contents`
- `document_locations`
- `document_people`
- `evidence`
- `extracted_relationships`
- `family_groups`
- `family_group_members`
- `identity_candidates`
- `location_residents`
- `locations`
- `migrations`
- `military_service`
- `research_notes`
- `research_questions`

---

## 🟠 Important Issues

### 4. Missing Error Handling
**Severity: MEDIUM** | **Impact: Poor UX, debugging difficulty**

Files without proper error handling:
- `pages/Compare.jsx`
- `pages/FamilyGroupBrowser.jsx`
- `pages/LocationBrowser.jsx`

**Fix:** Add try/catch blocks and error state display.

### 5. Missing Loading States
**Severity: MEDIUM** | **Impact: Poor UX**

Files without loading indicators:
- `pages/Compare.jsx`
- `pages/FamilyGroupBrowser.jsx`
- `pages/LocationBrowser.jsx`

**Fix:** Add loading state and skeleton/spinner UI.

### 6. Large Bundle Size
**Severity: MEDIUM** | **Impact: Slow initial load**

```
dist/assets/index-BlQNTYgv.js   973.45 kB (gzip: 261.77 kB)
```

**Fix:** 
- Use dynamic imports for heavy components (D3 charts, maps)
- Code-split by route
- Tree-shake unused D3 modules

### 7. Large Components Need Refactoring
**Severity: MEDIUM** | **Impact: Maintainability**

Files over 500 lines:
- `PersonDetail.jsx` (1204 lines)
- `DocumentProcessor.jsx` (967 lines)
- `PersonForm.jsx` (607 lines)
- `DocumentForm.jsx` (592 lines)
- `NetworkGraph.jsx` (533 lines)

**Fix:** Break into smaller, focused components.

---

## 🟡 Minor Issues / Improvements

### 8. Incomplete TODO Items
- `ExtractionReview.jsx:118` - "TODO: Implement person search modal"

### 9. Missing Input Validation
Forms lack client-side validation before submission.

### 10. No Optimistic Updates
All mutations wait for server response before updating UI.

### 11. No Caching Strategy
Every page load refetches data; no React Query or SWR.

### 12. Hardcoded External URLs
Map tiles and geocoding APIs are hardcoded. Consider moving to config.

---

## 📋 Recommended Action Plan

### Phase 1: Critical Security (Do First)
1. Add `workspace_id` to all remaining tables
2. Enable RLS on all tables
3. Create workspace-based RLS policies
4. Update all components to filter by workspace

### Phase 2: Stability
1. Add error boundaries
2. Add proper error handling to all data fetches
3. Add loading states everywhere
4. Add form validation

### Phase 3: Performance
1. Implement code splitting
2. Add React Query for caching
3. Lazy load heavy components (maps, charts)
4. Optimize bundle size

### Phase 4: Maintainability
1. Refactor large components
2. Add TypeScript (optional but recommended)
3. Add unit tests for critical paths
4. Document component APIs

---

## Database Schema Improvements

```sql
-- Add workspace_id to remaining tables
ALTER TABLE locations ADD COLUMN workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE migrations ADD COLUMN workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE military_service ADD COLUMN workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE associations ADD COLUMN workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE evidence ADD COLUMN workspace_id UUID REFERENCES workspaces(id);
-- ... etc for all tables

-- Enable RLS
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Create policies (example)
CREATE POLICY workspace_isolation ON people
  USING (workspace_id = current_setting('app.current_workspace')::uuid);
```

---

## Summary

| Category | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🟠 Important | 4 |
| 🟡 Minor | 5 |

**Estimated effort to address all issues:** 2-3 days of focused work

The app has a solid foundation and good component architecture. The main concerns are around multi-tenancy security (workspace isolation) which needs to be completed before sharing this with other users.
