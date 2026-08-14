import type {
  AuditEvent,
  ClinicalRecord,
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
  SourceSystem,
  UnmatchedRecord,
} from '../types/domain'

export const DEMO_NOW = '2026-08-14T10:30:00Z'

export const sourceSystems: SourceSystem[] = [
  { id: 'sys-epic', name: 'Northbridge Epic', organization: 'Northbridge Hospital', type: 'EHR', protocol: 'FHIR R4', status: 'Connected', lastSync: '2026-08-14T10:26:00Z', messagesToday: 48620, dataDomains: ['Encounters', 'Conditions', 'Allergies', 'Appointments'], demoLabel: 'Synthetic EHR' },
  { id: 'sys-oracle', name: 'CityCare Oracle Health', organization: 'CityCare Clinic', type: 'EHR', protocol: 'FHIR R4', status: 'Connected', lastSync: '2026-08-14T10:18:00Z', messagesToday: 18220, dataDomains: ['Encounters', 'Medications', 'Documents'], demoLabel: 'Synthetic EHR' },
  { id: 'sys-dedalus', name: 'Regional Dedalus', organization: 'Regional Care Trust', type: 'EHR', protocol: 'HL7 v2', status: 'Connected', lastSync: '2026-08-14T10:24:00Z', messagesToday: 14300, dataDomains: ['ADT', 'Referrals'], demoLabel: 'Synthetic EHR' },
  { id: 'sys-lis', name: 'Metro Diagnostics LIS', organization: 'Metro Diagnostics', type: 'Laboratory', protocol: 'HL7 v2', status: 'Connected', lastSync: '2026-08-14T10:28:00Z', messagesToday: 23540, dataDomains: ['Lab Results', 'Orders'], demoLabel: 'Synthetic LIS' },
  { id: 'sys-pacs', name: 'Prime Imaging PACS', organization: 'Prime Imaging Centre', type: 'Imaging', protocol: 'DICOM', status: 'Connected', lastSync: '2026-08-14T10:21:00Z', messagesToday: 5880, dataDomains: ['Imaging', 'Reports'], demoLabel: 'Synthetic PACS' },
  { id: 'sys-pharmacy', name: 'Northbridge Pharmacy', organization: 'Northbridge Hospital Pharmacy', type: 'Pharmacy', protocol: 'REST API', status: 'Connected', lastSync: '2026-08-14T10:14:00Z', messagesToday: 9200, dataDomains: ['Medication Records', 'Dispensing'], demoLabel: 'Synthetic Pharmacy' },
  { id: 'sys-insurance', name: 'HealthSure Insurance', organization: 'HealthSure', type: 'Insurance', protocol: 'Batch Import', status: 'Delayed', lastSync: '2026-08-13T21:00:00Z', messagesToday: 3320, dataDomains: ['Coverage', 'Claims'], demoLabel: 'Synthetic Insurance' },
  { id: 'sys-devices', name: 'Connected Device Gateway', organization: 'Northbridge Digital Care', type: 'Medical Devices', protocol: 'Event Stream', status: 'Connected', lastSync: '2026-08-14T10:29:00Z', messagesToday: 5361, dataDomains: ['Observations', 'Device Events'], demoLabel: 'Synthetic Device Gateway' },
]

