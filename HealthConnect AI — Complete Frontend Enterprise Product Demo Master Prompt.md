# HealthConnect AI — Complete Frontend Enterprise Product Demo Master Prompt

You are a Senior Frontend Engineer, Healthcare Interoperability Architect, FHIR/HL7 Product Specialist, Enterprise Healthcare UX Designer, Master Patient Index Architect, Clinical Data Platform Designer, Data Provenance Specialist, and AI Product Engineer.

Your task is to build a polished enterprise portfolio product called:

# HealthConnect AI
## Healthcare Interoperability & Unified Patient 360 Platform

HealthConnect AI is a frontend-only interactive enterprise healthcare demo designed to show how fragmented patient information from multiple healthcare systems can be brought together into one unified longitudinal Patient 360 experience.

The product should demonstrate how a healthcare organization could connect information originating from:

- Epic
- Oracle Health
- Dedalus
- Laboratories
- PACS / Imaging
- Pharmacy systems
- Insurance systems
- Medical devices
- Other EHRs
- External clinics
- Diagnostic centres

through a simulated healthcare interoperability layer supporting concepts such as:

- FHIR
- HL7 v2
- DICOM
- REST APIs
- Events
- Patient identity matching
- Deduplication
- Provenance
- Record reconciliation
- Patient 360
- Longitudinal clinical timeline
- Source-aware AI Copilot

The strongest product story is:

A patient has received care across Hospital A, Clinic B and Diagnostic Centre C.

Instead of the clinician opening three separate systems, HealthConnect AI presents one unified patient record.

Every clinical event remains traceable to its original system.

Example:

12 Aug — Blood Test  
Source: Hospital A

09 Aug — CT Scan  
Source: Imaging Centre C

06 Aug — Medication Changed  
Source: Clinic B

Then an AI assistant can summarize the longitudinal record while showing the source behind every factual statement.

This application will be presented to prospective healthcare organizations and enterprise software clients.

It must therefore feel like a sophisticated interoperability product, not a generic patient dashboard.

---

# 1. READ EVERYTHING BEFORE CODING

Before modifying or creating code:

1. Read every provided reference file.
2. Inspect the entire existing repository.
3. Review:
   - package.json
   - application routes
   - TypeScript configuration
   - existing components
   - global CSS
   - design tokens
   - state management
   - tables
   - charts
   - drawers
   - modals
   - mock data
   - tests
   - utilities
4. Identify reusable components.
5. Identify functionality already implemented.
6. Reuse good existing architecture.
7. Do not install duplicate libraries unnecessarily.
8. Do not build isolated pages that cannot communicate with each other.
9. Understand the complete:
   source system → identity → unified record → AI → audit
   flow before implementation.

If this repository is empty, establish a clean scalable architecture first.

---

# 2. CRITICAL PROJECT CONSTRAINT

THIS PROJECT IS FRONTEND ONLY.

Do NOT create:

- Django backend
- Node backend
- database server
- real Epic connection
- real Oracle Health connection
- real Dedalus connection
- real FHIR server
- real HL7 interface
- real PACS
- real DICOM service
- real insurance API
- real patient data
- real AI API
- production Master Patient Index
- real identity-matching algorithm

Everything is a realistic simulation.

However:

THE PRODUCT MUST NOT FEEL STATIC OR FAKE.

The frontend must simulate realistic system behavior using interconnected state.

Example:

New external patient record arrives
→ identity engine detects possible match
→ user opens comparison
→ reviews demographic evidence
→ chooses Merge
→ unified patient record updates
→ external encounters appear on Patient 360
→ provenance remains attached
→ AI summary changes
→ audit history records merge.

Another:

Integration becomes delayed
→ interface status changes
→ data freshness warning appears
→ Patient 360 indicates stale laboratory feed
→ admin runs simulated reconnect
→ sync succeeds
→ latest results appear
→ warning disappears.

---

# 3. CORE PRODUCT PRINCIPLE

HealthConnect AI is primarily:

**Interoperability Infrastructure + Patient Identity + Unified Clinical Record + Provenance + AI-Assisted Navigation**

It is NOT primarily:

- patient monitoring,
- appointment scheduling,
- clinical diagnosis,
- population health,
- medication safety,
- cybersecurity.

Do not accidentally turn it into another CareOps or Clinician Copilot project.

Its central product promise is:

**One patient.  
Many systems.  
One longitudinal view.  
Every record traceable to its source.**

---

# 4. CORE PLATFORM FLOW

Represent the architecture visually and functionally:

Epic
Oracle Health
Dedalus
Laboratory
PACS / Imaging
Pharmacy
Insurance
Medical Devices

↓

INTEROPERABILITY GATEWAY

FHIR
HL7 v2
DICOM
REST
Events

↓

PATIENT IDENTITY LAYER

Matching
Deduplication
Merge Review
Identifier Linking
Provenance

↓

UNIFIED PATIENT RECORD

Encounters
Diagnoses
Medications
Allergies
Labs
Imaging
Documents
Appointments
Devices

↓

PATIENT 360

↓

SOURCE-GROUNDED AI COPILOT

---

# 5. PRIMARY DEMO WORKFLOW

This MUST function end-to-end:

Search patient
↓
Multiple records found
↓
Possible duplicate detected
↓
Identity comparison opened
↓
Demographic and identifier evidence shown
↓
Human reviews match
↓
Merge records
↓
Patient 360 updated
↓
Timeline now includes data from multiple facilities
↓
Source provenance visible for every event
↓
AI Copilot generates longitudinal summary
↓
Every factual statement links back to its source.

