# CohortFlow Product Specification

**Version:** 1.0
**Last Updated:** February 12, 2026
**Project:** MAIA Biotech Spring 2026
**Status:** MVP Development

---

## Executive Summary

CohortFlow is a purpose-built intake pipeline management system for university hospital volunteer, shadowing, and research programs. It replaces the fragile chain of forms, spreadsheets, emails, and shared drives with a configurable workflow engine featuring RBAC, audit logging, and reviewer collaboration.

**Core Value Proposition:** Switch without changing your spreadsheet - export mapping that matches existing spreadsheets reduces switching risk to near zero.

**Target Market:** 6,100+ U.S. hospitals running 2-5 programs each, processing high-volume applicant funnels multiple times per year.

---

## Problem Statement

### Current State: The Fragile Chain

Healthcare program coordinators currently manage intake through a disconnected toolchain:

1. **Form Submissions** - Google Forms, Typeform, or institutional forms
2. **Spreadsheet Tracking** - Manual copy-paste of applicant data
3. **Email Threads** - Reviewer assignments, decision notifications, back-and-forth
4. **Calendar Coordination** - Interview and orientation scheduling via email
5. **Shared Drives** - Inconsistent permissions, unclear access logs

### Pain Points

**For Program Coordinators:**
- 25-50 hours of manual work per intake cycle
- Error-prone copy-paste between systems
- No visibility into who accessed sensitive files
- Reviewer follow-up via email threads
- Recreating export templates every cycle

**For Reviewers:**
- Inconsistent rubric application
- No structured scoring interface
- Unclear queue of assigned applications
- Manual tracking of completion status

**For Applicants:**
- Opaque status visibility
- Inconsistent communication
- Unclear requirements and deadlines
- No confirmation of document receipt

### Critical Gaps

- **No structured workflow** - Stages tracked manually in spreadsheet columns
- **No access control** - Shared drive folders lack granular permissions
- **No audit trail** - Unknown who viewed which applicant files
- **No reusable configuration** - Program setup recreated each cycle

---

## Solution Overview

### Positioning Statement

**For** healthcare program coordinators **who** run recurring high-volume intake cycles,
**CohortFlow is** a configurable pipeline management system **that** provides workflow automation, reviewer collaboration, and audit visibility,
**unlike** forms + spreadsheets + email, which require manual coordination and lack access control.

### Core Capabilities

1. **Configurable Pipeline** - Define stages, transitions, reviewer queues, and rubrics
2. **Reusable Applicant Profile** - Standard fields + custom prompts + artifact uploads
3. **Export Mapping** - Field-to-column mapping saved per program, matches existing spreadsheets
4. **Trust Layer** - RBAC roles, least privilege, audit log for compliance

### Key Differentiation

**The Real Incumbent:** Forms + Spreadsheets + Email + Shared Drive

**Why CohortFlow Wins:**
- Export parity reduces switching risk to near-zero
- Purpose-built for reviewer workflows (not generic Airtable/Notion flexibility)
- File access visibility (coordinators see "who saw what")
- Configurable rubrics with scoring aggregation

---

## User Personas

### Persona 1: Program Coordinator

**Role:** Economic buyer and champion
**Responsibilities:** Owns intake end-to-end, assigns reviewers, finalizes decisions, exports roster

**Goals:**
- Reduce manual coordination time by 50%
- Maintain control over stage transitions and assignments
- Ensure compliance with audit requirements
- Export roster matching existing downstream systems

**Pain Points:**
- Chasing reviewers for completion status
- Manual copy-paste between systems
- No visibility into file access
- Recreating export templates each cycle

**Success Metrics:**
- Setup time under 30 minutes from template
- Reduced follow-up emails to reviewers
- One-click export matching existing spreadsheet

### Persona 2: Reviewer

**Role:** Faculty, staff, or senior students evaluating applications
**Responsibilities:** Read applications, score using rubric, provide comments

**Goals:**
- Clear queue of assigned applications
- Structured scoring interface
- Quick completion tracking

**Pain Points:**
- Unclear which applications need review
- Inconsistent rubric application across team
- Manual tracking in personal notes

