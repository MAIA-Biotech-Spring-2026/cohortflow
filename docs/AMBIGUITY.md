# CohortFlow: Open Questions and Ambiguities

**Version:** 1.0
**Last Updated:** February 12, 2026
**Status:** Living Document (Update as Decisions Made)

---

## Purpose

This document captures all areas of ambiguity, open questions, and decisions needed for CohortFlow. It serves as a reference for the team to discuss trade-offs and make informed decisions during MVP development.

---

## Table of Contents

1. [Workflow and Pipeline](#workflow-and-pipeline)
2. [Feature Prioritization](#feature-prioritization)
3. [Technical Trade-offs](#technical-trade-offs)
4. [RBAC and Permissions](#rbac-and-permissions)
5. [File Handling](#file-handling)
6. [Reviewer Assignment](#reviewer-assignment)
7. [Export and Integration](#export-and-integration)
8. [Compliance and Trust](#compliance-and-trust)
9. [Scaling Concerns](#scaling-concerns)
10. [AI Features](#ai-features)

---

## Workflow and Pipeline

### Q1: How should stage transitions be triggered?

**Options:**
1. **Manual Only:** Coordinators explicitly move applications between stages
2. **Automated + Manual:** Some stages auto-advance (e.g., training completion), others manual
3. **Rule-Based:** Define transition rules (e.g., "if all reviews complete, auto-advance")

**Trade-offs:**
- Manual: Full control, more coordinator work
- Automated: Reduces coordinator workload, risk of incorrect transitions
- Rule-Based: Flexible but adds complexity

**Current Decision:** **Option 2 (Automated + Manual)**
- Most stages manual (coordinator control)
- Specific stages automated (e.g., form completion, attestations)
- Define `automated: boolean` in stage configuration

**Open Questions:**
- [ ] Which stages should be automated by default?
- [ ] Should coordinators override automated transitions?
- [ ] How to handle failed automated transitions (e.g., incomplete training)?

---

### Q2: Can applications move backwards in the pipeline?

**Scenario:** Application in "Under Review" needs to return to "Document Check" for missing file.

**Options:**
1. **Forward Only:** Cannot move backwards (simple state machine)
2. **Allow Rollback:** Coordinators can move applications backwards
3. **Conditional Rollback:** Only certain stages allow backwards movement

**Trade-offs:**
- Forward Only: Simpler logic, but inflexible
- Allow Rollback: More flexible, but complex state tracking
- Conditional: Balanced, but requires stage-specific rules

**Current Decision:** **Option 2 (Allow Rollback)**
- State machine allows backwards transitions (except from terminal states: ACCEPTED, REJECTED)
- Audit log captures all transitions with reason

**Open Questions:**
- [ ] Should backwards transitions require a reason?
- [ ] Should applicants be notified of backwards movement?
- [ ] How to display backwards movement in pipeline board?

---

### Q3: How to handle waitlisted applicants?

**Scenario:** Program accepts 50 applicants, waitlists 20. If 5 decline offer, how to promote waitlist?

**Options:**
1. **Manual Promotion:** Coordinator manually moves waitlisted to accepted
2. **Ranked Waitlist:** Waitlist ordered by score, auto-promote top N
3. **Notification System:** Notify waitlisted applicants, manual coordinator action

**Trade-offs:**
- Manual: Simple, full control, but time-consuming
- Ranked: Automated, but assumes score-based ranking is desired
- Notification: Reduces coordinator work, but requires email system

**Current Decision:** **Defer to Post-MVP**
- MVP: Manual promotion only
- Post-MVP: Add ranked waitlist with auto-promotion option

**Open Questions:**
- [ ] Should waitlist have expiration dates?
- [ ] How to notify waitlisted applicants of promotion?
- [ ] Should coordinators reorder waitlist manually?

---

### Q4: How to handle multi-cycle programs?

**Scenario:** Volunteer program runs Fall 2025 and Spring 2026 cycles. Should they be separate programs or cycles of one program?

**Options:**
1. **Separate Programs:** Each cycle is a new program (duplicate configuration)
2. **Program with Cycles:** One program entity, multiple cycle instances
3. **Template System:** Clone previous program as template for new cycle

**Trade-offs:**
- Separate: Simple, but manual duplication
- Cycles: Efficient, but adds complexity to schema
- Template: Balanced, easy to launch new cycles

**Current Decision:** **Option 3 (Template System)**
- MVP: Duplicate program manually via UI "Clone Program" button
- Post-MVP: Add formal cycle management

**Open Questions:**
- [ ] Should historical data (applications, reviews) carry over between cycles?
- [ ] How to compare metrics across cycles?
- [ ] Should export mappings be shared across cycles?

---

## Feature Prioritization

### Q5: Should we include a messaging/email system in MVP?

**Use Case:** Notify applicants of decisions, send reminders to reviewers.

**Options:**
1. **No Messaging in MVP:** Focus on pipeline only, manual email for now
2. **Basic Email Notifications:** Send emails on stage changes (via Resend/SendGrid)
3. **Full Messaging Log:** Track all outbound emails, resend capability

**Trade-offs:**
- No Messaging: Simpler MVP, but coordinators use external email
- Basic Notifications: Useful, but adds integration complexity
- Full Log: Best UX, but significant scope increase

**Current Decision:** **Option 1 (No Messaging in MVP)**
- MVP: No email integration, coordinators use Gmail/Outlook manually
- Post-MVP: Add email notifications (phase 7-8)

**Open Questions:**
- [ ] Should we add email placeholders in MVP UI (for future integration)?
- [ ] Which email provider to use (Resend, SendGrid, AWS SES)?
- [ ] Should emails be templated or free-form?

---

### Q6: Should we include analytics/reporting in MVP?

**Use Case:** Coordinators want to see funnel metrics (conversion rates, time-to-decision).

**Options:**
1. **No Analytics in MVP:** Focus on core pipeline functionality
2. **Basic Metrics:** Show application count per stage, average review scores
3. **Full Dashboard:** Charts, funnel visualization, reviewer performance

**Trade-offs:**
- No Analytics: Simpler MVP, but coordinators use spreadsheets
- Basic Metrics: Easy to implement, limited insight
- Full Dashboard: Best UX, but adds significant scope

**Current Decision:** **Option 2 (Basic Metrics)**
- MVP: Show counts per stage, average scores in application detail
- Post-MVP: Add full analytics dashboard (phase 7-8)

**Open Questions:**
- [ ] Which metrics are most valuable for MVP demo?
- [ ] Should metrics be exportable as CSV?
- [ ] How to handle privacy (aggregate vs. individual metrics)?

---

### Q7: Should applicants see reviewer comments?

**Scenario:** Reviewer writes comment "Weak communication skills" on application. Should applicant see this?

**Options:**
1. **Never Visible:** Comments only for coordinators/reviewers
2. **Coordinator-Filtered:** Coordinator shares specific comments with applicant
3. **Always Visible:** Full transparency, applicants see all comments

**Trade-offs:**
- Never Visible: Avoids hurt feelings, but less transparent
- Coordinator-Filtered: Balanced, but manual work for coordinator
- Always Visible: Most transparent, but risk of unprofessional comments

**Current Decision:** **Option 1 (Never Visible)**
- MVP: Comments only visible to coordinators and reviewers
- Post-MVP: Add "share comment" toggle for coordinators

**Open Questions:**
- [ ] Should there be "internal" vs. "external" comment fields?
- [ ] How to handle unprofessional/inappropriate comments?
- [ ] Should applicants see aggregate scores (without comments)?

---

## Technical Trade-offs

### Q8: Should we use server components or client components by default?

**Next.js 14 App Router:** Server Components by default, Client Components for interactivity.

**Options:**
1. **Server Components First:** Use RSC by default, `'use client'` only when needed
2. **Client Components First:** Use client components everywhere (easier for team)
3. **Mixed Approach:** Server for data-heavy pages, client for interactive features

**Trade-offs:**
- Server First: Smaller bundles, faster initial load, but learning curve
- Client First: Familiar React patterns, but larger bundles
- Mixed: Balanced, but requires team to understand when to use each

**Current Decision:** **Option 1 (Server Components First)**
- Default to Server Components
- Use Client Components for: forms, modals, drag-and-drop, real-time updates

**Open Questions:**
- [ ] How to handle shared state between server and client components?
- [ ] Should we use React Server Actions for forms?
- [ ] How to optimize hydration for large lists?

---

### Q9: Should we use Prisma or Drizzle ORM?

**Comparison:**

| Feature | Prisma | Drizzle |
|---------|--------|---------|
| Type Safety | Excellent | Excellent |
| Query Syntax | Custom API | SQL-like |
| Performance | Heavier runtime | Lightweight |
| Migrations | Auto-generated | Manual SQL |
| Ecosystem | Mature | Newer |

**Current Decision:** **Drizzle ORM**
- Reasoning: Lighter runtime, SQL-like syntax (easier to optimize), active development
- Acknowledged trade-off: Less mature than Prisma, smaller community

**Open Questions:**
- [ ] Should we add Prisma later if Drizzle proves limiting?
- [ ] How to handle complex joins (manual SQL or query builder)?
- [ ] Should we cache frequently-accessed data (Redis/in-memory)?

---

### Q10: Should we use WebSockets for real-time updates?

**Use Case:** Pipeline board updates when another coordinator moves application.

**Options:**
1. **No Real-Time:** Rely on browser refresh, optimistic updates
2. **Polling:** Fetch updates every 5-10 seconds
3. **WebSockets/SSE:** Real-time push notifications
4. **Hybrid:** Polling for MVP, WebSockets post-MVP

**Trade-offs:**
- No Real-Time: Simplest, but stale data risk
- Polling: Easy to implement, but inefficient
- WebSockets: Best UX, but adds infrastructure complexity
- Hybrid: Pragmatic MVP approach

**Current Decision:** **Option 4 (Hybrid)**
- MVP: Optimistic updates + React Query background refetching
- Post-MVP: Add WebSocket for real-time collaboration

**Open Questions:**
- [ ] What refetch interval is acceptable for MVP (5s, 10s, 30s)?
- [ ] Should we show "stale data" indicator?
- [ ] Which WebSocket library (Socket.IO, Pusher, Ably)?

---

## RBAC and Permissions

### Q11: Can one user have multiple roles?

**Scenario:** Coordinator who also reviews applications.

**Options:**
1. **Single Role:** Each user has one role (APPLICANT, REVIEWER, or COORDINATOR)
2. **Multiple Roles:** User can have multiple roles (array: `['REVIEWER', 'COORDINATOR']`)
3. **Role Hierarchy:** COORDINATOR inherits REVIEWER permissions

**Trade-offs:**
- Single Role: Simpler RBAC, but requires separate accounts for multi-role users
- Multiple Roles: Flexible, but complex permission checks
- Role Hierarchy: Balanced, but rigid structure

**Current Decision:** **Option 1 (Single Role) for MVP**
- MVP: One role per user
- Post-MVP: Consider multiple roles if user feedback demands it

**Open Questions:**
- [ ] Should coordinators be able to review (bypass assignment)?
- [ ] Should there be a "super admin" role for cross-program management?
- [ ] How to handle role changes (applicant becomes reviewer)?

---

### Q12: Can reviewers see other reviewers' scores before submitting?

**Scenario:** Reviewer A completes review. Should Reviewer B see A's scores when reviewing?

**Options:**
1. **Blind Review:** Reviewers cannot see other reviews until all submitted
2. **Open Review:** Reviewers see all prior reviews
3. **Coordinator-Controlled:** Coordinator decides per-program (toggle in settings)

**Trade-offs:**
- Blind: Prevents bias, but reviewers may duplicate effort
- Open: Faster review, but risk of anchoring bias
- Coordinator-Controlled: Flexible, but adds configuration complexity

**Current Decision:** **Option 1 (Blind Review) for MVP**
- MVP: Reviewers cannot see other reviews until submission
- Post-MVP: Add coordinator toggle for open vs. blind

**Open Questions:**
- [ ] Should coordinators always see all reviews?
- [ ] Should aggregate scores be visible to reviewers after submission?
- [ ] How to handle "discuss with team" scenarios?

---

### Q13: Should there be fine-grained permissions within coordinator role?

**Scenario:** Coordinator delegates reviewer assignment to assistant, but assistant shouldn't export data.

**Options:**
1. **Single Coordinator Role:** All coordinators have full permissions
2. **Coordinator Sub-Roles:** Coordinator (full), Coordinator Assistant (limited)
3. **Permission Flags:** Granular permissions (can_export, can_assign, can_transition)

**Trade-offs:**
- Single Role: Simplest, but inflexible
- Sub-Roles: Balanced, common pattern
- Permission Flags: Most flexible, but complex

**Current Decision:** **Defer to Post-MVP**
- MVP: All coordinators have full permissions
- Post-MVP: Add Coordinator Assistant role if needed

**Open Questions:**
- [ ] What are most common delegation scenarios?
- [ ] Should permission changes be audited?
- [ ] How to handle temporary permission grants?

---

## File Handling

### Q14: Should we support file versioning?

**Scenario:** Applicant uploads resume, then uploads revised version. Should both be kept?

**Options:**
1. **No Versioning:** New upload replaces old file (delete from Blob)
2. **Keep All Versions:** Store all versions, show history
3. **Replace with Audit Log:** Replace file, but log replacement event

**Trade-offs:**
- No Versioning: Simple, saves storage, but loses history
- Keep All Versions: Complete history, but complex UI and storage cost
- Replace with Audit Log: Balanced, preserves record of change

**Current Decision:** **Option 3 (Replace with Audit Log)**
- MVP: New upload replaces old file
- Audit log records replacement (old file name, new file name, timestamp)

**Open Questions:**
- [ ] Should coordinators be able to restore old versions?
- [ ] How long to retain deleted files in Blob (soft delete)?
- [ ] Should there be a confirmation prompt before replacing?

---

### Q15: What file size and type limits should we enforce?

**Current Limits (Proposed):**
- **Max Size:** 10 MB per file
- **Allowed Types:** PDF, JPEG, PNG, DOC, DOCX
- **Max Files per Application:** 10

**Open Questions:**
- [ ] Are 10 MB sufficient for transcripts/references?
- [ ] Should we allow ZIP files (multiple files in one)?
- [ ] Should we scan for viruses (ClamAV, Cloudflare Stream)?
- [ ] Should we limit total storage per program (e.g., 1 GB)?

**Current Decision:** **Start with proposed limits, adjust based on feedback**

---

### Q16: Should file URLs expire?

**Scenario:** Signed URL expires after 1 hour. If coordinator is reviewing for 2 hours, URLs break.

**Options:**
1. **Fixed Expiry:** 1 hour, regenerate if expired
2. **Longer Expiry:** 24 hours (less secure, but better UX)
3. **Refresh Tokens:** Auto-refresh URLs before expiry (client-side)

**Trade-offs:**
- Fixed Expiry: Most secure, but poor UX
- Longer Expiry: Better UX, but wider attack window
- Refresh Tokens: Balanced, but adds complexity

**Current Decision:** **Option 1 (1-hour expiry) for MVP**
- MVP: 1-hour expiry, show "Refresh" button if expired
- Post-MVP: Implement auto-refresh in client

**Open Questions:**
- [ ] Should expiry time vary by user role (longer for coordinators)?
- [ ] Should there be a "download all" option (ZIP export)?
- [ ] How to handle expired URLs in email notifications?

---

## Reviewer Assignment

### Q17: How should reviewers be assigned to applications?

**Options:**
1. **Manual Assignment:** Coordinator assigns specific reviewers to specific applications
2. **Pool Assignment:** Coordinator assigns reviewers to a stage, applications distributed evenly
3. **Self-Selection:** Reviewers claim applications from a pool
4. **Rule-Based:** Auto-assign based on rules (e.g., load balancing, expertise match)

**Trade-offs:**
- Manual: Full control, but time-consuming at scale
- Pool: Balanced workload, but less control over matches
- Self-Selection: Reduces coordinator work, but risk of cherry-picking
- Rule-Based: Most automated, but complex to configure

**Current Decision:** **Option 2 (Pool Assignment) for MVP**
- Coordinator assigns reviewers to a stage (e.g., "Reviewer A and B for Eligibility")
- All applications in that stage accessible to assigned reviewers
- Post-MVP: Add rule-based assignment

**Open Questions:**
- [ ] Should reviewers see all applications in pool or batches?
- [ ] How to handle reviewer capacity limits (max 20 applications)?
- [ ] Should there be a queue priority (first-in-first-out)?

---

### Q18: Should reviewers be required to review all assigned applications?

**Scenario:** Reviewer assigned to 50 applications, only completes 30.

**Options:**
1. **No Requirement:** Reviewers complete what they can, no enforcement
2. **Soft Requirement:** Show progress (30/50 completed), but no blocking
3. **Hard Requirement:** Cannot close program until all reviews complete

**Trade-offs:**
- No Requirement: Flexible, but risk of incomplete reviews
- Soft Requirement: Transparency, but no enforcement
- Hard Requirement: Ensures completeness, but rigid

**Current Decision:** **Option 2 (Soft Requirement)**
- MVP: Show progress tracker (X of Y completed)
- Coordinator can proceed without 100% completion
- Post-MVP: Add notifications/reminders to reviewers

**Open Questions:**
- [ ] Should there be a deadline for review completion?
- [ ] How to handle reviewer no-shows (reassign applications)?
- [ ] Should incomplete reviews affect reviewer metrics?

---

## Export and Integration

### Q19: Should export mapping support computed fields?

**Scenario:** Export column "Full Name" = `firstName + " " + lastName`

**Options:**
1. **Direct Mapping Only:** Each column maps to a single field (e.g., `responses.firstName`)
2. **Computed Fields:** Support expressions (e.g., `responses.firstName + " " + responses.lastName`)
3. **Formula System:** Excel-like formulas (e.g., `CONCAT(firstName, " ", lastName)`)

**Trade-offs:**
- Direct Only: Simple, but inflexible
- Computed: Powerful, but requires expression parser
- Formula System: Most flexible, but complex to build

**Current Decision:** **Option 1 (Direct Mapping) for MVP**
- MVP: One-to-one field mapping only
- Post-MVP: Add computed fields with simple expressions

**Open Questions:**
- [ ] Should we support conditional fields (e.g., "if accepted, include badge ID")?
- [ ] How to handle missing fields (empty string, "N/A", or omit)?
- [ ] Should export mappings be versioned (in case columns change)?

---

### Q20: Should we integrate with external systems?

**Use Cases:**
- **Hospital HR System:** Export accepted applicants
- **Calendar System:** Schedule orientation sessions
- **Single Sign-On (SSO):** Authenticate via hospital credentials

**Options:**
1. **No Integrations in MVP:** CSV export only
2. **OAuth Integrations:** Google Sheets, Microsoft Teams
3. **API Webhooks:** Push data to external systems on events
4. **SSO via SAML/OAuth:** Authenticate with hospital identity

**Trade-offs:**
- No Integrations: Simple MVP, but manual data transfer
- OAuth: Useful for coordinators, but adds complexity
- Webhooks: Powerful, but requires API setup
- SSO: Best for enterprise, but complex for MVP

**Current Decision:** **Option 1 (No Integrations in MVP)**
- MVP: CSV export only
- Post-MVP: Add Google Sheets export, SSO (if hospital feedback demands)

**Open Questions:**
- [ ] Which integrations are most valuable (Google Sheets, Outlook, Slack)?
- [ ] Should we build generic webhook system or specific integrations?
- [ ] How to handle authentication for integrations (OAuth2)?

---

## Compliance and Trust

### Q21: What data should be logged in audit trail?

**Current Logged Events:**
- File uploads/downloads
- Stage transitions
- Review submissions
- Exports
- Program creation/updates

**Additional Events to Consider:**
- [ ] User login/logout
- [ ] Password changes
- [ ] Permission changes (if added)
- [ ] Failed login attempts (security)
- [ ] Bulk actions (e.g., bulk stage transition)

**Open Questions:**
- [ ] Should audit logs be immutable (no edits/deletes)?
- [ ] Should logs be encrypted at rest?
- [ ] How long to retain logs (2 years, 5 years, indefinitely)?
- [ ] Should logs be exportable for external audits?

**Current Decision:** **Log all critical events, retain 2+ years, exportable as CSV**

---

### Q22: Should we claim HIPAA compliance for MVP?

**Context:** CohortFlow stores applicant personal info (name, email, phone) but NOT protected health information (PHI).

**Options:**
1. **No HIPAA Claims:** Explicitly state "not HIPAA compliant" in docs
2. **HIPAA-Ready:** Design with HIPAA in mind (encryption, audit logs), but don't certify
3. **HIPAA-Compliant:** Get Business Associate Agreement (BAA) with Vercel, full compliance

**Trade-offs:**
- No HIPAA Claims: Honest, avoids legal risk, but limits market
- HIPAA-Ready: Prepares for future, but no legal backing
- HIPAA-Compliant: Best for hospitals, but expensive and time-consuming

**Current Decision:** **Option 1 (No HIPAA Claims) for MVP**
- MVP: Use synthetic data only, no PHI
- Docs: Explicitly state "Not for PHI, not HIPAA compliant"
- Post-MVP: Consider HIPAA compliance if customer demand exists

**Open Questions:**
- [ ] Should we add disclaimer in UI ("Do not enter PHI")?
- [ ] What data qualifies as PHI (diagnosis, treatment info)?
- [ ] Should we encrypt database fields (PII like email, phone)?

---

### Q23: Should we implement rate limiting?

**Use Cases:**
- Prevent brute-force login attempts
- Limit API abuse (e.g., 1000 requests/second)
- Throttle file uploads

**Options:**
1. **No Rate Limiting in MVP:** Trust users, rely on Vercel limits
2. **Basic Rate Limiting:** Limit login attempts (5 per 15 minutes)
3. **Comprehensive Rate Limiting:** Limit all endpoints (Redis-based)

**Trade-offs:**
- No Rate Limiting: Simple MVP, but vulnerable to abuse
- Basic: Protects auth, minimal complexity
- Comprehensive: Most secure, but adds Redis dependency

**Current Decision:** **Option 2 (Basic Rate Limiting) for MVP**
- MVP: Limit login attempts (5 per 15 minutes per IP)
- Post-MVP: Add comprehensive rate limiting if abuse detected

**Open Questions:**
- [ ] Should rate limits be per-user or per-IP?
- [ ] How to handle legitimate high-traffic scenarios (e.g., coordinator bulk actions)?
- [ ] Should we show rate limit headers in API responses?

---

## Scaling Concerns

### Q24: How to handle multi-tenancy?

**Scenario:** 100 hospitals each run multiple programs. Should they share one database or separate?

**Options:**
1. **Single Database, Single Schema:** All hospitals in one database, filter by hospital ID
2. **Single Database, Schema per Tenant:** Each hospital gets a PostgreSQL schema
3. **Database per Tenant:** Each hospital gets a separate database

**Trade-offs:**
- Single Schema: Simplest, but risk of data leakage, hard to isolate performance
- Schema per Tenant: Better isolation, but complex migrations
- Database per Tenant: Best isolation, but expensive at scale

**Current Decision:** **Defer to Post-MVP**
- MVP: Single hospital (MAIA Biotech), no multi-tenancy
- Post-MVP: Likely Option 1 (single schema with hospital ID filter)

**Open Questions:**
- [ ] Should hospitals be able to see aggregated industry benchmarks?
- [ ] How to handle data residency requirements (e.g., EU hospitals)?
- [ ] Should pricing vary by hospital size (tiered plans)?

---

### Q25: How to handle high-traffic application deadlines?

**Scenario:** 500 applicants submit in the last hour before deadline. Can the system handle it?

**Current Capacity (Vercel Pro):**
- 1000 serverless function invocations/hour
- 100 GB bandwidth/month

**Potential Bottlenecks:**
- Database connection pool exhaustion
- Blob upload concurrency limits
- Serverless function cold starts

**Mitigation Strategies:**
- [ ] Add loading indicators and retry logic
- [ ] Increase connection pool size (Vercel Postgres)
- [ ] Pre-warm serverless functions before deadline
- [ ] Add queue system for async processing (BullMQ + Redis)

**Current Decision:** **Monitor in MVP, optimize if needed**
- MVP: No special handling, rely on Vercel scaling
- Post-MVP: Add queue system if traffic becomes issue

---

## AI Features

### Q26: Should we include AI-powered features in MVP?

**Proposed AI Features:**
1. **Applicant Clarity Coach:** Suggest rewrites for short answers
2. **Rubric Generator:** Draft rubric from program description
3. **Application Screening:** Flag weak applications for coordinator review

**Options:**
1. **No AI in MVP:** Focus on core functionality
2. **Guardrailed AI (MVP):** Rubric generator only (coordinator edits before use)
3. **Full AI Suite (Post-MVP):** All features with guardrails

**Trade-offs:**
- No AI: Simpler MVP, but less differentiation
- Guardrailed AI: Safe, useful, but requires OpenAI integration
- Full AI Suite: Most impressive, but risk of errors/bias

**Current Decision:** **Option 1 (No AI in MVP)**
- MVP: No AI features (avoid scope creep)
- Post-MVP: Add guardrailed rubric generator (phase 7-8)

**Open Questions:**
- [ ] Should AI features be opt-in (coordinator toggle)?
- [ ] How to handle AI errors (e.g., inappropriate suggestions)?
- [ ] Should we use OpenAI, Anthropic, or open-source models?
- [ ] How to ensure AI doesn't introduce bias in reviews?

---

### Q27: If we add AI, how to prevent auto-accept/reject?

**Guardrails:**
- [ ] AI never makes final decisions (human-in-the-loop)
- [ ] AI outputs are suggestions, always editable
- [ ] Coordinator explicitly confirms AI-generated content
- [ ] Audit log captures AI usage (which features, when)

**Implementation:**
```typescript
// Example: Rubric generator
const draftRubric = await generateRubric(programDescription); // AI

// Coordinator must review and approve
<RubricEditor initialValue={draftRubric} onSave={handleSave} />
```

**Current Decision:** **Strict guardrails if AI added post-MVP**

---

## Decision Log

Track decisions as they are made. Format:

| Date | Question | Decision | Rationale | Owner |
|------|----------|----------|-----------|-------|
| 2026-02-12 | Q1: Stage transitions | Automated + Manual | Balance flexibility and automation | Team |
| 2026-02-12 | Q5: Email system in MVP | No messaging in MVP | Focus on core pipeline | Team |
| 2026-02-12 | Q9: ORM choice | Drizzle ORM | Lighter runtime, SQL-like syntax | Team |
| 2026-02-12 | Q22: HIPAA compliance | No HIPAA claims for MVP | Avoid legal complexity, use synthetic data | Team |
| 2026-02-12 | Q26: AI in MVP | No AI in MVP | Avoid scope creep | Team |
| | | | | |

---

## How to Use This Document

**When Starting a Feature:**
1. Check if related ambiguity exists
2. Discuss with team if decision needed
3. Update "Current Decision" section
4. Add entry to Decision Log

**During Code Review:**
- Reference decisions in PR comments
- Challenge decisions if new info emerges
- Propose alternative if trade-offs change

**Weekly Review:**
- Revisit open questions
- Close resolved ambiguities
- Add new ambiguities discovered

---

## Contributing

Found a new ambiguity? Add it to this document:

1. Choose appropriate section (or create new)
2. Format as question: "Should we...?"
3. List options with trade-offs
4. Mark as "Open Questions" (checkboxes)
5. Discuss with team, update "Current Decision"

---

**This is a living document. Update as decisions are made and new ambiguities arise.**

---

**Document Maintained By:** MAIA Biotech Spring 2026 Team
**Last Review:** February 12, 2026