---

# 6. SECOND WORKFLOW — NEW EXTERNAL DATA

External laboratory feed
↓
New result arrives
↓
Integration activity updates
↓
Record mapped to existing patient
↓
Patient timeline updates
↓
Latest Labs section updates
↓
AI summary refreshes
↓
Provenance indicates source.

---

# 7. THIRD WORKFLOW — IDENTITY CONFLICT

External record arrives
↓
Patient identity is uncertain
↓
Possible matches shown
↓
Match confidence explained
↓
Human chooses:

Merge
Keep Separate
Link as Related Record
Request Review

↓
Decision stored
↓
Audit trail updated.

Never auto-merge uncertain identities.

---

# 8. FOURTH WORKFLOW — INTEGRATION FAILURE

Laboratory Interface
↓
Status = Delayed
↓
Last message timestamp becomes stale
↓
Data freshness alert generated
↓
Affected Patient 360 sections display stale-data warning
↓
Admin opens integration
↓
Runs simulated reconnect
↓
Interface status restored
↓
New message arrives.

---

# 9. FIFTH WORKFLOW — AI COPILOT

Clinician opens Patient 360
↓
asks:

"Summarize the last 30 days."

AI reads unified synthetic timeline
↓
returns:

- medication change,
- investigation,
- encounter,
- lab result,
- outstanding event

↓
each statement contains source citation
↓
clinician clicks citation
↓
original source record opens.

---

# 10. RECOMMENDED STACK

Use:

- React
- TypeScript
- Vite
- React Router
- Zustand
- localStorage or IndexedDB
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Radix UI
- TanStack Table
- Recharts
- Lucide React
- Sonner
- date-fns
- Framer Motion only for restrained transitions

Reuse equivalent existing libraries if appropriate.

---

# 11. COMPLETELY UNIQUE VISUAL IDENTITY

This project MUST NOT visually resemble:

- CareOps AI
- Clinician Copilot AI
- SmartReferral AI
- MedSafe AI
- VirtualWard AI
- HealthPopulation AI

HealthConnect should feel like:

**a premium healthcare data infrastructure and interoperability product.**

Visual concepts:

- Connected systems
- Structured information
- Data flow
- Identity resolution
- Provenance
- Enterprise architecture
- Clinical clarity

Avoid:

- generic SaaS gradient
- purple AI dashboard
- excessive healthcare blue
- cyberpunk
- glowing network lines
- dark security dashboard
- giant marketing tiles
- fake technical complexity

---

# 12. UNIQUE COLOR PALETTE

## Carbon Slate
#202A33

Use for:

- sidebar
- navigation
- strong structural headers
- enterprise framing

## Interoperability Aqua
#1C9A9A

Use for:

- connected systems
- integration health
- successful mapping
- active interfaces

## Data Cyan
#4E9BCB

Use for:

- FHIR
- data streams
- source records
- informational states

## Signal Lime
#7FAF67

Use sparingly for:

- successfully matched
- mapped
- synchronized
- verified data

## Identity Amber
#D29A43

Use for:

- possible identity match
- review required
- uncertain mapping

## Conflict Coral
#C76563

Use for:

- failed interfaces
- identity conflicts
- significant errors

## Background
#F4F7F8

## Surface
#FFFFFF

## Secondary Surface
#EDF2F4

## Border
#D7E0E4

## Main Text
#202B33

## Secondary Text
#687781

## AI Accent
#6269B8

## AI Background
#EFF0FA

## Provenance Background
#EDF7FA

---

# 13. COLOR DISTRIBUTION

Use roughly:

75% neutral / clean surface

15% Carbon Slate

10% interoperability / semantic accents

Do not make each source system a different bright color.

Use icons, badges and labels instead.

---

# 14. UI STYLE

The visual language should feel:

Precise
Structured
Modern
Enterprise
Healthcare-specific
Data-rich
Calm
Trustworthy

Use:

- thin borders
- restrained shadows
- organized hierarchy
- strong spacing
- information density without clutter
- clear metadata
- readable tables
- high-quality drawers
- compact tags

Avoid excessive card nesting.

---

# 15. APPLICATION SHELL

Recommended sidebar:

HEALTHCONNECT AI

OVERVIEW
- Interoperability Overview

PATIENT IDENTITY
- Identity Queue
- Duplicate Records
- Merge History

PATIENT 360
- Patient Search
- Unified Records
- Longitudinal Timeline

DATA EXCHANGE
- Interfaces
- Message Activity
- Data Mapping

CLINICAL DATA
- Medications
- Labs
- Imaging
- Documents

INTELLIGENCE
- AI Copilot
- Data Quality
- Provenance Explorer

SYSTEM
- Integration Catalog
- Audit Trail
- Settings

---

# 16. TOP BAR

Show:

Health network selector

Global patient search

Interface status

Notifications

Current user

Demo Environment

Example:

Northbridge Health Network

7 Systems Connected

User:

Daniel Foster
Interoperability Manager

---

# 17. ROLES

Simulate:

Clinician

Health Information Manager

Interoperability Analyst

Integration Engineer

Data Steward

Clinical Informaticist

Administrator

Permissions should affect actions.

Example:

Clinician:
view Patient 360
use AI Copilot

Data Steward:
review identity matches
perform merge

Integration Engineer:
manage simulated interfaces

Administrator:
demo settings

---

# 18. SYNTHETIC SOURCE SYSTEMS

Seed:

Northbridge Epic

CityCare Oracle Health

