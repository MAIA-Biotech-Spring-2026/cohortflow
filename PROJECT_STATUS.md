# CohortFlow - Project Status & Roadmap

**Last Updated:** February 12, 2026
**Project Stage:** Early Development (Phase 1)
**Target Launch:** End of Spring 2026 Semester

---

## Executive Summary

CohortFlow is a configurable intake pipeline system for university hospital volunteer, shadowing, and research programs. We're building a purpose-built alternative to the fragile chain of forms, spreadsheets, email, and shared drives that healthcare programs currently rely on.

### Key Metrics

- **Team Size:** MAIA Biotech Spring 2026 cohort
- **Sprint Velocity:** 2-week sprints
- **Timeline:** 6-8 weeks to MVP
- **Target Users:** Program coordinators, reviewers, applicants
- **Success Criterion:** Can replace existing intake workflows without changing output (spreadsheet export parity)

---

## What's Implemented ✅

### Phase 1: Foundation & Setup

- [x] **Project Repository** - GitHub repo with CI/CD ready
  - TypeScript + Next.js 14 configured
  - Turbo monorepo with pnpm workspaces
  - Drizzle ORM for database layer
  - tRPC for end-to-end type safety

- [x] **Database Infrastructure**
  - PostgreSQL schema designed with Drizzle ORM
  - Core tables: users, programs, applications, reviews, audit logs
  - Relationships and constraints defined
  - Migration system configured

- [x] **Authentication Scaffolding**
  - NextAuth.js integrated
  - OAuth providers ready (Google, GitHub)
  - Session management configured
  - Role-based access control (RBAC) framework defined

- [x] **Tech Stack Decisions**
  - Frontend: Next.js 14, React 18, Tailwind CSS, shadcn/ui
  - Backend: tRPC, PostgreSQL, Drizzle ORM
  - Infrastructure: Vercel for deployment, Vercel Blob for file storage
  - Auth: NextAuth.js with multiple providers

- [x] **Deployment Infrastructure**
  - Vercel setup ready
  - GitHub Actions CI/CD pipeline configured
  - Environment configuration files created
  - Production security headers configured

- [x] **Documentation**
  - README with feature overview
  - Project architecture documented
  - Database schema documented
  - Quick start guide created

### Phase 1: Planning & Requirements

- [x] **Product Specification** - Complete feature set defined
- [x] **Three User Personas** - Coordinator, Reviewer, Applicant
- [x] **Real-World Workflows** - Three sample intake pipelines documented
- [x] **Synthetic Data Generation** - Test dataset created for demos
- [x] **UI/UX Wireframes** - Key screens designed
- [x] **Data Export Mapping** - CSV export structure designed

---

## What's In Progress 🚧

### Phase 2: Core Features (Weeks 2-3)

- [ ] **Auth System Implementation**
  - Status: Partially complete
  - What's done: Session management, role-based middleware
  - What's needed: Login page, signup flow, password reset
  - Est. completion: End of Week 2

- [ ] **Program Builder**
  - Status: Schema designed, UI not started
  - What's needed:
    - Create program form
    - Stage configuration UI
    - Rubric builder interface
    - Field mapping configuration
  - Est. completion: End of Week 3

- [ ] **Applicant Profile & Submission**
  - Status: Schema designed, endpoints not implemented
  - What's needed:
    - Submission form builder
    - File upload to Vercel Blob
    - Form validation with Zod
    - Submission tracking
  - Est. completion: End of Week 3

### Phase 3: Review & Workflow (Weeks 4-5)

- [ ] **Pipeline Board Visualization**
  - Status: Not started
  - Technology: dnd-kit for drag-and-drop
  - Features: Kanban view, stage swimlanes, bulk actions
  - Est. completion: Week 4

- [ ] **Rubric Scoring Interface**
  - Status: Schema ready, UI pending
  - Features: Reviewer queue, scoring form, comment thread
  - Est. completion: Week 4

- [ ] **Review Aggregation**
  - Status: Data model designed, logic pending
  - Features: Average scoring, consistency metrics, decision workflow
  - Est. completion: Week 5

### Phase 4: Polish & Export (Weeks 5-6)

- [ ] **Export Mapping & CSV Generation**
  - Status: Data model designed
  - What's needed: Configuration UI, CSV export function
  - Est. completion: Week 5

