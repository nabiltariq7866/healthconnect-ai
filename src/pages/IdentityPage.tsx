import { Check, GitMerge, Link2, Search, ShieldAlert, UserRoundCheck, UserRoundX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Drawer, EmptyState, InfoBanner, LoadingState, Modal, SectionHeader, formatDate } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'

export function IdentityPage({ duplicatesOnly = false }: { duplicatesOnly?: boolean }) {
  const { identityCandidates, externalRecords, patients, systems, mergeCandidate, keepSeparate, linkRelated, requestIdentityReview, currentRole } = useHealthConnectStore()
  const [selectedId, setSelectedId] = useState<string>()
  const [action, setAction] = useState<'merge' | 'separate' | 'link'>()
  const [reason, setReason] = useState('Human-reviewed demographic and identifier evidence')
  const [confirmation, setConfirmation] = useState('')
  const [resolvingIdentity, setResolvingIdentity] = useState(false)
  const selected = identityCandidates.find((candidate) => candidate.id === selectedId)
  const incoming = selected ? externalRecords.find((record) => record.id === selected.incomingRecordId) : undefined
  const patient = selected ? patients.find((item) => item.id === selected.potentialPatientId) : undefined
  const visible = useMemo(
    () => identityCandidates.filter((candidate) => duplicatesOnly ? candidate.status === 'Needs Review' || candidate.status === 'Review Requested' : true),
    [identityCandidates, duplicatesOnly],
  )
  const canReview = canRole(currentRole, 'identity-review')
  const decisionOpen = selected && ['Needs Review', 'Review Requested'].includes(selected.status)

  const openReview = (candidateId: string) => {
    setResolvingIdentity(true)
    window.setTimeout(() => {
      setSelectedId(candidateId)
      setResolvingIdentity(false)
    }, 180)
  }

  const openAction = (next: 'merge' | 'separate' | 'link') => {
    setAction(next)
    setConfirmation('')
  }

  const confirm = () => {
    if (!selected || !action) return
    if (action === 'merge' && confirmation.trim().toUpperCase() !== 'MERGE') return
    const result = action === 'merge'
      ? mergeCandidate(selected.id, reason)
      : action === 'separate'
        ? keepSeparate(selected.id, reason)
        : linkRelated(selected.id, reason)
    if (result.ok) {
      setAction(undefined)
      setSelectedId(undefined)
      setConfirmation('')
    }
  }

  return (
    <div>
      <div className="page-hero">
        <div><div className="eyebrow">PATIENT IDENTITY</div><h1>{duplicatesOnly ? 'Duplicate Records' : 'Patient Identity Queue'}</h1><p>Review potential patient matches with transparent evidence. HealthConnect never auto-merges uncertain identities.</p></div>
        <Badge tone="warning">{visible.filter((candidate) => candidate.status === 'Needs Review' || candidate.status === 'Review Requested').length} need review</Badge>
      </div>
      {resolvingIdentity && <LoadingState label="Resolving patient identity..." />}
      {!canReview && <InfoBanner kind="warning" title="Read-only for current role">Switch to Data Steward, Health Information Manager or Administrator to make identity decisions.</InfoBanner>}
      <section className="panel">
        <SectionHeader title="Identity review work queue" subtitle="Synthetic demo matching logic — human decision required." />
        {visible.length === 0 ? <EmptyState title="No identity reviews pending" detail="All current synthetic identity candidates have been resolved." /> : (
          <div className="table-scroll"><table><thead><tr><th>Incoming record</th><th>Potential match</th><th>Source</th><th>Match strength</th><th>Conflicts</th><th>Status</th><th>Received</th><th></th></tr></thead><tbody>{visible.map((candidate) => {
            const external = externalRecords.find((record) => record.id === candidate.incomingRecordId)
            const existing = patients.find((item) => item.id === candidate.potentialPatientId)
            const system = systems.find((source) => source.id === external?.sourceSystemId)
            return <tr key={candidate.id}><td><strong>{external?.name}</strong><small>{external?.localId}</small></td><td><strong>{existing?.name}</strong><small>{existing?.unifiedId}</small></td><td>{system?.name}</td><td><Badge tone={candidate.matchStrength === 'Strong Match' ? 'success' : candidate.matchStrength === 'Conflict' ? 'critical' : 'warning'}>{candidate.matchStrength}</Badge></td><td>{candidate.evidence.filter((evidence) => evidence.state === 'Conflict').length}</td><td><Badge tone={candidate.status === 'Merged' ? 'success' : candidate.status === 'Needs Review' || candidate.status === 'Review Requested' ? 'warning' : 'neutral'}>{candidate.status}</Badge></td><td>{formatDate(candidate.receivedAt)}</td><td><button className="secondary-button compact" onClick={() => openReview(candidate.id)}>Review</button></td></tr>
          })}</tbody></table></div>
        )}
      </section>

      <Drawer open={Boolean(selected)} title="Identity comparison" subtitle="Incoming source record vs. existing unified patient" onClose={() => setSelectedId(undefined)} wide>
        {selected && incoming && patient && (
          <>
            <div className="identity-summary"><div><span>Incoming record</span><strong>{incoming.name}</strong><small>{incoming.localId}</small></div><div className="match-pill"><GitMerge size={18} /><strong>{selected.matchStrength}</strong><span>Demo identity match score</span></div><div><span>Unified record</span><strong>{patient.name}</strong><small>{patient.unifiedId}</small></div></div>
            <div className="comparison-grid">
              <div className="comparison-column"><h3>Incoming · {systems.find((system) => system.id === incoming.sourceSystemId)?.name}</h3><dl><dt>Name</dt><dd>{incoming.name}</dd><dt>DOB</dt><dd>{incoming.dob}</dd><dt>Phone</dt><dd>{incoming.phone}</dd><dt>Email</dt><dd>{incoming.email}</dd><dt>Address</dt><dd>{incoming.address}</dd><dt>Local ID</dt><dd>{incoming.localId}</dd></dl></div>
              <div className="evidence-column"><h3>Match evidence</h3>{selected.evidence.map((evidence) => <div className={`evidence-row ${evidence.state.toLowerCase()}`} key={evidence.field}><div><strong>{evidence.field}</strong><span>{evidence.state}</span></div><p>{evidence.note ?? (evidence.state === 'Exact' ? 'Values agree across source records.' : 'Review difference before deciding.')}</p></div>)}</div>
              <div className="comparison-column"><h3>Existing unified identity</h3><dl><dt>Name</dt><dd>{patient.name}</dd><dt>DOB</dt><dd>{patient.dob}</dd><dt>Phone</dt><dd>{patient.phone}</dd><dt>Email</dt><dd>{patient.email}</dd><dt>Address</dt><dd>{patient.address}</dd><dt>Unified ID</dt><dd>{patient.unifiedId}</dd></dl></div>
            </div>
            <InfoBanner title="Source identifiers will be preserved">Merging links the external record to the unified patient. It does not delete the original source identifier, external record or provenance.</InfoBanner>
            <div className="action-row">
              <button className="secondary-button" disabled={!canReview || !decisionOpen} onClick={() => requestIdentityReview(selected.id)}><Search size={16} />Request review</button>
              <button className="secondary-button" disabled={!canReview || !decisionOpen} onClick={() => openAction('separate')}><UserRoundX size={16} />Keep separate</button>
              <button className="secondary-button" disabled={!canReview || !decisionOpen} onClick={() => openAction('link')}><Link2 size={16} />Link records</button>
              <button className="primary-button" disabled={!canReview || !decisionOpen} onClick={() => openAction('merge')}><UserRoundCheck size={16} />Merge records</button>
            </div>
            {!decisionOpen && <InfoBanner title="Decision recorded">This candidate is already {selected.status}. The original comparison evidence remains visible for auditability.</InfoBanner>}
          </>
        )}
      </Drawer>

      <Modal open={Boolean(action)} title={action === 'merge' ? 'Confirm identity merge' : action === 'separate' ? 'Keep records separate' : 'Link related records'} onClose={() => setAction(undefined)}>
        {action === 'merge' && selected && incoming && patient && (
          <div className="merge-impact">
            <div className="mini-title">Merge impact</div>
            <dl className="key-value"><dt>Incoming record</dt><dd>{incoming.name} · {incoming.localId}</dd><dt>Unified patient</dt><dd>{patient.name} · {patient.unifiedId}</dd><dt>Identifiers preserved</dt><dd>{patient.identifiers.length + (patient.identifiers.some((identifier) => identifier.value === incoming.localId) ? 0 : 1)}</dd><dt>Source systems after merge</dt><dd>{new Set([...patient.sourceSystemIds, incoming.sourceSystemId]).size}</dd><dt>Timeline records added</dt><dd>{incoming.clinicalRecordIds.length}</dd></dl>
          </div>
        )}
        <label className="field"><span>Human decision reason</span><textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} /></label>
        {action === 'merge' && <label className="field"><span>Type MERGE to confirm the human-reviewed identity decision</span><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" /></label>}
        <div className="modal-warning"><ShieldAlert size={18} /><span>This is a synthetic identity workflow. Original source evidence and identifiers remain preserved; no uncertain identity is auto-merged.</span></div>
        <div className="action-row end"><button className="secondary-button" onClick={() => setAction(undefined)}>Cancel</button><button className="primary-button" disabled={!reason.trim() || (action === 'merge' && confirmation.trim().toUpperCase() !== 'MERGE')} onClick={confirm}><Check size={16} />Confirm decision</button></div>
      </Modal>
    </div>
  )
}