Regional Dedalus

Metro Diagnostics LIS

Prime Imaging PACS

Northbridge Pharmacy

HealthSure Insurance

Connected Device Gateway

All fictional/demo-labelled.

---

# 19. SYSTEM CONNECTION TYPES

Simulate:

FHIR R4

HL7 v2

DICOM

REST API

Event Stream

Batch Import

---

# 20. INTEROPERABILITY OVERVIEW

This should be an impressive enterprise home screen.

Title:

Interoperability Overview

Subtitle:

Unified visibility across healthcare systems, patient identity, message exchange, data quality and longitudinal patient records.

---

# 21. TOP METRICS

Examples:

Connected Systems
8

Active Interfaces
14

Messages Today
128,441

Patient Records
486,220

Identity Reviews
23

Potential Duplicates
17

Data Mapping Issues
11

Interface Alerts
2

Use demo state where practical.

---

# 22. SYSTEM LANDSCAPE

Create visual integration topology.

Source Systems

↓

HealthConnect Gateway

↓

Identity Layer

↓

Unified Patient Record

Do not create flashy networking animation.

Make it enterprise architecture UI.

---

# 23. SYSTEM CONNECTION CARDS

Each source system card:

Name

Type

Protocol

Status

Last Sync

Messages Today

Data Domains

Example:

Metro Diagnostics

Laboratory

HL7 v2

Connected

Last message:
2 min ago

Domains:
Lab Results
Orders

---

# 24. CONNECTION STATES

Connected

Syncing

Delayed

Degraded

Offline

Maintenance

---

# 25. INTERFACE HEALTH

Create table:

Interface

Source

Protocol

Direction

Last Message

Messages/hr

Errors

Status

---

# 26. MESSAGE ACTIVITY

Create:

Message Activity

Support simulated messages:

ADT

ORU

ORM

FHIR Patient

FHIR Observation

FHIR MedicationRequest

DICOM Study

REST event

---

# 27. MESSAGE DETAIL

Click message.

Open drawer:

Message ID

Source

Destination

Protocol

Timestamp

Patient Mapping

Status

Processing Steps

---

# 28. HL7 VIEWER

Optional but impressive.

Show sanitized fictional:

MSH
PID
OBR
OBX

Do not overdo technical detail.

Provide:

Raw

Parsed

Mapped

tabs.

---

# 29. FHIR RESOURCE VIEWER

Show fictional resources:

Patient

Encounter

Observation

Condition

MedicationStatement

AllergyIntolerance

DiagnosticReport

DocumentReference

Appointment

Provenance

Provide:

Summary

FHIR JSON Demo

Source Mapping

---

# 30. DICOM / IMAGING

Show:

Study

Modality

Body Region

Date

Imaging Centre

Report

Source

Do not attempt actual diagnostic image interpretation.

---

# 31. DATA MAPPING

Create:

Mapping Workspace

Example:

Source:

local_patient_id

Target:

Patient.identifier

Source:

lab_result_value

Target:

Observation.valueQuantity

Show:

Mapped
Unmapped
Needs Review

---

# 32. PATIENT IDENTITY ENGINE

This is a central module.

Build:

Patient Identity Queue

Columns:

Incoming Record

Potential Match

Source System

Match Strength

Conflicts

Status

Received

Action

---

# 33. IDENTITY MATCH FACTORS

Possible comparison fields:

Name

DOB

Sex

Address

Phone

National/health identifier

MRN

Email

Facility identifier

Do not imply exact validated matching logic.

---

# 34. IDENTITY SCORE

Use descriptive confidence:

Strong Match

Possible Match

Weak Match

Conflict

Avoid fake precise scores unless helpful.

If score shown:

label it as:

Demo Identity Match Score.

---

# 35. MATCH EXPLANATION

Example:

Possible Match

Incoming:

Emily Robertson
DOB 21 Apr 1962
MRN C-49022

Existing:

Emily Robinson
DOB 21 Apr 1962
MRN H-10498

Supporting:

Same DOB

Matching phone

Similar name

Different local identifiers expected across facilities

Conflict:

Address differs.

---

# 36. HUMAN IDENTITY DECISION

Actions:

Merge

Keep Separate

Link Records

Request Review

Do not automatically merge.

---

# 37. IDENTITY COMPARISON WORKSPACE

Use three-column layout:

LEFT:
Incoming record

CENTER:
Match evidence

RIGHT:
Existing unified identity

Highlight:

Exact match

Near match

Conflict

Missing

---

# 38. MERGE CONFIRMATION

Before merge:

Show:

Records to merge

Identifiers preserved

Source systems preserved

Timeline impact

Confirmation field.

Button:

Confirm Merge

---

# 39. NEVER DESTROY SOURCE IDENTIFIERS

After merge retain:

Epic MRN

Clinic MRN

Lab ID

Imaging ID

Insurance member ID

Unified HealthConnect ID

---

# 40. UNIFIED PATIENT ID

Example:

HC-2026-102842

Source Identifiers:

EPIC-MRN-44291

ORACLE-10931

LIS-77382

PACS-39011

---

# 41. MERGE HISTORY

Show:

Unified Patient

Merged Records

Performed By

Date

Reason

Sources

Allow:

View Merge

Do not implement real irreversible undo complexity unless simulated.

---

# 42. PATIENT SEARCH

Search:

Name

DOB

Unified ID

MRN

External identifier

Phone

---

# 43. SEARCH RESULTS

Show:

Unified Records

Source-only Records

Identity Review Required

Possible Duplicates

