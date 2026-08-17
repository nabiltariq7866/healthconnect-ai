import { Activity, ArrowRight, CircleAlert, Database, GitMerge, Network, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ConnectionBadge, MetricCard, ProtocolBadge, SectionHeader, formatDate } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'

const activity = [
  { time: '06:00', messages: 6900 }, { time: '07:00', messages: 8400 }, { time: '08:00', messages: 11200 },
  { time: '09:00', messages: 13600 }, { time: '10:00', messages: 15100 }, { time: '11:00', messages: 12400 },
]

export function OverviewPage() {
  const navigate = useNavigate()
  const { systems, interfaces, patients, identityCandidates, qualityIssues, messages, unmatchedRecords, audits } = useHealthConnectStore()
  const integrated = systems.filter((system) => system.status !== 'Offline').length
  const detailedReviews = identityCandidates.filter((candidate) => candidate.status === 'Needs Review' || candidate.status === 'Review Requested').length
  const networkIdentityReviews = 21 + detailedReviews
  const detailedDuplicates = qualityIssues.filter((issue) => issue.type === 'Duplicate identity' && issue.status !== 'Resolved').length
  const potentialDuplicates = 16 + detailedDuplicates
  const detailedMappingIssues = qualityIssues.filter((issue) => issue.type === 'Mapping failure' && issue.status !== 'Resolved').length
  const mappingIssues = 10 + detailedMappingIssues
  const openIssues = qualityIssues.filter((issue) => issue.status !== 'Resolved').length
  const failed = messages.filter((message) => message.status === 'Failed').length
  const alerts = interfaces.filter((item) => ['Degraded', 'Offline', 'Delayed'].includes(item.status)).length
  const messageTotal = systems.reduce((total, system) => total + system.messagesToday, 0)

  return (
    <div className="dashboard-page">
      <div className="page-hero dashboard-hero">
        <div><div className="eyebrow">HEALTHCARE INTEROPERABILITY</div><h1>Interoperability Overview</h1><p>Unified visibility across healthcare systems, patient identity, message exchange, data quality and longitudinal patient records.</p></div>
        <div className="hero-actions"><button className="secondary-button" onClick={() => navigate('/interfaces')}><Network size={16} />View interfaces</button><button className="primary-button" onClick={() => navigate('/patients')}><Database size={16} />Open Patient 360</button></div>
      </div>
      <div className="metrics-grid four dashboard-metrics">
        <MetricCard label="Connected Systems" value={integrated} detail={`${systems.filter((system) => system.status === 'Connected').length} currently healthy`} tone="aqua" />
        <MetricCard label="Active Interfaces" value={interfaces.length} detail="FHIR / HL7 / DICOM / API" />
        <MetricCard label="Messages Today" value={messageTotal.toLocaleString()} detail={`${failed} detailed failed message${failed === 1 ? '' : 's'} in queue`} />
        <MetricCard label="Patient Records" value="486,220" detail={`${patients.length} detailed synthetic patients`} />
        <MetricCard label="Identity Reviews" value={networkIdentityReviews} detail={`${detailedReviews} detailed demo reviews`} tone="amber" />
        <MetricCard label="Potential Duplicates" value={potentialDuplicates} detail="Representative network count" tone="amber" />
        <MetricCard label="Data Mapping Issues" value={mappingIssues} detail={`${detailedMappingIssues} detailed issue in workspace`} />
        <MetricCard label="Interface Alerts" value={alerts} detail="Delayed / degraded feeds" tone={alerts ? 'coral' : 'default'} />
      </div>

      <section className="panel interoperability-analytics dashboard-analytics">
        <SectionHeader title="Interoperability analytics" subtitle="Representative synthetic measures for integration observability — not production SLA reporting." />
        <div className="mini-metrics six">
          <div><span>Processing success</span><strong>{messages.length ? `${Math.round((messages.filter((message) => message.status === 'Processed').length / messages.length) * 1000) / 10}%` : '—'}</strong></div>
          <div><span>Identity match rate</span><strong>98.6%</strong></div>
          <div><span>Unmatched records</span><strong>{unmatchedRecords.filter((item) => item.status === 'Unmatched').length}</strong></div>
          <div><span>Duplicate candidates</span><strong>{potentialDuplicates}</strong></div>
          <div><span>Mapping issues</span><strong>{mappingIssues}</strong></div>
          <div><span>Avg processing latency</span><strong>320 ms</strong></div>
        </div>
      </section>

      <div className="overview-grid dashboard-overview-grid">
        <section className="panel architecture-panel dashboard-landscape-panel">
          <SectionHeader title="Connected healthcare landscape" subtitle="Synthetic source systems feed a common interoperability and identity layer." />
          <div className="source-row dashboard-source-grid">{systems.map((system) => <div className="source-mini dashboard-source-card" key={system.id}><div className="system-icon"><Database size={17} /></div><strong>{system.name}</strong><span>{system.type}</span><ConnectionBadge status={system.status} /></div>)}</div>
          <div className="flow-arrow dashboard-flow"><ArrowRight size={18} /><span>FHIR · HL7 v2 · DICOM · REST · Events · Batch</span><ArrowRight size={18} /></div>
          <div className="gateway-row dashboard-gateway-row">
            <div className="gateway-card dashboard-gateway-card"><Network size={22} /><div><strong>HealthConnect Gateway</strong><span>Receive · Validate · Route · Map</span></div></div>
            <ArrowRight size={20} />
            <div className="gateway-card dashboard-gateway-card"><GitMerge size={22} /><div><strong>Patient Identity Layer</strong><span>Match · Human Review · Preserve IDs</span></div></div>
            <ArrowRight size={20} />
            <div className="gateway-card dashboard-gateway-card"><ShieldCheck size={22} /><div><strong>Unified Patient Record</strong><span>Longitudinal data · Provenance preserved</span></div></div>
          </div>
        </section>
        <section className="panel dashboard-message-panel">
          <SectionHeader title="Message activity" subtitle="Synthetic throughput across active interfaces." />
          <div className="chart-wrap dashboard-chart-wrap" role="img" aria-label="Synthetic integration messages over time"><ResponsiveContainer width="100%" height={238}><AreaChart data={activity}><defs><linearGradient id="msgFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1C9A9A" stopOpacity={0.28} /><stop offset="100%" stopColor="#1C9A9A" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#E6ECEF" /><XAxis dataKey="time" tickLine={false} axisLine={false} /><YAxis hide /><Tooltip /><Area type="monotone" dataKey="messages" stroke="#1C9A9A" fill="url(#msgFill)" strokeWidth={2.3} /></AreaChart></ResponsiveContainer></div>
          <div className="message-summary">
            <div><span>Network throughput</span><strong>{messageTotal.toLocaleString()}</strong><small>messages today</small></div>
            <div><span>Peak hour</span><strong>15.1k</strong><small>at 10:00</small></div>
            <div className={failed ? 'attention' : 'healthy'}><span>Failed queue</span><strong>{failed}</strong><small>{failed ? 'requires review' : 'no failures'}</small></div>
          </div>
        </section>
      </div>

      <div className="two-column dashboard-lower-grid">
        <section className="panel dashboard-interface-panel">
          <SectionHeader title="Interface health" subtitle="Operational view of the most important data feeds." action={<button className="text-button" onClick={() => navigate('/interfaces')}>All interfaces <ArrowRight size={14} /></button>} />
          <div className="table-scroll"><table><thead><tr><th>Interface</th><th>Protocol</th><th>Last message</th><th>Errors</th><th>Status</th></tr></thead><tbody>{interfaces.slice(0, 6).map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{systems.find((system) => system.id === item.sourceSystemId)?.organization}</small></td><td><ProtocolBadge protocol={item.protocol} /></td><td>{formatDate(item.lastMessage)}</td><td>{item.errors}</td><td><ConnectionBadge status={item.status} /></td></tr>)}</tbody></table></div>
        </section>
        <section className="panel focus-panel dashboard-attention-panel">
          <SectionHeader title="Requires attention" subtitle="Human-reviewed work queues — not autonomous decisions." />
          <button className="attention-card identity-attention" onClick={() => navigate('/identity')}><GitMerge size={20} /><div><strong>{detailedReviews} detailed identity matches require review</strong><span>Potential patient matches are never auto-merged.</span></div><ArrowRight size={16} /></button>
          <button className="attention-card quality-attention" onClick={() => navigate('/data-quality')}><CircleAlert size={20} /><div><strong>{openIssues} detailed data-quality issues</strong><span>Includes unmatched records, mapping issues, duplicates and stale feeds.</span></div><ArrowRight size={16} /></button>
          <button className="attention-card message-attention" onClick={() => navigate('/messages')}><Activity size={20} /><div><strong>{failed} failed integration message{failed === 1 ? '' : 's'}</strong><span>Resolve validation or transport issues before retry.</span></div><ArrowRight size={16} /></button>
          <div className="recent-audit"><span>Latest audit event</span><strong>{audits[0]?.action}</strong><small>{audits[0] && formatDate(audits[0].timestamp)}</small></div>
        </section>
      </div>
    </div>
  )
}