**Success Metrics:**
- Completion of full queue within assigned timeframe
- Higher rubric consistency across reviewers
- Reduced coordinator follow-up

### Persona 3: Applicant

**Role:** Students, volunteers, or researchers applying to programs
**Responsibilities:** Submit required information, upload documents, track status

**Goals:**
- Clear requirements and deadlines
- Status visibility throughout process
- Confirmation of document receipt

**Pain Points:**
- Opaque status (submitted, under review, accepted?)
- Uncertainty about document receipt
- Inconsistent communication timing

**Success Metrics:**
- Complete submission on first attempt
- Clear status visibility
- Timely decision notification

---

## Workflows

### Workflow A: Volunteer Program Intake

**Context:** Hospital volunteer program, 2 cycles/year, 150-400 applicants per cycle

**Stages:**

1. **Eligibility Screen**
   - University affiliation check
   - Time commitment confirmation (8-12 hours/week)
   - Availability verification (weekday/weekend preferences)
   - **Transition:** Auto-advance if all criteria met, else reject

2. **Document Check**
   - Resume upload and review
   - Schedule upload (class/work commitments)
   - Optional: Transcript, reference letters
   - **Transition:** Coordinator reviews completeness

3. **Training and Attestations**
   - Code of conduct acknowledgment
   - Safety module completion
   - Background check consent
   - **Transition:** Auto-advance upon completion

4. **Orientation Scheduling**
   - Group session assignment
   - Calendar invite sent
   - Attendance confirmation
   - **Transition:** Manual advance after attendance

5. **Placement and Final Roster**
   - Department/unit assignment
   - Shift schedule creation
   - **Export:** CSV matching downstream HR system

6. **Onboarding Checklist**
   - Badge pickup confirmation
   - First shift attendance
   - **Status:** Active volunteer

**Reviewer Roles:**
- Coordinator: Stages 1, 2, 4, 5
- Automated: Stage 3 (upon completion)

### Workflow B: Shadowing Program

**Context:** Clinical shadowing, 3 cycles/year, 50-100 applicants per cycle

**Stages:**

1. **Eligibility and Interest Area**
   - University affiliation
   - Clinical interest area selection
   - Pre-med/pre-health track confirmation

2. **Department Sponsor Matching**
   - Sponsor identification
   - Sponsor approval confirmation

3. **Schedule Constraints**
   - Availability windows
   - Duration and frequency preferences

4. **Coordinator Review**
   - Sponsor + schedule compatibility
   - Policy compliance check

5. **Policy Acknowledgements**
   - HIPAA training completion
   - Confidentiality agreement
   - Professional conduct standards

6. **Final Export**
   - CSV for hospital credentialing system

### Workflow C: Research Assistant Intake

**Context:** Lab research positions, rolling/seasonal, 20-50 applicants per cycle

**Stages:**

1. **Eligibility and Interest**
   - Academic standing verification
   - Research area interest
   - Availability (hours/week, duration)

2. **Statement and Artifact Review**
   - Personal statement upload
   - Resume/CV upload
   - Optional: Writing samples, prior research

3. **Rubric Scoring**
   - Multiple reviewers score:
     - Research fit (1-5)
     - Prior experience (1-5)
     - Availability match (1-5)
     - Communication quality (1-5)
   - **Aggregate:** Average scores across reviewers

4. **Interview Shortlist**
   - Top scorers identified
   - Interview scheduling

5. **Offer and Acceptance**
   - Offer extended
   - Applicant accepts/declines

6. **Onboarding Checklist**
   - Lab safety training
   - Equipment access
   - First day confirmation

**Reviewer Roles:**
- PI (Principal Investigator): All stages
- Lab Manager: Stages 2, 3, 6
- Grad Students: Stage 3 (scoring)

---

## Features and Modules

### 1. Program Builder

**Purpose:** Configure intake pipeline for each program type

**Configuration Elements:**
- Program name, description, cycle dates
- Stage definitions (name, order, automated/manual transitions)
- Applicant profile fields (standard + custom prompts)
- Reviewer assignment rules
- Rubric templates per stage
- Export field mapping