- [ ] **Audit Log System**
  - Status: Schema designed, endpoints pending
  - Events to log: File uploads, submissions, reviews, exports, stage changes
  - Est. completion: Week 5

- [ ] **File Access Tracking**
  - Status: Concept defined
  - Features: Time-limited URLs, who viewed what
  - Est. completion: Week 6

---

## What's Planned 📋

### Phase 5: Optional Enhancements (Weeks 6-8)

- [ ] **Messaging & Collaboration**
  - Messaging log for applicant-coordinator conversations
  - Review comments threaded on applications
  - Notifications and digest emails

- [ ] **Analytics Dashboard**
  - Application completion rates
  - Reviewer consistency metrics
  - Time-to-decision tracking
  - Pipeline velocity analytics

- [ ] **AI Features (Guardrailed)**
  - Applicant clarity coach for short answers
  - Auto-generate rubric from program description
  - Completeness checks for required fields
  - *Note: AI never auto-accepts/rejects, suggestions only*

- [ ] **Advanced Workflows**
  - Conditional stage transitions
  - Bulk decision actions
  - Interview scheduling integration
  - Email notifications to applicants

- [ ] **Mobile-Friendly Interface**
  - Responsive design for tablets
  - Mobile app for reviewer queue
  - Mobile submission for applicants

### Phase 6: Post-Launch

- [ ] **HIPAA Compliance Features** (if needed)
  - Data encryption at rest
  - Audit log archival
  - Compliance reporting
  - *Note: MVP is NOT HIPAA compliant, synthetic data only*

- [ ] **Multi-Tenant Features**
  - Organization accounts
  - Team management
  - Shared program templates
  - Usage billing

- [ ] **Integration Ecosystem**
  - Calendar integration (scheduling)
  - Email integration (notifications)
  - Slack webhooks
  - API webhooks for custom workflows

---

## Known Issues 🐛

### Critical Issues

Currently none - project is in early development phase.

### Open Questions

1. **Authentication Providers**
   - Should we support institutional SSO (SAML)?
   - Google OAuth ready, but GitHub OAuth setup needed
   - Timeline: Decide by end of Week 2

2. **Rubric Flexibility**
   - Fixed criteria vs. flexible free-form scoring?
   - How many rubric versions per program?
   - Timeline: Design finalized by Week 3

3. **File Storage Limits**
   - Max file size? (Default: 50MB per file)
   - Max storage per program? (Default: 10GB)
   - Timeline: Configure before Week 3

### Design Decisions Needed

- [ ] Bulk action confirmation UX (modals vs. toast notifications)
- [ ] Pipeline board stage ordering (configurable vs. fixed)
- [ ] Export frequency limits (unlimited vs. throttled)
- [ ] Reviewer workload balancing (manual vs. auto-distribute)

---

## Next Steps 🎯

### This Week (Week 1)
- [x] Set up repository and deployment infrastructure
- [x] Create demo database with synthetic data
- [x] Configure CI/CD pipeline
- [ ] **Complete:** Auth system login/signup pages
- [ ] **Complete:** Program list page (read-only)

### Next Week (Week 2)
- [ ] Finish auth system (login, signup, password reset)
- [ ] Build program creation form
- [ ] Implement applicant submission form
- [ ] Set up file upload to Vercel Blob
- [ ] Begin pipeline board visualization

### Following Week (Week 3)
- [ ] Complete rubric builder UI
- [ ] Finish program configuration
- [ ] Implement stage transitions
- [ ] Build reviewer queue interface
- [ ] Add review scoring interface

### Week 4-5
- [ ] Implement review aggregation logic
- [ ] Build export mapping configuration
- [ ] Create CSV export functionality
- [ ] Implement audit log UI
- [ ] Build analytics dashboard

### Weeks 6-8
- [ ] Polish UI and fix bugs
- [ ] Performance optimization
- [ ] Security review
- [ ] Write API documentation
- [ ] Prepare demo and presentation

---

## Risk Assessment

### High Risks

1. **Scope Creep**
   - Risk: Feature requests expanding beyond MVP
   - Mitigation: Strict scope lock by end of Week 1
   - Owner: Project Lead

2. **Database Scalability**
   - Risk: Large datasets causing performance issues
   - Mitigation: Query optimization and indexing plan
   - Owner: Backend Lead

3. **File Upload Performance**
   - Risk: Large files and bulk uploads timing out
   - Mitigation: Streaming uploads, chunked processing
   - Owner: Backend Lead