export const interfaces: InterfaceConnection[] = [
  { id: 'int-epic-fhir', name: 'Epic Clinical FHIR', sourceSystemId: 'sys-epic', destination: 'HealthConnect Gateway', protocol: 'FHIR R4', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:26:00Z', messagesPerHour: 2150, errors: 0, endpointLabel: '/demo/fhir/epic' },
  { id: 'int-oracle-fhir', name: 'CityCare FHIR Feed', sourceSystemId: 'sys-oracle', destination: 'HealthConnect Gateway', protocol: 'FHIR R4', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:18:00Z', messagesPerHour: 740, errors: 1, endpointLabel: '/demo/fhir/citycare' },
  { id: 'int-dedalus-adt', name: 'Dedalus ADT', sourceSystemId: 'sys-dedalus', destination: 'HealthConnect Gateway', protocol: 'HL7 v2', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:24:00Z', messagesPerHour: 610, errors: 0, endpointLabel: 'MLLP://demo/dedalus' },
  { id: 'int-lab-oru', name: 'Metro Diagnostics ORU', sourceSystemId: 'sys-lis', destination: 'HealthConnect Gateway', protocol: 'HL7 v2', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:28:00Z', messagesPerHour: 980, errors: 0, endpointLabel: 'MLLP://demo/metro-lab' },
  { id: 'int-pacs-dicom', name: 'Prime Imaging DICOM', sourceSystemId: 'sys-pacs', destination: 'HealthConnect Gateway', protocol: 'DICOM', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:21:00Z', messagesPerHour: 180, errors: 0, endpointLabel: 'DICOM://demo/prime' },
  { id: 'int-pharmacy-rest', name: 'Pharmacy Medication API', sourceSystemId: 'sys-pharmacy', destination: 'HealthConnect Gateway', protocol: 'REST API', direction: 'Bidirectional', status: 'Connected', lastMessage: '2026-08-14T10:14:00Z', messagesPerHour: 320, errors: 0, endpointLabel: '/demo/api/pharmacy' },
  { id: 'int-insurance-batch', name: 'HealthSure Eligibility Batch', sourceSystemId: 'sys-insurance', destination: 'HealthConnect Gateway', protocol: 'Batch Import', direction: 'Inbound', status: 'Delayed', lastMessage: '2026-08-13T21:00:00Z', messagesPerHour: 0, errors: 2, endpointLabel: 'SFTP://demo/healthsure' },
  { id: 'int-device-events', name: 'Device Observation Stream', sourceSystemId: 'sys-devices', destination: 'HealthConnect Gateway', protocol: 'Event Stream', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:29:00Z', messagesPerHour: 520, errors: 0, endpointLabel: 'EVENT://demo/devices' },
  { id: 'int-epic-adt', name: 'Epic ADT Event Feed', sourceSystemId: 'sys-epic', destination: 'HealthConnect Gateway', protocol: 'HL7 v2', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:25:00Z', messagesPerHour: 890, errors: 0, endpointLabel: 'MLLP://demo/epic-adt' },
  { id: 'int-oracle-docs', name: 'CityCare Document API', sourceSystemId: 'sys-oracle', destination: 'HealthConnect Gateway', protocol: 'REST API', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:17:00Z', messagesPerHour: 120, errors: 0, endpointLabel: '/demo/api/citycare-documents' },
  { id: 'int-lab-orders', name: 'Metro Laboratory Orders', sourceSystemId: 'sys-lis', destination: 'Metro Diagnostics', protocol: 'HL7 v2', direction: 'Outbound', status: 'Connected', lastMessage: '2026-08-14T10:20:00Z', messagesPerHour: 210, errors: 0, endpointLabel: 'MLLP://demo/metro-orders' },
  { id: 'int-pacs-reports', name: 'Prime Imaging Report FHIR', sourceSystemId: 'sys-pacs', destination: 'HealthConnect Gateway', protocol: 'FHIR R4', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:19:00Z', messagesPerHour: 95, errors: 0, endpointLabel: '/demo/fhir/prime-reports' },
  { id: 'int-pharmacy-events', name: 'Pharmacy Dispense Events', sourceSystemId: 'sys-pharmacy', destination: 'HealthConnect Gateway', protocol: 'Event Stream', direction: 'Inbound', status: 'Connected', lastMessage: '2026-08-14T10:13:00Z', messagesPerHour: 180, errors: 0, endpointLabel: 'EVENT://demo/pharmacy' },
  { id: 'int-insurance-claims', name: 'HealthSure Claims REST', sourceSystemId: 'sys-insurance', destination: 'HealthConnect Gateway', protocol: 'REST API', direction: 'Inbound', status: 'Delayed', lastMessage: '2026-08-13T20:55:00Z', messagesPerHour: 0, errors: 1, endpointLabel: '/demo/api/healthsure-claims' },
]

export const patients: Patient[] = [
  {
    id: 'pt-emily', unifiedId: 'HC-2026-102842', name: 'Emily Robinson', dob: '1962-04-21', sex: 'Female', phone: '+44 7700 900412', email: 'emily.robinson@example.test', address: '14 Willow Close, Northbridge', primaryCareProvider: 'Dr. Hannah Cole',
    identifiers: [
      { systemId: 'sys-epic', label: 'Epic MRN', value: 'EPI-904122' },
      { systemId: 'sys-lis', label: 'Lab ID', value: 'LIS-778201' },
      { systemId: 'sys-pacs', label: 'PACS ID', value: 'PACS-491204' },
      { systemId: 'sys-pharmacy', label: 'Pharmacy ID', value: 'PHR-88210' },
    ],
    sourceSystemIds: ['sys-epic', 'sys-lis', 'sys-pacs', 'sys-pharmacy'],
    clinicalRecordIds: ['rec-enc-aug3', 'rec-condition-hypertension', 'rec-lab-aug12', 'rec-lab-aug12-epic-forward', 'rec-ct-aug9', 'rec-med-pharmacy', 'rec-allergy-penicillin', 'rec-doc-discharge', 'rec-appointment'],
    lastUnifiedUpdate: '2026-08-14T10:28:00Z',
  },
  {
    id: 'pt-james', unifiedId: 'HC-2026-108903', name: 'James Turner', dob: '1957-09-14', sex: 'Male', phone: '+44 7700 900518', email: 'james.turner@example.test', address: '92 Regent Avenue, Northbridge', primaryCareProvider: 'Dr. Samuel Price',
    identifiers: [{ systemId: 'sys-epic', label: 'Epic MRN', value: 'EPI-991241' }, { systemId: 'sys-lis', label: 'Lab ID', value: 'LIS-336009' }], sourceSystemIds: ['sys-epic', 'sys-lis'], clinicalRecordIds: ['rec-james-enc', 'rec-james-lab'], lastUnifiedUpdate: '2026-08-14T09:50:00Z',
  },
  {
    id: 'pt-maria', unifiedId: 'HC-2026-114721', name: 'Maria Collins', dob: '1970-01-08', sex: 'Female', phone: '+44 7700 900621', email: 'maria.collins@example.test', address: '7 Cedar Walk, CityCare', primaryCareProvider: 'Dr. Leah Morris',
    identifiers: [{ systemId: 'sys-oracle', label: 'Clinic MRN', value: 'ORC-778121' }], sourceSystemIds: ['sys-oracle'], clinicalRecordIds: ['rec-maria-doc'], lastUnifiedUpdate: '2026-08-14T08:42:00Z',
  },
]

export const externalRecords: ExternalPatientRecord[] = [
  {
    id: 'ext-emily-citycare', sourceSystemId: 'sys-oracle', localId: 'ORC-201839', name: 'Emily Robertson', dob: '1962-04-21', sex: 'Female', phone: '+44 7700 900412', email: 'emily.r@example.test', address: '22 Rose Lane, Northbridge', clinicalRecordIds: ['rec-med-citycare', 'rec-citycare-encounter'], receivedAt: '2026-08-14T09:32:00Z',
  },
  {
    id: 'ext-j-turner', sourceSystemId: 'sys-dedalus', localId: 'DED-49018', name: 'James Turner', dob: '1957-09-14', sex: 'Male', phone: '+44 7700 900518', email: 'j.turner@example.test', address: '92 Regent Avenue, Northbridge', clinicalRecordIds: [], receivedAt: '2026-08-14T09:54:00Z',
  },
]

export const identityCandidates: IdentityCandidate[] = [
  {
    id: 'idq-emily', incomingRecordId: 'ext-emily-citycare', potentialPatientId: 'pt-emily', matchStrength: 'Strong Match', status: 'Needs Review', receivedAt: '2026-08-14T09:33:00Z',
    evidence: [
      { field: 'Name', incoming: 'Emily Robertson', existing: 'Emily Robinson', state: 'Near', note: 'Similar first name and surname variation' },
      { field: 'Date of birth', incoming: '21 Apr 1962', existing: '21 Apr 1962', state: 'Exact' },
      { field: 'Phone', incoming: '+44 7700 900412', existing: '+44 7700 900412', state: 'Exact' },
      { field: 'Address', incoming: '22 Rose Lane, Northbridge', existing: '14 Willow Close, Northbridge', state: 'Conflict', note: 'Address differs across systems' },
      { field: 'Local identifier', incoming: 'ORC-201839', existing: 'EPI-904122', state: 'Near', note: 'Different local identifiers are expected across facilities' },
    ],
  },
  {
    id: 'idq-james', incomingRecordId: 'ext-j-turner', potentialPatientId: 'pt-james', matchStrength: 'Strong Match', status: 'Needs Review', receivedAt: '2026-08-14T09:55:00Z',
    evidence: [
      { field: 'Name', incoming: 'James Turner', existing: 'James Turner', state: 'Exact' },
      { field: 'Date of birth', incoming: '14 Sep 1957', existing: '14 Sep 1957', state: 'Exact' },
      { field: 'Phone', incoming: '+44 7700 900518', existing: '+44 7700 900518', state: 'Exact' },
      { field: 'Address', incoming: '92 Regent Avenue, Northbridge', existing: '92 Regent Avenue, Northbridge', state: 'Exact' },
    ],
  },
]

export const clinicalRecords: ClinicalRecord[] = [
  {
    id: 'rec-enc-aug3', patientId: 'pt-emily', domain: 'Encounter', title: 'Outpatient cardiology encounter', summary: 'Routine outpatient review documented at Northbridge Hospital.', status: 'Completed', author: 'Dr. Hannah Cole', facility: 'Northbridge Hospital',
    provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'ENC-EP-44081', receivedAt: '2026-08-03T11:40:00Z', clinicalAt: '2026-08-03T10:15:00Z', protocol: 'FHIR R4', messageId: 'MSG-20260803-44081', mappedType: 'Encounter', freshness: 'Current' },
    raw: { resourceType: 'Encounter', status: 'finished', id: 'ENC-EP-44081' }, mapped: { resource: 'Encounter', status: 'completed' }, tags: ['Cardiology']
  },
  {
    id: 'rec-lab-aug12', patientId: 'pt-emily', domain: 'Lab', title: 'Comprehensive blood test', summary: 'Routine laboratory panel received from Metro Diagnostics.', value: 'Reviewed', status: 'Final', facility: 'Metro Diagnostics',
    provenance: { sourceOrganization: 'Metro Diagnostics', sourceSystemId: 'sys-lis', originalRecordId: 'LAB-771902', receivedAt: '2026-08-12T09:24:00Z', clinicalAt: '2026-08-12T08:50:00Z', protocol: 'HL7 v2', messageId: 'MSG-20260812-771902', mappedType: 'DiagnosticReport / Observation', freshness: 'Current' },
    raw: 'MSH|^~\\&|METRO|LAB|HEALTHCONNECT|HIE|202608120924||ORU^R01|771902|P|2.5\nPID|||LIS-778201||ROBINSON^EMILY||19620421|F\nOBR|1|||ROUTINE PANEL\nOBX|1|ST|SUMMARY||Routine panel available', mapped: { resource: 'DiagnosticReport', status: 'final' }, tags: ['Lab']
  },
  {
    id: 'rec-ct-aug9', patientId: 'pt-emily', domain: 'Imaging', title: 'CT chest', summary: 'CT chest study and report received from Prime Imaging Centre. No automated image interpretation is performed by this demo.', status: 'Final report', author: 'Dr. Lewis Grant', facility: 'Prime Imaging Centre',
    provenance: { sourceOrganization: 'Prime Imaging Centre', sourceSystemId: 'sys-pacs', originalRecordId: 'PACS-STUDY-39011', receivedAt: '2026-08-09T15:42:00Z', clinicalAt: '2026-08-09T14:05:00Z', protocol: 'DICOM', messageId: 'MSG-20260809-39011', mappedType: 'ImagingStudy / DiagnosticReport', freshness: 'Current' },
    raw: { StudyInstanceUID: '1.2.826.0.1.3680043.10.39011', Modality: 'CT', BodyPartExamined: 'CHEST' }, mapped: { resource: 'ImagingStudy', modality: 'CT', bodyRegion: 'Chest' }, tags: ['Imaging']
  },
  {
    id: 'rec-med-pharmacy', patientId: 'pt-emily', domain: 'Medication', title: 'Metformin', summary: 'Metformin 500 mg twice daily', value: '500 mg twice daily', status: 'Active', facility: 'Northbridge Hospital Pharmacy',
    provenance: { sourceOrganization: 'Northbridge Hospital Pharmacy', sourceSystemId: 'sys-pharmacy', originalRecordId: 'PHR-MED-88210', receivedAt: '2026-08-10T12:20:00Z', clinicalAt: '2026-08-10T11:55:00Z', protocol: 'REST API', messageId: 'MSG-20260810-88210', mappedType: 'MedicationStatement', freshness: 'Current' },
    raw: { medication: 'Metformin', dose: '500mg', frequency: 'BID' }, mapped: { resource: 'MedicationStatement', dose: '500 mg twice daily' }, tags: ['Metformin']
  },
  {
    id: 'rec-med-citycare', domain: 'Medication', title: 'Metformin', summary: 'Metformin 500 mg once daily recorded at CityCare Clinic', value: '500 mg once daily', status: 'Active', facility: 'CityCare Clinic',
    provenance: { sourceOrganization: 'CityCare Clinic', sourceSystemId: 'sys-oracle', originalRecordId: 'ORC-MED-201839', receivedAt: '2026-08-14T09:32:00Z', clinicalAt: '2026-08-06T10:05:00Z', protocol: 'FHIR R4', messageId: 'MSG-20260814-ORC839', mappedType: 'MedicationStatement', freshness: 'Current' },
    raw: { resourceType: 'MedicationStatement', medication: 'Metformin', dosage: '500 mg daily' }, mapped: { resource: 'MedicationStatement', dose: '500 mg once daily' }, tags: ['Metformin']
  },
  {
    id: 'rec-citycare-encounter', domain: 'Encounter', title: 'External clinic review', summary: 'Follow-up consultation at CityCare Clinic.', status: 'Completed', author: 'Dr. Amelia Shaw', facility: 'CityCare Clinic',
    provenance: { sourceOrganization: 'CityCare Clinic', sourceSystemId: 'sys-oracle', originalRecordId: 'ORC-ENC-201840', receivedAt: '2026-08-14T09:32:00Z', clinicalAt: '2026-08-13T16:15:00Z', protocol: 'FHIR R4', messageId: 'MSG-20260814-ORC840', mappedType: 'Encounter', freshness: 'Current' },
    raw: { resourceType: 'Encounter', status: 'finished' }, mapped: { resource: 'Encounter', status: 'completed' }
  },
  {
    id: 'rec-condition-hypertension', patientId: 'pt-emily', domain: 'Condition', title: 'Hypertension', summary: 'Hypertension is present in the synthetic problem list from Northbridge Epic.', status: 'Active', author: 'Dr. Hannah Cole', facility: 'Northbridge Hospital',
    provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'COND-EP-44112', receivedAt: '2026-08-03T11:40:00Z', clinicalAt: '2025-11-18T09:10:00Z', protocol: 'FHIR R4', messageId: 'MSG-20260803-44112', mappedType: 'Condition', freshness: 'Current' }, raw: { resourceType: 'Condition', code: 'Demo hypertension concept' }, mapped: { resource: 'Condition', clinicalStatus: 'active' }
  },
  {
    id: 'rec-lab-aug12-epic-forward', patientId: 'pt-emily', domain: 'Lab', title: 'Comprehensive blood test', summary: 'Forwarded copy of the Metro Diagnostics panel received through the EHR; potential duplicate clinical event.', value: 'Reviewed', status: 'Final', facility: 'Northbridge Hospital',
    provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'EPIC-LAB-COPY-771902', receivedAt: '2026-08-12T09:31:00Z', clinicalAt: '2026-08-12T08:50:00Z', protocol: 'FHIR R4', messageId: 'MSG-20260812-EPIC-LAB-COPY', mappedType: 'DiagnosticReport', freshness: 'Current' }, raw: { resourceType: 'DiagnosticReport', sourceReference: 'LAB-771902' }, mapped: { resource: 'DiagnosticReport', duplicateCandidateOf: 'rec-lab-aug12' }, tags: ['Lab', 'Potential duplicate']
  },
  {
    id: 'rec-doc-discharge', patientId: 'pt-emily', domain: 'Document', title: 'Previous discharge summary', summary: 'Synthetic discharge summary retained from a prior Northbridge encounter.', status: 'Final', author: 'Dr. Hannah Cole', facility: 'Northbridge Hospital',
    provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'DOC-EP-55091', receivedAt: '2026-08-03T11:41:00Z', clinicalAt: '2026-07-28T15:00:00Z', protocol: 'FHIR R4', messageId: 'MSG-20260803-DOC55091', mappedType: 'DocumentReference', freshness: 'Current' }, raw: 'Synthetic discharge summary for interoperability demonstration only.', mapped: { resource: 'DocumentReference', status: 'current' }
  },
  {
    id: 'rec-allergy-penicillin', patientId: 'pt-emily', domain: 'Allergy', title: 'Penicillin', summary: 'Recorded allergy: rash', value: 'Rash', status: 'Active', facility: 'Northbridge Hospital',
    provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'ALG-44091', receivedAt: '2026-08-03T11:40:00Z', clinicalAt: '2024-03-16T12:00:00Z', protocol: 'FHIR R4', mappedType: 'AllergyIntolerance', freshness: 'Current' }, raw: { allergen: 'Penicillin', reaction: 'Rash' }, mapped: { resource: 'AllergyIntolerance', clinicalStatus: 'active' }
  },
  {
    id: 'rec-appointment', patientId: 'pt-emily', domain: 'Appointment', title: 'Cardiology follow-up', summary: 'Upcoming cardiology review at Northbridge Hospital.', status: 'Booked', facility: 'Northbridge Hospital',
    provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'APT-20260820-18', receivedAt: '2026-08-14T08:00:00Z', clinicalAt: '2026-08-20T09:30:00Z', protocol: 'FHIR R4', mappedType: 'Appointment', freshness: 'Current' }, raw: { date: '2026-08-20', time: '09:30' }, mapped: { resource: 'Appointment', status: 'booked' }
  },
  {
    id: 'rec-james-enc', patientId: 'pt-james', domain: 'Encounter', title: 'Emergency encounter', summary: 'Synthetic emergency encounter.', status: 'Completed', facility: 'Northbridge Hospital', provenance: { sourceOrganization: 'Northbridge Hospital', sourceSystemId: 'sys-epic', originalRecordId: 'ENC-J-201', receivedAt: '2026-08-10T19:10:00Z', clinicalAt: '2026-08-10T18:25:00Z', protocol: 'FHIR R4', mappedType: 'Encounter', freshness: 'Current' }, raw: {}, mapped: { resource: 'Encounter' }
  },
  {
    id: 'rec-james-lab', patientId: 'pt-james', domain: 'Lab', title: 'Renal panel', summary: 'Synthetic laboratory result.', status: 'Final', facility: 'Metro Diagnostics', provenance: { sourceOrganization: 'Metro Diagnostics', sourceSystemId: 'sys-lis', originalRecordId: 'LAB-J-920', receivedAt: '2026-08-11T08:15:00Z', clinicalAt: '2026-08-11T07:55:00Z', protocol: 'HL7 v2', mappedType: 'Observation', freshness: 'Current' }, raw: {}, mapped: { resource: 'Observation' }
  },
  {
    id: 'rec-maria-doc', patientId: 'pt-maria', domain: 'Document', title: 'Clinic note', summary: 'Synthetic primary care clinic note.', status: 'Final', author: 'Dr. Leah Morris', facility: 'CityCare Clinic', provenance: { sourceOrganization: 'CityCare Clinic', sourceSystemId: 'sys-oracle', originalRecordId: 'DOC-M-881', receivedAt: '2026-08-14T08:42:00Z', clinicalAt: '2026-08-13T14:10:00Z', protocol: 'FHIR R4', mappedType: 'DocumentReference', freshness: 'Current' }, raw: 'Synthetic clinical note for portfolio demonstration.', mapped: { resource: 'DocumentReference' }
  },
]

export const dataConflicts: DataConflict[] = []

export const messages: IntegrationMessage[] = [
  {
    id: 'MSG-20260814-10249', type: 'FHIR Patient', protocol: 'FHIR R4', sourceSystemId: 'sys-oracle', destination: 'HealthConnect Gateway', timestamp: '2026-08-14T09:32:00Z', patientMapping: 'Identity review required', status: 'Processed',
    pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Match', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }],
    raw: '{"resourceType":"Patient","id":"ORC-201839","name":[{"family":"Robertson","given":["Emily"]}]}', parsed: { resourceType: 'Patient', localId: 'ORC-201839', name: 'Emily Robertson' }, mapped: { identityCandidate: 'idq-emily' }
  },
  {
    id: 'MSG-20260812-771902', type: 'ORU', protocol: 'HL7 v2', sourceSystemId: 'sys-lis', destination: 'HealthConnect Gateway', timestamp: '2026-08-12T09:24:00Z', patientMapping: 'HC-2026-102842', status: 'Processed',
    pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }, { label: 'Patient 360', status: 'Complete' }],
    raw: 'MSH|^~\\&|METRO|LAB|HEALTHCONNECT|HIE|202608120924||ORU^R01|771902|P|2.5\nPID|||LIS-778201||ROBINSON^EMILY||19620421|F\nOBR|1|||ROUTINE PANEL\nOBX|1|ST|SUMMARY||Routine panel available', parsed: { patientId: 'LIS-778201', report: 'Routine panel' }, mapped: { patientId: 'pt-emily', recordId: 'rec-lab-aug12' }
  },
  {
    id: 'MSG-20260814-ADT01', type: 'ADT', protocol: 'HL7 v2', sourceSystemId: 'sys-dedalus', destination: 'HealthConnect Gateway', timestamp: '2026-08-14T09:58:00Z', patientMapping: 'HC-2026-108903', status: 'Processed', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }, { label: 'Patient 360', status: 'Complete' }], raw: 'MSH|^~\&|DEDALUS|REGIONAL|HEALTHCONNECT|HIE|202608140958||ADT^A08|ADT01|P|2.5\nPID|||DED-49018||TURNER^JAMES', parsed: { event: 'A08', patient: 'James Turner' }, mapped: { resource: 'Encounter', patientId: 'pt-james' }
  },
  {
    id: 'MSG-20260814-ORM01', type: 'ORM', protocol: 'HL7 v2', sourceSystemId: 'sys-lis', destination: 'Metro Diagnostics', timestamp: '2026-08-14T09:46:00Z', patientMapping: 'HC-2026-102842', status: 'Processed', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }], raw: 'MSH|^~\&|HEALTHCONNECT|HIE|METRO|LAB|202608140946||ORM^O01|ORM01|P|2.5', parsed: { order: 'Demo laboratory order' }, mapped: { resource: 'ServiceRequest', patientId: 'pt-emily' }
  },
  {
    id: 'MSG-20260814-FHIROBS', type: 'FHIR Observation', protocol: 'FHIR R4', sourceSystemId: 'sys-epic', destination: 'HealthConnect Gateway', timestamp: '2026-08-14T09:40:00Z', patientMapping: 'HC-2026-102842', status: 'Processed', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }, { label: 'Patient 360', status: 'Complete' }], raw: '{"resourceType":"Observation","id":"OBS-DEMO-01","subject":{"reference":"Patient/EPI-904122"}}', parsed: { resourceType: 'Observation', id: 'OBS-DEMO-01' }, mapped: { patientId: 'pt-emily', resource: 'Observation' }
  },
  {
    id: 'MSG-20260814-FHIRMED', type: 'FHIR MedicationRequest', protocol: 'FHIR R4', sourceSystemId: 'sys-oracle', destination: 'HealthConnect Gateway', timestamp: '2026-08-14T09:35:00Z', patientMapping: 'Identity review required', status: 'Held', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Match', status: 'Active' }, { label: 'Mapped', status: 'Pending' }, { label: 'Stored', status: 'Pending' }], raw: '{"resourceType":"MedicationRequest","id":"ORC-MED-201839"}', parsed: { resourceType: 'MedicationRequest', localPatientId: 'ORC-201839' }, mapped: { identityCandidate: 'idq-emily' }
  },
  {
    id: 'MSG-20260809-DICOM01', type: 'DICOM Study', protocol: 'DICOM', sourceSystemId: 'sys-pacs', destination: 'HealthConnect Gateway', timestamp: '2026-08-09T15:42:00Z', patientMapping: 'HC-2026-102842', status: 'Processed', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }, { label: 'Patient 360', status: 'Complete' }], raw: 'StudyInstanceUID=1.2.826.0.1.3680043.10.39011;Modality=CT;BodyPartExamined=CHEST', parsed: { StudyInstanceUID: '1.2.826.0.1.3680043.10.39011', Modality: 'CT', BodyPartExamined: 'CHEST' }, mapped: { resource: 'ImagingStudy', recordId: 'rec-ct-aug9' }
  },
  {
    id: 'MSG-20260814-REST01', type: 'REST Event', protocol: 'REST API', sourceSystemId: 'sys-pharmacy', destination: 'HealthConnect Gateway', timestamp: '2026-08-14T09:20:00Z', patientMapping: 'HC-2026-102842', status: 'Processed', pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validated', status: 'Complete' }, { label: 'Patient Matched', status: 'Complete' }, { label: 'Mapped', status: 'Complete' }, { label: 'Stored', status: 'Complete' }, { label: 'Patient 360', status: 'Complete' }], raw: '{"event":"medication.dispensed","patient":"PHR-88210"}', parsed: { event: 'medication.dispensed', patient: 'PHR-88210' }, mapped: { patientId: 'pt-emily', resource: 'MedicationStatement' }
  },
  {
    id: 'MSG-20260814-FAIL01', type: 'ORU', protocol: 'HL7 v2', sourceSystemId: 'sys-lis', destination: 'HealthConnect Gateway', timestamp: '2026-08-14T10:02:00Z', status: 'Failed', error: 'Patient identifier missing',
    pipeline: [{ label: 'Received', status: 'Complete' }, { label: 'Validation', status: 'Failed' }, { label: 'Patient Match', status: 'Pending' }, { label: 'Mapped', status: 'Pending' }], raw: 'MSH|...\nPID|||\nOBX|...', parsed: { error: 'Missing PID-3' }, mapped: {}
  },
]

