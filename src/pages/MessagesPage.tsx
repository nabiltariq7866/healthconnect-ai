import { Braces, CheckCircle2, CircleX, Filter, RefreshCw, Search, ShieldCheck, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, CustomSelect, Drawer, EmptyState, InfoBanner, ProtocolBadge, SectionHeader, formatDate } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'

const statuses = ['All', 'Processed', 'Failed', 'Held', 'Unmatched', 'Received', 'Processing']
type ViewerTab = 'Raw' | 'Parsed' | 'Mapped'

export function MessagesPage() {
  const { messages, systems, currentRole, retryMessage, repairMessageIssue } = useHealthConnectStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [selectedId, setSelectedId] = useState<string>()
  const [tab, setTab] = useState<ViewerTab>('Raw')
  const [mappingMessageId, setMappingMessageId] = useState<string>()
  const canManage = canRole(currentRole, 'interface-manage')
  const selected = messages.find((message) => message.id === selectedId)
  const sourceSystem = systems.find((system) => system.id === selected?.sourceSystemId)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return messages.filter((message) => {
      const matchesStatus = status === 'All' || message.status === status
      const source = systems.find((system) => system.id === message.sourceSystemId)
      const matchesQuery = !needle || [message.id, message.type, message.protocol, message.patientMapping ?? '', message.error ?? '', source?.name ?? ''].some((value) => value.toLowerCase().includes(needle))
      return matchesStatus && matchesQuery
    })
  }, [messages, query, status, systems])

  const viewerLabels = selected?.protocol === 'FHIR R4'
    ? { Raw: 'FHIR JSON Demo', Parsed: 'Summary', Mapped: 'Source Mapping' }
    : selected?.protocol === 'DICOM'
      ? { Raw: 'DICOM Metadata', Parsed: 'Summary', Mapped: 'Source Mapping' }
      : { Raw: 'Raw', Parsed: 'Parsed', Mapped: 'Mapped' }

  const viewerContent = selected
    ? tab === 'Raw'
      ? selected.raw
      : JSON.stringify(tab === 'Parsed' ? selected.parsed : selected.mapped, null, 2)
    : ''

  const runRetry = (messageId: string) => {
    if (mappingMessageId) return
    setMappingMessageId(messageId)
    window.setTimeout(() => {
      retryMessage(messageId)
      setMappingMessageId(undefined)
    }, 220)
  }

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">DATA EXCHANGE</div>
          <h1>Message Activity</h1>
          <p>Inspect synthetic FHIR, HL7, DICOM and API messages through validation, matching, mapping and Patient 360 delivery.</p>
        </div>
        <div className="toolbar">
          <label className="search-inline"><Search size={15} /><input aria-label="Search integration messages" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages..." /></label>
          <div className="filter-select"><Filter size={14} /><CustomSelect ariaLabel="Filter messages by status" value={status} onChange={setStatus} options={statuses.map((item) => ({ value: item, label: item }))} /></div>
        </div>
      </div>
      {!canManage && <InfoBanner kind="warning" title="Read-only message operations">Switch to Integration Engineer or Administrator to repair and retry failed synthetic messages.</InfoBanner>}
      <section className="panel">
        <SectionHeader title="Integration messages" subtitle={`${visible.length} synthetic messages match the current filters.`} />
        {visible.length === 0 ? <EmptyState title="No messages match" detail="Change the search or custom status filter." /> : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Message</th><th>Type</th><th>Source</th><th>Protocol</th><th>Patient mapping</th><th>Time</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {visible.map((message) => (
                  <tr key={message.id}>
                    <td><strong>{message.id}</strong>{message.error && <small className="danger-text">{message.error}</small>}</td>
                    <td>{message.type}</td>
                    <td>{systems.find((system) => system.id === message.sourceSystemId)?.name}</td>
                    <td><ProtocolBadge protocol={message.protocol} /></td>
                    <td>{message.patientMapping ?? '—'}</td>
                    <td>{formatDate(message.timestamp)}</td>
                    <td><Badge tone={message.status === 'Processed' ? 'success' : message.status === 'Failed' ? 'critical' : message.status === 'Unmatched' || message.status === 'Held' ? 'warning' : 'neutral'}>{message.status}</Badge></td>
                    <td><button className="secondary-button compact" onClick={() => { setSelectedId(message.id); setTab(message.protocol === 'FHIR R4' ? 'Parsed' : 'Raw') }}>Inspect</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <SectionHeader title="FHIR R4 demo resource coverage" subtitle="Fictional interoperability concepts represented by source records, mappings and message viewers." />
        <div className="tag-list">{['Patient', 'Encounter', 'Observation', 'Condition', 'MedicationStatement', 'AllergyIntolerance', 'DiagnosticReport', 'DocumentReference', 'Appointment', 'Provenance'].map((resource) => <Badge key={resource} tone="info">{resource}</Badge>)}</div>
        <p className="muted">Open any FHIR message above to switch between Summary, FHIR JSON Demo and Source Mapping. These are synthetic examples and not a live FHIR server.</p>
      </section>

      <Drawer open={Boolean(selected)} title={selected?.id ?? 'Message'} subtitle={selected ? `${selected.type} · ${sourceSystem?.name}` : undefined} onClose={() => setSelectedId(undefined)} wide>
        {selected && (
          <>
            <div className="detail-kpis">
              <div><span>Status</span><Badge tone={selected.status === 'Processed' ? 'success' : selected.status === 'Failed' ? 'critical' : 'warning'}>{selected.status}</Badge></div>
              <div><span>Protocol</span><ProtocolBadge protocol={selected.protocol} /></div>
              <div><span>Source</span><strong>{sourceSystem?.name}</strong></div>
              <div><span>Patient mapping</span><strong>{selected.patientMapping ?? 'Unresolved'}</strong></div>
            </div>
            <div className="pipeline" aria-label="Message processing pipeline">
              {selected.pipeline.map((step, index) => (
                <div className={`pipeline-step ${step.status.toLowerCase()}`} key={`${step.label}-${index}`}>
                  {step.status === 'Complete' ? <CheckCircle2 size={17} /> : step.status === 'Failed' ? <CircleX size={17} /> : <span className="step-index">{index + 1}</span>}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
            {mappingMessageId === selected.id && <InfoBanner title="Mapping incoming message...">The repaired synthetic message is being validated, mapped and stored before Patient 360 availability.</InfoBanner>}
            {selected.error && <InfoBanner kind={selected.error.includes('resolved') ? 'info' : 'warning'} title="Processing issue">{selected.error}</InfoBanner>}
            <div className="message-tabs" role="tablist">
              {(['Raw', 'Parsed', 'Mapped'] as ViewerTab[]).map((item) => (
                <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{viewerLabels[item]}</button>
              ))}
            </div>
            <pre className="message-code">{viewerContent}</pre>
            {selected.protocol === 'FHIR R4' && <InfoBanner title="FHIR demo resource">This viewer shows a fictional resource summary, demo JSON and source mapping. It is not connected to a live FHIR server.</InfoBanner>}
            {selected.protocol === 'DICOM' && <InfoBanner title="DICOM metadata only">The demo exposes study metadata and mapping only. It performs no diagnostic image interpretation.</InfoBanner>}
            {selected.status === 'Failed' && (
              <div className="action-row end">
                {selected.error === 'Patient identifier missing' && <button className="secondary-button" disabled={!canManage} onClick={() => repairMessageIssue(selected.id)}><Wrench size={16} />Resolve demo identifier</button>}
                <button className="primary-button" disabled={!canManage || selected.error === 'Patient identifier missing' || mappingMessageId === selected.id} onClick={() => runRetry(selected.id)}><RefreshCw size={16} />Retry processing</button>
              </div>
            )}
            <div className="demo-note"><Braces size={18} /><div><strong>Demo pipeline</strong><span>Received → Validated → Patient Matched → Mapped → Stored → Patient 360. Failed messages retain evidence until the synthetic issue is resolved; successful messages cannot be retried unnecessarily.</span></div></div>
            <div className="demo-note"><ShieldCheck size={18} /><div><strong>Human-controlled troubleshooting</strong><span>Message repair and retry are role-gated demo operations. No production healthcare message is changed.</span></div></div>
          </>
        )}
      </Drawer>
    </div>
  )
}