---

# 44. PATIENT 360

This should be the product's strongest screen.

Header:

Patient

Unified HealthConnect ID

DOB

Age

Primary Care Provider

Known Source Systems

Last Unified Update

---

# 45. SOURCE SYSTEM BADGES

Example:

Epic

Oracle Health

Metro Labs

Prime Imaging

Pharmacy

Display subtle badges.

---

# 46. PATIENT 360 TABS

Overview

Timeline

Encounters

Conditions

Medications

Allergies

Laboratory

Imaging

Documents

Appointments

Sources

Audit

---

# 47. PATIENT OVERVIEW

Show:

Unified clinical summary

Active conditions

Current medications

Allergies

Recent labs

Recent imaging

Recent encounters

Upcoming appointments

Source coverage

---

# 48. LONGITUDINAL TIMELINE

This is a signature feature.

Timeline example:

12 Aug 2026

Blood Test

Source:
Hospital A

System:
Metro Diagnostics LIS

09 Aug 2026

CT Chest

Source:
Diagnostic Centre C

System:
Prime Imaging PACS

06 Aug 2026

Medication Changed

Source:
Clinic B

System:
CityCare Oracle Health

03 Aug 2026

Outpatient Encounter

Source:
Hospital A

---

# 49. TIMELINE FILTERS

Filter:

All

Encounter

Medication

Lab

Imaging

Document

Appointment

Admission

Source System

Date range

---

# 50. PROVENANCE — CRITICAL

Every unified clinical item must preserve provenance.

Each record should show:

Source organization

Source system

Original record ID

Received timestamp

Clinical timestamp

Mapped type

Data freshness

---

# 51. PROVENANCE DRAWER

Click:

View Source

Show:

Original Source

Source System

Protocol

Message/Resource ID

Clinical Timestamp

Received Timestamp

Original Data

Mapped Data

---

# 52. PROVENANCE CHAIN

Example:

Metro Diagnostics LIS

↓

HL7 ORU Message

↓

HealthConnect Gateway

↓

Observation Mapping

↓

Patient HC-2026-102842

↓

Patient 360

This should be visually clear.

---

# 53. MEDICATION RECONCILIATION VIEW

Do not duplicate Clinician Copilot functionality.

Here focus on:

**multiple source records.**

Example:

Metformin

Epic:
500mg twice daily

Clinic B:
500mg once daily

Pharmacy:
500mg twice daily

Status:

Cross-source conflict.

Show:

Sources

Dates

Do not auto-resolve clinically.

---

# 54. CROSS-SOURCE CONFLICT

Create:

Data Conflict

Examples:

Medication dose conflict

Different allergy status

Different demographic address

Duplicate diagnosis entry

Actions:

Mark Reviewed

Prefer Latest Source

Send for Clinical Review

Keep All Sources

Avoid autonomous clinical correction.

---

# 55. ALLERGIES

Unified list showing:

Allergen

Reaction

Recorded By

Source

Last Updated

Conflict flag

---

# 56. LABORATORY

Show:

Test

Result

Unit

Date

Reference Information

Facility

Source System

Provenance

Do not diagnose abnormal values.

---

# 57. IMAGING

Show:

Study Type

Date

Facility

Report Status

Report Summary

Source

No AI diagnosis.

---

# 58. DOCUMENTS

Unified documents:

Discharge summary

Referral

Clinic note

Imaging report

Lab report

Procedure note

---

# 59. DOCUMENT VIEW

Show:

Document

Facility

Author

Date

Source system

Original ID

Text/preview

---

# 60. AI COPILOT

Create a source-grounded AI Copilot.

Context:

Current Patient

Longitudinal Record

Last 30 Days

Medication History

Encounters

Documents

---

# 61. COPILOT QUESTIONS

Suggested:

Summarize the last 30 days.

What changed recently?

Show recent investigations.

Summarize current medications.

What records came from external organizations?

Show conflicting medication records.

What is the most recent imaging report?

---

# 62. CONTEXT-AWARE RESPONSES

Do NOT use generic answers.

AI must derive its answer from current synthetic patient state.

---

# 63. SOURCE-GROUNDED AI ANSWERS

Example:

The patient's Metformin dose was recorded as 500mg twice daily on 6 Aug 2026.

Source:
Clinic B Medication Record

A CT chest was recorded on 9 Aug 2026.

Source:
Diagnostic Centre C Imaging Report

---

# 64. CLICKABLE AI CITATIONS

Each factual statement should link to:

the exact source record.

Click citation:

open Source Drawer.

---

# 65. NO UNSOURCED FACTS

If data isn't present:

AI should say:

No supporting record was found in the currently connected demo sources.

Do not invent.

---

# 66. AI SUMMARY

Generate:

Unified Patient Summary

Sections:

Recent Care

Conditions

Medication Changes

Investigations

Outstanding Records

Data Conflicts

Source Coverage

---

# 67. AI DATA-CONFLICT SUMMARY

Example:

Two medication records disagree on Metformin frequency.

Latest Pharmacy source:
twice daily

Clinic B:
once daily

Requires clinical reconciliation.

---

# 68. AI DATA-QUALITY INSIGHT

Example:

Patient record currently contains recent encounter and medication information from three organizations, but no laboratory updates have been received from Hospital A within the configured freshness period.

---

# 69. DATA QUALITY PAGE

Create:

Data Quality

Metrics:

Complete Patient Identities

Possible Duplicates

Unmatched Records

Missing Required Mappings

Data Conflicts

Stale Feeds

Unmapped Messages

