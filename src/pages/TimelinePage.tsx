import { ExternalLink, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, SectionHeader, formatDate, formatDateOnly } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'
import type { ClinicalDomain } from '../types/domain'

const domains: Array<'All' | ClinicalDomain> = ['All', 'Encounter', 'Condition', 'Medication', 'Allergy', 'Lab', 'Imaging', 'Document', 'Appointment', 'Device']

export function TimelinePage() {
  const navigate = useNavigate()
  const { clinicalRecords, patients, systems } = useHealthConnectStore()
  const [domain, setDomain] = useState<'All' | ClinicalDomain>('All')
  const records = useMemo(
    () => clinicalRecords
      .filter((record) => record.patientId && (domain === 'All' || record.domain === domain))
      .sort((a, b) => new Date(b.provenance.clinicalAt).getTime() - new Date(a.provenance.clinicalAt).getTime()),
    [clinicalRecords, domain],
  )

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">PATIENT 360</div>
          <h1>Longitudinal Timeline</h1>
          <p>Cross-patient demonstration of clinically dated events with source, source date and received-time provenance.</p>
        </div>
        <div className="filter-select">
          <Filter size={15} />
          <CustomSelect ariaLabel="Filter timeline by clinical domain" value={domain} onChange={(value) => setDomain(value as 'All' | ClinicalDomain)} options={domains.map((item) => ({ value: item, label: item }))} />
        </div>
      </div>
      <section className="panel">
        <SectionHeader title="Unified events" subtitle={`${records.length} detailed synthetic records across the demo cohort.`} />
        {records.length === 0 ? <EmptyState title="No timeline events" detail="No unified records match the selected domain." /> : (
          <div className="timeline-list full">
            {records.map((record) => {
              const patient = patients.find((item) => item.id === record.patientId)
              const system = systems.find((item) => item.id === record.provenance.sourceSystemId)
              return (
                <button className="timeline-row" key={record.id} onClick={() => navigate(`/patients/${record.patientId}`)}>
                  <div className="timeline-date"><strong>{formatDateOnly(record.provenance.clinicalAt)}</strong><Badge>{record.domain}</Badge></div>
                  <div className="timeline-line"><i /></div>
                  <div className="timeline-content">
                    <strong>{record.title}</strong>
                    <p>{patient?.name} · {record.summary}</p>
                    <span>Source: {record.provenance.sourceOrganization} · {system?.name} · Clinical {formatDate(record.provenance.clinicalAt)} · Received {formatDate(record.provenance.receivedAt)}</span>
                  </div>
                  <ExternalLink size={15} />
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
