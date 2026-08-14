export type Role =
  | 'Clinician'
  | 'Health Information Manager'
  | 'Interoperability Analyst'
  | 'Integration Engineer'
  | 'Data Steward'
  | 'Clinical Informaticist'
  | 'Administrator'

export type ConnectionStatus = 'Connected' | 'Syncing' | 'Delayed' | 'Degraded' | 'Offline' | 'Maintenance'
export type Protocol = 'FHIR R4' | 'HL7 v2' | 'DICOM' | 'REST API' | 'Event Stream' | 'Batch Import'
export type Freshness = 'Current' | 'Stale' | 'Unknown' | 'Delayed'
export type ClinicalDomain = 'Encounter' | 'Condition' | 'Medication' | 'Allergy' | 'Lab' | 'Imaging' | 'Document' | 'Appointment' | 'Device'
export type MatchStrength = 'Strong Match' | 'Possible Match' | 'Weak Match' | 'Conflict'
export type IdentityStatus = 'Needs Review' | 'Merged' | 'Kept Separate' | 'Linked' | 'Review Requested'
export type MessageStatus = 'Received' | 'Processing' | 'Processed' | 'Failed' | 'Held' | 'Unmatched'
export type IssueStatus = 'Open' | 'In Review' | 'Resolved' | 'Held'

export interface SourceSystem {
  id: string
  name: string
  organization: string
  type: string
  protocol: Protocol
  status: ConnectionStatus
  lastSync: string
  messagesToday: number
  dataDomains: string[]
  demoLabel?: string
}

export interface InterfaceConnection {
  id: string
  name: string
  sourceSystemId: string
  destination: string
  protocol: Protocol
  direction: 'Inbound' | 'Outbound' | 'Bidirectional'
  status: ConnectionStatus
  lastMessage: string
  messagesPerHour: number
  errors: number
  endpointLabel: string
}

export interface PipelineStep {
  label: string
  status: 'Complete' | 'Active' | 'Failed' | 'Pending'
}

export interface IntegrationMessage {
  id: string
  type: 'ADT' | 'ORU' | 'ORM' | 'FHIR Patient' | 'FHIR Observation' | 'FHIR MedicationRequest' | 'DICOM Study' | 'REST Event'
  protocol: Protocol
  sourceSystemId: string
  destination: string
  timestamp: string
  patientMapping?: string
  status: MessageStatus
  error?: string
  pipeline: PipelineStep[]
  raw: string
  parsed: Record<string, unknown>
  mapped: Record<string, unknown>
}

export interface PatientIdentifier {
  systemId: string
  label: string
  value: string
}

export interface Patient {
  id: string
  unifiedId: string
  name: string
  dob: string
  sex: string
  phone: string
  email: string
  address: string
  primaryCareProvider: string
  identifiers: PatientIdentifier[]
  sourceSystemIds: string[]
  clinicalRecordIds: string[]
  lastUnifiedUpdate: string
}

export interface ExternalPatientRecord {
  id: string
  sourceSystemId: string
  localId: string
  name: string
  dob: string
  sex: string
  phone: string
  email: string
  address: string
  clinicalRecordIds: string[]
  receivedAt: string
  linkedPatientId?: string
}

export interface MatchEvidence {
  field: string
  incoming: string
  existing: string
  state: 'Exact' | 'Near' | 'Conflict' | 'Missing'
  note?: string
}

export interface IdentityCandidate {
  id: string
  incomingRecordId: string
  potentialPatientId: string
  matchStrength: MatchStrength
  evidence: MatchEvidence[]
  status: IdentityStatus
  receivedAt: string
  reviewer?: string
}

export interface Provenance {
  sourceOrganization: string
  sourceSystemId: string
  originalRecordId: string
  receivedAt: string
  clinicalAt: string
  protocol: Protocol
  messageId?: string
  mappedType: string
  freshness: Freshness
}

export interface ClinicalRecord {
  id: string
  patientId?: string
  domain: ClinicalDomain
  title: string
  summary: string
  value?: string
  unit?: string
  status: string
  author?: string
  facility: string
  provenance: Provenance
  raw: Record<string, unknown> | string
  mapped: Record<string, unknown>
  tags?: string[]
}

export interface DataConflict {
  id: string
  patientId: string
  type: 'Medication' | 'Allergy' | 'Demographic' | 'Duplicate Event'
  title: string
  description: string
  recordIds: string[]
  status: 'Open' | 'Reviewed' | 'Escalated' | 'Keep All Sources' | 'Display Preference Set' | 'Grouped'
  displayPreferenceRecordId?: string
  reviewedBy?: string
  reviewedAt?: string
}

export interface DataQualityIssue {
  id: string
  type: 'Duplicate identity' | 'Missing identifier' | 'Mapping failure' | 'Stale data' | 'Conflicting demographic' | 'Medication conflict' | 'Orphan record' | 'Missing source'
  title: string
  patientId?: string
  sourceSystemId?: string
  detectedAt: string
  priority: 'Low' | 'Medium' | 'High'
  owner: string
  status: IssueStatus
  relatedId?: string
}

export interface MappingRule {
  id: string
  sourceSystemId: string
  sourceField: string
  sourceCode?: string
  targetResource: string
  targetField: string
  transformation: string
  status: 'Mapped' | 'Unmapped' | 'Needs Review'
}

export interface UnmatchedRecord {
  id: string
  sourceSystemId: string
  localPatientLabel: string
  record: Omit<ClinicalRecord, 'patientId'>
  status: 'Unmatched' | 'Held' | 'Linked' | 'Created New Patient'
  receivedAt: string
}

export interface MergeHistoryItem {
  id: string
  patientId: string
  incomingRecordId: string
  performedBy: string
  date: string
  reason: string
  sourceSystemIds: string[]
}

export interface AuditEvent {
  id: string
  timestamp: string
  user: string
  role: Role
  entity: string
  action: string
  object: string
  previousState: string
  newState: string
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  severity: 'Info' | 'Warning' | 'Critical' | 'Success'
  createdAt: string
  read: boolean
  href?: string
}

export interface SourceCitation {
  recordId: string
  label: string
  sourceSystemId: string
  timestamp: string
}

export interface CopilotStatement {
  id: string
  text: string
  citations: SourceCitation[]
}

export interface CopilotResponse {
  id: string
  patientId: string
  question: string
  title: string
  statements: CopilotStatement[]
  sourcesUsed: number
  freshness: Freshness
  conflicts: number
  humanReview: boolean
  createdAt: string
}