**User Stories:**
- As a coordinator, I want to clone last year's program template so I can launch a new cycle in under 30 minutes
- As a coordinator, I want to define custom stages so the pipeline matches my program's unique workflow

**Acceptance Criteria:**
- Program creation from template in < 5 minutes
- Custom field creation (text, file upload, multiple choice)
- Stage reordering via drag-and-drop
- Export mapping saved per program

### 2. Applicant Portal

**Purpose:** Application submission and status tracking

**Features:**
- Application form with required/optional fields
- File upload (resume, transcripts, references)
- Progress indicator (% complete)
- Status dashboard (stage, last updated, next steps)
- Decision notification

**User Stories:**
- As an applicant, I want clear indication of required vs optional fields so I can complete my submission correctly
- As an applicant, I want real-time status visibility so I know where my application stands

**Acceptance Criteria:**
- Form validation prevents incomplete submission
- File upload with type/size limits
- Status updated within 1 minute of stage change
- Email notification on decision

### 3. Reviewer Queue

**Purpose:** Structured review interface for assigned applications

**Features:**
- Queue view (assigned, in progress, completed)
- Rubric scoring interface
- Comment/notes field
- Bulk actions (approve, request info, reject)
- Progress tracker (X of Y completed)

**User Stories:**
- As a reviewer, I want a clear queue of assigned applications so I know exactly what needs my attention
- As a reviewer, I want rubric scoring prompts so my evaluations are consistent

**Acceptance Criteria:**
- Queue filtered by reviewer assignment
- Rubric scores saved per criterion
- Comments attached to application record
- Completion status visible to coordinator

### 4. Pipeline Board

**Purpose:** Coordinator view of all applications across stages

**Features:**
- Kanban-style board (columns = stages)
- Drag-and-drop stage transitions
- Filters (reviewer, date range, status)
- Bulk actions (assign reviewer, move stage)
- Search by applicant name/email

**User Stories:**
- As a coordinator, I want a visual pipeline board so I can see bottlenecks at a glance
- As a coordinator, I want bulk stage transitions so I can efficiently move groups of applicants

**Acceptance Criteria:**
- Board loads in < 2 seconds for 500 applications
- Drag-and-drop updates stage immediately
- Filters apply without page reload
- Search returns results in < 1 second

### 5. Export Engine

**Purpose:** Generate CSV matching existing downstream systems

**Features:**
- Field-to-column mapping configuration
- Saved export templates per program
- One-click export generation
- Preview before download
- Export history log

**User Stories:**
- As a coordinator, I want export mapping to match my existing spreadsheet so I can avoid reformatting
- As a coordinator, I want export history so I can reference prior rosters

**Acceptance Criteria:**
- Export template saved per program
- Column order and naming customizable
- Export includes all selected stages
- Export downloadable as CSV
- Export logged in audit trail

### 6. Audit Log

**Purpose:** Compliance and visibility into system events

**Logged Events:**
- User login/logout
- Application submission
- File upload/download
- Stage transitions
- Reviewer assignments
- Review completion
- Exports

**Attributes per Event:**
- Timestamp
- User (name, email, role)
- Action type
- Resource (application ID, file name)
- IP address (optional, for security)

**User Stories:**
- As a coordinator, I need to see who accessed which applicant files for compliance audits
- As a coordinator, I want to track when decisions were made so I can reference timeline

**Acceptance Criteria:**
- All critical events logged automatically
- Log viewable by coordinators only
- Filterable by user, event type, date range
- Exportable as CSV

---

## Trust Layer

### RBAC Roles

**Applicant:**
- Read: Own application, own files
- Write: Own application (before submission), own files
- **Restrictions:** Cannot view other applications

**Reviewer:**
- Read: Assigned applications, associated files
- Write: Reviews, comments, scores
- **Restrictions:** Cannot access unassigned applications, cannot change stages

**Coordinator:**
- Read: All applications, all files, all reviews, audit log
- Write: Program configuration, reviewer assignments, stage transitions, exports
- **Restrictions:** None within program scope

**System Admin (future):**
- Full access across all programs
- User management

### Least Privilege Enforcement

**File Access:**
- Time-limited URLs (expire after 1 hour)
- Access logged in audit trail
- Reviewer access only for assigned applications

