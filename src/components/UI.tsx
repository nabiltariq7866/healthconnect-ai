import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  ExternalLink,
  Info,
  X,
} from 'lucide-react'
import type { ClinicalRecord, ConnectionStatus, Freshness, Protocol } from '../types/domain'
import { useEffect, useId, useRef, useState } from 'react'
import { useHealthConnectStore } from '../stores/useHealthConnectStore'

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

export const formatDateOnly = (value: string) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info' | 'ai'
}) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const tone =
    status === 'Connected'
      ? 'success'
      : status === 'Delayed' || status === 'Maintenance' || status === 'Syncing'
        ? 'warning'
        : status === 'Degraded' || status === 'Offline'
          ? 'critical'
          : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

export function FreshnessBadge({ freshness }: { freshness: Freshness }) {
  return <Badge tone={freshness === 'Current' ? 'success' : freshness === 'Delayed' || freshness === 'Stale' ? 'warning' : 'neutral'}>{freshness}</Badge>
}

export function ProtocolBadge({ protocol }: { protocol: Protocol }) {
  return (
    <span className="protocol-badge">
      <Database size={12} />
      {protocol}
    </span>
  )
}

export function MetricCard({
  label,
  value,
  detail,
  tone = 'default',
}: {
  label: string
  value: string | number
  detail?: string
  tone?: 'default' | 'aqua' | 'amber' | 'coral'
}) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {detail && <div className="metric-detail">{detail}</div>}
    </div>
  )
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function LoadingState({ label }: { label: string }) {
  return <div className="loading-state" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true" /><strong>{label}</strong></div>
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="empty-state">
      <CheckCircle2 size={28} />
      <strong>{title}</strong>
      <p>{detail}</p>
    </div>
  )
}

type CustomSelectOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  ariaLabel,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  options: CustomSelectOption[]
  ariaLabel: string
  placeholder?: string
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (next: CustomSelectOption) => {
    if (next.disabled) return
    onChange(next.value)
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const openWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
      requestAnimationFrame(() => {
        const current = rootRef.current?.querySelector<HTMLElement>(`[role="option"][aria-selected="true"]`)
        const first = rootRef.current?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
        ;(current ?? first)?.focus()
      })
    }
  }

  const optionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    const enabled = options
      .map((option, optionIndex) => ({ option, optionIndex }))
      .filter(({ option }) => !option.disabled)
    const enabledPosition = enabled.findIndex(({ optionIndex }) => optionIndex === index)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextPosition = (enabledPosition + direction + enabled.length) % enabled.length
      const nextIndex = enabled[nextPosition]?.optionIndex
      rootRef.current?.querySelector<HTMLElement>(`[data-option-index="${nextIndex}"]`)?.focus()
    }
    if (event.key === 'Home') {
      event.preventDefault()
      rootRef.current?.querySelector<HTMLElement>(`[data-option-index="${enabled[0]?.optionIndex}"]`)?.focus()
    }
    if (event.key === 'End') {
      event.preventDefault()
      rootRef.current?.querySelector<HTMLElement>(`[data-option-index="${enabled.at(-1)?.optionIndex}"]`)?.focus()
    }
  }

  return (
    <div ref={rootRef} className={`custom-select ${className} ${open ? 'open' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={openWithKeyboard}
      >
        <span className={selected ? '' : 'placeholder'}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div id={listId} className="custom-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              disabled={option.disabled}
              className={option.value === value ? 'selected' : ''}
              data-option-index={index}
              key={option.value}
              onClick={() => choose(option)}
              onKeyDown={(event) => optionKeyDown(event, index)}
            >
              <span>
                <strong>{option.label}</strong>
                {option.description && <small>{option.description}</small>}
              </span>
              {option.value === value && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function useDialogFocus(open: boolean, onClose: () => void, containerRef: React.RefObject<HTMLElement | null>) {
  const previousFocus = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!open) return
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const container = containerRef.current
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [role="combobox"]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"])'
    const focusFirst = () => container?.querySelector<HTMLElement>(focusableSelector)?.focus()
    requestAnimationFrame(focusFirst)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !container) return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      requestAnimationFrame(() => previousFocus.current?.focus())
    }
  }, [open, containerRef])
}

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  const drawerRef = useRef<HTMLElement>(null)
  const titleId = useId()
  useDialogFocus(open, onClose, drawerRef)
  if (!open) return null
  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close drawer" tabIndex={-1} />
      <aside ref={drawerRef} className={`drawer ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="drawer-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  )
}

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialogFocus(open, onClose, modalRef)
  if (!open) return null
  return (
    <div className="modal-layer" role="presentation">
      <button className="modal-backdrop" onClick={onClose} aria-label="Close modal" tabIndex={-1} />
      <div ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="drawer-head">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  )
}

