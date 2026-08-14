import { ArrowRight, Search, ShieldCheck, UserRoundSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, SectionHeader, formatDate } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'

export function PatientSearchPage(){
  const navigate=useNavigate(); const [params]=useSearchParams();
  const [query,setQuery]=useState(params.get('q')??'')
  const {patients,systems,externalRecords,identityCandidates}=useHealthConnectStore()
  const results=useMemo(()=>{
    const q=query.toLowerCase().trim(); if(!q)return patients
    return patients.filter(p=>[p.name,p.dob,p.unifiedId,p.phone,...p.identifiers.map(i=>i.value)].some(v=>v.toLowerCase().includes(q)))
  },[patients,query])
  const sourceOnly=useMemo(()=>externalRecords.filter(r=>!r.linkedPatientId && (!query||[r.name,r.localId,r.dob,r.phone].some(v=>v.toLowerCase().includes(query.toLowerCase())))),[externalRecords,query])
  return <div><div className="page-hero"><div><div className="eyebrow">PATIENT 360</div><h1>Patient Search</h1><p>Search unified identities and source-only records by name, DOB, unified ID, MRN or external identifier.</p></div></div>
    <section className="search-hero-card"><UserRoundSearch size={28}/><div><h2>Find a longitudinal patient record</h2><p>Try “Emily Robinson”, “HC-2026-102842” or “ORC-201839”.</p></div><div className="patient-search-box"><Search size={18}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patients and external identifiers..."/></div></section>
    <section className="panel"><SectionHeader title="Unified records" subtitle={`${results.length} detailed synthetic patient record${results.length===1?'':'s'} found.`}/><div className="patient-grid">{results.map(p=><button className="patient-result" key={p.id} onClick={()=>navigate(`/patients/${p.id}`)}><div className="avatar">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div className="patient-result-main"><div><strong>{p.name}</strong><Badge tone="success">Unified</Badge></div><span>{p.unifiedId} · DOB {p.dob}</span><div className="source-badges">{p.sourceSystemIds.map(id=><span key={id}>{systems.find(s=>s.id===id)?.name}</span>)}</div></div><div className="patient-result-meta"><span>{p.sourceSystemIds.length} sources</span><span>Updated {formatDate(p.lastUnifiedUpdate)}</span><ArrowRight size={18}/></div></button>)}</div></section>
    {sourceOnly.length>0&&<section className="panel"><SectionHeader title="Source-only / identity review records" subtitle="These records are not yet silently inserted into a unified patient record."/><div className="table-scroll"><table><thead><tr><th>Source record</th><th>Local ID</th><th>Source system</th><th>Identity status</th><th></th></tr></thead><tbody>{sourceOnly.map(r=>{const cand=identityCandidates.find(c=>c.incomingRecordId===r.id);return <tr key={r.id}><td><strong>{r.name}</strong><small>DOB {r.dob}</small></td><td>{r.localId}</td><td>{systems.find(s=>s.id===r.sourceSystemId)?.name}</td><td><Badge tone="warning">{cand?.status??'Source only'}</Badge></td><td><button className="text-button" onClick={()=>navigate('/identity')}><ShieldCheck size={14}/>Review identity</button></td></tr>})}</tbody></table></div></section>}
  </div>
}
