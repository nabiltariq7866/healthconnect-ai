import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import {
  audits as seedAudits,
  clinicalRecords as seedClinicalRecords,
  dataConflicts as seedConflicts,
  externalRecords as seedExternalRecords,
  identityCandidates as seedCandidates,
  interfaces as seedInterfaces,
  mappings as seedMappings,
  mergeHistory as seedMergeHistory,
  messages as seedMessages,
  notifications as seedNotifications,
  patients as seedPatients,
  qualityIssues as seedQualityIssues,
  sourceSystems as seedSourceSystems,
  unmatchedRecords as seedUnmatchedRecords,
} from '../data/seed'
import type {
  AuditEvent,
  ClinicalRecord,
  CopilotResponse,
  DataConflict,
  DataQualityIssue,
  ExternalPatientRecord,
  IdentityCandidate,
  IntegrationMessage,
  InterfaceConnection,
  MappingRule,
  MergeHistoryItem,
  NotificationItem,
  Patient,
  Role,
  SourceSystem,
  UnmatchedRecord,
} from '../types/domain'
import { detectCrossSourceConflicts } from '../services/ai/recordConflictAI'
import { answerPatientQuestion } from '../services/ai/copilotAI'
import { generateUnifiedPatientSummary } from '../services/ai/patientSummaryAI'

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T
const now = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export type Permission = 'view-patient' | 'copilot' | 'identity-review' | 'interface-manage' | 'mapping-manage' | 'data-quality' | 'settings'

const permissionMap: Record<Role, Permission[]> = {
  Clinician: ['view-patient', 'copilot'],
  'Health Information Manager': ['view-patient', 'identity-review', 'data-quality'],
  'Interoperability Analyst': ['view-patient', 'mapping-manage', 'data-quality'],
  'Integration Engineer': ['view-patient', 'interface-manage', 'mapping-manage'],
  'Data Steward': ['view-patient', 'identity-review', 'data-quality'],
  'Clinical Informaticist': ['view-patient', 'copilot', 'mapping-manage', 'data-quality'],
  Administrator: ['view-patient', 'copilot', 'identity-review', 'interface-manage', 'mapping-manage', 'data-quality', 'settings'],
}

export const canRole = (role: Role, permission: Permission) => permissionMap[role].includes(permission)

interface ActionResult { ok: boolean; error?: string }

interface HealthConnectState {
  currentRole: Role
  currentUser: string
  systems: SourceSystem[]
  interfaces: InterfaceConnection[]
  messages: IntegrationMessage[]
  patients: Patient[]
  externalRecords: ExternalPatientRecord[]
  identityCandidates: IdentityCandidate[]
  clinicalRecords: ClinicalRecord[]
  conflicts: DataConflict[]
  qualityIssues: DataQualityIssue[]
  mappings: MappingRule[]
  unmatchedRecords: UnmatchedRecord[]
  mergeHistory: MergeHistoryItem[]
  audits: AuditEvent[]
  notifications: NotificationItem[]
  copilotResponses: CopilotResponse[]

  setRole: (role: Role) => void
  markNotificationRead: (notificationId: string) => void
  mergeCandidate: (candidateId: string, reason: string) => ActionResult
  keepSeparate: (candidateId: string, reason: string) => ActionResult
  linkRelated: (candidateId: string, reason: string) => ActionResult
  requestIdentityReview: (candidateId: string) => ActionResult
  pauseInterface: (interfaceId: string) => ActionResult
  createInterfaceError: (interfaceId: string) => ActionResult
  restoreInterface: (interfaceId: string) => ActionResult
  simulateSync: (interfaceId: string) => ActionResult
  repairMessageIssue: (messageId: string) => ActionResult
  retryMessage: (messageId: string) => ActionResult
  resolveMapping: (mappingId: string) => ActionResult
  linkUnmatchedRecord: (unmatchedId: string, patientId: string) => ActionResult
  holdUnmatchedRecord: (unmatchedId: string) => ActionResult
  createPatientFromUnmatched: (unmatchedId: string, name: string, dob: string) => ActionResult
  createDemoUnmatchedLab: () => ActionResult
  reviewConflict: (conflictId: string, mode: 'Reviewed' | 'Escalated' | 'Keep All Sources' | 'Display Preference Set' | 'Grouped', preferredRecordId?: string) => ActionResult
  askCopilot: (patientId: string, question: string) => CopilotResponse | undefined
  generatePatientSummary: (patientId: string) => CopilotResponse | undefined
  logSourceView: (recordId: string) => void
  resetDemo: () => void
}

