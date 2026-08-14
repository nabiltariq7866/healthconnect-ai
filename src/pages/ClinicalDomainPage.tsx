import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Drawer, EmptyState, ProvenanceView, RecordCard, SectionHeader } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'
import type { ClinicalDomain, ClinicalRecord } from '../types/domain'

const allowed: ClinicalDomain[]=['Medication','Lab','Imaging','Document','Encounter','Condition','Allergy','Appointment','Device']
export function ClinicalDomainPage(){
 const {domain}=useParams(); const clinicalDomain=allowed.includes(domain as ClinicalDomain)?domain as ClinicalDomain:'Document'; const {clinicalRecords,patients,systems}=useHealthConnectStore(); const [query,setQuery]=useState(''); const [source,setSource]=useState<ClinicalRecord>()
 const records=useMemo(()=>clinicalRecords.filter(r=>r.domain===clinicalDomain&&(!query||[r.title,r.summary,r.facility,patients.find(p=>p.id===r.patientId)?.name??'',systems.find(s=>s.id===r.provenance.sourceSystemId)?.name??''].some(v=>v.toLowerCase().includes(query.toLowerCase())))),[clinicalRecords,clinicalDomain,query,patients,systems])
 return <div><div className="page-hero"><div><div className="eyebrow">CLINICAL DATA</div><h1>{clinicalDomain}</h1><p>Unified {clinicalDomain.toLowerCase()} records with source, facility, clinical timestamp and provenance.</p></div><label className="search-inline"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${clinicalDomain.toLowerCase()}...`}/></label></div><section className="panel"><SectionHeader title={`${clinicalDomain} records`} subtitle={`${records.length} detailed synthetic records across the connected source systems.`}/>{records.length===0?<EmptyState title={`No ${clinicalDomain.toLowerCase()} records`} detail="No matching records are available from the current synthetic sources."/>:<div className="record-list domain-grid">{records.map(r=><div key={r.id}><div className="record-patient">{patients.find(p=>p.id===r.patientId)?.name??'Unmatched'} · {systems.find(s=>s.id===r.provenance.sourceSystemId)?.name}</div><RecordCard record={r} onSource={setSource}/></div>)}</div>}</section><Drawer open={Boolean(source)} title={source?.title??'Source'} subtitle={source?.provenance.sourceOrganization} onClose={()=>setSource(undefined)} wide><ProvenanceView record={source}/></Drawer></div>
}