export const unmatchedRecords: UnmatchedRecord[] = [
  {
    id: 'unmatched-lab-1', sourceSystemId: 'sys-lis', localPatientLabel: 'E. Robinson / DOB 21-04-1962', status: 'Unmatched', receivedAt: '2026-08-14T10:05:00Z',
    record: {
      id: 'rec-unmatched-lab', domain: 'Lab', title: 'C-reactive protein', summary: 'Synthetic external laboratory result awaiting patient linkage.', value: '6.2', unit: 'mg/L', status: 'Final', facility: 'Metro Diagnostics',
      provenance: { sourceOrganization: 'Metro Diagnostics', sourceSystemId: 'sys-lis', originalRecordId: 'LAB-UNMATCH-1022', receivedAt: '2026-08-14T10:05:00Z', clinicalAt: '2026-08-14T09:48:00Z', protocol: 'HL7 v2', messageId: 'MSG-UNMATCH-1022', mappedType: 'Observation', freshness: 'Current' },
      raw: 'Synthetic ORU with incomplete identifier', mapped: { resource: 'Observation', code: 'CRP' }
    }
  }
]

export const mappings: MappingRule[] = [
  { id: 'map-1', sourceSystemId: 'sys-lis', sourceField: 'OBX-5', sourceCode: 'NUMERIC', targetResource: 'Observation', targetField: 'valueQuantity', transformation: 'Numeric result', status: 'Mapped' },
  { id: 'map-2', sourceSystemId: 'sys-lis', sourceField: 'PID-3', targetResource: 'Patient', targetField: 'identifier', transformation: 'Local identifier → identifier[]', status: 'Mapped' },
  { id: 'map-3', sourceSystemId: 'sys-oracle', sourceField: 'local_medication_name', sourceCode: 'METFORMIN_LOCAL', targetResource: 'MedicationStatement', targetField: 'medicationCodeableConcept', transformation: 'Demo terminology normalization', status: 'Needs Review' },
  { id: 'map-4', sourceSystemId: 'sys-dedalus', sourceField: 'PV1-10', targetResource: 'Encounter', targetField: 'serviceType', transformation: 'Pending mapping rule', status: 'Unmapped' },
]

