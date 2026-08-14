import { Braces, Database, FileText, Network, Search, UserRound } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, EmptyState, SectionHeader } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'

export function SearchPage(){
  const [params]=useSearchParams(); const query=(params.get('q')??'').trim(); const q=query.toLowerCase(); const navigate=useNavigate()
  const {patients,clinicalRecords,messages,interfaces,systems}=useHealthConnectStore()
  const result=useMemo(()=>({
    patients: patients.filter(p=>[p.name,p.unifiedId,p.dob,p.phone,...p.identifiers.map(i=>i.value)].some(v=>v.toLowerCase().includes(q))).slice(0,8),
    records: clinicalRecords.filter(r=>[r.title,r.summary,r.provenance.originalRecordId,r.provenance.messageId??'',r.domain].some(v=>v.toLowerCase().includes(q))).slice(0,8),
    messages: messages.filter(m=>[m.id,m.type,m.patientMapping??''].some(v=>v.toLowerCase().includes(q))).slice(0,8),
    interfaces: interfaces.filter(i=>[i.name,i.endpointLabel,systems.find(s=>s.id===i.sourceSystemId)?.name??''].some(v=>v.toLowerCase().includes(q))).slice(0,8),
    documents: clinicalRecords.filter(r=>r.domain==='Document'&&[r.title,r.summary,r.facility].some(v=>v.toLowerCase().includes(q))).slice(0,8),
  }),[q,patients,clinicalRecords,messages,interfaces,systems])
  const total=Object.values(result).reduce((n,a)=>n+a.length,0)
  return <div><div className="page-hero"><div><div className="eyebrow">GLOBAL SEARCH</div><h1>Search HealthConnect</h1><p>Grouped results across patients, source records, messages, interfaces and documents.</p></div><Badge tone="info">{total} result{total===1?'':'s'}</Badge></div>{!query?<EmptyState title="Enter a search term" detail="Use the top search bar to find patients, identifiers, systems, messages, documents or source records."/>:<div className="search-groups">
    <SearchGroup icon={<UserRound size={17}/>} title="Patients" count={result.patients.length}>{result.patients.map(p=><button key={p.id} onClick={()=>navigate(`/patients/${p.id}`)}><strong>{p.name}</strong><span>{p.unifiedId} · {p.dob}</span></button>)}</SearchGroup>
    <SearchGroup icon={<Database size={17}/>} title="Source Records" count={result.records.length}>{result.records.map(r=><button key={r.id} onClick={()=>navigate(`/patients/${r.patientId}`)}><strong>{r.title}</strong><span>{r.domain} · {r.provenance.originalRecordId}</span></button>)}</SearchGroup>
    <SearchGroup icon={<Braces size={17}/>} title="Messages" count={result.messages.length}>{result.messages.map(m=><button key={m.id} onClick={()=>navigate('/messages')}><strong>{m.id}</strong><span>{m.type} · {m.status}</span></button>)}</SearchGroup>
    <SearchGroup icon={<Network size={17}/>} title="Interfaces" count={result.interfaces.length}>{result.interfaces.map(i=><button key={i.id} onClick={()=>navigate('/interfaces')}><strong>{i.name}</strong><span>{i.protocol} · {i.status}</span></button>)}</SearchGroup>
    <SearchGroup icon={<FileText size={17}/>} title="Documents" count={result.documents.length}>{result.documents.map(r=><button key={r.id} onClick={()=>navigate(`/patients/${r.patientId}`)}><strong>{r.title}</strong><span>{r.facility}</span></button>)}</SearchGroup>
  </div>}</div>
}

function SearchGroup({icon,title,count,children}:{icon:React.ReactNode,title:string,count:number,children:React.ReactNode}){return <section className="panel search-group"><SectionHeader title={title} action={<Badge>{count}</Badge>}/><div className="search-group-list">{count?children:<div className="search-group-empty"><Search size={15}/>No matching {title.toLowerCase()}</div>}</div></section>}
