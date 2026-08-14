import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CustomSelect, EmptyState, SectionHeader, formatDate } from '../components/UI'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'

export function AuditPage() {
  const audits = useHealthConnectStore((state) => state.audits)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All')
  const roles = useMemo(() => ['All', ...Array.from(new Set(audits.map((audit) => audit.role)))], [audits])
  const visible = audits.filter((audit) => {
    const matchesRole = role === 'All' || audit.role === role
    const needle = query.trim().toLowerCase()
    const matchesQuery = !needle || [audit.user, audit.role, audit.entity, audit.action, audit.object, audit.previousState, audit.newState].some((value) => value.toLowerCase().includes(needle))
    return matchesRole && matchesQuery
  })

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">SYSTEM</div>
          <h1>Audit Trail</h1>
          <p>Trace identity decisions, interface activity, mapping changes, AI summaries and source-record operations.</p>
        </div>
        <div className="toolbar">
          <label className="search-inline">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search audit..." aria-label="Search audit events" />
          </label>
          <div className="filter-select">
            <Filter size={14} />
            <CustomSelect ariaLabel="Filter audit by role" value={role} onChange={setRole} options={roles.map((item) => ({ value: item, label: item }))} />
          </div>
        </div>
      </div>
      <section className="panel">
        <SectionHeader title="Enterprise audit events" subtitle="Historical events are never silently removed when demo state changes." />
        {visible.length === 0 ? (
          <EmptyState title="No audit events match" detail="Change the role or search filter to view other immutable demo events." />
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Time</th><th>User</th><th>Role</th><th>Patient/System</th><th>Action</th><th>Object</th><th>Previous</th><th>New</th></tr></thead>
              <tbody>
                {visible.map((audit) => (
                  <tr key={audit.id}>
                    <td>{formatDate(audit.timestamp)}</td>
                    <td><strong>{audit.user}</strong></td>
                    <td>{audit.role}</td>
                    <td>{audit.entity}</td>
                    <td><strong>{audit.action}</strong></td>
                    <td>{audit.object}</td>
                    <td>{audit.previousState}</td>
                    <td>{audit.newState}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
