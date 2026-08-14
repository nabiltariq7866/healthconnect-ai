# HealthConnect AI — Master Prompt Compliance

This document maps the final frontend release to the supplied HealthConnect AI master prompt. The product is a **synthetic frontend demonstration**, not a live clinical/integration system.

## 1. Product architecture — Implemented

- Interoperability Gateway concept across Epic, Oracle Health, Dedalus, LIS, PACS, Pharmacy, Insurance and Connected Devices.
- Protocol concepts: FHIR R4, HL7 v2, DICOM, REST API, Event Stream and Batch Import.
- Human-controlled Patient Identity layer.
- Unified Patient 360 with longitudinal records.
- Record-level provenance and lineage.
- Source-grounded deterministic AI Copilot.
- Cross-module state continuity using Zustand + localStorage persistence.

## 2. Primary identity → Patient 360 workflow — Implemented

- Search Emily Robinson.
- Review Emily Robertson possible match.
- Three-column identity comparison and evidence states.
- Human actions: Merge, Keep Separate, Link Records, Request Review.
- Typed merge confirmation.
- No automatic uncertain merge.
- Original source identifiers preserved.
- Merge adds external source/clinical data to the unified record.
- Duplicate/data-quality counts update.
- Merge history and audit update.
- Patient 360, source coverage, conflicts and AI context update from the same state.

## 3. External data / unmatched-record workflow — Implemented

- Deterministic incoming synthetic laboratory record.
- Unmatched queue / orphan quality issue.
- Human Link / Hold / Create New Patient actions.
- Linked result enters the selected Patient 360.
- Source/provenance remains attached.
- Audit and data-quality states update.

## 4. Interface failure / recovery workflow — Implemented

- Interface status management with Connected, Syncing, Delayed, Degraded, Offline and Maintenance concepts.
- Pause Feed, Create Demo Error, Restore Connection and Simulate Sync actions.
- Metro Diagnostics degradation marks laboratory records delayed.
- Patient 360 surfaces stale/delayed freshness warning.
- Restore alone does not falsely mark clinical data current.
- Simulated sync receives a new deterministic lab record/message and restores appropriate freshness.
- Audit/notifications update.

## 5. Patient 360 — Implemented

Tabs:

- Overview
- Timeline
- Encounters
- Conditions
- Medications
- Allergies
- Laboratory
- Imaging
- Documents
- Appointments
- Sources
- Audit

Features include source badges/tooltips, clinical-vs-received timestamps, timeline filters, source coverage, freshness, cross-source conflicts, inline source-grounded AI, exact provenance drawers and human conflict review.

## 6. Provenance / lineage — Implemented

Meaningful clinical records retain:

- source organization
- source system
- original record ID
- clinical timestamp
- received timestamp
- protocol
- message/resource ID where applicable
- mapped type
- freshness
- original/raw demo data
- mapped demo data

The Provenance Explorer provides source → transport → mapping → unified record → Patient 360 lineage.

## 7. AI Copilot — Implemented

- Deterministic, current-patient/current-state answers.
- Last-30-days / recent-change / investigations / medication / external-source / conflict questions.
- Exact record citations.
- Clicking citation opens the cited source record.
- Explicit no-support response when current synthetic records do not support a claim.
- Freshness and conflict metadata.
- Human-review flag.
- Unified Patient Summary sections: Recent Care, Conditions, Medication Changes, Investigations, Outstanding Records, Data Conflicts and Source Coverage.
- No diagnosis/prescribing/clinical auto-resolution.

## 8. Cross-source conflicts — Implemented

- Medication conflict.
- Demographic conflict after identity unification.
- Potential duplicate clinical event across source systems.
- Human actions including review, clinical escalation, display preference, keep sources and duplicate grouping.
- Original evidence is not deleted.

## 9. Interfaces / messages / mappings — Implemented