---

# 70. DATA QUALITY WORK QUEUE

Columns:

Issue

Patient

Source

Type

Detected

Priority

Owner

Status

---

# 71. DATA-QUALITY TYPES

Duplicate identity

Missing identifier

Mapping failure

Stale data

Conflicting demographic

Medication conflict

Orphan record

Missing source

---

# 72. UNMATCHED RECORDS

Create:

Unmatched Records

Example:

Laboratory result received

No confident patient match found.

Actions:

Review Matches

Create New Patient

Hold Record

---

# 73. ORPHAN RECORD WORKFLOW

Incoming lab
↓
identity unresolved
↓
held in queue
↓
human reviews
↓
links to patient
↓
Patient 360 updates
↓
audit event.

---

# 74. SOURCE COVERAGE

Patient detail should show:

Epic
✓ Encounters

Oracle
✓ Medications

Lab
✓ Results

PACS
✓ Imaging

Insurance
No recent data

---

# 75. DATA FRESHNESS

Every domain can show:

Current

Stale

Unknown

Delayed

Example:

Laboratory

Last update:
2 hours ago

Current.

Pharmacy

Last update:
18 days ago

Stale.

---

# 76. DATA FRESHNESS WARNING

AI should not treat stale information as current without warning.

Example:

Medication records from Clinic B were last refreshed 18 days ago.

---

# 77. INTEGRATION CATALOG

Create:

Integration Catalog

Cards:

Epic

Oracle Health

Dedalus

Laboratory

PACS

Pharmacy

Insurance

Devices

---

# 78. INTEGRATION DETAIL

Show:

Name

Type

Protocol

Endpoint Demo Label

Direction

Data Domains

Status

Last Message

Error Rate

Mappings

Recent Activity

---

# 79. SIMULATE CONNECTION

Buttons:

Simulate Sync

Pause Feed

Create Demo Error

Restore Connection

These must affect frontend state.

---

# 80. INTERFACE FAILURE SCENARIO

User:

Create Demo Error

Interface:

Metro Diagnostics

Status:
Degraded

Errors:
12

Patient lab freshness warnings appear.

Restore.

State returns Connected.

---

# 81. MESSAGE PROCESSING PIPELINE

Visual:

Received

Validated

Patient Matched

Mapped

Stored

Available in Patient 360

For failed:

Received

Validation Failed

Show reason.

---

# 82. MESSAGE ERROR QUEUE

Examples:

Patient identifier missing

Unsupported code

Mapping unavailable

Duplicate message

Invalid timestamp

---

# 83. RETRY SIMULATION

Click:

Retry Processing

If demo issue resolved:

message becomes Processed.

---

# 84. DATA MAPPING PAGE

Mappings:

Source Field

Source Code

Target Resource

Target Field

Transformation

Status

---

# 85. MAPPING DETAILS

Example:

Source:

OBX-5

Target:

Observation.valueQuantity

Transformation:

Numeric Result

Status:

Active

---

# 86. TERMINOLOGY MAPPING

Optional simulated mappings:

Local lab code

→ standardized demo code

Local medication name

→ normalized concept

Do not claim production terminology validation.

---

# 87. CODE SYSTEM LABELS

Can reference healthcare concepts such as:

ICD

SNOMED

LOINC

RxNorm

but clearly treat them as demo mapping concepts.

---

# 88. PATIENT SOURCE RECORDS

Sources tab:

System

Local ID

First Seen

Last Seen

Record Types

Status

---

# 89. DATA LINEAGE

Create a Provenance Explorer.

Search record.

Show lineage:

Source record

→ integration message

→ mapping

→ unified resource

→ Patient 360 display.

---

# 90. PROVENANCE EXPLORER

Search by:

Record ID

Patient

Source

Resource type

---

# 91. AI EXPLAINABILITY

For AI answer:

show:

Sources Used:
4

Data Freshness:
Current

Conflicts:
1

Human Review:
Recommended

---

# 92. AI SOURCE PANEL

Example:

Response based on:

Clinic B Medication Record

Hospital A Encounter

Metro Laboratory Result

Prime Imaging Report

---

# 93. AUDIT TRAIL

Create enterprise audit screen.

Columns:

Time

User

Role

Patient/System

Action

Object

Previous State

New State

---

# 94. AUDIT EVENTS

Examples:

Possible patient match identified

Patient records merged

Merge rejected

Unmatched record linked

Interface paused

Interface restored

Data mapping updated

AI summary generated

Source record viewed

---

# 95. NEVER REMOVE AUDIT HISTORY

Even when demo record changes:

historical events remain.

---

# 96. NOTIFICATIONS

Examples:

23 identity matches need review

Laboratory interface degraded

New unmatched records

Data mapping errors increased

Patient record conflict detected

Interface restored

---

# 97. GLOBAL SEARCH

Search across:

Patients

External IDs

Systems

Messages

Interfaces

Documents

Records

---

# 98. SEARCH RESULT GROUPS

Patients

Source Records

Messages

Interfaces

Documents

---

# 99. SYSTEM ACTIVITY

Optional panel:

Last 10 Minutes

3,241 messages processed

6 patient identities matched

2 messages failed

1 interface recovered

---

# 100. DEMO DATA ARCHITECTURE

Create synthetic data for:

Patients

External patient records

Source identifiers

Systems

Interfaces

Messages

FHIR resources

HL7 messages

Imaging metadata

Medications

Labs

Encounters

Documents

Appointments

Identity matches

Mappings

Conflicts

Audit events

---