**Stage Transitions:**
- Only coordinators can move applications between stages
- Reviewers complete reviews but cannot advance stages

**Export Access:**
- Only coordinators can generate exports
- Exports logged with timestamp and user

### Audit Trail Requirements

**What is Logged:**
- File uploads (who, when, file name, size)
- File downloads (who, when, file name)
- Stage changes (who, from stage, to stage, timestamp)
- Reviewer assignments (who assigned, to whom, application ID)
- Review submissions (who, when, scores)
- Exports (who, when, filter criteria, row count)

**Retention:**
- Audit logs retained for duration of program + 2 years
- Exportable for external compliance audits

**Access Control:**
- Coordinators: Read access to audit log
- Reviewers: No access to audit log
- Applicants: No access to audit log

---

## Market Context

### Target Market Sizing

**Total Addressable Market (TAM):**
- 6,100 U.S. hospitals (American Hospital Association)
- 2-5 programs per hospital (volunteer, shadowing, research, training)
- **Total:** 12,000-30,000 programs

**Serviceable Addressable Market (SAM):**
- Focus: Academic medical centers and teaching hospitals
- Estimated: 1,000 hospitals, 3-5 programs each
- **Total:** 3,000-5,000 programs

**Initial Target Segment:**
- University-affiliated hospitals in major metro areas
- Programs with 100+ applicants per cycle
- 2+ cycles per year
- **Estimated:** 500-1,000 programs

### Pricing Strategy (Post-MVP)

**Tier 1: Starter** - $300/month or $3,000/year
- 1 active program
- Up to 250 applicants per cycle
- 3 coordinator seats, 10 reviewer seats
- Basic audit logging

**Tier 2: Professional** - $500/month or $5,000/year
- 3 active programs
- Up to 500 applicants per cycle
- 5 coordinator seats, 25 reviewer seats
- Advanced audit logging and analytics

**Tier 3: Enterprise** - Custom pricing
- Unlimited programs
- Unlimited applicants
- Unlimited seats
- SSO, custom integrations, dedicated support

**Average Contract Value:** $6,000/year per program

### Competitive Landscape

**The Real Incumbent:** Forms + Spreadsheets + Email + Shared Drive
- Strengths: Free, familiar, no switching cost
- Weaknesses: Manual, error-prone, no access control, no audit trail

**Generic Tools (Airtable, Notion):**
- Strengths: Flexible, multi-purpose, visual
- Weaknesses: Not purpose-built for reviewer workflows, no built-in RBAC, requires custom configuration

**Applicant Tracking Systems (Greenhouse, Lever):**
- Strengths: Robust pipeline management, established market
- Weaknesses: Designed for corporate hiring (not academic programs), expensive, overkill for seasonal programs

**CohortFlow Differentiation:**
- Purpose-built for recurring academic/healthcare programs
- Export parity with existing spreadsheets (reduces switching risk)
- Reviewer-specific features (queue, rubric, aggregation)
- File access visibility for compliance

---

## Roadmap

### Phase 0: Foundation (Weeks 1-2)

**Goals:**
- Requirements finalization
- Technical stack validation
- Synthetic data generation

**Deliverables:**
- [x] Product spec document
- [x] Wireframes and mockups
- [x] Synthetic dataset (150 applicants)
- [ ] Database schema v1
- [ ] Auth system with 3 roles

### Phase 1: MVP Core (Weeks 3-4)

**Goals:**
- Applicant submission flow
- Basic coordinator dashboard
- File handling

**Deliverables:**
- [ ] Application form (standard fields + custom prompts)
- [ ] File upload to Vercel Blob
- [ ] Program configuration interface
- [ ] Pipeline board visualization
- [ ] Stage transition logic

### Phase 2: Reviewer Features (Weeks 5-6)

**Goals:**
- Reviewer queue and rubric scoring
- Review aggregation

**Deliverables:**
- [ ] Reviewer queue (assigned applications)
- [ ] Rubric scoring interface
- [ ] Comment/notes functionality
- [ ] Score aggregation logic
- [ ] Reviewer completion tracking

### Phase 3: Export and Audit (Weeks 7-8)

