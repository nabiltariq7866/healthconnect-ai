import { FileSearch, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState, ProvenanceView, SectionHeader } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'
import type { ClinicalRecord } from '../types/domain'

export function ProvenancePage(){
 const {clinicalRecords,patients,systems}=useHealthConnectStore(); const [query,setQuery]=useState(''); const [selected,setSelected]=useState<ClinicalRecord>()
 const results=useMemo(()=>{const q=query.toLowerCase().trim();if(!q)return clinicalRecords.slice(0,8);return clinicalRecords.filter(r=>[r.id,r.title,r.provenance.originalRecordId,r.provenance.messageId??'',patients.find(p=>p.id===r.patientId)?.name??'',systems.find(s=>s.id===r.provenance.sourceSystemId)?.name??'',r.domain].some(v=>v.toLowerCase().includes(q))).slice(0,20)},[query,clinicalRecords,patients,systems])
 return <div><div className="page-hero"><div><div className="eyebrow">INTELLIGENCE</div><h1>Provenance Explorer</h1><p>Trace any unified record from its original source through transport, mapping and Patient 360 presentation.</p></div></div><div className="provenance-workspace"><aside className="panel"><SectionHeader title="Search records" subtitle="Search by record ID, patient, source, message or resource type."/><label className="search-inline wide"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="LAB-771902, Emily, Metro, Imaging..."/></label><div className="provenance-results">{results.map(r=><button className={selected?.id===r.id?'active':''} key={r.id} onClick={()=>setSelected(r)}><FileSearch size={16}/><div><strong>{r.title}</strong><span>{patients.find(p=>p.id===r.patientId)?.name??'Unmatched'} · {r.provenance.sourceOrganization}</span><small>{r.provenance.originalRecordId}</small></div></button>)}</div></aside><section className="panel provenance-main">{selected?<ProvenanceView record={selected}/>:<EmptyState title="Select a record" detail="Choose a result to inspect original data, mapped data, timestamps and the complete provenance chain."/>}</section></div></div>
}