export const qualityIssues: DataQualityIssue[] = [
  { id: 'dq-msg-missing-id', type: 'Missing identifier', title: 'Failed ORU message is missing a patient identifier', sourceSystemId: 'sys-lis', detectedAt: '2026-08-14T10:02:00Z', priority: 'High', owner: 'Integration Team', status: 'Open', relatedId: 'MSG-20260814-FAIL01' },
  { id: 'dq-1', type: 'Duplicate identity', title: 'Possible duplicate: Emily Robertson / Emily Robinson', patientId: 'pt-emily', sourceSystemId: 'sys-oracle', detectedAt: '2026-08-14T09:33:00Z', priority: 'High', owner: 'Data Steward Queue', status: 'Open', relatedId: 'idq-emily' },
  { id: 'dq-2', type: 'Mapping failure', title: 'Medication terminology mapping requires review', sourceSystemId: 'sys-oracle', detectedAt: '2026-08-14T08:55:00Z', priority: 'Medium', owner: 'Clinical Informatics', status: 'Open', relatedId: 'map-3' },
  { id: 'dq-3', type: 'Orphan record', title: 'Laboratory result has no confident patient match', sourceSystemId: 'sys-lis', detectedAt: '2026-08-14T10:05:00Z', priority: 'High', owner: 'Data Steward Queue', status: 'Open', relatedId: 'unmatched-lab-1' },
  { id: 'dq-4', type: 'Stale data', title: 'HealthSure feed is delayed', sourceSystemId: 'sys-insurance', detectedAt: '2026-08-14T07:00:00Z', priority: 'Low', owner: 'Integration Team', status: 'Open' },
]

