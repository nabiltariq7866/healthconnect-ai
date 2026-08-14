import { AlertTriangle, ArrowRight, CircleCheck, Link2, PauseCircle, Plus, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, InfoBanner, MetricCard, Modal, SectionHeader, formatDate } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'
import { generateDataQualityInsights } from '../services/ai/dataQualityAI'

export function DataQualityPage() {
  const navigate = useNavigate()
  const {
    qualityIssues,
    unmatchedRecords,
    patients,
    systems,
    interfaces,
    mappings,
    messages,
    conflicts,
    identityCandidates,
    currentRole,
    linkUnmatchedRecord,
    holdUnmatchedRecord,
    createPatientFromUnmatched,
    createDemoUnmatchedLab,
  } = useHealthConnectStore()
  const [selectedUnmatched, setSelectedUnmatched] = useState<string>()
  const [patientId, setPatientId] = useState('pt-emily')
  const [newPatient, setNewPatient] = useState(false)
  const [name, setName] = useState('Emily Carter')
  const [dob, setDob] = useState('1962-04-21')

  const open = qualityIssues.filter((issue) => issue.status !== 'Resolved')
  const insights = useMemo(() => generateDataQualityInsights(qualityIssues, interfaces), [qualityIssues, interfaces])
  const canReview = canRole(currentRole, 'data-quality') || canRole(currentRole, 'identity-review')
  const selected = unmatchedRecords.find((item) => item.id === selectedUnmatched)
  const detailedDuplicates = open.filter((issue) => issue.type === 'Duplicate identity').length
  const networkDuplicates = 16 + detailedDuplicates
  const detailedMappingIssues = open.filter((issue) => issue.type === 'Mapping failure').length
  const networkMappings = 10 + detailedMappingIssues
  const staleFeeds = new Set(open.filter((issue) => issue.type === 'Stale data').map((issue) => issue.sourceSystemId)).size
  const unmappedMessages = messages.filter((message) => ['Failed', 'Unmatched', 'Held'].includes(message.status)).length
  const completeIdentities = 486220 - networkDuplicates - unmatchedRecords.filter((item) => item.status === 'Unmatched').length

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">INTELLIGENCE</div>
          <h1>Data Quality</h1>
          <p>Resolve identity, mapping, stale-data and orphan-record issues without losing original source evidence.</p>
        </div>
        <button className="primary-button" disabled={!canRole(currentRole, 'identity-review')} onClick={createDemoUnmatchedLab}><Plus size={16} />Create demo incoming lab</button>
      </div>
      <div className="metrics-grid four">
        <MetricCard label="Complete Patient Identities" value={completeIdentities.toLocaleString()} detail="Representative synthetic network count" tone="aqua" />
        <MetricCard label="Possible Duplicates" value={networkDuplicates} detail={`${detailedDuplicates} detailed queue item`} tone="amber" />
        <MetricCard label="Unmatched Records" value={unmatchedRecords.filter((item) => item.status === 'Unmatched').length} tone="coral" />
        <MetricCard label="Missing Required Mappings" value={networkMappings} detail={`${detailedMappingIssues} detailed mapping issue`} />
        <MetricCard label="Data Conflicts" value={conflicts.filter((conflict) => conflict.status === 'Open').length} detail="Detailed cross-source conflicts requiring human review" />
        <MetricCard label="Stale Feeds" value={staleFeeds} tone={staleFeeds ? 'amber' : 'default'} />
        <MetricCard label="Unmapped Messages" value={unmappedMessages} tone={unmappedMessages ? 'coral' : 'default'} />
        <MetricCard label="Identity Reviews" value={identityCandidates.filter((candidate) => candidate.status === 'Needs Review' || candidate.status === 'Review Requested').length} />
      </div>

      <section className="panel">
        <SectionHeader title="AI-assisted data quality insight" subtitle="Operational observations only — human review required." />
        <div className="insight-list">{insights.map((insight, index) => <div key={`${insight}-${index}`}><CircleCheck size={16} /><span>{insight}</span></div>)}</div>
      </section>
      {!canReview && <InfoBanner kind="warning" title="Limited permissions">Your current role can view this queue but may not resolve identity or mapping issues.</InfoBanner>}

      <section className="panel">
        <SectionHeader title="Work queue" subtitle="Issues remain visible until a human-reviewed resolution is recorded." />
        <div className="table-scroll">
          <table>
            <thead><tr><th>Issue</th><th>Type</th><th>Source</th><th>Priority</th><th>Owner</th><th>Detected</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {qualityIssues.map((issue) => (
                <tr key={issue.id}>
                  <td><strong>{issue.title}</strong></td>
                  <td>{issue.type}</td>
                  <td>{systems.find((system) => system.id === issue.sourceSystemId)?.name ?? 'Patient Identity'}</td>
                  <td><Badge tone={issue.priority === 'High' ? 'critical' : issue.priority === 'Medium' ? 'warning' : 'neutral'}>{issue.priority}</Badge></td>
                  <td>{issue.owner}</td>
                  <td>{formatDate(issue.detectedAt)}</td>
                  <td><Badge tone={issue.status === 'Resolved' ? 'success' : issue.status === 'Held' ? 'neutral' : 'warning'}>{issue.status}</Badge></td>
                  <td>
                    {issue.relatedId?.startsWith('idq') ? <button className="text-button" onClick={() => navigate('/identity')}>Review <ArrowRight size={14} /></button>
                      : issue.relatedId?.startsWith('map') ? <button className="text-button" onClick={() => navigate('/mappings')}>Mapping <ArrowRight size={14} /></button>
                        : issue.relatedId?.startsWith('unmatched') ? <button className="text-button" onClick={() => setSelectedUnmatched(issue.relatedId)}>Resolve <ArrowRight size={14} /></button>
                          : issue.relatedId?.startsWith('MSG') ? <button className="text-button" onClick={() => navigate('/messages')}>Message <ArrowRight size={14} /></button>
                            : issue.relatedId?.startsWith('conflict-') && issue.patientId ? <button className="text-button" onClick={() => navigate(`/patients/${issue.patientId}`)}>Conflict <ArrowRight size={14} /></button>
                              : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <SectionHeader title="Unmatched records" subtitle="No uncertain record is silently placed into Patient 360." />
        {unmatchedRecords.length === 0 ? <EmptyState title="No unmatched records" detail="All current synthetic records have a resolved patient identity." /> : (
          <div className="unmatched-grid">
            {unmatchedRecords.map((item) => (
              <div className="unmatched-card" key={item.id}>
                <div><AlertTriangle size={19} /><div><strong>{item.record.title}</strong><span>{item.localPatientLabel}</span></div></div>
                <p>{item.record.summary}</p>
                <div className="record-meta"><span>{systems.find((system) => system.id === item.sourceSystemId)?.name}</span><span>{formatDate(item.receivedAt)}</span></div>
                <Badge tone={item.status === 'Linked' || item.status === 'Created New Patient' ? 'success' : item.status === 'Held' ? 'neutral' : 'warning'}>{item.status}</Badge>
                {(item.status === 'Unmatched' || item.status === 'Held') && <button className="secondary-button" onClick={() => setSelectedUnmatched(item.id)}>Review matches</button>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <SectionHeader title="Mapping coverage" subtitle="Detailed mapping rules remain traceable to the data-mapping workspace." />
        <div className="mini-metrics">
          <div><span>Mapped</span><strong>{mappings.filter((mapping) => mapping.status === 'Mapped').length}</strong></div>
          <div><span>Needs Review</span><strong>{mappings.filter((mapping) => mapping.status === 'Needs Review').length}</strong></div>
          <div><span>Unmapped</span><strong>{mappings.filter((mapping) => mapping.status === 'Unmapped').length}</strong></div>
          <div><span>Total Rules</span><strong>{mappings.length}</strong></div>
        </div>
      </section>

      <Modal open={Boolean(selectedUnmatched)} title="Resolve unmatched clinical record" onClose={() => { setSelectedUnmatched(undefined); setNewPatient(false) }}>
        {selected && (
          <>
            <InfoBanner title="Incoming source record">{selected.record.title} · {selected.localPatientLabel} · {systems.find((system) => system.id === selected.sourceSystemId)?.name}</InfoBanner>
            {!newPatient ? (
              <>
                <label className="field"><span>Link to unified patient</span><CustomSelect ariaLabel="Select unified patient for unmatched record" value={patientId} onChange={setPatientId} options={patients.map((patient) => ({ value: patient.id, label: `${patient.name} · ${patient.unifiedId}`, description: patient.dob }))} /></label>
                <div className="action-grid">
                  <button className="secondary-button" disabled={!canRole(currentRole, 'identity-review') || selected.status !== 'Unmatched'} onClick={() => { holdUnmatchedRecord(selected.id); setSelectedUnmatched(undefined) }}><PauseCircle size={16} />Hold record</button>
                  <button className="secondary-button" disabled={!canRole(currentRole, 'identity-review')} onClick={() => setNewPatient(true)}><UserPlus size={16} />Create new patient</button>
                  <button className="primary-button" disabled={!canRole(currentRole, 'identity-review')} onClick={() => { linkUnmatchedRecord(selected.id, patientId); setSelectedUnmatched(undefined) }}><Link2 size={16} />Link to Patient 360</button>
                </div>
              </>
            ) : (
              <>
                <label className="field"><span>Patient name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label className="field"><span>Date of birth</span><input type="date" value={dob} onChange={(event) => setDob(event.target.value)} /></label>
                <div className="action-row end"><button className="secondary-button" onClick={() => setNewPatient(false)}>Back</button><button className="primary-button" disabled={!canRole(currentRole, 'identity-review') || !name.trim()} onClick={() => { createPatientFromUnmatched(selected.id, name, dob); setSelectedUnmatched(undefined); setNewPatient(false) }}><UserPlus size={16} />Create synthetic patient</button></div>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}