- 8 source-system cards.
- 14 interface records.
- Interface health/detail/activity.
- ADT, ORU, ORM, FHIR Patient, FHIR Observation, FHIR MedicationRequest, DICOM Study and REST Event examples.
- Message detail pipeline.
- Raw / Parsed / Mapped views.
- FHIR demo resource coverage labels.
- Sanitized HL7 demo viewer.
- DICOM metadata-only display.
- Failed-message repair/retry workflow.
- Data mapping workspace and issue resolution.
- Demo terminology/code-system framing.

## 10. Data Quality — Implemented

- Complete identities representative metric.
- Potential duplicates.
- Unmatched records.
- Missing mappings.
- Data conflicts.
- Stale feeds.
- Unmapped/failed messages.
- Work queue with ownership/status.
- Human resolution flows that update counts and audit.

## 11. Search / audit / notifications — Implemented

Global search groups:

- Patients
- Source Records
- Messages
- Interfaces
- Documents

Audit includes identity, source viewing, interface, mapping, message, unmatched-record, conflict and AI actions. Notifications are state-driven and route to relevant work areas.

## 12. Role simulation and invalid-state protection — Implemented

Roles:

- Clinician
- Health Information Manager
- Interoperability Analyst
- Integration Engineer
- Data Steward
- Clinical Informaticist
- Administrator

Critical store actions enforce permissions in addition to UI gating. Identity decisions, retries, interface restoration, source-preserving merges and conflict handling include invalid-state guards.

## 13. Visual identity — Implemented

Dedicated HealthConnect palette:

- Carbon Slate `#202A33`
- Interoperability Aqua `#1C9A9A`
- Data Cyan `#4E9BCB`
- Signal Lime `#7FAF67`
- Identity Amber `#D29A43`
- Conflict Coral `#C76563`
- Background `#F4F7F8`
- AI Accent `#6269B8`

The application uses a precise enterprise interoperability UI rather than a generic blue clinical dashboard or cyberpunk/network visualization.

## 14. Project-wide custom dropdown requirement — Implemented

The final release contains **zero native HTML `<select>` and `<option>` controls** in application source.

A reusable `CustomSelect` provides:

- custom trigger/menu styling
- `combobox` / `listbox` / `option` semantics
- keyboard Enter/Space opening
- Arrow Up/Down navigation
- Home/End
- Escape close
- selected/disabled ARIA state
- click-outside close
- focus return

It is used for role switching and project filters/selectors including audit, Copilot, data quality, mappings, messages and timeline/Patient 360 controls.

## 15. Accessibility / responsive behavior — Implemented in source

- semantic buttons/tables/tabs where used
- visible focus states
- custom-dropdown keyboard support
- dialogs/drawers with dialog semantics
- Escape handling
- focus trap
- focus return
- non-color status text
- responsive desktop/tablet layouts
- collapsible Patient 360 secondary panels

## 16. Testing — Authored

Unit/regression coverage includes:

- identity matching and decisions
- source-ID preservation
- merge continuity
- interface degradation/recovery
- freshness behavior
- message repair/retry guards
- unmatched record workflow
- mapping resolution
- duplicate-event/conflict review
- Copilot source citations/no unsupported facts
- late-arriving data timestamps
- source-view audit
- role permissions
- reset demo
- custom dropdown rendering/keyboard behavior

Playwright scenarios cover the primary Patient 360 merge story, interface failure/recovery, unmatched lab linking, Copilot citation, message repair/retry and custom dropdown interaction.

## 17. Intentional limitations

These are required scope boundaries rather than missing product features:

- no live EHR/FHIR/HL7/DICOM connection
- no production MPI
- no real patient data
- no external AI API
- no validated clinical/identity algorithm
- no diagnostic image interpretation
- no production terminology/compliance claim

## 18. Verification truthfulness

Static source checks pass as recorded in `docs/VERIFICATION.md`.

Dependency installation could not complete in the current sandbox because the npm registry was unreachable, therefore build/unit/Playwright execution is **not falsely marked PASS** here. Run the listed npm commands locally for runtime certification.