**Goals:**
- Export mapping and generation
- Audit logging v1

**Deliverables:**
- [ ] Export field mapping configuration
- [ ] CSV export generation
- [ ] Audit log (core events: file access, stage changes, exports)
- [ ] Audit log viewer for coordinators

### Phase 4: Polish and Demo (Weeks 9-10)

**Goals:**
- UI refinement
- Demo narrative
- Presentation preparation

**Deliverables:**
- [ ] Responsive design polish
- [ ] Demo script for 3 workflows
- [ ] User testing with 3-5 target users
- [ ] Final presentation deck

### Post-MVP: Optional Features

**Messaging Log:**
- Track all outbound emails (stage changes, decisions, reminders)
- Resend capability
- Message templates

**Analytics Dashboard:**
- Cycle metrics (time-to-decision, reviewer throughput)
- Bottleneck identification
- Rubric score distributions

**AI Features (Guardrailed):**
- Applicant clarity coach (rewrite suggestions for short answers)
- Coordinator rubric generation (draft from program description)
- **Rules:** AI never auto-accepts/rejects, outputs are editable, human always decides

---

## Success Metrics

### Product Metrics

**Setup Efficiency:**
- Time to create program from template: < 30 minutes
- Time to configure export mapping: < 10 minutes

**Coordinator Time Savings:**
- Baseline: 25-50 hours manual work per cycle
- Target: 50% reduction (12-25 hours)

**Reviewer Efficiency:**
- Rubric completion rate: > 90%
- Average review time: < 10 minutes per application

**Applicant Experience:**
- Submission completion rate: > 85%
- Status check frequency: < 3 per applicant

**Export Parity:**
- Export matches existing spreadsheet: 100%
- Export generation time: < 30 seconds for 500 applicants

### Business Metrics (Post-MVP)

**User Acquisition:**
- Beta programs: 10 programs across 5 hospitals
- Pilot conversion rate: > 60%

**Engagement:**
- Programs launched per month: 20+
- Active users per program: 1 coordinator + 3 reviewers + 100 applicants

**Revenue:**
- ARR target: $100K in Year 1 (20 programs @ $5K/year)

---

## Constraints and Compliance

### Data Boundaries (Student MVP)

**What CohortFlow DOES:**
- Store applicant contact info (name, email, phone)
- Store application responses (text, files)
- Store review scores and comments
- Store audit logs

**What CohortFlow DOES NOT:**
- Store or process PHI (protected health information)
- Integrate with EHRs or hospital identity systems
- Claim HIPAA compliance
- Store patient data

**Synthetic Data Only:**
- All demo data is synthetic (Faker.js generated)
- No real applicant data during MVP phase

### Trust Requirements

**Authentication:**
- NextAuth.js with email/password
- Session management with secure cookies
- Password hashing (bcrypt)

**Authorization:**
- Role-based access control (RBAC)
- Least privilege enforcement
- Reviewer access only to assigned applications

**Audit Logging:**
- All file access logged (who, when, what)
- All stage transitions logged
- All exports logged
- Logs retained for 2+ years

**File Security:**
- Time-limited URLs (1 hour expiration)
- Logged access events
- No public file access

---

## Open Questions

See [AMBIGUITY.md](./AMBIGUITY.md) for detailed discussion of ambiguities and required decisions.

---

## Appendix

### Glossary

- **Cohort:** Group of applicants in a single intake cycle
- **Cycle:** Time-bound period for a program (e.g., Fall 2026 volunteer intake)
- **Pipeline:** Sequence of stages from application to acceptance
- **Stage:** Step in the pipeline (e.g., "Document Review")
- **Rubric:** Scoring criteria for reviewer evaluation
- **Artifact:** Uploaded file (resume, transcript, reference letter)
- **Export Mapping:** Configuration defining which fields map to which CSV columns

### References

- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design
- [API.md](./API.md) - tRPC API reference
- [DATABASE.md](./DATABASE.md) - Schema documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

---

**Document Owner:** MAIA Biotech Spring 2026 Team
**Maintained By:** Project Lead - Caleb Newton
**Review Cycle:** Weekly during MVP development