### Medium Risks

1. **Authentication Complexity**
   - Risk: Role-based access control too permissive
   - Mitigation: Security audit before Week 3
   - Owner: Security Lead

2. **UI Consistency**
   - Risk: Component inconsistencies across pages
   - Mitigation: Implement component library standards
   - Owner: Design Lead

3. **Type Safety**
   - Risk: tRPC types diverging from runtime
   - Mitigation: Strict TypeScript validation
   - Owner: Architect

### Low Risks

1. **Library Version Conflicts** - Well-managed dependencies
2. **Deployment Issues** - Vercel handles most complexity
3. **Browser Compatibility** - Modern browsers only

---

## Success Criteria

### For MVP (End of Semester)

- [x] **Type Safety**: 100% TypeScript with strict mode
- [x] **Authentication**: 3 roles (Applicant, Reviewer, Coordinator)
- [ ] **Core Features**: All Phase 1-3 features working
- [ ] **Export Parity**: CSV matches existing spreadsheet exactly
- [ ] **Performance**: < 2s page load, < 100ms API response
- [ ] **Reliability**: 99% uptime in staging
- [ ] **Security**: All OWASP top 10 mitigations implemented
- [ ] **Documentation**: Complete API and deployment guides
- [ ] **Testable**: Demo with 3+ user accounts and workflows

### Quality Gates

All PRs must pass:
- TypeScript type checking (`pnpm type-check`)
- ESLint linting (`pnpm lint`)
- Build verification (`pnpm build`)
- Performance benchmarks (< 100ms API response)

---

## Technology Stack Status

### Frontend ✅ Confirmed

- **Next.js 14** - Installed, configured
- **React 18** - Installed, ready
- **TypeScript 5.3** - Strict mode enabled
- **Tailwind CSS 3.4** - Configured
- **shadcn/ui** - Component library ready
- **dnd-kit** - Drag-and-drop ready
- **React Hook Form** - Form handling
- **Zod** - Validation

### Backend ✅ Confirmed

- **tRPC 11** - Type-safe RPC configured
- **Next.js API Routes** - Ready for tRPC endpoints
- **PostgreSQL** - Via Vercel Postgres
- **Drizzle ORM 0.33** - Migrations configured
- **NextAuth.js 4.24** - Auth ready

### Infrastructure ✅ Confirmed

- **Vercel** - Deployment platform
- **Vercel Postgres** - Database hosting
- **Vercel Blob** - File storage
- **GitHub Actions** - CI/CD configured
- **pnpm** - Package manager

---

## Team Assignments

| Role | Owner | Status |
|------|-------|--------|
| Project Lead | Caleb Newton | In progress |
| Frontend Lead | TBD | Pending assignment |
| Backend Lead | TBD | Pending assignment |
| Design Lead | TBD | Pending assignment |
| DevOps/Infra | TBD | Pending assignment |
| Database | TBD | Pending assignment |

---

## Resources & References

### Documentation
- [Product Specification](./docs/PRODUCT_SPEC.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [NextAuth.js](https://next-auth.js.org)
- [Vercel Docs](https://vercel.com/docs)

### Demo & Presentation
- Demo Login: `coordinator@example.com` / `demo123`
- Demo Data: Seeded via `pnpm db:seed`
- Presentation Deck: TBD
- Demo Script: TBD

---

## Communication & Updates

### Daily
- **Standup**: Async in Slack with blockers and progress
- **Syncs**: Daily 15-min check-in (time TBD)

### Weekly
- **Sprint Planning**: Every Monday 10am
- **Sprint Review**: Every Friday 3pm
- **Retrospective**: Every Friday 4pm

### GitHub
- All work tracked in GitHub Issues and Projects
- PRs required for all code changes
- Code review by at least one team member
- All PRs must pass CI checks before merge

---

## Conclusion

CohortFlow is on track for a strong MVP launch by end of Spring 2026. The foundation is solid with a modern tech stack, clear requirements, and a focused team. The next phase is rapid feature development with quality gates to ensure we deliver a reliable, secure system that healthcare programs can trust.

**We're building for the future of healthcare operations.** 🏥

---

For questions or updates, contact the project lead or check the [GitHub Project Board](https://github.com/MAIA-Biotech-Spring-2026/cohortflow/projects).

Last updated: February 12, 2026