const initialData = () => ({
  systems: clone(seedSourceSystems),
  interfaces: clone(seedInterfaces),
  messages: clone(seedMessages),
  patients: clone(seedPatients),
  externalRecords: clone(seedExternalRecords),
  identityCandidates: clone(seedCandidates),
  clinicalRecords: clone(seedClinicalRecords),
  conflicts: clone(seedConflicts.length ? seedConflicts : seedPatients.flatMap((patient) => detectCrossSourceConflicts(patient.id, seedClinicalRecords))),
  qualityIssues: clone(seedQualityIssues),
  mappings: clone(seedMappings),
  unmatchedRecords: clone(seedUnmatchedRecords),
  mergeHistory: clone(seedMergeHistory),
  audits: clone(seedAudits),
  notifications: clone(seedNotifications),
  copilotResponses: [] as CopilotResponse[],
})

function deny(message: string): ActionResult {
  toast.error(message)
  return { ok: false, error: message }
}

export const useHealthConnectStore = create<HealthConnectState>()(
  persist(
    (set, get) => ({
      currentRole: 'Data Steward',
      currentUser: 'Daniel Foster',
      ...initialData(),

      setRole: (role) => set({ currentRole: role, currentUser: role === 'Clinician' ? 'Dr. Hannah Cole' : role === 'Integration Engineer' ? 'Alex Morgan' : role === 'Clinical Informaticist' ? 'Dr. Priya Shah' : role === 'Administrator' ? 'Jordan Lee' : role === 'Data Steward' ? 'Daniel Foster' : 'Taylor Reed' }),
      markNotificationRead: (notificationId) => set(state => ({ notifications: state.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n) })),

      mergeCandidate: (candidateId, reason) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot merge patient identities.')
        const candidate = state.identityCandidates.find(c => c.id === candidateId)
        if (!candidate) return deny('Identity candidate not found.')
        if (!['Needs Review', 'Review Requested'].includes(candidate.status)) return deny(`This identity decision is already final (${candidate.status}).`)
        const incoming = state.externalRecords.find(r => r.id === candidate.incomingRecordId)
        const patient = state.patients.find(p => p.id === candidate.potentialPatientId)
        if (!incoming || !patient) return deny('Required identity records are unavailable.')
        if (incoming.linkedPatientId === patient.id) return deny('This record is already linked to the selected patient.')

        const sourceSystem = state.systems.find(s => s.id === incoming.sourceSystemId)
        const newIdentifiers = patient.identifiers.some(i => i.value === incoming.localId)
          ? patient.identifiers
          : [...patient.identifiers, { systemId: incoming.sourceSystemId, label: `${sourceSystem?.name ?? 'External'} ID`, value: incoming.localId }]
        const newRecordIds = [...new Set([...patient.clinicalRecordIds, ...incoming.clinicalRecordIds])]
        const updatedPatient: Patient = {
          ...patient,
          identifiers: newIdentifiers,
          sourceSystemIds: [...new Set([...patient.sourceSystemIds, incoming.sourceSystemId])],
          clinicalRecordIds: newRecordIds,
          lastUnifiedUpdate: now(),
        }
        const updatedRecords = state.clinicalRecords.map(record => incoming.clinicalRecordIds.includes(record.id) ? { ...record, patientId: patient.id } : record)
        const clinicalConflicts = detectCrossSourceConflicts(patient.id, updatedRecords)
        const demographicEvidence = candidate.evidence.filter((evidence) => evidence.state === 'Conflict')
        const demographicConflicts: DataConflict[] = demographicEvidence.map((evidence) => ({
          id: `conflict-demographic-${patient.id}-${evidence.field.toLowerCase().replace(/\s+/g, '-')}`,
          patientId: patient.id,
          type: 'Demographic',
          title: `${evidence.field} differs across source identities`,
          description: `${sourceSystem?.name ?? 'Incoming source'}: ${evidence.incoming} • Unified record: ${evidence.existing}. Human review is required; neither value is silently overwritten.`,
          recordIds: [],
          status: 'Open',
        }))
        const newConflicts = [...clinicalConflicts, ...demographicConflicts]
        const conflictQualityIssues: DataQualityIssue[] = newConflicts
          .filter((conflict) => conflict.type === 'Medication' || conflict.type === 'Demographic')
          .map((conflict) => ({
            id: `dq-${conflict.id}`,
            type: conflict.type === 'Medication' ? 'Medication conflict' : 'Conflicting demographic',
            title: conflict.title,
            patientId: patient.id,
            sourceSystemId: incoming.sourceSystemId,
            detectedAt: now(),
            priority: 'Medium',
            owner: conflict.type === 'Medication' ? 'Clinical Reconciliation' : 'Data Steward Queue',
            status: 'Open',
            relatedId: conflict.id,
          }))
        const preservedOtherConflicts = state.conflicts.filter(c => c.patientId !== patient.id || c.status !== 'Open')
        const history: MergeHistoryItem = { id: id('merge'), patientId: patient.id, incomingRecordId: incoming.id, performedBy: state.currentUser, date: now(), reason: reason || 'Human-reviewed identity match', sourceSystemIds: [...new Set([...patient.sourceSystemIds, incoming.sourceSystemId])] }
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: patient.name, action: 'Patient records merged', object: candidate.id, previousState: `${patient.sourceSystemIds.length} source systems`, newState: `${updatedPatient.sourceSystemIds.length} source systems; source identifiers preserved` }

        set({
          patients: state.patients.map(p => p.id === patient.id ? updatedPatient : p),
          externalRecords: state.externalRecords.map(r => r.id === incoming.id ? { ...r, linkedPatientId: patient.id } : r),
          identityCandidates: state.identityCandidates.map(c => c.id === candidate.id ? { ...c, status: 'Merged', reviewer: state.currentUser } : c),
          clinicalRecords: updatedRecords,
          conflicts: [...preservedOtherConflicts, ...newConflicts],
          qualityIssues: [
            ...conflictQualityIssues.filter((issue) => !state.qualityIssues.some((existing) => existing.id === issue.id)),
            ...state.qualityIssues.map((issue): DataQualityIssue => issue.relatedId === candidate.id ? { ...issue, status: 'Resolved' } : issue),
          ],
          mergeHistory: [history, ...state.mergeHistory],
          audits: [audit, ...state.audits],
          notifications: [{ id: id('note'), title: 'Patient identity merged', body: `${incoming.name} was merged into ${patient.name}; all source identifiers were preserved.`, severity: 'Success', createdAt: now(), read: false, href: `/patients/${patient.id}` }, ...state.notifications],
        })
        toast.success('Patient identity merged. Provenance and source identifiers were preserved.')
        return { ok: true }
      },

      keepSeparate: (candidateId, reason) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot make identity decisions.')
        const candidate = state.identityCandidates.find(c => c.id === candidateId)
        if (!candidate) return deny('Identity candidate not found.')
        if (!['Needs Review', 'Review Requested'].includes(candidate.status)) return deny(`This identity decision is already final (${candidate.status}).`)
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: candidateId, action: 'Identity merge rejected', object: candidateId, previousState: candidate.status, newState: `Kept Separate — ${reason || 'human review'}` }
        set({ identityCandidates: state.identityCandidates.map(c => c.id === candidateId ? { ...c, status: 'Kept Separate', reviewer: state.currentUser } : c), audits: [audit, ...state.audits], qualityIssues: state.qualityIssues.map((i): DataQualityIssue => i.relatedId === candidateId ? { ...i, status: 'Resolved' } : i) })
        toast.success('Records kept separate.')
        return { ok: true }
      },

      linkRelated: (candidateId, reason) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot link identity records.')
        const candidate = state.identityCandidates.find(c => c.id === candidateId)
        if (!candidate) return deny('Identity candidate not found.')
        if (!['Needs Review', 'Review Requested'].includes(candidate.status)) return deny(`This identity decision is already final (${candidate.status}).`)
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: candidateId, action: 'External record linked as related', object: candidateId, previousState: candidate.status, newState: `Linked — ${reason || 'human review'}` }
        set({
          identityCandidates: state.identityCandidates.map(c => c.id === candidateId ? { ...c, status: 'Linked', reviewer: state.currentUser } : c),
          qualityIssues: state.qualityIssues.map(issue => issue.relatedId === candidateId ? { ...issue, status: 'Resolved' } : issue),
          audits: [audit, ...state.audits],
        })
        toast.success('Record linked without destructive merge.')
        return { ok: true }
      },

      requestIdentityReview: (candidateId) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot request identity review.')
        const candidate = state.identityCandidates.find(c => c.id === candidateId)
        if (!candidate) return deny('Identity candidate not found.')
        set({ identityCandidates: state.identityCandidates.map(c => c.id === candidateId ? { ...c, status: 'Review Requested' } : c), audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: candidateId, action: 'Additional identity review requested', object: candidateId, previousState: candidate.status, newState: 'Review Requested' }, ...state.audits], notifications: [{ id: id('note'), title: 'Identity review requested', body: `Additional review requested for ${candidateId}.`, severity: 'Info', createdAt: now(), read: false, href: '/identity' }, ...state.notifications] })
        toast.success('Additional identity review requested.')
        return { ok: true }
      },

      pauseInterface: (interfaceId) => {
        const state = get()
        if (!canRole(state.currentRole, 'interface-manage')) return deny('Switch to Integration Engineer or Administrator to manage interfaces.')
        const iface = state.interfaces.find(i => i.id === interfaceId)
        if (!iface) return deny('Interface not found.')
        if (iface.status === 'Maintenance') return deny('Interface is already paused.')
        if (iface.status === 'Degraded' || iface.status === 'Offline') return deny('Restore the interface before pausing the feed.')
        const existingOpenIssue = state.qualityIssues.find(issue => issue.relatedId === interfaceId && issue.type === 'Stale data' && issue.status !== 'Resolved')
        const issue: DataQualityIssue = existingOpenIssue ?? { id: id('dq'), type: 'Stale data', title: `${iface.name} is paused; downstream data freshness requires review`, sourceSystemId: iface.sourceSystemId, detectedAt: now(), priority: 'Medium', owner: 'Integration Team', status: 'Open', relatedId: iface.id }
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: iface.name, action: 'Interface paused', object: iface.id, previousState: iface.status, newState: 'Maintenance; downstream data delayed' }
        set({
          interfaces: state.interfaces.map(i => i.id === interfaceId ? { ...i, status: 'Maintenance' } : i),
          systems: state.systems.map(source => source.id === iface.sourceSystemId ? { ...source, status: 'Maintenance' } : source),
          clinicalRecords: state.clinicalRecords.map(record => record.provenance.sourceSystemId === iface.sourceSystemId ? { ...record, provenance: { ...record.provenance, freshness: 'Delayed' as const } } : record),
          qualityIssues: existingOpenIssue ? state.qualityIssues : [issue, ...state.qualityIssues],
          audits: [audit, ...state.audits],
          notifications: [{ id: id('note'), title: 'Interface feed paused', body: `${iface.name} is paused. Records from this source are marked delayed until restore and sync.`, severity: 'Warning', createdAt: now(), read: false, href: '/interfaces' }, ...state.notifications],
        })
        toast.success('Demo feed paused. Downstream records are marked delayed.')
        return { ok: true }
      },

      createInterfaceError: (interfaceId) => {
        const state = get()
        if (!canRole(state.currentRole, 'interface-manage')) return deny('Switch to Integration Engineer or Administrator to create interface scenarios.')
        const iface = state.interfaces.find(i => i.id === interfaceId)
        if (!iface) return deny('Interface not found.')
        if (iface.status === 'Degraded') return deny('This interface is already degraded.')
        if (iface.status === 'Maintenance' || iface.status === 'Offline') return deny('Restore the interface before creating a new demo error.')
        const affectedSystemId = iface.sourceSystemId
        const issue: DataQualityIssue = { id: id('dq'), type: 'Stale data', title: `${iface.name} is degraded; downstream data may be delayed`, sourceSystemId: affectedSystemId, detectedAt: now(), priority: 'High', owner: 'Integration Team', status: 'Open', relatedId: iface.id }
        const failedMessage: IntegrationMessage = { id: id('MSG-FAIL'), type: iface.protocol === 'HL7 v2' ? 'ORU' : 'REST Event', protocol: iface.protocol, sourceSystemId: affectedSystemId, destination: iface.destination, timestamp: now(), status: 'Failed', error: 'Synthetic interface transport failure', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validation', status: 'Failed' }, { label: 'Patient Match', status: 'Pending' }, { label: 'Mapped', status: 'Pending' }], raw: 'Synthetic failed transport payload', parsed: { demoError: true }, mapped: {} }
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: iface.name, action: 'Demo integration error created', object: iface.id, previousState: iface.status, newState: 'Degraded' }
        set({
          interfaces: state.interfaces.map(i => i.id === interfaceId ? { ...i, status: 'Degraded', errors: 12 } : i),
          systems: state.systems.map(s => s.id === affectedSystemId ? { ...s, status: 'Degraded' } : s),
          clinicalRecords: state.clinicalRecords.map(r => r.provenance.sourceSystemId === affectedSystemId ? { ...r, provenance: { ...r.provenance, freshness: 'Delayed' } } : r),
          qualityIssues: [issue, ...state.qualityIssues], messages: [failedMessage, ...state.messages], audits: [audit, ...state.audits],
          notifications: [{ id: id('note'), title: 'Interface degraded', body: `${iface.name} is degraded. Patient 360 data from this source is marked delayed.`, severity: 'Critical', createdAt: now(), read: false, href: '/interfaces' }, ...state.notifications],
        })
        toast.error('Demo interface degraded; downstream freshness warnings are active.')
        return { ok: true }
      },

      restoreInterface: (interfaceId) => {
        const state = get()
        if (!canRole(state.currentRole, 'interface-manage')) return deny('Switch to Integration Engineer or Administrator to restore interfaces.')
        const iface = state.interfaces.find(i => i.id === interfaceId)
        if (!iface) return deny('Interface not found.')
        if (iface.status === 'Connected') return deny('Interface is already connected.')
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: iface.name, action: 'Interface restored', object: iface.id, previousState: iface.status, newState: 'Connected; sync required for freshness' }
        set({ interfaces: state.interfaces.map(i => i.id === interfaceId ? { ...i, status: 'Connected', errors: 0 } : i), systems: state.systems.map(s => s.id === iface.sourceSystemId ? { ...s, status: 'Connected' } : s), audits: [audit, ...state.audits], notifications: [{ id: id('note'), title: 'Interface restored', body: `${iface.name} is connected. Run a demo sync to refresh downstream records.`, severity: 'Success', createdAt: now(), read: false, href: '/interfaces' }, ...state.notifications] })
        toast.success('Interface restored. Run Simulate Sync to refresh data.')
        return { ok: true }
      },

      simulateSync: (interfaceId) => {
        const state = get()
        if (!canRole(state.currentRole, 'interface-manage')) return deny('Switch to Integration Engineer or Administrator to simulate interface sync.')
        const iface = state.interfaces.find(i => i.id === interfaceId)
        if (!iface) return deny('Interface not found.')
        if (!['Connected', 'Syncing'].includes(iface.status)) return deny('Restore the interface before running a sync.')
        const timestamp = now()
        const isLab = iface.sourceSystemId === 'sys-lis'
        const newRecord: ClinicalRecord | undefined = isLab ? {
          id: id('rec-lab-sync'), patientId: 'pt-emily', domain: 'Lab', title: 'C-reactive protein', summary: 'New synthetic laboratory result received after interface recovery.', value: '5.8', unit: 'mg/L', status: 'Final', facility: 'Metro Diagnostics',
          provenance: { sourceOrganization: 'Metro Diagnostics', sourceSystemId: 'sys-lis', originalRecordId: id('LAB-SYNC'), receivedAt: timestamp, clinicalAt: timestamp, protocol: 'HL7 v2', messageId: id('MSG-SYNC'), mappedType: 'Observation', freshness: 'Current' }, raw: 'Synthetic ORU recovery message', mapped: { resource: 'Observation', code: 'CRP', value: 5.8 }
        } : undefined
        const message: IntegrationMessage = { id: newRecord?.provenance.messageId ?? id('MSG-SYNC'), type: isLab ? 'ORU' : 'REST Event', protocol: iface.protocol, sourceSystemId: iface.sourceSystemId, destination: iface.destination, timestamp, patientMapping: isLab ? 'HC-2026-102842' : 'Demo mapping complete', status: 'Processed', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }, { label: 'Patient 360', status: 'Complete' }], raw: 'Synthetic successful sync message', parsed: { synced: true }, mapped: { recordId: newRecord?.id } }
        const patientUpdates = newRecord ? state.patients.map(p => p.id === 'pt-emily' ? { ...p, clinicalRecordIds: [...p.clinicalRecordIds, newRecord.id], lastUnifiedUpdate: timestamp } : p) : state.patients
        const audit: AuditEvent = { id: id('audit'), timestamp, user: state.currentUser, role: state.currentRole, entity: iface.name, action: 'Simulated sync completed', object: message.id, previousState: 'Connected', newState: 'Message processed; downstream records current' }
        set({
          interfaces: state.interfaces.map(i => i.id === interfaceId ? { ...i, status: 'Connected', lastMessage: timestamp, errors: 0 } : i),
          systems: state.systems.map(s => s.id === iface.sourceSystemId ? { ...s, status: 'Connected', lastSync: timestamp, messagesToday: s.messagesToday + 1 } : s),
          messages: [message, ...state.messages],
          clinicalRecords: [...state.clinicalRecords.map(r => r.provenance.sourceSystemId === iface.sourceSystemId ? { ...r, provenance: { ...r.provenance, freshness: 'Current' as const } } : r), ...(newRecord ? [newRecord] : [])],
          patients: patientUpdates,
          qualityIssues: state.qualityIssues.map(issue => issue.relatedId === interfaceId || (issue.type === 'Stale data' && issue.sourceSystemId === iface.sourceSystemId) ? { ...issue, status: 'Resolved' } : issue),
          audits: [audit, ...state.audits],
        })
        toast.success('Synthetic sync complete. Downstream freshness has been restored.')
        return { ok: true }
      },

      repairMessageIssue: (messageId) => {
        const state = get()
        if (!canRole(state.currentRole, 'interface-manage')) return deny('This role cannot repair integration message issues.')
        const message = state.messages.find(item => item.id === messageId)
        if (!message) return deny('Message not found.')
        if (message.status !== 'Failed') return deny('Only failed messages require repair.')
        if (!message.error) return deny('No unresolved demo issue is attached to this message.')
        const previousError = message.error
        set({
          messages: state.messages.map(item => item.id === messageId ? {
            ...item,
            error: 'Demo issue resolved — ready to retry',
            patientMapping: item.patientMapping ?? 'HC-2026-102842',
            parsed: { ...item.parsed, resolvedPatientIdentifier: 'LIS-778201' },
          } : item),
          qualityIssues: state.qualityIssues.map(issue => issue.relatedId === messageId ? { ...issue, status: 'Resolved' } : issue),
          audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: message.sourceSystemId, action: 'Message data-quality issue repaired', object: message.id, previousState: previousError, newState: 'Synthetic patient identifier mapped; retry permitted' }, ...state.audits],
        })
        toast.success('Synthetic message issue repaired. Retry processing is now available.')
        return { ok: true }
      },

      retryMessage: (messageId) => {
        const state = get()
        if (!canRole(state.currentRole, 'interface-manage')) return deny('This role cannot retry integration messages.')
        const message = state.messages.find(m => m.id === messageId)
        if (!message) return deny('Message not found.')
        if (message.status !== 'Failed') return deny('Only failed messages can be retried.')
        if (message.error === 'Patient identifier missing') {
          toast.error('Retry blocked: patient identifier is still missing. Resolve the data-quality issue first.')
          return { ok: false, error: 'Patient identifier still missing' }
        }
        const source = state.systems.find(system => system.id === message.sourceSystemId)
        if (message.error === 'Synthetic interface transport failure' && source?.status !== 'Connected') {
          return deny('Retry blocked: restore the source interface before reprocessing this transport failure.')
        }
        set({ messages: state.messages.map(m => m.id === messageId ? { ...m, status: 'Processed', error: undefined, pipeline: m.pipeline.map(step => ({ ...step, status: 'Complete' as const })) } : m), audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: message.sourceSystemId, action: 'Failed message retried', object: message.id, previousState: 'Failed', newState: 'Processed' }, ...state.audits] })
        toast.success('Message successfully reprocessed.')
        return { ok: true }
      },

      resolveMapping: (mappingId) => {
        const state = get()
        if (!canRole(state.currentRole, 'mapping-manage')) return deny('This role cannot modify demo mappings.')
        const mapping = state.mappings.find(m => m.id === mappingId)
        if (!mapping) return deny('Mapping not found.')
        if (mapping.status === 'Mapped') return deny('Mapping is already active.')
        set({ mappings: state.mappings.map(m => m.id === mappingId ? { ...m, status: 'Mapped' } : m), qualityIssues: state.qualityIssues.map(i => i.relatedId === mappingId ? { ...i, status: 'Resolved' } : i), audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: mapping.sourceSystemId, action: 'Data mapping updated', object: mapping.id, previousState: mapping.status, newState: 'Mapped' }, ...state.audits] })
        toast.success('Demo mapping marked active.')
        return { ok: true }
      },

      linkUnmatchedRecord: (unmatchedId, patientId) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot link unmatched clinical records.')
        const unmatched = state.unmatchedRecords.find(u => u.id === unmatchedId)
        const patient = state.patients.find(p => p.id === patientId)
        if (!unmatched || !patient) return deny('Unmatched record or patient not found.')
        if (!['Unmatched', 'Held'].includes(unmatched.status)) return deny(`This unmatched record decision is already final (${unmatched.status}).`)
        const record: ClinicalRecord = { ...unmatched.record, patientId }
        set({
          unmatchedRecords: state.unmatchedRecords.map(u => u.id === unmatchedId ? { ...u, status: 'Linked' } : u),
          clinicalRecords: [...state.clinicalRecords, record],
          patients: state.patients.map(p => p.id === patientId ? { ...p, clinicalRecordIds: [...p.clinicalRecordIds, record.id], sourceSystemIds: [...new Set([...p.sourceSystemIds, unmatched.sourceSystemId])], lastUnifiedUpdate: now() } : p),
          qualityIssues: state.qualityIssues.map(i => i.relatedId === unmatchedId ? { ...i, status: 'Resolved' } : i),
          audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: patient.name, action: 'Unmatched record linked', object: unmatched.id, previousState: 'Unmatched', newState: `Linked to ${patient.unifiedId}` }, ...state.audits],
        })
        toast.success('Laboratory record linked to Patient 360.')
        return { ok: true }
      },

      holdUnmatchedRecord: (unmatchedId) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot hold unmatched records.')
        const unmatched = state.unmatchedRecords.find(item => item.id === unmatchedId)
        if (!unmatched) return deny('Unmatched record not found.')
        if (unmatched.status !== 'Unmatched') return deny(`This unmatched record is already ${unmatched.status}.`)
        set({
          unmatchedRecords: state.unmatchedRecords.map(item => item.id === unmatchedId ? { ...item, status: 'Held' } : item),
          qualityIssues: state.qualityIssues.map(issue => issue.relatedId === unmatchedId ? { ...issue, status: 'Held' } : issue),
          audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: unmatched.localPatientLabel, action: 'Unmatched record held', object: unmatched.id, previousState: 'Unmatched', newState: 'Held for human review' }, ...state.audits],
        })
        toast.success('Record held for later review.')
        return { ok: true }
      },

      createPatientFromUnmatched: (unmatchedId, name, dob) => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('This role cannot create unified patients from unmatched records.')
        const unmatched = state.unmatchedRecords.find(u => u.id === unmatchedId)
        if (!unmatched) return deny('Unmatched record not found.')
        if (!['Unmatched', 'Held'].includes(unmatched.status)) return deny(`This unmatched record decision is already final (${unmatched.status}).`)
        if (!name.trim()) return deny('A synthetic patient name is required.')
        const patientId = id('pt')
        const patient: Patient = { id: patientId, unifiedId: `HC-2026-${String(Date.now()).slice(-6)}`, name, dob, sex: 'Unknown', phone: '', email: '', address: '', primaryCareProvider: 'Not recorded', identifiers: [{ systemId: unmatched.sourceSystemId, label: 'Source record ID', value: unmatched.record.provenance.originalRecordId }], sourceSystemIds: [unmatched.sourceSystemId], clinicalRecordIds: [unmatched.record.id], lastUnifiedUpdate: now() }
        const record: ClinicalRecord = { ...unmatched.record, patientId }
        set({ patients: [patient, ...state.patients], clinicalRecords: [...state.clinicalRecords, record], unmatchedRecords: state.unmatchedRecords.map(u => u.id === unmatchedId ? { ...u, status: 'Created New Patient' } : u), qualityIssues: state.qualityIssues.map(i => i.relatedId === unmatchedId ? { ...i, status: 'Resolved' } : i), audits: [{ id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: patient.name, action: 'Unified patient created from unmatched record', object: unmatched.id, previousState: 'Unmatched', newState: patient.unifiedId }, ...state.audits] })
        toast.success('New synthetic unified patient created.')
        return { ok: true }
      },

      createDemoUnmatchedLab: () => {
        const state = get()
        if (!canRole(state.currentRole, 'identity-review')) return deny('Switch to Data Steward, Health Information Manager, or Administrator to create the unmatched-record demo.')
        const active = state.unmatchedRecords.find(item => item.status === 'Unmatched' && item.record.title === 'NT-proBNP')
        if (active) return deny('The generated unmatched laboratory demo is already waiting for review.')
        const timestamp = now()
        const unmatchedId = id('unmatched-lab')
        const recordId = id('rec-unmatched-lab')
        const messageId = id('MSG-UNMATCH')
        const unmatched: UnmatchedRecord = {
          id: unmatchedId,
          sourceSystemId: 'sys-lis',
          localPatientLabel: 'E. Robinson / identifier incomplete',
          status: 'Unmatched',
          receivedAt: timestamp,
          record: {
            id: recordId,
            domain: 'Lab',
            title: 'NT-proBNP',
            summary: 'Synthetic external laboratory result intentionally received without a confident patient identifier.',
            value: 'Demo result',
            status: 'Final',
            facility: 'Metro Diagnostics',
            provenance: { sourceOrganization: 'Metro Diagnostics', sourceSystemId: 'sys-lis', originalRecordId: id('LAB-UNMATCH'), receivedAt: timestamp, clinicalAt: timestamp, protocol: 'HL7 v2', messageId, mappedType: 'Observation', freshness: 'Current' },
            raw: 'Synthetic ORU held because patient identity is unresolved',
            mapped: { resource: 'Observation', patientResolution: 'Unmatched' },
          },
        }
        const message: IntegrationMessage = {
          id: messageId,
          type: 'ORU',
          protocol: 'HL7 v2',
          sourceSystemId: 'sys-lis',
          destination: 'HealthConnect Gateway',
          timestamp,
          status: 'Unmatched',
          error: 'No confident patient match found',
          pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Match', status: 'Failed' }, { label: 'Mapped', status: 'Pending' }, { label: 'Stored', status: 'Pending' }],
          raw: 'MSH|...|ORU^R01|DEMO-UNMATCH\nPID|||INCOMPLETE\nOBX|1|ST|NT-PROBNP||DEMO',
          parsed: { result: 'NT-proBNP', patientIdentifier: 'INCOMPLETE' },
          mapped: { heldRecordId: recordId },
        }
        const issue: DataQualityIssue = { id: id('dq'), type: 'Orphan record', title: 'New laboratory result has no confident patient match', sourceSystemId: 'sys-lis', detectedAt: timestamp, priority: 'High', owner: 'Data Steward Queue', status: 'Open', relatedId: unmatchedId }
        set({
          unmatchedRecords: [unmatched, ...state.unmatchedRecords],
          messages: [message, ...state.messages],
          qualityIssues: [issue, ...state.qualityIssues],
          audits: [{ id: id('audit'), timestamp, user: state.currentUser, role: state.currentRole, entity: 'Metro Diagnostics', action: 'Unmatched laboratory demo created', object: unmatchedId, previousState: 'No incoming record', newState: 'Held for identity resolution' }, ...state.audits],
          notifications: [{ id: id('note'), title: 'New unmatched laboratory record', body: 'A synthetic Metro Diagnostics result needs patient identity review.', severity: 'Warning', createdAt: timestamp, read: false, href: '/data-quality' }, ...state.notifications],
        })
        toast.success('Synthetic unmatched laboratory record created.')
        return { ok: true }
      },

      reviewConflict: (conflictId, mode, preferredRecordId) => {
        const state = get()
        if (!canRole(state.currentRole, 'data-quality')) return deny('This role cannot review cross-source data conflicts.')
        const conflict = state.conflicts.find(c => c.id === conflictId)
        if (!conflict) return deny('Conflict not found.')
        if (conflict.status !== 'Open') return deny(`This conflict already has a human decision (${conflict.status}).`)
        if (mode === 'Grouped' && conflict.type !== 'Duplicate Event') return deny('Only potential duplicate clinical events can be grouped.')
        if (mode === 'Display Preference Set' && (!preferredRecordId || !conflict.recordIds.includes(preferredRecordId))) {
          return deny('Select a source record from this conflict before setting a display preference.')
        }
        const reviewedAt = now()
        set({
          conflicts: state.conflicts.map(c => c.id === conflictId ? {
            ...c,
            status: mode,
            displayPreferenceRecordId: mode === 'Display Preference Set' ? preferredRecordId : c.displayPreferenceRecordId,
            reviewedBy: state.currentUser,
            reviewedAt,
          } : c),
          qualityIssues: state.qualityIssues.map((issue) => issue.relatedId === conflictId ? { ...issue, status: mode === 'Escalated' ? 'In Review' : 'Resolved' } : issue),
          audits: [{ id: id('audit'), timestamp: reviewedAt, user: state.currentUser, role: state.currentRole, entity: conflict.patientId, action: 'Cross-source conflict reviewed', object: conflict.id, previousState: conflict.status, newState: mode }, ...state.audits],
          notifications: mode === 'Escalated' ? [{ id: id('note'), title: 'Clinical reconciliation requested', body: `${conflict.title} was escalated for human review.`, severity: 'Warning', createdAt: reviewedAt, read: false, href: `/patients/${conflict.patientId}` }, ...state.notifications] : state.notifications,
        })
        toast.success('Conflict review decision recorded. Original source evidence remains intact.')
        return { ok: true }
      },

      askCopilot: (patientId, question) => {
        const state = get()
        if (!canRole(state.currentRole, 'copilot')) {
          toast.error('Switch to Clinician, Clinical Informaticist, or Administrator to use the AI Copilot.')
          return undefined
        }
        const patient = state.patients.find(p => p.id === patientId)
        if (!patient) return undefined
        const response = answerPatientQuestion(patient, state.clinicalRecords, state.conflicts, question)
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: patient.name, action: 'AI Copilot summary generated', object: response.id, previousState: 'Question submitted', newState: `${response.sourcesUsed} source record(s) cited` }
        set({ copilotResponses: [response, ...state.copilotResponses], audits: [audit, ...state.audits] })
        return response
      },

      generatePatientSummary: (patientId) => {
        const state = get()
        if (!canRole(state.currentRole, 'copilot')) return undefined
        const patient = state.patients.find(p => p.id === patientId)
        if (!patient) return undefined
        return generateUnifiedPatientSummary(patient, state.clinicalRecords, state.conflicts)
      },

      logSourceView: (recordId) => {
        const state = get()
        const record = state.clinicalRecords.find(r => r.id === recordId)
        if (!record) return
        const patient = state.patients.find(p => p.id === record.patientId)
        const last = state.audits[0]
        if (last?.action === 'Source record viewed' && last.object === recordId && last.user === state.currentUser) return
        const audit: AuditEvent = { id: id('audit'), timestamp: now(), user: state.currentUser, role: state.currentRole, entity: patient?.name ?? record.provenance.sourceOrganization, action: 'Source record viewed', object: recordId, previousState: record.provenance.originalRecordId, newState: 'Provenance inspected' }
        set({ audits: [audit, ...state.audits] })
      },

      resetDemo: () => {
        set({ ...initialData(), currentRole: 'Data Steward', currentUser: 'Daniel Foster' })
        toast.success('HealthConnect synthetic demo data restored.')
      },
    }),
    { name: 'healthconnect-ai-demo-v3', version: 3, partialize: (state) => state }
  )
)
