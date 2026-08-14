import type { ClinicalRecord, DataConflict } from '../../types/domain'

const normalizedTitle = (record: ClinicalRecord) => record.title.trim().toLowerCase().replace(/\s+/g, ' ')
const minuteDistance = (left: string, right: string) => Math.abs(new Date(left).getTime() - new Date(right).getTime()) / 60_000

export function detectCrossSourceConflicts(patientId: string, records: ClinicalRecord[]): DataConflict[] {
  const patientRecords = records.filter((record) => record.patientId === patientId)
  const conflicts: DataConflict[] = []

  // Demo medication reconciliation: preserve all source records and flag disagreement only.
  const medicationGroups = new Map<string, ClinicalRecord[]>()
  patientRecords.filter((record) => record.domain === 'Medication').forEach((record) => {
    const key = normalizedTitle(record)
    medicationGroups.set(key, [...(medicationGroups.get(key) ?? []), record])
  })
  for (const [name, group] of medicationGroups.entries()) {
    const values = new Set(group.map((record) => record.value ?? record.summary))
    const sources = new Set(group.map((record) => record.provenance.sourceSystemId))
    if (values.size > 1 && sources.size > 1) {
      conflicts.push({
        id: `conflict-med-${patientId}-${name.replace(/\s+/g, '-')}`,
        patientId,
        type: 'Medication',
        title: `${group[0].title} frequency differs across sources`,
        description: group.map((record) => `${record.provenance.sourceOrganization}: ${record.value ?? record.summary}`).join(' • '),
        recordIds: group.map((record) => record.id),
        status: 'Open',
      })
    }
  }

  // Detect a likely forwarded copy of the same clinical event from two systems.
  const seenPairs = new Set<string>()
  patientRecords.forEach((record, index) => {
    patientRecords.slice(index + 1).forEach((other) => {
      if (record.domain !== other.domain) return
      if (normalizedTitle(record) !== normalizedTitle(other)) return
      if (record.provenance.sourceSystemId === other.provenance.sourceSystemId) return
      if (minuteDistance(record.provenance.clinicalAt, other.provenance.clinicalAt) > 10) return
      const pair = [record.id, other.id].sort().join('|')
      if (seenPairs.has(pair)) return
      seenPairs.add(pair)
      conflicts.push({
        id: `conflict-duplicate-${patientId}-${record.id}-${other.id}`,
        patientId,
        type: 'Duplicate Event',
        title: `Potential duplicate ${record.domain.toLowerCase()} event`,
        description: `${record.provenance.sourceOrganization} and ${other.provenance.sourceOrganization} contain a clinically dated ${record.title} event within the same demo time window. Human review is required before grouping.`,
        recordIds: [record.id, other.id],
        status: 'Open',
      })
    })
  })

  return conflicts
}