# 101. STATE ARCHITECTURE

Suggested stores:

integrationStore

interfaceStore

messageStore

identityStore

patientStore

clinicalDataStore

mappingStore

provenanceStore

copilotStore

dataQualityStore

auditStore

notificationStore

---

# 102. CRITICAL STATE CONTINUITY

Merge identity:

must affect:

Patient Search

Patient 360

Identity Queue

Duplicate Count

Audit Trail

AI Copilot

Source Coverage

---

# 103. DELETE / MERGE SAFETY

Do not implement destructive deletion casually.

Identity operations should include confirmation.

Merge should preserve original external records.

---

# 104. SIMULATED AI SERVICES

Create:

src/services/ai/

identityMatchAI.ts

patientSummaryAI.ts

recordConflictAI.ts

copilotAI.ts

dataQualityAI.ts

sourceGroundingAI.ts

---

# 105. FUNCTIONS

suggestIdentityMatches()

explainIdentityMatch()

generateUnifiedPatientSummary()

detectCrossSourceConflicts()

answerPatientQuestion()

generateDataQualityInsights()

resolveSourceCitations()

---

# 106. DETERMINISTIC AI

Use predictable synthetic logic.

Example:

Same DOB

Same phone

Similar name

Different local IDs

→ Strong Possible Match.

Do not randomly change matches during demo.

---

# 107. IDENTITY MATCH RULES

For demo only:

Exact health identifier:
strong evidence

Exact DOB + phone + close name:
strong match

DOB + similar name:
possible match

Conflicting DOB:
conflict

Clearly label:

Demo identity matching logic.

---

# 108. SOURCE PRIORITY

Do NOT silently assign one source as universally authoritative.

Preserve all sources.

Where conflict exists:

show conflict.

Human reviews.

---

# 109. PATIENT TIMELINE RULE

Sort by clinical event date.

Also preserve:

received date

and:

source date.

---

# 110. LATE-ARRIVING DATA

Support scenario:

Clinical event occurred 5 Aug.

Message arrives 13 Aug.

Timeline should display event at:

5 Aug

with metadata:

Received 13 Aug.

---

# 111. DUPLICATE CLINICAL EVENT

Detect same event from multiple systems.

Example:

same lab result forwarded by EHR and LIS.

Show:

Potential duplicate clinical event.

Allow:

Group

Keep Separate

---

# 112. DATA CONFLICT PANEL

Patient-level panel:

3 cross-source conflicts.

Examples:

Medication frequency

Address

Allergy status

---

# 113. CONFLICT REVIEW

Show both source records.

User:

Mark Reviewed

Escalate

Choose Display Preference

Never destroy original evidence.

---

# 114. PATIENT 360 DESIGN

Do not make Patient 360 visually overwhelming.

Recommended layout:

LEFT:

Patient demographics / source coverage

CENTER:

Unified timeline / clinical data

RIGHT:

AI Copilot / Data quality / Conflicts

Allow panels to collapse.

---

# 115. PATIENT HEADER

Show:

Emily Robinson

Unified ID:
HC-102842

DOB:
21 Apr 1962

Sources:
5

Last update:
4 min ago

Conflicts:
1

---

# 116. SOURCE BADGES

Source names should be concise.

Tooltip reveals:

Organization

System

Protocol

Last sync.

---

# 117. CLINICAL DATA CARDS

Medication, lab and imaging cards should each expose:

Source

Timestamp

Facility

Status

View Original.

---

# 118. DATA VISUALIZATION

Use restrained charts for:

Messages over time

Interface error rates

Identity review trends

Mapping errors

Data freshness

Do not add charts merely to fill space.

---

# 119. INTEROPERABILITY ANALYTICS

Show:

Messages processed

Processing success

Identity match rate

Unmatched records

Duplicate candidates

Mapping errors

Average processing latency

Keep clearly demo-labelled.

---

# 120. ROLE PERMISSIONS

Clinician:

Patient 360
AI Copilot
Source records

Data Steward:

Identity Queue
Merge
Data quality

Integration Engineer:

Interfaces
Messages
Mappings

Informaticist:

Mappings
Provenance
Data quality

Administrator:

Settings

---

# 121. PREVENT INVALID STATE

Examples:

Cannot merge patient with itself.

Cannot merge already merged record.

Cannot process unresolved identity record into Patient 360 incorrectly.

Cannot mark offline interface healthy without restore action.

Cannot retry successful message unnecessarily.

Cannot delete provenance.

Cannot silently overwrite source information.

---

# 122. EMPTY STATES

Examples:

No identity reviews pending.

No unmatched records.

No data conflicts.

All interfaces operational.

No messages match current filter.

No imaging available for this patient.

---

# 123. ERROR STATES

Implement:

Integration unavailable

Patient not found

FHIR mapping unavailable

Identity conflict

Message validation failed

Record source missing

Copilot source unavailable

Data stale

---

# 124. LOADING STATES

Use:

Loading unified record...

Resolving patient identity...

Mapping incoming message...

Retrieving source provenance...

Generating source-grounded summary...

Short and professional.

---

# 125. ACCESSIBILITY

Implement:

keyboard navigation

visible focus states

focus traps

ARIA labels

semantic tables

accessible tabs

status text in addition to color

good contrast

Escape behavior

focus return

---

# 126. RESPONSIVENESS

Primary:

1440px

1280px

Tablet support.

Patient 360 may collapse secondary sidebars into drawers.

Do not optimize away useful desktop information.

---

# 127. ANIMATION

Use subtle transitions:

incoming message

identity review

merge completion

source highlight

copilot response

interface state change

Avoid:

network particle animations

glowing data streams

cyberpunk visuals

---

# 128. REUSABLE COMPONENTS

Create components such as:

SystemStatusCard

InterfaceHealthBadge

ProtocolBadge

PatientIdentityCard

IdentityComparison

MatchEvidencePanel

SourceBadge

ProvenanceLink

ProvenanceDrawer

ClinicalRecordCard

UnifiedTimeline

DataConflictCard

MessagePipeline

FHIRResourceViewer

HL7MessageViewer

AIAnswerWithSources

DataFreshnessBadge

SourceCoveragePanel

---

# 129. PROFESSIONAL IDS

Use realistic fictional identifiers.

Unified Patient:

HC-2026-102842

External:

EPI-904122

ORC-201839

LIS-778201

PACS-491204

Message:

MSG-20260813-10249

Interface:

INT-LAB-ORU-01

---

# 130. PRIMARY DEMO DATA

Patient:

Emily Robinson

Unified ID:

HC-2026-102842

Hospital A:

Northbridge Hospital

Clinic B:

CityCare Clinic

Diagnostic Centre C:

Prime Imaging

---

# 131. DEMO TIMELINE

Seed:

12 Aug

Blood Test

Source:
Northbridge Hospital / Metro Labs

09 Aug

CT Scan

Source:
Prime Imaging

06 Aug

Medication Changed

Source:
CityCare Clinic

03 Aug

Outpatient Encounter

Source:
Northbridge Hospital

---

# 132. PRIMARY DEMO SCENARIO — PATIENT 360

Search:

Emily Robinson

Show:

2 possible linked source records.

Open identity review.

Compare.

Merge.

Patient now has:

5 source systems.

Open Patient 360.

Show timeline.

Click:

CT Scan

Open source.

Show Prime Imaging.

Return.

Ask AI:

Summarize the last 30 days.

AI responds using exact source citations.

---

# 133. SECOND DEMO — IDENTITY MATCH

New patient arrives:

Emily Robertson

DOB:
21 Apr 1962

Same phone as Emily Robinson.

New Clinic ID.

Identity engine:

Strong Possible Match.

Data Steward reviews.

Merge.

New clinic encounter appears in timeline.

---

# 134. THIRD DEMO — UNMATCHED LAB

New lab result arrives.

No patient identifier.

Status:

Unmatched.

Data Steward searches patient.

Links result.

Patient lab list updates.

Audit records action.

---

# 135. FOURTH DEMO — INTEGRATION FAILURE

Metro Diagnostics interface:

Connected.

Click:

Create Demo Error.

Status:

Degraded.

Recent lab freshness becomes:

Delayed.

Open Patient 360.

Lab section warning appears.

Restore connection.

Simulate new lab message.

Warning clears.

---

# 136. FIFTH DEMO — CROSS-SOURCE MEDICATION CONFLICT

Patient has:

Epic:

Metformin 500mg twice daily.

Clinic:

Metformin 500mg once daily.

Pharmacy:

Metformin 500mg twice daily.

HealthConnect:

Cross-source conflict.

AI:

Medication records differ between source systems.

Requires clinician reconciliation.

---

# 137. SIXTH DEMO — PROVENANCE

Open lab result.

Click:

View Provenance.

Show:

Metro Diagnostics

→ HL7 ORU

→ Interface INT-LAB-ORU-01

→ Observation Mapping

→ Emily Robinson

→ Patient 360.

---

# 138. SEVENTH DEMO — SOURCE-GROUNDED AI

Ask:

What changed recently?

AI:

Medication was updated on 6 Aug.

Source:
CityCare Clinic.

CT imaging was recorded on 9 Aug.

Source:
Prime Imaging.

Blood testing was recorded on 12 Aug.

Source:
Metro Diagnostics.

Click each source.

---

# 139. EIGHTH DEMO — DATA QUALITY

Data Quality:

17 possible duplicate patients.

11 mapping issues.

Open duplicate.

Resolve.

Counts update.

Open mapping issue.

Review mapping.

Simulate correction.

Counts update.

---

# 140. AUTOMATED TESTING

Add tests for:

Patient search

Identity matching

Identity review

Merge

Keep separate

Merge preservation of source IDs

Patient 360 timeline

Source provenance

Cross-source conflict

FHIR viewer

Message status

Interface degradation

Interface recovery

Unmatched record linking

Copilot source citation

Data freshness

Audit event

Reset demo

Role permission.

---

# 141. CRITICAL REGRESSION TESTS

Verify:

Human merge preserves all source identifiers.

Merged source records appear on correct patient.

Keep Separate prevents accidental unification.

AI answers only use current patient data.

Citation opens correct record.

Clinical date differs correctly from received date.

Stale feed warning appears when source is stale.

Restored interface clears appropriate warning.

---

# 142. E2E — PATIENT 360

Search Emily

→ Identity Review

→ Merge

→ Patient 360

→ Timeline

→ Open Source

→ AI Summary

→ Click Citation

Verify source.

---

# 143. E2E — INTERFACE FAILURE

Open Interfaces

→ Create Lab Error

→ Verify degraded status

→ Open Patient 360

→ Verify freshness warning

→ Restore Interface

→ Sync

→ Verify warning clears.

---

# 144. E2E — UNMATCHED RECORD

Create demo incoming lab

→ unmatched queue

→ review

→ link patient

→ verify Patient 360

→ verify audit.

---

# 145. FINAL MANUAL QA

