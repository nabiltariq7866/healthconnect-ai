import type { ExternalPatientRecord, MatchEvidence, MatchStrength, Patient } from '../../types/domain'

const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')

export function explainIdentityMatch(incoming: ExternalPatientRecord, patient: Patient): MatchEvidence[] {
  const evidence: MatchEvidence[] = []
  const incomingName = normalize(incoming.name)
  const existingName = normalize(patient.name)
  evidence.push({
    field: 'Name', incoming: incoming.name, existing: patient.name,
    state: incomingName === existingName ? 'Exact' : incoming.name.split(' ')[0] === patient.name.split(' ')[0] ? 'Near' : 'Conflict',
    note: incomingName !== existingName ? 'Demo fuzzy-name comparison; human review required.' : undefined,
  })
  evidence.push({ field: 'Date of birth', incoming: incoming.dob, existing: patient.dob, state: incoming.dob === patient.dob ? 'Exact' : 'Conflict' })
  evidence.push({ field: 'Phone', incoming: incoming.phone, existing: patient.phone, state: normalize(incoming.phone) === normalize(patient.phone) ? 'Exact' : incoming.phone && patient.phone ? 'Conflict' : 'Missing' })
  evidence.push({ field: 'Address', incoming: incoming.address, existing: patient.address, state: normalize(incoming.address) === normalize(patient.address) ? 'Exact' : 'Conflict' })
  return evidence
}

export function suggestIdentityMatch(incoming: ExternalPatientRecord, patients: Patient[]): { patientId?: string; strength: MatchStrength; evidence: MatchEvidence[] } {
  let best: { patient?: Patient; score: number; evidence: MatchEvidence[] } = { score: 0, evidence: [] }
  for (const patient of patients) {
    const evidence = explainIdentityMatch(incoming, patient)
    let score = 0
    if (incoming.dob === patient.dob) score += 4
    if (normalize(incoming.phone) === normalize(patient.phone)) score += 4
    if (incoming.name.split(' ')[0].toLowerCase() === patient.name.split(' ')[0].toLowerCase()) score += 2
    if (normalize(incoming.name) === normalize(patient.name)) score += 2
    if (score > best.score) best = { patient, score, evidence }
  }
  const strength: MatchStrength = best.score >= 8 ? 'Strong Match' : best.score >= 5 ? 'Possible Match' : best.score >= 3 ? 'Weak Match' : 'Conflict'
  return { patientId: best.patient?.id, strength, evidence: best.evidence }
}

export function suggestIdentityMatches(incoming: ExternalPatientRecord, patients: Patient[]) {
  return patients
    .map((patient) => {
      const result = suggestIdentityMatch(incoming, [patient])
      const rank: Record<MatchStrength, number> = { 'Strong Match': 4, 'Possible Match': 3, 'Weak Match': 2, Conflict: 1 }
      return { patientId: patient.id, strength: result.strength, evidence: result.evidence, rank: rank[result.strength] }
    })
    .sort((left, right) => right.rank - left.rank)
    .map(({ rank: _rank, ...match }) => match)
}