export function RecordCard({ record, onSource }: { record: ClinicalRecord; onSource: (record: ClinicalRecord) => void }) {
  return (
    <article className="record-card">
      <div className="record-top">
        <div>
          <span className="domain-label">{record.domain}</span>
          <h3>{record.title}</h3>
        </div>
        <FreshnessBadge freshness={record.provenance.freshness} />
      </div>
      <p>{record.summary}</p>
      {record.value && <div className="record-value">{record.value} {record.unit ?? ''}</div>}
      <div className="record-meta">
        <span>{formatDate(record.provenance.clinicalAt)}</span>
        <span>{record.facility}</span>
      </div>
      <button className="text-button" onClick={() => onSource(record)}>
        View original source <ExternalLink size={14} />
      </button>
    </article>
  )
}

export function ProvenanceView({ record }: { record?: ClinicalRecord }) {
  const systems = useHealthConnectStore((state) => state.systems)
  const logSourceView = useHealthConnectStore((state) => state.logSourceView)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!record) return
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 180)
    logSourceView(record.id)
    return () => window.clearTimeout(timer)
  }, [record, logSourceView])
  if (!record) return <EmptyState title="No source selected" detail="Choose a clinical record or AI citation to inspect its exact provenance." />
  if (loading) return <LoadingState label="Retrieving source provenance..." />
  const system = systems.find((source) => source.id === record.provenance.sourceSystemId)
  const steps = [
    { label: record.provenance.sourceOrganization, detail: system?.name ?? record.provenance.sourceSystemId },
    { label: record.provenance.protocol, detail: record.provenance.messageId ?? 'Direct demo resource' },
    { label: 'HealthConnect Gateway', detail: `Mapped as ${record.provenance.mappedType}` },
    { label: 'Unified Patient Record', detail: record.patientId ?? 'Unmatched record' },
    { label: 'Patient 360', detail: 'Displayed with source provenance preserved' },
  ]
  return (
    <div className="provenance-view">
      <div className="source-summary">
        <div><span>Original source</span><strong>{record.provenance.sourceOrganization}</strong></div>
        <div><span>Original record</span><strong>{record.provenance.originalRecordId}</strong></div>
        <div><span>Protocol / resource</span><strong>{record.provenance.protocol} · {record.provenance.mappedType}</strong></div>
        <div><span>Clinical time</span><strong>{formatDate(record.provenance.clinicalAt)}</strong></div>
        <div><span>Received</span><strong>{formatDate(record.provenance.receivedAt)}</strong></div>
        <div><span>Freshness</span><FreshnessBadge freshness={record.provenance.freshness} /></div>
      </div>
      <div className="lineage" aria-label="Data lineage">
        {steps.map((step, index) => (
          <div className="lineage-step" key={`${step.label}-${index}`}>
            <div className="lineage-node">{index + 1}</div>
            <div><strong>{step.label}</strong><span>{step.detail}</span></div>
            {index < steps.length - 1 && <ChevronRight size={16} aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="code-grid">
        <div><div className="mini-title">Original data</div><pre>{typeof record.raw === 'string' ? record.raw : JSON.stringify(record.raw, null, 2)}</pre></div>
        <div><div className="mini-title">Mapped data</div><pre>{JSON.stringify(record.mapped, null, 2)}</pre></div>
      </div>
    </div>
  )
}

export function InfoBanner({ kind = 'info', title, children }: { kind?: 'info' | 'warning' | 'critical'; title: string; children: React.ReactNode }) {
  const Icon = kind === 'critical' ? AlertTriangle : kind === 'warning' ? Clock3 : Info
  return (
    <div className={`info-banner ${kind}`}>
      <Icon size={18} />
      <div><strong>{title}</strong><p>{children}</p></div>
    </div>
  )
}
