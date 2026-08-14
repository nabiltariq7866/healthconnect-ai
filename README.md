# HealthConnect AI

**Healthcare Interoperability & Unified Patient 360 Platform**

HealthConnect AI is a frontend-only enterprise portfolio demo showing how fragmented **synthetic** healthcare information can be unified across EHR, laboratory, imaging, pharmacy, insurance and medical-device systems without losing provenance.

> **Demo safety:** No real patient data, live Epic/Oracle/Dedalus connection, live FHIR/HL7/DICOM endpoint, production MPI, clinical AI, diagnosis or prescribing is used.

## What is included

- 8 fictional source systems and 14 synthetic interfaces
- FHIR R4, HL7 v2, DICOM, REST, Event Stream and Batch concepts
- Human-controlled identity matching / deduplication
- Merge / Keep Separate / Link Records / Request Review decisions
- Unified Patient 360 and longitudinal clinical timeline
- Original source-identifier preservation
- Record-level provenance and full data-lineage explorer
- Cross-source medication, demographic and duplicate-event conflict review
- Source-grounded deterministic AI Copilot with exact clickable citations
- Data freshness/stale-feed handling
- Interface error/recovery/sync simulation
- Message processing, repair/retry and FHIR/HL7/DICOM demo viewers
- Data mapping and data-quality workflows
- Unmatched/orphan laboratory workflow
- Role permissions, audit, notifications and reset
- Accessible project-wide custom dropdown controls
- Unit/regression and Playwright E2E test suites

## Custom dropdown requirement

The project intentionally contains **no native HTML `<select>` / `<option>` controls** in application source.

All role/filter/selection experiences use the reusable `CustomSelect` component with custom styling, keyboard navigation, ARIA combobox/listbox semantics, Escape handling and focus return.

## Core demo workflows

### 1. Identity → Unified Patient 360

1. Use **Data Steward**.
2. Open **Identity Queue**.
3. Review **Emily Robertson → Emily Robinson**.
4. Inspect exact/near/conflicting evidence.
5. Type `MERGE` in confirmation and confirm.
6. Open Emily Patient 360.
7. CityCare records/source identifiers become part of the longitudinal view while original identifiers remain preserved.
8. Cross-source conflicts are surfaced for human review.

### 2. Interface failure → freshness → recovery

1. Use **Integration Engineer**.
2. Open **Interfaces → Metro Diagnostics ORU**.
3. Choose **Create Demo Error**.
4. Emily Patient 360 marks laboratory information delayed/stale.
5. Restore the interface.
6. Run **Simulate Sync**.
7. A deterministic new lab message/record arrives and appropriate freshness returns to Current.

### 3. New unmatched laboratory record

1. Use **Data Steward**.
2. Open **Data Quality**.
3. Create/review the unmatched lab demo.
4. Human chooses Link, Hold or Create New Patient.
5. Linking to Emily updates Patient 360 and audit history.

### 4. Source-grounded AI Copilot

1. Use **Clinician** or **Clinical Informaticist**.
2. Open Emily Patient 360 or **AI Copilot**.
3. Ask `Summarize the last 30 days.`
4. Every supported factual statement contains exact source citations.
5. Click a citation to inspect source system, original ID, timestamps, raw/mapped data and lineage.
6. Unsupported questions return a no-support message rather than invented facts.

## Technology

- React
- TypeScript
- Vite
- React Router
- Zustand + localStorage persistence
- React Hook Form / Zod dependencies available for structured form workflows
- Recharts
- Lucide React
- Sonner
- date-fns
- Custom lightweight enterprise component/design system
- Vitest + Testing Library
- Playwright

Equivalent custom components are used instead of adding redundant UI-framework dependencies to this self-contained demo.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Unit/regression tests:

```bash
npm test
```

E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

## Main routes

- `/` — Interoperability Overview
- `/identity` — Identity Queue
- `/duplicates` — Duplicate Records
- `/merge-history` — Merge History
- `/patients` — Patient Search
- `/unified` — Unified Records
- `/patients/pt-emily` — Primary Patient 360 demo
- `/timeline` — Longitudinal Timeline
- `/interfaces` — Interface health/failure simulation
- `/messages` — Message Activity
- `/mappings` — Data Mapping
- `/clinical/Medication` — Medications
- `/clinical/Lab` — Laboratory
- `/clinical/Imaging` — Imaging
- `/clinical/Document` — Documents
- `/copilot` — Source-grounded AI Copilot
- `/data-quality` — Data Quality / unmatched records
- `/provenance` — Provenance Explorer
- `/integrations` — Integration Catalog
- `/audit` — Audit Trail
- `/settings` — Demo Controls / Reset
- `/search` — Grouped global search results

## Demo roles

- **Clinician** — Patient 360 + AI Copilot
- **Health Information Manager** — identity/data-quality review
- **Interoperability Analyst** — mappings/data quality
- **Integration Engineer** — interfaces/messages/mappings
- **Data Steward** — identity + unmatched-record decisions
- **Clinical Informaticist** — Copilot/mappings/data quality
- **Administrator** — all demo operations/reset

## Design identity

- Carbon Slate `#202A33`
- Interoperability Aqua `#1C9A9A`
- Data Cyan `#4E9BCB`
- Signal Lime `#7FAF67`
- Identity Amber `#D29A43`
- Conflict Coral `#C76563`
- Background `#F4F7F8`
- AI Accent `#6269B8`

## Verification

See:

- `docs/MASTER_PROMPT_COMPLIANCE.md`
- `docs/IMPLEMENTATION_SCOPE.md`
- `docs/VERIFICATION.md`

The final static verification found 0 TypeScript/TSX syntax diagnostics, 0 unresolved local relative imports and 0 native HTML select controls. npm registry access was unavailable in the build sandbox, so dependency-based build/test commands are not falsely claimed as executed there.
