import { Bell, Braces, ChevronDown, CircleUserRound, Database, FileClock, FileSearch, GitMerge, HeartPulse, LayoutDashboard, Menu, Network, Search, Settings, ShieldCheck, Sparkles, TableProperties, Unplug, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'
import type { Role } from '../types/domain'
import { CustomSelect } from './UI'

const groups = [
  { label: 'OVERVIEW', items: [{ to: '/', label: 'Interoperability Overview', icon: LayoutDashboard }] },
  { label: 'PATIENT IDENTITY', items: [{ to: '/identity', label: 'Identity Queue', icon: GitMerge }, { to: '/duplicates', label: 'Duplicate Records', icon: FileSearch }, { to: '/merge-history', label: 'Merge History', icon: FileClock }] },
  { label: 'PATIENT 360', items: [{ to: '/patients', label: 'Patient Search', icon: HeartPulse }, { to: '/unified', label: 'Unified Records', icon: Database }, { to: '/timeline', label: 'Longitudinal Timeline', icon: FileClock }] },
  { label: 'DATA EXCHANGE', items: [{ to: '/interfaces', label: 'Interfaces', icon: Network }, { to: '/messages', label: 'Message Activity', icon: Braces }, { to: '/mappings', label: 'Data Mapping', icon: TableProperties }] },
  { label: 'CLINICAL DATA', items: [{ to: '/clinical/Medication', label: 'Medications', icon: Database }, { to: '/clinical/Lab', label: 'Labs', icon: Database }, { to: '/clinical/Imaging', label: 'Imaging', icon: Database }, { to: '/clinical/Document', label: 'Documents', icon: Database }] },
  { label: 'INTELLIGENCE', items: [{ to: '/copilot', label: 'AI Copilot', icon: Sparkles }, { to: '/data-quality', label: 'Data Quality', icon: ShieldCheck }, { to: '/provenance', label: 'Provenance Explorer', icon: FileSearch }] },
  { label: 'SYSTEM', items: [{ to: '/integrations', label: 'Integration Catalog', icon: Unplug }, { to: '/audit', label: 'Audit Trail', icon: FileClock }, { to: '/settings', label: 'Settings', icon: Settings }] },
]

const roles: Role[] = ['Clinician', 'Health Information Manager', 'Interoperability Analyst', 'Integration Engineer', 'Data Steward', 'Clinical Informaticist', 'Administrator']

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { currentRole, currentUser, setRole, systems, notifications, markNotificationRead } = useHealthConnectStore()
  const connected = systems.filter(s => s.status === 'Connected').length
  const unread = notifications.filter(n => !n.read).length
  const health = useMemo(() => systems.some(s => ['Degraded', 'Offline'].includes(s.status)) ? 'Attention' : systems.some(s => s.status === 'Delayed') ? 'Monitor' : 'Healthy', [systems])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">HC</div>
        <div><strong>HealthConnect AI</strong><span>Interoperability Platform</span></div>
        <button className="icon-button mobile-only" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18}/></button>
      </div>
      <nav>
        {groups.map(group => <div className="nav-group" key={group.label}>
          <div className="nav-label">{group.label}</div>
          {group.items.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <item.icon size={17}/><span>{item.label}</span>
          </NavLink>)}
        </div>)}
      </nav>
      <div className="sidebar-foot">
        <div className="demo-chip">DEMO ENVIRONMENT</div>
        <span>Synthetic data only · No live EHR</span>
      </div>
    </aside>

    <div className="main-shell">
      <header className="topbar">
        <button className="icon-button mobile-only" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
        <div className="network-selector"><Network size={16}/><div><span>Northbridge Health Network</span><small>{connected} systems connected · {health}</small></div><ChevronDown size={14}/></div>
        <form className="global-search" onSubmit={submitSearch}><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patient, unified ID, MRN, source..."/><kbd>↵</kbd></form>
        <div className="top-actions">
          <div className="status-dot-wrap"><span className={`status-dot ${health.toLowerCase()}`}/><span>Interfaces</span></div>
          <div className="notification-wrap">
            <button className="icon-button notification-button" onClick={() => setNotifOpen(v=>!v)} aria-label="Notifications"><Bell size={19}/>{unread > 0 && <b>{unread}</b>}</button>
            {notifOpen && <div className="notification-panel">
              <div className="notification-head"><strong>Notifications</strong><span>{unread} unread</span></div>
              {notifications.slice(0,6).map(n => <button key={n.id} className={`notification-item ${n.read?'':'unread'}`} onClick={() => { markNotificationRead(n.id); setNotifOpen(false); if(n.href) navigate(n.href) }}>
                <span className={`severity-pin ${n.severity.toLowerCase()}`}/><div><strong>{n.title}</strong><p>{n.body}</p></div>
              </button>)}
            </div>}
          </div>
          <div className="role-box"><CircleUserRound size={19}/><div><strong>{currentUser}</strong><CustomSelect ariaLabel="Current role" value={currentRole} onChange={(value)=>setRole(value as Role)} options={roles.map((role)=>({value:role,label:role}))}/></div></div>
        </div>
      </header>
      <main className="page-wrap"><Outlet/></main>
    </div>
  </div>
}
