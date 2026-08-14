import { FileSearch, Send, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, CustomSelect, Drawer, InfoBanner, ProvenanceView, SectionHeader } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'
import type { ClinicalRecord, CopilotResponse } from '../types/domain'

const prompts = [
  'Summarize the last 30 days.',
  'What changed recently?',
  'Show recent investigations.',
  'Summarize current medications.',
  'What records came from external organizations?',
  'Show conflicting medication records.',
  'What is the most recent imaging report?',
]

export function CopilotPage() {
  const { patients, clinicalRecords, conflicts, currentRole, askCopilot } = useHealthConnectStore()
  const [patientId, setPatientId] = useState('pt-emily')
  const [question, setQuestion] = useState('Summarize the last 30 days.')
  const [response, setResponse] = useState<CopilotResponse>()
  const [source, setSource] = useState<ClinicalRecord>()
  const [processing, setProcessing] = useState(false)
  const patient = patients.find((item) => item.id === patientId)
  const patientRecords = useMemo(() => clinicalRecords.filter((record) => record.patientId === patientId), [clinicalRecords, patientId])
  const canUse = canRole(currentRole, 'copilot')

  const ask = () => {
    if (processing) return
    setProcessing(true)
    setResponse(undefined)
    window.setTimeout(() => {
      const next = askCopilot(patientId, question)
      if (next) setResponse(next)
      setProcessing(false)
    }, 450)
  }

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">INTELLIGENCE</div>
          <h1>AI Copilot</h1>
          <p>Source-grounded navigation across the current unified synthetic patient record. No unsourced clinical facts are generated.</p>
        </div>
        <Badge tone="ai">Human review recommended</Badge>
      </div>
      {!canUse && <InfoBanner kind="warning" title="AI Copilot permission">Switch to Clinician, Clinical Informaticist or Administrator to generate answers.</InfoBanner>}
      <div className="copilot-workspace">
        <aside className="panel prompt-panel">
          <SectionHeader title="Patient context" />
          <label className="field">
            <span>Unified patient</span>
            <CustomSelect
              ariaLabel="Select unified patient for AI Copilot"
              value={patientId}
              onChange={(value) => { setPatientId(value); setResponse(undefined) }}
              options={patients.map((item) => ({ value: item.id, label: `${item.name} · ${item.unifiedId}`, description: `${item.sourceSystemIds.length} connected source systems` }))}
            />
          </label>
          <div className="context-card">
            <strong>{patient?.name}</strong>
            <span>{patient?.sourceSystemIds.length} source systems</span>
            <span>{patientRecords.length} unified records</span>
            <span>{conflicts.filter((conflict) => conflict.patientId === patientId && conflict.status === 'Open').length} open conflicts</span>
          </div>
          <div className="mini-title">Suggested questions</div>
          <div className="prompt-list">{prompts.map((prompt) => <button key={prompt} onClick={() => setQuestion(prompt)}>{prompt}</button>)}</div>
        </aside>
        <main className="panel copilot-main">
          <div className="ai-title big"><Sparkles size={22} /><div><strong>HealthConnect Copilot</strong><span>Answers only from connected synthetic sources</span></div></div>
          <div className="chat-compose">
            <textarea aria-label="Copilot question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} />
            <button className="primary-button" disabled={!canUse || !question.trim() || processing} onClick={ask}><Send size={16} />{processing ? 'Generating source-grounded summary...' : 'Generate source-grounded answer'}</button>
          </div>
          {!response ? (
            <div className="copilot-placeholder"><Sparkles size={34} /><strong>{processing ? 'Generating source-grounded summary...' : 'Ask about the unified patient record'}</strong><p>{processing ? 'Retrieving current synthetic records, checking freshness and resolving exact citations.' : 'Every factual statement will include a clickable source citation. If the record does not support a question, the Copilot will say so.'}</p></div>
          ) : (
            <div className="copilot-answer">
              <div className="ai-stat-row">
                <Badge tone="ai">{response.sourcesUsed} sources used</Badge>
                <Badge tone={response.freshness === 'Current' ? 'success' : 'warning'}>{response.freshness}</Badge>
                <Badge tone={response.conflicts ? 'warning' : 'neutral'}>{response.conflicts} conflicts</Badge>
                <Badge>Human review recommended</Badge>
              </div>
              <h2>{response.title}</h2>
              {response.statements.map((statement) => (
                <div className="answer-statement" key={statement.id}>
                  <p>{statement.text}</p>
                  {statement.citations.length > 0 && (
                    <div className="citations">
                      {statement.citations.map((citation) => (
                        <button key={citation.recordId} onClick={() => setSource(clinicalRecords.find((record) => record.id === citation.recordId))}>
                          <FileSearch size={13} />{citation.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Drawer open={Boolean(source)} title={source?.title ?? 'Source record'} subtitle={source?.provenance.sourceOrganization} onClose={() => setSource(undefined)} wide>
        <ProvenanceView record={source} />
      </Drawer>
    </div>
  )
}
