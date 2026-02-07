import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Context
import { WorkspaceProvider } from './contexts/WorkspaceContext'

// Layout
import Layout from './components/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import PeopleBrowser from './pages/PeopleBrowser'
import PersonDetail from './pages/PersonDetail'
import DocumentBrowser from './pages/DocumentBrowser'
import DocumentDetail from './pages/DocumentDetail'
import SourceBrowser from './pages/SourceBrowser'
import SourceDetail from './pages/SourceDetail'
import LocationBrowser from './pages/LocationBrowser'
import LocationDetail from './pages/LocationDetail'
import FamilyGroupBrowser from './pages/FamilyGroupBrowser'
import FamilyGroupDetail from './pages/FamilyGroupDetail'
import ChapterBuilder from './pages/ChapterBuilder'
import ChapterDetail from './pages/ChapterDetail'
import IdentityQueue from './pages/IdentityQueue'
import Compare from './pages/Compare'
import ResearchQuestions from './pages/ResearchQuestions'
import GapAnalysis from './pages/GapAnalysis'
import DocumentProcessing from './pages/DocumentProcessing'
import ExtractionReview from './pages/ExtractionReview'
import PedigreeView from './pages/PedigreeView'
import DnaMatchesPage from './pages/DnaMatches'
import DnaMatchFormPage from './pages/DnaMatchForm'
import DnaSegmentsPage from './pages/DnaSegments'
import DnaSurnamesPage from './pages/DnaSurnames'

function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="people" element={<PeopleBrowser />} />
          <Route path="people/:id" element={<PersonDetail />} />
          <Route path="pedigree" element={<PedigreeView />} />
          <Route path="documents" element={<DocumentBrowser />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="sources" element={<SourceBrowser />} />
          <Route path="sources/:id" element={<SourceDetail />} />
          <Route path="locations" element={<LocationBrowser />} />
          <Route path="locations/:slug" element={<LocationDetail />} />
          <Route path="families" element={<FamilyGroupBrowser />} />
          <Route path="families/:slug" element={<FamilyGroupDetail />} />
          <Route path="chapters" element={<ChapterBuilder />} />
          <Route path="chapters/:slug" element={<ChapterDetail />} />
          <Route path="identity" element={<IdentityQueue />} />
          <Route path="compare/:id1/:id2" element={<Compare />} />
          <Route path="research" element={<ResearchQuestions />} />
          <Route path="gaps" element={<GapAnalysis />} />
          <Route path="processing" element={<DocumentProcessing />} />
          <Route path="documents/:id/review" element={<ExtractionReview />} />
          <Route path="dna/matches" element={<DnaMatchesPage />} />
          <Route path="dna/matches/new" element={<DnaMatchFormPage />} />
          <Route path="dna/matches/:id" element={<DnaMatchFormPage />} />
          <Route path="dna/segments" element={<DnaSegmentsPage />} />
          <Route path="dna/surnames" element={<DnaSurnamesPage />} />
        </Route>
      </Routes>
      </WorkspaceProvider>
    </BrowserRouter>
  )
}

export default App
