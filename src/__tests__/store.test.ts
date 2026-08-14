import { beforeEach, describe, expect, it } from 'vitest'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'

beforeEach(() => {
  localStorage.clear()
  useHealthConnectStore.getState().resetDemo()
})

describe('HealthConnect connected workflows', () => {
  it('seeds the requested enterprise integration landscape', () => {
    const state = useHealthConnectStore.getState()
    expect(state.systems).toHaveLength(8)
    expect(state.interfaces).toHaveLength(14)
    expect(state.systems.reduce((sum, system) => sum + system.messagesToday, 0)).toBe(128441)
    for (const type of ['ADT', 'ORU', 'ORM', 'FHIR Patient', 'FHIR Observation', 'FHIR MedicationRequest', 'DICOM Study', 'REST Event']) {
      expect(state.messages.some((message) => message.type === type)).toBe(true)
    }
  })

  it('preserves identifiers and adds source records after a human-approved identity merge', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    const result = useHealthConnectStore.getState().mergeCandidate('idq-emily', 'Verified DOB and phone; address variation reviewed')
    expect(result.ok).toBe(true)
    const next = useHealthConnectStore.getState()
    const emily = next.patients.find((patient) => patient.id === 'pt-emily')!
    expect(emily.sourceSystemIds).toContain('sys-oracle')
    expect(emily.sourceSystemIds).toHaveLength(5)
    expect(emily.identifiers.some((identifier) => identifier.value === 'ORC-201839')).toBe(true)
    expect(next.clinicalRecords.find((record) => record.id === 'rec-med-citycare')?.patientId).toBe('pt-emily')
    expect(next.identityCandidates.find((candidate) => candidate.id === 'idq-emily')?.status).toBe('Merged')
    expect(next.conflicts.some((conflict) => conflict.patientId === 'pt-emily' && conflict.type === 'Medication')).toBe(true)
    expect(next.conflicts.some((conflict) => conflict.patientId === 'pt-emily' && conflict.type === 'Demographic')).toBe(true)
    expect(next.mergeHistory).toHaveLength(1)
    expect(next.audits.some((audit) => audit.action === 'Patient records merged')).toBe(true)
  })

  it('prevents unauthorized and repeated identity decisions', () => {
    useHealthConnectStore.getState().setRole('Clinician')
    expect(useHealthConnectStore.getState().mergeCandidate('idq-emily', 'Should be denied').ok).toBe(false)
    expect(useHealthConnectStore.getState().identityCandidates.find((candidate) => candidate.id === 'idq-emily')?.status).toBe('Needs Review')

    useHealthConnectStore.getState().setRole('Data Steward')
    expect(useHealthConnectStore.getState().keepSeparate('idq-emily', 'Reviewed as distinct').ok).toBe(true)
    expect(useHealthConnectStore.getState().mergeCandidate('idq-emily', 'Should remain final').ok).toBe(false)
    expect(useHealthConnectStore.getState().identityCandidates.find((candidate) => candidate.id === 'idq-emily')?.status).toBe('Kept Separate')
  })

  it('supports request-review and link-related human identity decisions with audit history', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    expect(useHealthConnectStore.getState().requestIdentityReview('idq-emily').ok).toBe(true)
    expect(useHealthConnectStore.getState().identityCandidates.find((candidate) => candidate.id === 'idq-emily')?.status).toBe('Review Requested')
    expect(useHealthConnectStore.getState().linkRelated('idq-emily', 'Related external record, not destructive merge').ok).toBe(true)
    const next = useHealthConnectStore.getState()
    expect(next.identityCandidates.find((candidate) => candidate.id === 'idq-emily')?.status).toBe('Linked')
    expect(next.audits.some((audit) => audit.action === 'External record linked as related')).toBe(true)
  })

  it('propagates interface degradation to freshness and restores it only after sync', () => {
    useHealthConnectStore.getState().setRole('Integration Engineer')
    expect(useHealthConnectStore.getState().createInterfaceError('int-lab-oru').ok).toBe(true)
    let next = useHealthConnectStore.getState()
    expect(next.interfaces.find((item) => item.id === 'int-lab-oru')?.status).toBe('Degraded')
    expect(next.clinicalRecords.find((record) => record.id === 'rec-lab-aug12')?.provenance.freshness).toBe('Delayed')

    expect(next.restoreInterface('int-lab-oru').ok).toBe(true)
    next = useHealthConnectStore.getState()
    expect(next.interfaces.find((item) => item.id === 'int-lab-oru')?.status).toBe('Connected')
    expect(next.clinicalRecords.find((record) => record.id === 'rec-lab-aug12')?.provenance.freshness).toBe('Delayed')

    expect(next.simulateSync('int-lab-oru').ok).toBe(true)
    next = useHealthConnectStore.getState()
    expect(next.clinicalRecords.find((record) => record.id === 'rec-lab-aug12')?.provenance.freshness).toBe('Current')
    expect(next.clinicalRecords.some((record) => record.patientId === 'pt-emily' && record.title === 'C-reactive protein' && record.provenance.messageId?.startsWith('MSG-SYNC'))).toBe(true)
    expect(next.qualityIssues.filter((issue) => issue.sourceSystemId === 'sys-lis' && issue.type === 'Stale data' && issue.status !== 'Resolved')).toHaveLength(0)
  })

  it('pauses an interface and makes source records delayed until restore and sync', () => {
    useHealthConnectStore.getState().setRole('Integration Engineer')
    expect(useHealthConnectStore.getState().pauseInterface('int-lab-oru').ok).toBe(true)
    let state = useHealthConnectStore.getState()
    expect(state.interfaces.find((item) => item.id === 'int-lab-oru')?.status).toBe('Maintenance')
    expect(state.clinicalRecords.find((record) => record.id === 'rec-lab-aug12')?.provenance.freshness).toBe('Delayed')
    expect(state.pauseInterface('int-lab-oru').ok).toBe(false)
    expect(state.restoreInterface('int-lab-oru').ok).toBe(true)
    state = useHealthConnectStore.getState()
    expect(state.clinicalRecords.find((record) => record.id === 'rec-lab-aug12')?.provenance.freshness).toBe('Delayed')
    expect(state.simulateSync('int-lab-oru').ok).toBe(true)
    expect(useHealthConnectStore.getState().clinicalRecords.find((record) => record.id === 'rec-lab-aug12')?.provenance.freshness).toBe('Current')
  })

  it('repairs a failed missing-identifier message before retry and blocks invalid retry', () => {
    useHealthConnectStore.getState().setRole('Integration Engineer')
    expect(useHealthConnectStore.getState().retryMessage('MSG-20260814-FAIL01').ok).toBe(false)
    expect(useHealthConnectStore.getState().repairMessageIssue('MSG-20260814-FAIL01').ok).toBe(true)
    expect(useHealthConnectStore.getState().retryMessage('MSG-20260814-FAIL01').ok).toBe(true)
    const message = useHealthConnectStore.getState().messages.find((item) => item.id === 'MSG-20260814-FAIL01')!
    expect(message.status).toBe('Processed')
    expect(message.pipeline.every((step) => step.status === 'Complete')).toBe(true)
    expect(useHealthConnectStore.getState().retryMessage('MSG-20260814-FAIL01').ok).toBe(false)
  })

  it('links an unmatched laboratory record into the unified patient and audit trail', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    const result = useHealthConnectStore.getState().linkUnmatchedRecord('unmatched-lab-1', 'pt-emily')
    expect(result.ok).toBe(true)
    const next = useHealthConnectStore.getState()
    expect(next.unmatchedRecords.find((item) => item.id === 'unmatched-lab-1')?.status).toBe('Linked')
    expect(next.clinicalRecords.find((record) => record.id === 'rec-unmatched-lab')?.patientId).toBe('pt-emily')
    expect(next.patients.find((patient) => patient.id === 'pt-emily')?.sourceSystemIds).toContain('sys-lis')
    expect(next.audits.some((audit) => audit.action === 'Unmatched record linked')).toBe(true)
    expect(next.linkUnmatchedRecord('unmatched-lab-1', 'pt-emily').ok).toBe(false)
  })

  it('creates a deterministic new unmatched lab demo that remains outside Patient 360 until human linking', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    expect(useHealthConnectStore.getState().createDemoUnmatchedLab().ok).toBe(true)
    let state = useHealthConnectStore.getState()
    const generated = state.unmatchedRecords.find((item) => item.record.title === 'NT-proBNP' && item.status === 'Unmatched')!
    expect(generated).toBeDefined()
    expect(state.clinicalRecords.some((record) => record.id === generated.record.id)).toBe(false)
    expect(state.createDemoUnmatchedLab().ok).toBe(false)
    expect(state.linkUnmatchedRecord(generated.id, 'pt-emily').ok).toBe(true)
    state = useHealthConnectStore.getState()
    expect(state.clinicalRecords.find((record) => record.id === generated.record.id)?.patientId).toBe('pt-emily')
  })

  it('resolves mapping issues and refuses to retry an already mapped rule', () => {
    useHealthConnectStore.getState().setRole('Clinical Informaticist')
    expect(useHealthConnectStore.getState().resolveMapping('map-3').ok).toBe(true)
    const next = useHealthConnectStore.getState()
    expect(next.mappings.find((mapping) => mapping.id === 'map-3')?.status).toBe('Mapped')
    expect(next.qualityIssues.find((issue) => issue.relatedId === 'map-3')?.status).toBe('Resolved')
    expect(next.resolveMapping('map-3').ok).toBe(false)
  })

  it('allows human grouping of duplicate events but never destructive source deletion', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    const duplicate = useHealthConnectStore.getState().conflicts.find((conflict) => conflict.type === 'Duplicate Event')!
    expect(duplicate).toBeDefined()
    const sourceIds = [...duplicate.recordIds]
    expect(useHealthConnectStore.getState().reviewConflict(duplicate.id, 'Grouped').ok).toBe(true)
    const next = useHealthConnectStore.getState()
    expect(next.conflicts.find((conflict) => conflict.id === duplicate.id)?.status).toBe('Grouped')
    for (const recordId of sourceIds) expect(next.clinicalRecords.some((record) => record.id === recordId)).toBe(true)
    expect(next.reviewConflict(duplicate.id, 'Reviewed').ok).toBe(false)
  })

  it('requires a valid record when selecting a cross-source display preference', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    useHealthConnectStore.getState().mergeCandidate('idq-emily', 'Create medication conflict')
    const conflict = useHealthConnectStore.getState().conflicts.find((item) => item.type === 'Medication' && item.status === 'Open')!
    expect(useHealthConnectStore.getState().reviewConflict(conflict.id, 'Display Preference Set', 'not-in-conflict').ok).toBe(false)
    expect(useHealthConnectStore.getState().reviewConflict(conflict.id, 'Display Preference Set', conflict.recordIds[0]).ok).toBe(true)
  })

  it('returns source-grounded Copilot answers and no unsourced facts', () => {
    useHealthConnectStore.getState().setRole('Clinician')
    const answer = useHealthConnectStore.getState().askCopilot('pt-emily', 'What changed recently?')
    expect(answer).toBeDefined()
    expect(answer!.statements.some((statement) => statement.citations.length > 0)).toBe(true)
    expect(answer!.sourcesUsed).toBeGreaterThan(0)
    const citation = answer!.statements.flatMap((statement) => statement.citations)[0]
    expect(useHealthConnectStore.getState().clinicalRecords.some((record) => record.id === citation.recordId)).toBe(true)

    const empty = useHealthConnectStore.getState().askCopilot('pt-maria', 'Show recent investigations')
    expect(empty?.statements[0].text).toContain('No supporting record')
  })

  it('builds a sectioned unified patient summary grounded in exact records', () => {
    useHealthConnectStore.getState().setRole('Clinician')
    const summary = useHealthConnectStore.getState().generatePatientSummary('pt-emily')!
    expect(summary.statements.some((statement) => statement.text.startsWith('Recent Care'))).toBe(true)
    expect(summary.statements.some((statement) => statement.text.startsWith('Conditions'))).toBe(true)
    expect(summary.statements.some((statement) => statement.text.startsWith('Medication Changes'))).toBe(true)
    expect(summary.statements.some((statement) => statement.text.startsWith('Investigations'))).toBe(true)
    expect(summary.statements.some((statement) => statement.text.startsWith('Source Coverage'))).toBe(true)
    for (const citation of summary.statements.flatMap((statement) => statement.citations)) {
      expect(useHealthConnectStore.getState().clinicalRecords.some((record) => record.id === citation.recordId)).toBe(true)
    }
  })

  it('preserves late-arriving clinical and received timestamps independently', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    useHealthConnectStore.getState().mergeCandidate('idq-emily', 'Human verified')
    const medication = useHealthConnectStore.getState().clinicalRecords.find((record) => record.id === 'rec-med-citycare')!
    expect(new Date(medication.provenance.clinicalAt).getTime()).toBeLessThan(new Date(medication.provenance.receivedAt).getTime())
  })

  it('records source provenance views in the immutable-style audit history', () => {
    const before = useHealthConnectStore.getState().audits.length
    useHealthConnectStore.getState().logSourceView('rec-ct-aug9')
    const next = useHealthConnectStore.getState()
    expect(next.audits.length).toBe(before + 1)
    expect(next.audits[0].action).toBe('Source record viewed')
    expect(next.clinicalRecords.find((record) => record.id === 'rec-ct-aug9')?.provenance.originalRecordId).toBe('PACS-STUDY-39011')
  })

  it('reset restores original identity, interface and data-quality state', () => {
    useHealthConnectStore.getState().setRole('Data Steward')
    useHealthConnectStore.getState().mergeCandidate('idq-emily', 'Human verified')
    useHealthConnectStore.getState().setRole('Integration Engineer')
    useHealthConnectStore.getState().createInterfaceError('int-lab-oru')
    useHealthConnectStore.getState().resetDemo()
    const state = useHealthConnectStore.getState()
    expect(state.currentRole).toBe('Data Steward')
    expect(state.identityCandidates.find((candidate) => candidate.id === 'idq-emily')?.status).toBe('Needs Review')
    expect(state.interfaces.find((connection) => connection.id === 'int-lab-oru')?.status).toBe('Connected')
    expect(state.patients.find((patient) => patient.id === 'pt-emily')?.sourceSystemIds).not.toContain('sys-oracle')
  })
})
