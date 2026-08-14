import type { ClinicalRecord, CopilotResponse, CopilotStatement, DataConflict, Patient } from '../../types/domain'
import { citationFor, overallFreshness, resolveSourceCitations } from './sourceGroundingAI'

const byClinicalDateDesc = (a: ClinicalRecord, b: ClinicalRecord) => new Date(b.provenance.clinicalAt).getTime() - new Date(a.provenance.clinicalAt).getTime()
const latest = (records: ClinicalRecord[], domains: ClinicalRecord['domain'][]): ClinicalRecord | undefined =>
  [...records].filter((record) => domains.includes(record.domain)).sort(byClinicalDateDesc)[0]

function groundedStatement(id: string, section: string, record?: ClinicalRecord): CopilotStatement | undefined {
  if (!record) return undefined
  return {
    id,
    text: `${section} — ${record.title}: ${record.summary}`,
    citations: [citationFor(record)],
  }
}

export function generateUnifiedPatientSummary(patient: Patient, records: ClinicalRecord[], conflicts: DataConflict[]): CopilotResponse {
  const patientRecords = records.filter((record) => record.patientId === patient.id).sort(byClinicalDateDesc)
  const openConflicts = conflicts.filter((conflict) => conflict.patientId === patient.id && conflict.status === 'Open')
  const statements: CopilotStatement[] = []

  const recentCare = groundedStatement('summary-recent-care', 'Recent Care', latest(patientRecords, ['Encounter']))
  const condition = groundedStatement('summary-condition', 'Conditions', latest(patientRecords, ['Condition']))
  const medication = groundedStatement('summary-medication', 'Medication Changes', latest(patientRecords, ['Medication']))
  const investigation = groundedStatement('summary-investigation', 'Investigations', latest(patientRecords, ['Lab', 'Imaging']))
  const outstanding = groundedStatement('summary-outstanding', 'Outstanding Records', latest(patientRecords, ['Appointment']))
  ;[recentCare, condition, medication, investigation, outstanding].forEach((statement) => { if (statement) statements.push(statement) })

  if (openConflicts.length > 0) {
    const conflict = openConflicts[0]
    statements.push({
      id: 'summary-conflict',
      text: `Data Conflicts — ${openConflicts.length} cross-source conflict${openConflicts.length > 1 ? 's' : ''} require human review. Example: ${conflict.title}.`,
      citations: resolveSourceCitations(conflict.recordIds, patientRecords),
    })
  }

  if (patientRecords.length > 0) {
    const sourceRecords = patientRecords
      .filter((record, index, array) => array.findIndex((candidate) => candidate.provenance.sourceSystemId === record.provenance.sourceSystemId) === index)
      .slice(0, 6)
    statements.push({
      id: 'summary-source-coverage',
      text: `Source Coverage — the current unified record contains traceable clinical data from ${sourceRecords.length} connected source system${sourceRecords.length === 1 ? '' : 's'}.`,
      citations: sourceRecords.map(citationFor),
    })
  }

  if (statements.length === 0) {
    statements.push({ id: 'summary-empty', text: 'No supporting record was found in the currently connected demo sources.', citations: [] })
  }

  return {
    id: `summary-${patient.id}`,
    patientId: patient.id,
    question: 'Unified Patient Summary',
    title: 'Unified Patient Summary',
    statements,
    sourcesUsed: new Set(statements.flatMap((statement) => statement.citations.map((citation) => citation.recordId))).size,
    freshness: overallFreshness(patientRecords),
    conflicts: openConflicts.length,
    humanReview: true,
    createdAt: new Date().toISOString(),
  }
}
