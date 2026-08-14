import { describe, expect, it } from 'vitest'
import { clinicalRecords, externalRecords, patients } from '../data/seed'
import { explainIdentityMatch, suggestIdentityMatch, suggestIdentityMatches } from '../services/ai/identityMatchAI'
import { detectCrossSourceConflicts } from '../services/ai/recordConflictAI'
import { resolveSourceCitations } from '../services/ai/sourceGroundingAI'

describe('deterministic healthcare interoperability AI helpers', () => {
  it('explains Emily Robertson as a strong human-review match without auto-merging', () => {
    const incoming = externalRecords.find((record) => record.id === 'ext-emily-citycare')!
    const emily = patients.find((patient) => patient.id === 'pt-emily')!
    const evidence = explainIdentityMatch(incoming, emily)
    expect(evidence.find((item) => item.field === 'Date of birth')?.state).toBe('Exact')
    expect(evidence.find((item) => item.field === 'Phone')?.state).toBe('Exact')
    expect(evidence.find((item) => item.field === 'Name')?.state).toBe('Near')
    expect(evidence.find((item) => item.field === 'Address')?.state).toBe('Conflict')
    expect(suggestIdentityMatch(incoming, patients).strength).toBe('Strong Match')
    expect(suggestIdentityMatches(incoming, patients)[0].patientId).toBe('pt-emily')
  })

  it('detects the duplicate forwarded laboratory event deterministically', () => {
    const conflicts = detectCrossSourceConflicts('pt-emily', clinicalRecords)
    const duplicate = conflicts.find((conflict) => conflict.type === 'Duplicate Event')
    expect(duplicate?.recordIds).toEqual(expect.arrayContaining(['rec-lab-aug12', 'rec-lab-aug12-epic-forward']))
  })

  it('resolves source citations only to existing exact records', () => {
    const citations = resolveSourceCitations(['rec-ct-aug9', 'missing', 'rec-lab-aug12'], clinicalRecords)
    expect(citations.map((citation) => citation.recordId)).toEqual(['rec-ct-aug9', 'rec-lab-aug12'])
    expect(citations[0].label).toContain('Prime Imaging Centre')
  })
})