export function MergeHistoryPage() {
  const navigate = useNavigate()
  const { mergeHistory, patients, externalRecords, systems } = useHealthConnectStore()
  return (
    <div>
      <div className="page-hero"><div><div className="eyebrow">PATIENT IDENTITY</div><h1>Merge History</h1><p>Immutable demo history of human-approved identity merges and preserved source records.</p></div></div>
      <section className="panel">
        <SectionHeader title="Merge decisions" subtitle="Original source records remain available after merge." />
        {mergeHistory.length === 0 ? <EmptyState title="No merges recorded yet" detail="Review Emily Robertson in the Identity Queue to run the primary merge workflow." /> : (
          <div className="table-scroll"><table><thead><tr><th>Unified patient</th><th>External record</th><th>Sources</th><th>Performed by</th><th>Date</th><th>Reason</th><th></th></tr></thead><tbody>{mergeHistory.map((item) => {
            const patient = patients.find((candidate) => candidate.id === item.patientId)
            const external = externalRecords.find((candidate) => candidate.id === item.incomingRecordId)
            return <tr key={item.id}><td><strong>{patient?.name}</strong><small>{patient?.unifiedId}</small></td><td>{external?.name}<small>{external?.localId}</small></td><td>{item.sourceSystemIds.map((sourceId) => systems.find((system) => system.id === sourceId)?.name).filter(Boolean).join(', ')}</td><td>{item.performedBy}</td><td>{formatDate(item.date)}</td><td>{item.reason}</td><td><button className="secondary-button compact" onClick={() => navigate(`/patients/${item.patientId}`)}>View merge</button></td></tr>
          })}</tbody></table></div>
        )}
      </section>
    </div>
  )
}
