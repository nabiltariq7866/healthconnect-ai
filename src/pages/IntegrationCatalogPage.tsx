import { AlertOctagon, ArrowRightLeft, Database, Network, Pause, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, ConnectionBadge, Drawer, InfoBanner, ProtocolBadge, SectionHeader, formatDate } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'

export function IntegrationCatalogPage() {
  const {
    systems,
    interfaces,
    messages,
    mappings,
    audits,
    currentRole,
    pauseInterface,
    createInterfaceError,
    restoreInterface,
    simulateSync,
  } = useHealthConnectStore()
  const [selectedSystemId, setSelectedSystemId] = useState<string>()
  const selectedSystem = systems.find((system) => system.id === selectedSystemId)
  const relatedInterfaces = useMemo(
    () => interfaces.filter((connection) => connection.sourceSystemId === selectedSystemId),
    [interfaces, selectedSystemId],
  )
  const canManage = canRole(currentRole, 'interface-manage')

  const activity = useMemo(() => {
    if (!selectedSystem) return []
    const relatedIds = new Set(relatedInterfaces.map((connection) => connection.id))
    return audits
      .filter((audit) => audit.object === selectedSystem.id || relatedIds.has(audit.object) || audit.entity === selectedSystem.organization)
      .slice(0, 6)
  }, [audits, relatedInterfaces, selectedSystem])

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">SYSTEM</div>
          <h1>Integration Catalog</h1>
          <p>All source systems are fictional, demo-labelled connections. No live healthcare endpoint is configured.</p>
        </div>
      </div>

      {!canManage && (
        <InfoBanner kind="warning" title="Read-only for current role">
          Integration state changes are restricted to Integration Engineer and Administrator roles.
        </InfoBanner>
      )}

      <section className="panel">
        <SectionHeader title="Connected source systems" subtitle="Enterprise catalog of synthetic healthcare integrations and data domains." />
        <div className="integration-catalog">
          {systems.map((system) => {
            const related = interfaces.filter((connection) => connection.sourceSystemId === system.id)
            return (
              <article className="integration-card" key={system.id}>
                <div className="integration-card-top">
                  <div className="system-icon"><Database size={19} /></div>
                  <div><strong>{system.name}</strong><span>{system.organization}</span></div>
                  <ConnectionBadge status={system.status} />
                </div>
                <div className="catalog-meta">
                  <div><Network size={14} /><span>{system.type}</span></div>
                  <ProtocolBadge protocol={system.protocol} />
                  <div><RefreshCw size={14} /><span>{formatDate(system.lastSync)}</span></div>
                </div>
                <div className="tag-list">{system.dataDomains.map((domain) => <span key={domain}>{domain}</span>)}</div>
                <div className="catalog-foot">
                  <span>{related.length} interface{related.length === 1 ? '' : 's'}</span>
                  <span>{system.messagesToday.toLocaleString()} messages today</span>
                  <span className="demo-label"><ShieldCheck size={13} />{system.demoLabel}</span>
                </div>
                <button className="secondary-button catalog-action" onClick={() => setSelectedSystemId(system.id)}>
                  View integration
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <Drawer
        open={Boolean(selectedSystem)}
        title={selectedSystem?.name ?? 'Integration'}
        subtitle={selectedSystem ? `${selectedSystem.organization} · ${selectedSystem.demoLabel ?? 'Synthetic integration'}` : undefined}
        onClose={() => setSelectedSystemId(undefined)}
        wide
      >
        {selectedSystem && (
          <>
            <div className="detail-kpis">
              <div><span>Status</span><ConnectionBadge status={selectedSystem.status} /></div>
              <div><span>Primary protocol</span><ProtocolBadge protocol={selectedSystem.protocol} /></div>
              <div><span>Last sync</span><strong>{formatDate(selectedSystem.lastSync)}</strong></div>
              <div><span>Messages today</span><strong>{selectedSystem.messagesToday.toLocaleString()}</strong></div>
            </div>

            <InfoBanner kind="info" title="Simulation only">
              Endpoint labels, messages, mappings and state transitions are frontend-only synthetic examples. No real Epic, Oracle, FHIR, HL7, DICOM or other healthcare endpoint is contacted.
            </InfoBanner>

            <div className="integration-detail-grid">
              <section>
                <h3>Integration profile</h3>
                <dl className="key-value">
                  <dt>Name</dt><dd>{selectedSystem.name}</dd>
                  <dt>Type</dt><dd>{selectedSystem.type}</dd>
                  <dt>Organization</dt><dd>{selectedSystem.organization}</dd>
                  <dt>Protocol</dt><dd>{selectedSystem.protocol}</dd>
                  <dt>Direction</dt><dd>{relatedInterfaces.map((connection) => connection.direction).filter((value, index, array) => array.indexOf(value) === index).join(', ') || 'Not configured'}</dd>
                  <dt>Error rate</dt><dd>{relatedInterfaces.reduce((sum, connection) => sum + connection.errors, 0)} demo error(s)</dd>
                </dl>
              </section>
              <section>
                <h3>Data domains</h3>
                <div className="tag-list">{selectedSystem.dataDomains.map((domain) => <Badge key={domain}>{domain}</Badge>)}</div>
                <h3>Mapping coverage</h3>
                <p className="muted">
                  {mappings.filter((mapping) => mapping.sourceSystemId === selectedSystem.id && mapping.status === 'Mapped').length} mapped ·{' '}
                  {mappings.filter((mapping) => mapping.sourceSystemId === selectedSystem.id && mapping.status !== 'Mapped').length} requiring review
                </p>
              </section>
            </div>

            <section>
              <h3>Interfaces</h3>
              <div className="integration-interface-list">
                {relatedInterfaces.map((connection) => (
                  <div className="integration-interface-item" key={connection.id}>
                    <div>
                      <strong>{connection.name}</strong>
                      <small>{connection.endpointLabel}</small>
                    </div>
                    <ProtocolBadge protocol={connection.protocol} />
                    <ConnectionBadge status={connection.status} />
                    <span className="inline-icon"><ArrowRightLeft size={14} />{connection.direction}</span>
                  </div>
                ))}
              </div>
            </section>

            {relatedInterfaces[0] && (
              <div className="integration-detail-actions">
                <button className="secondary-button" disabled={!canManage || !['Connected', 'Delayed'].includes(relatedInterfaces[0].status)} onClick={() => pauseInterface(relatedInterfaces[0].id)}>
                  <Pause size={16} />Pause Feed
                </button>
                <button className="danger-button" disabled={!canManage || !['Connected', 'Delayed'].includes(relatedInterfaces[0].status)} onClick={() => createInterfaceError(relatedInterfaces[0].id)}>
                  <AlertOctagon size={16} />Create Demo Error
                </button>
                <button className="secondary-button" disabled={!canManage || relatedInterfaces[0].status === 'Connected'} onClick={() => restoreInterface(relatedInterfaces[0].id)}>
                  <RotateCcw size={16} />Restore Connection
                </button>
                <button className="primary-button" disabled={!canManage || relatedInterfaces[0].status !== 'Connected'} onClick={() => simulateSync(relatedInterfaces[0].id)}>
                  <RefreshCw size={16} />Simulate Sync
                </button>
              </div>
            )}

            <div className="catalog-activity">
              <h3>Recent activity</h3>
              <div className="catalog-activity-list">
                {activity.length > 0 ? activity.map((audit) => (
                  <div key={audit.id}><strong>{audit.action}</strong><span>{formatDate(audit.timestamp)}</span></div>
                )) : <p className="muted">No recent state-changing activity for this synthetic integration.</p>}
                {messages.filter((message) => message.sourceSystemId === selectedSystem.id).slice(0, 2).map((message) => (
                  <div key={message.id}><strong>{message.type} · {message.status}</strong><span>{formatDate(message.timestamp)}</span></div>
                ))}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}