export const audits: AuditEvent[] = [
  { id: 'audit-1', timestamp: '2026-08-14T09:33:00Z', user: 'HealthConnect Identity Engine', role: 'Administrator', entity: 'Emily Robinson', action: 'Possible patient match identified', object: 'idq-emily', previousState: 'External record', newState: 'Needs Review' },
  { id: 'audit-2', timestamp: '2026-08-14T09:24:00Z', user: 'Integration Engine', role: 'Administrator', entity: 'Metro Diagnostics', action: 'Laboratory message processed', object: 'MSG-20260812-771902', previousState: 'Received', newState: 'Available in Patient 360' },
]

export const mergeHistory: MergeHistoryItem[] = []

export const notifications: NotificationItem[] = [
  { id: 'note-1', title: 'Identity reviews need attention', body: '2 patient identity matches are waiting for human review.', severity: 'Warning', createdAt: '2026-08-14T10:12:00Z', read: false, href: '/identity' },
  { id: 'note-2', title: 'Laboratory record unmatched', body: 'A new Metro Diagnostics result has no confident patient match.', severity: 'Warning', createdAt: '2026-08-14T10:05:00Z', read: false, href: '/data-quality' },
  { id: 'note-3', title: 'Insurance feed delayed', body: 'HealthSure has not delivered a current batch.', severity: 'Info', createdAt: '2026-08-14T07:00:00Z', read: false, href: '/interfaces' },
]
