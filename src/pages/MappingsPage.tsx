import { ArrowRight, CheckCircle2, Code2, Filter } from 'lucide-react'
import { useState } from 'react'
import { Badge, CustomSelect, EmptyState, InfoBanner, SectionHeader } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'

const mappingStatuses = ['All', 'Mapped', 'Needs Review', 'Unmapped']

export function MappingsPage() {
  const { mappings, systems, currentRole, resolveMapping } = useHealthConnectStore()
  const [status, setStatus] = useState('All')
  const canManage = canRole(currentRole, 'mapping-manage')
  const visible = mappings.filter((mapping) => status === 'All' || mapping.status === status)

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">DATA EXCHANGE</div>
          <h1>Data Mapping</h1>
          <p>Inspect synthetic source-to-target healthcare mappings and terminology normalization rules.</p>
        </div>
        <div className="filter-select">
          <Filter size={14} />
          <CustomSelect ariaLabel="Filter mappings by status" value={status} onChange={setStatus} options={mappingStatuses.map((item) => ({ value: item, label: item }))} />
        </div>
      </div>
      {!canManage && <InfoBanner kind="warning" title="Read-only for current role">Switch to Interoperability Analyst, Integration Engineer, Clinical Informaticist or Administrator to update mappings.</InfoBanner>}
      <section className="panel">
        <SectionHeader title="Mapping workspace" subtitle="Demo concepts only — not production terminology validation." />
        {visible.length === 0 ? <EmptyState title="No mappings match" detail="Change the custom status filter to inspect other mapping rules." /> : (
          <div className="mapping-list">
            {visible.map((mapping) => {
              const system = systems.find((item) => item.id === mapping.sourceSystemId)
              return (
                <div className="mapping-card" key={mapping.id}>
                  <div className="mapping-side"><span>Source</span><strong>{mapping.sourceField}</strong><small>{system?.name}{mapping.sourceCode ? ` · ${mapping.sourceCode}` : ''}</small></div>
                  <ArrowRight size={22} />
                  <div className="mapping-side"><span>Target</span><strong>{mapping.targetResource}.{mapping.targetField}</strong><small>{mapping.transformation}</small></div>
                  <Badge tone={mapping.status === 'Mapped' ? 'success' : mapping.status === 'Needs Review' ? 'warning' : 'critical'}>{mapping.status}</Badge>
                  {mapping.status !== 'Mapped' && <button className="secondary-button compact" disabled={!canManage} onClick={() => resolveMapping(mapping.id)}><CheckCircle2 size={14} />Mark mapped</button>}
                </div>
              )
            })}
          </div>
        )}
      </section>
      <InfoBanner title="Healthcare terminology demo"><span className="inline-icon"><Code2 size={15} />ICD, SNOMED, LOINC and RxNorm labels may appear as interoperability concepts, but this portfolio app does not claim production terminology validation.</span></InfoBanner>
    </div>
  )
}
