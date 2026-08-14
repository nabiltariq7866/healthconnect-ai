# HealthConnect AI — Final Implementation Scope

This repository implements the supplied 149-section HealthConnect AI master prompt as a frontend-only enterprise portfolio demonstration using fully synthetic healthcare information.

## Major completed product areas

- Premium Carbon Slate / Interoperability Aqua enterprise visual system
- Responsive application shell, global grouped search, notifications and role simulation
- 8 synthetic source systems and 14 synthetic interfaces
- FHIR R4 / HL7 v2 / DICOM / REST / Event Stream / Batch concepts
- Interoperability overview, system landscape and operational analytics
- Interface health/detail, pause/error/restore/sync simulation
- Message Activity with full requested message-type coverage
- Raw / Parsed / Mapped message views and processing pipeline
- FHIR resource-demo coverage, sanitized HL7 viewer and DICOM metadata display
- Mapping Workspace, mapping issues and simulated correction
- Human-reviewed identity queue and deterministic match explanations
- Merge / Keep Separate / Link Records / Request Review
- Typed merge confirmation and preservation of all original identifiers
- Merge history and View Merge navigation
- Unified Patient Search and Patient 360
- Timeline filters by domain/source/date range
- Late-arriving event presentation using clinical date plus received metadata
- Encounters, conditions, medications, allergies, labs, imaging, documents and appointments
- Source coverage/freshness and stale-feed warnings
- Cross-source medication/demographic/duplicate-event conflicts
- Human conflict review without deleting original evidence
- Record-level provenance drawers and Provenance Explorer
- Human-controlled unmatched/orphan laboratory workflow
- Data Quality metrics, queue and state-changing resolutions
- Source-grounded deterministic AI Copilot with exact clickable citations
- Sectioned unified patient summary and unsupported-fact behavior
- Enterprise audit trail and notifications
- Settings/demo scenarios and deterministic reset
- Role permissions plus store-level invalid-state guards
- Loading/error/empty states across core workflows
- Accessibility/focus handling for dialogs, drawers and custom dropdowns
- Project-wide custom dropdown system: **zero native HTML select/option controls**
- Unit/regression tests and Playwright E2E scenarios

## Frontend-only/safety boundaries

- No backend or database server
- No live Epic / Oracle Health / Dedalus / LIS / PACS / Pharmacy / Insurance integration
- No live FHIR server / HL7 engine / DICOM service
- No real patient data
- No real clinical AI
- No autonomous identity merge
- No autonomous clinical conflict resolution
- No diagnosis or prescribing
- No production terminology/identity/compliance claim

## Verification

See `docs/VERIFICATION.md` for the exact static verification results and environment limitation affecting npm dependency installation/build execution.
