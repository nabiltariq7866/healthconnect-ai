import type { ClinicalRecord, CopilotResponse, CopilotStatement, DataConflict, Patient } from '../../types/domain'
import { citationFor, overallFreshness, resolveSourceCitations } from './sourceGroundingAI'
import { DEMO_NOW } from '../../data/seed'

const q = (value: string) => value.toLowerCase().trim()
const sortRecords = (records: ClinicalRecord[]) => [...records].sort((a, b) => new Date(b.provenance.clinicalAt).getTime() - new Date(a.provenance.clinicalAt).getTime())
const latest = (records: ClinicalRecord[], domain: ClinicalRecord['domain']) => sortRecords(records.filter((record) => record.domain === domain))[0]

export function answerPatientQuestion(patient: Patient, allRecords: ClinicalRecord[], conflicts: DataConflict[], question: string): CopilotResponse {
  const records = sortRecords(allRecords.filter((record) => record.patientId === patient.id))
  const query = q(question)
  let selected: ClinicalRecord[] = []
  let statements: CopilotStatement[] | undefined

  if (query.includes('medication')) selected = records.filter((record) => record.domain === 'Medication')
  else if (query.includes('imaging') || query.includes('ct')) selected = records.filter((record) => record.domain === 'Imaging')
  else if (query.includes('investigation')) selected = records.filter((record) => record.domain === 'Imaging' || record.domain === 'Lab')
  else if (query.includes('external') || query.includes('organization') || query.includes('source')) selected = records.filter((record) => record.provenance.sourceSystemId !== 'sys-epic')
  else if (query.includes('conflict')) selected = conflicts.filter((conflict) => conflict.patientId === patient.id).flatMap((conflict) => conflict.recordIds).map((recordId) => records.find((record) => record.id === recordId)).filter((record): record is ClinicalRecord => Boolean(record))
  else if (query.includes('last 30 days') || query.includes('recent') || query.includes('changed')) {
    const demoNow = new Date(DEMO_NOW).getTime()
    const from = demoNow - 30 * 24 * 60 * 60 * 1000
    const recentRecords = records.filter((record) => {
      const clinicalTime = new Date(record.provenance.clinicalAt).getTime()
      return clinicalTime >= from && clinicalTime <= demoNow
    })
    const medicationChange = recentRecords.find((record) => record.id === 'rec-med-citycare') ?? latest(recentRecords, 'Medication')
    const investigation = latest(recentRecords.filter((record) => record.id !== 'rec-lab-aug12-epic-forward'), 'Lab')
    const imaging = latest(recentRecords, 'Imaging')
    const encounter = recentRecords.find((record) => record.id === 'rec-enc-aug3') ?? latest(recentRecords, 'Encounter')
    const outstanding = latest(records.filter((record) => record.domain === 'Appointment' && new Date(record.provenance.clinicalAt).getTime() >= demoNow), 'Appointment')
    const representative = [medicationChange, imaging, investigation, encounter, outstanding].filter((record): record is ClinicalRecord => Boolean(record))
    statements = representative.map((record, index) => ({
      id: `copilot-summary-${index}`,
      text: `${record.domain === 'Appointment' ? 'Outstanding event' : record.domain} — ${record.title}: ${record.summary}`,
      citations: [citationFor(record)],
    }))
  } else selected = records.slice(0, 6)

  if (!statements) {
    const unique = selected.filter((record, index, array) => array.findIndex((candidate) => candidate.id === record.id) === index)
    statements = unique.length > 0 ? unique.map((record, index) => ({
      id: `copilot-${index}`,
      text: `${record.provenance.clinicalAt.slice(0, 10)} — ${record.title}: ${record.summary}`,
      citations: [citationFor(record)],
    })) : [{ id: 'copilot-empty', text: 'No supporting record was found in the currently connected demo sources.', citations: [] }]
  }

  if (query.includes('conflict')) {
    const active = conflicts.filter((conflict) => conflict.patientId === patient.id && conflict.status === 'Open')
    if (active.length) statements.unshift({
      id: 'copilot-conflict-note',
      text: `${active.length} cross-source conflict${active.length > 1 ? 's' : ''} require human reconciliation. HealthConnect does not automatically choose a clinically correct source.`,
      citations: resolveSourceCitations(active.flatMap((conflict) => conflict.recordIds), records),
    })
  }

  const delayed = records.filter((record) => record.provenance.freshness === 'Delayed' || record.provenance.freshness === 'Stale')
  if (delayed.length > 0) {
    statements.push({
      id: 'copilot-freshness-warning',
      text: `Data Freshness — ${delayed.length} supporting record${delayed.length === 1 ? '' : 's'} are marked ${overallFreshness(delayed)}. Treat this information as potentially outdated until the source feed is refreshed.`,
      citations: delayed.slice(0, 4).map(citationFor),
    })
  }

  return {
    id: `copilot-${Date.now()}`,
    patientId: patient.id,
    question,
    title: 'Source-grounded AI Copilot',
    statements,
    sourcesUsed: new Set(statements.flatMap((statement) => statement.citations.map((citation) => citation.recordId))).size,
    freshness: overallFreshness(records),
    conflicts: conflicts.filter((conflict) => conflict.patientId === patient.id && conflict.status === 'Open').length,
    humanReview: true,
    createdAt: new Date().toISOString(),
  }
}
