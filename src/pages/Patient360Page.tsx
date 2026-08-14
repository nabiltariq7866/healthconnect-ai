import { AlertTriangle, ArrowRight, Database, ExternalLink, FileSearch, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, CustomSelect, Drawer, EmptyState, FreshnessBadge, InfoBanner, LoadingState, ProvenanceView, RecordCard, SectionHeader, formatDate, formatDateOnly } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'
import { DEMO_NOW } from '../data/seed'
import type { ClinicalDomain, ClinicalRecord, CopilotResponse } from '../types/domain'

const tabs = ['Overview', 'Timeline', 'Encounters', 'Conditions', 'Medications', 'Allergies', 'Laboratory', 'Imaging', 'Documents', 'Appointments', 'Sources', 'Audit'] as const
type Tab = (typeof tabs)[number]
const domainByTab: Partial<Record<Tab, ClinicalDomain>> = { Encounters: 'Encounter', Conditions: 'Condition', Medications: 'Medication', Allergies: 'Allergy', Laboratory: 'Lab', Imaging: 'Imaging', Documents: 'Document', Appointments: 'Appointment' }
const timelineDomains: Array<'All' | ClinicalDomain> = ['All', 'Encounter', 'Condition', 'Medication', 'Allergy', 'Lab', 'Imaging', 'Document', 'Appointment', 'Device']

