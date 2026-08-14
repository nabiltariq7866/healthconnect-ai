import { AlertTriangle, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoBanner, Modal, SectionHeader } from '../components/UI'
import { canRole, useHealthConnectStore } from '../stores/useHealthConnectStore'

export function SettingsPage() {
  const navigate = useNavigate()
  const { currentRole, resetDemo, createInterfaceError, restoreInterface, simulateSync } = useHealthConnectStore()
  const [confirm, setConfirm] = useState(false)
  const canAdmin = canRole(currentRole, 'interface-manage')

  const restoreAndSync = () => {
    const restored = restoreInterface('int-lab-oru')
    if (restored.ok) simulateSync('int-lab-oru')
  }

  return (
    <div>
      <div className="page-hero"><div><div className="eyebrow">SYSTEM</div><h1>Settings & Demo Controls</h1><p>Run deterministic portfolio scenarios or restore the original synthetic healthcare data.</p></div></div>
      <section className="panel">
        <SectionHeader title="Demo scenarios" subtitle="These controls mutate the same state used by Interfaces, Patient 360, Data Quality and Audit." />
        <div className="scenario-grid">
          <div className="scenario-card"><AlertTriangle size={20} /><div><strong>Metro Lab Interface Failure</strong><p>Marks Metro Diagnostics degraded and patient lab data delayed.</p></div><button className="secondary-button" disabled={!canAdmin} onClick={() => createInterfaceError('int-lab-oru')}>Run error</button></div>
          <div className="scenario-card"><RefreshCw size={20} /><div><strong>Restore & Sync Laboratory</strong><p>Restores the interface, then adds a new synthetic lab observation to Emily&apos;s Patient 360.</p></div><button className="secondary-button" disabled={!canAdmin} onClick={restoreAndSync}>Restore + sync</button></div>
          <div className="scenario-card"><ShieldCheck size={20} /><div><strong>Identity Merge Workflow</strong><p>Use the Identity Queue to review Emily Robertson before a human-approved merge.</p></div><button className="secondary-button" onClick={() => navigate('/identity')}>Open identity queue</button></div>
        </div>
        {!canAdmin && <InfoBanner kind="warning" title="Scenario permission">Switch to Integration Engineer or Administrator to run integration scenarios. Identity actions remain controlled separately by identity-review permissions.</InfoBanner>}
      </section>
      <section className="panel danger-zone"><SectionHeader title="Reset demo data" subtitle="Restores all source systems, identity candidates, records, messages, mappings, audit seeds and UI state." /><button className="danger-button" onClick={() => setConfirm(true)}><RotateCcw size={16} />Reset HealthConnect Demo</button></section>
      <Modal open={confirm} title="Reset all synthetic demo data?" onClose={() => setConfirm(false)}><p>This will discard your current merge decisions, interface scenarios, data-quality resolutions and generated AI responses.</p><div className="action-row end"><button className="secondary-button" onClick={() => setConfirm(false)}>Cancel</button><button className="danger-button" onClick={() => { resetDemo(); setConfirm(false) }}>Reset demo</button></div></Modal>
    </div>
  )
}