Before completion verify:

INTEROPERABILITY

System cards accurate.

Interfaces work.

Demo sync works.

Failure simulation works.

MESSAGES

Filters work.

Details work.

Pipeline works.

FHIR/HL7 viewers work.

IDENTITY

Queue works.

Comparison works.

Merge works.

Keep Separate works.

No accidental auto-merge.

PATIENT 360

Patient search works.

Timeline correct.

Sources correct.

All tabs load.

Conflicts visible.

PROVENANCE

Every meaningful record has source.

Source drawer works.

Lineage correct.

AI COPILOT

Context-aware.

No invented records.

Sources clickable.

DATA QUALITY

Issues work.

Counts update.

Unmatched workflow works.

AUDIT

Actions recorded.

SYSTEM

Simulated integrations clearly labelled.

RESET

Demo data restores.

GENERAL

No dead buttons.

No broken links.

No console errors.

No contradictory patient state.

No accidental real integration claim.

No real patient data.

No fake autonomous clinical decisions.

No encoding issues.

---

# 146. IMPLEMENTATION ORDER

Build in this order:

1. Design system
2. Application shell
3. Synthetic source systems
4. Shared types
5. Shared Zustand state
6. Interoperability overview
7. Interfaces
8. Message activity
9. Data mapping
10. Identity queue
11. Identity comparison
12. Merge workflow
13. Patient search
14. Patient 360
15. Longitudinal timeline
16. Provenance
17. Unified clinical domains
18. Cross-source conflicts
19. AI Copilot
20. Data quality
21. Unmatched records
22. Integration simulation
23. Audit
24. Role permissions
25. Settings/reset
26. Edge cases
27. Accessibility
28. Responsive polish
29. Testing
30. Final QA

---

# 147. FINAL IMPLEMENTATION RESPONSE

When implementation is complete provide:

1. Summary of product built.
2. Files created.
3. Files modified.
4. Routes.
5. Design system.
6. State architecture.
7. Synthetic integration architecture.
8. Patient identity architecture.
9. Unified Patient 360 architecture.
10. Provenance architecture.
11. Cross-source conflict architecture.
12. AI simulation architecture.
13. Interface simulation architecture.
14. Role permissions.
15. Demo workflow instructions.
16. Automated tests completed.
17. Known limitations.
18. Remaining TODOs.

Do not just describe what should be built.

Actually implement it.

---

# 148. FINAL CLIENT DEMO STORY

The completed product must support this presentation:

"Healthcare information is usually fragmented across multiple systems."

Open Interoperability Overview.

"Here we have Epic, Oracle Health, laboratory, imaging, pharmacy and external systems feeding one interoperability gateway."

Show connections.

"Now let's look at a patient who has received care across multiple organizations."

Search Emily Robinson.

"The identity engine has found another external record that may belong to Emily."

Open Identity Review.

"Instead of automatically merging it, HealthConnect shows the evidence."

Show:

DOB

phone

name similarity

local identifiers.

"The data steward remains in control."

Merge.

"Now Emily has one unified Patient 360."

Open record.

"The timeline includes information from the hospital, external clinic and imaging centre."

Show:

6 Aug medication change.

9 Aug imaging.

12 Aug lab result.

"And none of that source information disappears."

Click lab.

Open provenance.

"This result came from Metro Diagnostics, entered through an HL7 interface and was mapped into the unified record."

Return.

"Now the clinician can ask the AI assistant to summarize the patient's recent history."

Ask:

Summarize the last 30 days.

AI answers.

"The key difference is that every factual statement is traceable."

Click citation.

Show original source.

Then:

"Here's a medication conflict between three connected systems."

Open medication conflict.

"HealthConnect doesn't pretend to know which one is clinically correct. It preserves the sources and asks the clinical team to reconcile them."

Then:

"Let's simulate an integration issue."

Open Lab Interface.

Create Demo Error.

"Laboratory data is now delayed."

Open Patient 360.

Show freshness warning.

Restore interface.

Sync.

"This gives both technical teams and clinical teams visibility into whether the data they're looking at is current."

Finally:

"Everything—from patient merges to interface activity and data access—is traceable through the audit trail."

Open audit.

That story must work without needing to explain away broken interactions.

---

# 149. FINAL PRODUCT STANDARD

HealthConnect AI should demonstrate that a modern healthcare interoperability platform can provide:

One unified patient identity

Cross-system record access

Longitudinal patient history

FHIR / HL7 / DICOM interoperability concepts

Record-level provenance

Source-system visibility

Data freshness

Identity resolution

Deduplication

Cross-source conflict detection

Clinical data lineage

Integration observability

Data quality management

Source-grounded AI assistance

Human-controlled identity decisions

Enterprise auditability

The final product should be polished enough for demonstrations to:

Hospitals

Health Systems

Integrated Care Networks

EHR Vendors

Healthcare Software Vendors

Interoperability Companies

Digital Health Platforms

Clinical Informatics Teams

Health Information Management Teams

Government Health Organizations

Diagnostic Networks

Enterprise Healthcare Buyers

Most importantly, the application must clearly communicate:

**Healthcare data can come from many systems without losing its origin.**

**One patient can be presented as one longitudinal record while every original source remains visible.**

**AI can make that record easier to understand, but every clinical fact remains grounded in traceable source data.**

The final experience must feel:

Enterprise-grade

Healthcare-specific

Technically credible

Visually premium

Interactive

Interconnected

Traceable

Human-controlled

And clearly different from every other project in the healthcare AI portfolio.