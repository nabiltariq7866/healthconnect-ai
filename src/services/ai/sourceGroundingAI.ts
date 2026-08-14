import type { ClinicalRecord, Freshness, SourceCitation } from '../../types/domain'

export function citationFor(record: ClinicalRecord): SourceCitation {
  return {
    recordId: record.id,
    label: `${record.provenance.sourceOrganization} · ${record.title}`,
    sourceSystemId: record.provenance.sourceSystemId,
    timestamp: record.provenance.clinicalAt,
  }
}

export function resolveSourceCitations(recordIds: string[], records: ClinicalRecord[]): SourceCitation[] {
  return recordIds
    .map((recordId) => records.find((record) => record.id === recordId))
    .filter((record): record is ClinicalRecord => Boolean(record))
    .map(citationFor)
}

export function overallFreshness(records: ClinicalRecord[]): Freshness {
  if (records.some((record) => record.provenance.freshness === 'Delayed')) return 'Delayed'
  if (records.some((record) => record.provenance.freshness === 'Stale')) return 'Stale'
  if (records.some((record) => record.provenance.freshness === 'Unknown')) return 'Unknown'
  return 'Current'
}