export function Patient360Page() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients, clinicalRecords, systems, conflicts, audits, currentRole, generatePatientSummary, askCopilot, reviewConflict } = useHealthConnectStore()
  const patient = patients.find((item) => item.id === patientId)
  const [tab, setTab] = useState<Tab>('Overview')
  const [sourceRecord, setSourceRecord] = useState<ClinicalRecord>()
  const [question, setQuestion] = useState('Summarize the last 30 days.')
  const [response, setResponse] = useState<CopilotResponse>()
  const [timelineDomain, setTimelineDomain] = useState<'All' | ClinicalDomain>('All')
  const [timelineSource, setTimelineSource] = useState('All')
  const [timelineRange, setTimelineRange] = useState('All time')
  const [loadingRecord, setLoadingRecord] = useState(true)

  useEffect(() => {
    setLoadingRecord(true)
    const timer = window.setTimeout(() => setLoadingRecord(false), 180)
    return () => window.clearTimeout(timer)
  }, [patientId])

  const records = useMemo(
    () => clinicalRecords.filter((record) => record.patientId === patientId).sort((left, right) => new Date(right.provenance.clinicalAt).getTime() - new Date(left.provenance.clinicalAt).getTime()),
    [clinicalRecords, patientId],
  )
  const patientConflicts = conflicts.filter((conflict) => conflict.patientId === patientId)
  const patientAudits = audits.filter((audit) => audit.entity === patient?.name || audit.entity === patient?.id || audit.object.includes(patient?.id ?? '__'))
  const staleSources = records.filter((record) => record.provenance.freshness !== 'Current')
  const canUseCopilot = canRole(currentRole, 'copilot')
  const canReviewConflicts = canRole(currentRole, 'data-quality')

  const filteredTimeline = useMemo(() => {
    const now = new Date(DEMO_NOW).getTime()
    const rangeDays = timelineRange === '30 days' ? 30 : timelineRange === '90 days' ? 90 : timelineRange === '1 year' ? 365 : undefined
    return records.filter((record) => {
      const domainMatch = timelineDomain === 'All' || record.domain === timelineDomain
      const sourceMatch = timelineSource === 'All' || record.provenance.sourceSystemId === timelineSource
      const clinical = new Date(record.provenance.clinicalAt).getTime()
      const rangeMatch = !rangeDays || (clinical >= now - rangeDays * 86_400_000 && clinical <= now)
      return domainMatch && sourceMatch && rangeMatch
    })
  }, [records, timelineDomain, timelineSource, timelineRange])

  if (loadingRecord) return <LoadingState label="Loading unified record..." />
  if (!patient) return <EmptyState title="Patient not found" detail="The requested synthetic unified patient record does not exist." />

  const runQuestion = () => {
    const next = askCopilot(patient.id, question)
    if (next) setResponse(next)
  }
  const summary = canUseCopilot ? generatePatientSummary(patient.id) : undefined
  const displayDomain = domainByTab[tab]
  const latestBySource = new Map(patient.sourceSystemIds.map((sourceId) => [sourceId, records.filter((record) => record.provenance.sourceSystemId === sourceId).sort((left, right) => new Date(right.provenance.receivedAt).getTime() - new Date(left.provenance.receivedAt).getTime())[0]]))

  return (
    <div>
      <div className="patient-header panel">
        <div className="patient-header-main">
          <button className="back-link" onClick={() => navigate('/patients')}>← Patient Search</button>
          <div className="patient-title-row"><div className="large-avatar">{patient.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><h1>{patient.name}</h1><p>{patient.unifiedId} · DOB {formatDateOnly(patient.dob)} · {patient.sex} · PCP {patient.primaryCareProvider}</p></div></div>
        </div>
        <div className="patient-header-stats"><div><span>Known source systems</span><strong>{patient.sourceSystemIds.length}</strong></div><div><span>Open conflicts</span><strong className={patientConflicts.some((conflict) => conflict.status === 'Open') ? 'danger-text' : ''}>{patientConflicts.filter((conflict) => conflict.status === 'Open').length}</strong></div><div><span>Last unified update</span><strong>{formatDate(patient.lastUnifiedUpdate)}</strong></div></div>
      </div>

      {staleSources.length > 0 && <InfoBanner kind="warning" title="Data freshness warning">Some connected-source records are marked {staleSources[0].provenance.freshness}. AI summaries surface this freshness state and should not present stale information as current without warning.</InfoBanner>}
      <div className="patient-source-strip"><span>Known sources</span>{patient.sourceSystemIds.map((sourceId) => { const system = systems.find((item) => item.id === sourceId); return <div className="source-chip" title={`${system?.organization} · ${system?.protocol} · Last sync ${system ? formatDate(system.lastSync) : 'Unknown'}`} key={sourceId}><span className={`tiny-dot ${system?.status.toLowerCase()}`} />{system?.name}</div> })}</div>
      <div className="tabbar" role="tablist" aria-label="Patient 360 sections">{tabs.map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>

      {tab === 'Overview' && (
        <div className="patient360-grid">
          <div className="patient-main-column">
            <section className="panel">
              <SectionHeader title="Unified clinical overview" subtitle="Current synthetic records from all linked source systems." />
              <div className="mini-metrics"><div><span>Active conditions</span><strong>{records.filter((record) => record.domain === 'Condition' && record.status === 'Active').length}</strong></div><div><span>Current medications</span><strong>{records.filter((record) => record.domain === 'Medication').length}</strong></div><div><span>Allergies</span><strong>{records.filter((record) => record.domain === 'Allergy').length}</strong></div><div><span>Recent investigations</span><strong>{records.filter((record) => record.domain === 'Lab' || record.domain === 'Imaging').length}</strong></div></div>
              <div className="record-list compact-list">{records.slice(0, 6).map((record) => <RecordCard key={record.id} record={record} onSource={setSourceRecord} />)}</div>
            </section>
            <section className="panel">
              <SectionHeader title="Longitudinal timeline" subtitle="Sorted by clinical event date; received timestamps remain available in provenance." action={<button className="text-button" onClick={() => setTab('Timeline')}>Full timeline <ArrowRight size={14} /></button>} />
              <div className="timeline-list">{records.slice(0, 6).map((record) => <button className="timeline-row" key={record.id} onClick={() => setSourceRecord(record)}><div className="timeline-date"><strong>{formatDateOnly(record.provenance.clinicalAt)}</strong><span>{record.domain}</span></div><div className="timeline-line"><i /></div><div className="timeline-content"><strong>{record.title}</strong><p>{record.summary}</p><span>Source: {record.provenance.sourceOrganization} · Received {formatDate(record.provenance.receivedAt)}</span></div><ExternalLink size={15} /></button>)}</div>
            </section>
          </div>
          <aside className="patient-side-column">
            <details className="panel collapsible-panel ai-panel" open>
              <summary><div className="ai-title"><Sparkles size={18} /><div><strong>Unified Patient Summary</strong><span>Source-grounded AI · Human review recommended</span></div></div></summary>
              <div className="collapsible-body">
                {summary ? <><div className="ai-stat-row"><Badge tone="ai">{summary.sourcesUsed} sources</Badge><Badge tone={summary.freshness === 'Current' ? 'success' : 'warning'}>{summary.freshness}</Badge><Badge tone={summary.conflicts ? 'warning' : 'neutral'}>{summary.conflicts} conflicts</Badge></div><div className="ai-statements">{summary.statements.map((statement) => <div key={statement.id}><p>{statement.text}</p><div className="citations">{statement.citations.map((citation) => <button key={citation.recordId} onClick={() => setSourceRecord(records.find((record) => record.id === citation.recordId))}><FileSearch size={12} />{citation.label}</button>)}</div></div>)}</div></> : <InfoBanner title="Clinician AI access required">Switch role to Clinician, Clinical Informaticist or Administrator to generate the source-grounded patient summary.</InfoBanner>}
              </div>
            </details>
            <details className="panel collapsible-panel" open>
              <summary><div><strong>Data conflicts</strong><span>Original source evidence is never silently overwritten.</span></div></summary>
              <div className="collapsible-body">
                {!canReviewConflicts && patientConflicts.some((conflict) => conflict.status === 'Open') && <InfoBanner kind="warning" title="Conflict actions are role-gated">Switch to Data Steward, Health Information Manager, Interoperability Analyst, Clinical Informaticist or Administrator to record a conflict decision.</InfoBanner>}
                {patientConflicts.length === 0 ? <EmptyState title="No active conflicts" detail="No current cross-source conflict has been detected for this patient." /> : patientConflicts.map((conflict) => {
                  const conflictRecords = conflict.recordIds.map((recordId) => records.find((record) => record.id === recordId)).filter((record): record is ClinicalRecord => Boolean(record))
                  const latest = [...conflictRecords].sort((left, right) => new Date(right.provenance.clinicalAt).getTime() - new Date(left.provenance.clinicalAt).getTime())[0]
                  return <div className="conflict-card" key={conflict.id}><div><AlertTriangle size={18} /><strong>{conflict.title}</strong></div><p>{conflict.description}</p>{conflictRecords.length > 0 && <div className="conflict-sources">{conflictRecords.map((record) => <button onClick={() => setSourceRecord(record)} key={record.id}>{record.provenance.sourceOrganization}: {record.value ?? record.title}</button>)}</div>}<div className="action-row conflict-actions">{conflict.type === 'Duplicate Event' ? <><button className="secondary-button compact" disabled={!canReviewConflicts || conflict.status !== 'Open'} onClick={() => reviewConflict(conflict.id, 'Keep All Sources')}>Keep separate</button><button className="primary-button compact" disabled={!canReviewConflicts || conflict.status !== 'Open'} onClick={() => reviewConflict(conflict.id, 'Grouped')}>Group duplicate event</button></> : <><button className="secondary-button compact" disabled={!canReviewConflicts || conflict.status !== 'Open'} onClick={() => reviewConflict(conflict.id, 'Keep All Sources')}>Keep all sources</button>{latest && <button className="secondary-button compact" disabled={!canReviewConflicts || conflict.status !== 'Open'} onClick={() => reviewConflict(conflict.id, 'Display Preference Set', latest.id)}>Prefer latest display</button>}<button className="secondary-button compact" disabled={!canReviewConflicts || conflict.status !== 'Open'} onClick={() => reviewConflict(conflict.id, 'Escalated')}>Send for clinical review</button><button className="primary-button compact" disabled={!canReviewConflicts || conflict.status !== 'Open'} onClick={() => reviewConflict(conflict.id, 'Reviewed')}>Mark reviewed</button></>}</div><Badge tone={conflict.status === 'Open' ? 'warning' : 'success'}>{conflict.status}</Badge></div>
                })}
              </div>
            </details>
            <section className="panel"><SectionHeader title="Identity & source coverage" /><dl className="key-value"><dt>Primary care provider</dt><dd>{patient.primaryCareProvider}</dd><dt>Phone</dt><dd>{patient.phone}</dd><dt>Email</dt><dd>{patient.email}</dd><dt>Address</dt><dd>{patient.address}</dd></dl></section>
          </aside>
        </div>
      )}

      {tab === 'Timeline' && (
        <section className="panel">
          <SectionHeader title="Longitudinal clinical timeline" subtitle="Filter by domain, source system and date range. Clinical and received timestamps remain distinct." />
          <div className="timeline-filters">
            <CustomSelect ariaLabel="Filter patient timeline by domain" value={timelineDomain} onChange={(value) => setTimelineDomain(value as 'All' | ClinicalDomain)} options={timelineDomains.map((item) => ({ value: item, label: item }))} />
            <CustomSelect ariaLabel="Filter patient timeline by source" value={timelineSource} onChange={setTimelineSource} options={[{ value: 'All', label: 'All source systems' }, ...patient.sourceSystemIds.map((sourceId) => ({ value: sourceId, label: systems.find((system) => system.id === sourceId)?.name ?? sourceId }))]} />
            <CustomSelect ariaLabel="Filter patient timeline by date range" value={timelineRange} onChange={setTimelineRange} options={['All time', '30 days', '90 days', '1 year'].map((item) => ({ value: item, label: item }))} />
          </div>
          {filteredTimeline.length === 0 ? <EmptyState title="No timeline events match" detail="Change the custom filters to inspect other longitudinal records." /> : <div className="timeline-list full">{filteredTimeline.map((record) => <button className="timeline-row" key={record.id} onClick={() => setSourceRecord(record)}><div className="timeline-date"><strong>{formatDateOnly(record.provenance.clinicalAt)}</strong><span>{record.domain}</span></div><div className="timeline-line"><i /></div><div className="timeline-content"><strong>{record.title}</strong><p>{record.summary}</p><span>Source: {record.provenance.sourceOrganization} · System: {systems.find((system) => system.id === record.provenance.sourceSystemId)?.name} · Clinical {formatDate(record.provenance.clinicalAt)} · Received {formatDate(record.provenance.receivedAt)}</span></div><ExternalLink size={15} /></button>)}</div>}
        </section>
      )}

      {displayDomain && <section className="panel"><SectionHeader title={tab} subtitle={`Unified ${tab.toLowerCase()} from all connected synthetic source systems.`} /><div className="record-list">{records.filter((record) => record.domain === displayDomain).map((record) => <RecordCard key={record.id} record={record} onSource={setSourceRecord} />)}{records.filter((record) => record.domain === displayDomain).length === 0 && <EmptyState title={`No ${tab.toLowerCase()} available`} detail="No records from the currently connected demo sources match this domain." />}</div></section>}

      {tab === 'Sources' && (
        <section className="panel">
          <SectionHeader title="Source coverage & source identifiers" subtitle="Merging never destroys original local identifiers. Sources without recent patient data remain visible." />
          <div className="source-system-grid">
            {systems.map((system) => {
              const identifiers = patient.identifiers.filter((identifier) => identifier.systemId === system.id)
              const sourceRecords = records.filter((record) => record.provenance.sourceSystemId === system.id)
              const latest = latestBySource.get(system.id)
              const isKnown = patient.sourceSystemIds.includes(system.id)
              return <div className="integration-card" key={system.id}><div className="integration-card-top"><div className="system-icon"><Database size={18} /></div><div><strong>{system.name}</strong><span>{system.organization}</span></div><Badge tone={isKnown ? 'success' : 'neutral'}>{isKnown ? 'Linked source' : 'No recent data'}</Badge></div><dl className="key-value"><dt>Protocol</dt><dd>{system.protocol}</dd><dt>Local ID</dt><dd>{identifiers.map((identifier) => identifier.value).join(', ') || 'No patient identifier in unified record'}</dd><dt>Record types</dt><dd>{sourceRecords.length ? [...new Set(sourceRecords.map((record) => record.domain))].join(', ') : 'No recent patient data'}</dd><dt>First / last seen</dt><dd>{sourceRecords.length ? `${formatDate([...sourceRecords].sort((a, b) => new Date(a.provenance.receivedAt).getTime() - new Date(b.provenance.receivedAt).getTime())[0].provenance.receivedAt)} → ${formatDate(latest!.provenance.receivedAt)}` : 'Unknown'}</dd><dt>Data freshness</dt><dd>{latest ? <FreshnessBadge freshness={latest.provenance.freshness} /> : <Badge>Unknown</Badge>}</dd><dt>Source status</dt><dd>{system.status}</dd></dl></div>
            })}
          </div>
        </section>
      )}

      {tab === 'Audit' && <section className="panel"><SectionHeader title="Patient audit history" subtitle="Identity, source access and AI actions remain traceable." />{patientAudits.length === 0 ? <EmptyState title="No patient-specific audit events" detail="Run an identity or AI workflow to create traceable patient events." /> : <div className="table-scroll"><table><thead><tr><th>Time</th><th>User</th><th>Role</th><th>Action</th><th>Previous</th><th>New</th></tr></thead><tbody>{patientAudits.map((audit) => <tr key={audit.id}><td>{formatDate(audit.timestamp)}</td><td>{audit.user}</td><td>{audit.role}</td><td><strong>{audit.action}</strong></td><td>{audit.previousState}</td><td>{audit.newState}</td></tr>)}</tbody></table></div>}</section>}

      <section className="panel copilot-inline">
        <SectionHeader title="Ask HealthConnect Copilot" subtitle="Answers are derived only from this patient's current synthetic records; citations open the exact supporting source." />
        {!canUseCopilot && <InfoBanner kind="warning" title="Copilot permission">Switch to Clinician, Clinical Informaticist or Administrator to generate a source-grounded answer.</InfoBanner>}
        <div className="copilot-compose"><input aria-label="Patient Copilot question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about recent changes, medications, investigations or source conflicts..." /><button className="primary-button" disabled={!canUseCopilot || !question.trim()} onClick={runQuestion}><Sparkles size={16} />Ask Copilot</button></div>
        {response && <div className="copilot-response"><div className="ai-stat-row"><Badge tone="ai">{response.sourcesUsed} source records</Badge><Badge tone={response.freshness === 'Current' ? 'success' : 'warning'}>{response.freshness}</Badge><Badge tone={response.conflicts ? 'warning' : 'neutral'}>{response.conflicts} conflicts</Badge><Badge tone="neutral">Human review recommended</Badge></div>{response.statements.map((statement) => <div className="answer-statement" key={statement.id}><p>{statement.text}</p>{statement.citations.length > 0 && <div className="citations">{statement.citations.map((citation) => <button key={citation.recordId} onClick={() => setSourceRecord(records.find((record) => record.id === citation.recordId))}><FileSearch size={12} />{citation.label}</button>)}</div>}</div>)}</div>}
      </section>

      <Drawer open={Boolean(sourceRecord)} title={sourceRecord?.title ?? 'Source provenance'} subtitle={sourceRecord ? `${sourceRecord.domain} · ${sourceRecord.provenance.sourceOrganization}` : undefined} onClose={() => setSourceRecord(undefined)} wide><ProvenanceView record={sourceRecord} /></Drawer>
    </div>
  )
}
