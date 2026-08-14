import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { OverviewPage } from './pages/OverviewPage'
import { IdentityPage, MergeHistoryPage } from './pages/IdentityPage'
import { PatientSearchPage } from './pages/PatientSearchPage'
import { Patient360Page } from './pages/Patient360Page'
import { TimelinePage } from './pages/TimelinePage'
import { InterfacesPage } from './pages/InterfacesPage'
import { MessagesPage } from './pages/MessagesPage'
import { MappingsPage } from './pages/MappingsPage'
import { ClinicalDomainPage } from './pages/ClinicalDomainPage'
import { CopilotPage } from './pages/CopilotPage'
import { DataQualityPage } from './pages/DataQualityPage'
import { ProvenancePage } from './pages/ProvenancePage'
import { IntegrationCatalogPage } from './pages/IntegrationCatalogPage'
import { AuditPage } from './pages/AuditPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SearchPage } from './pages/SearchPage'

export function App() {
  return <Routes>
    <Route element={<Layout/>}>
      <Route path="/" element={<OverviewPage/>}/>
      <Route path="/identity" element={<IdentityPage/>}/>
      <Route path="/duplicates" element={<IdentityPage duplicatesOnly/>}/>
      <Route path="/merge-history" element={<MergeHistoryPage/>}/>
      <Route path="/patients" element={<PatientSearchPage/>}/>
      <Route path="/unified" element={<PatientSearchPage/>}/>
      <Route path="/search" element={<SearchPage/>}/>
      <Route path="/patients/:patientId" element={<Patient360Page/>}/>
      <Route path="/timeline" element={<TimelinePage/>}/>
      <Route path="/interfaces" element={<InterfacesPage/>}/>
      <Route path="/messages" element={<MessagesPage/>}/>
      <Route path="/mappings" element={<MappingsPage/>}/>
      <Route path="/clinical/:domain" element={<ClinicalDomainPage/>}/>
      <Route path="/copilot" element={<CopilotPage/>}/>
      <Route path="/data-quality" element={<DataQualityPage/>}/>
      <Route path="/provenance" element={<ProvenancePage/>}/>
      <Route path="/integrations" element={<IntegrationCatalogPage/>}/>
      <Route path="/audit" element={<AuditPage/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  </Routes>
}
