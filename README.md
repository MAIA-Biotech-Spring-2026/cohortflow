# CohortFlow

**Healthcare Program Intake Management System**

> Replacing Forms + Spreadsheets + Email with proper workflow pipeline, RBAC, and audit logging

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=flat&logo=trpc&logoColor=white)](https://trpc.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**MAIA Biotech Spring 2026 Team Project**

## Overview

CohortFlow is a configurable intake pipeline designed for **university hospital volunteer, shadowing, and research programs** that run high-volume applicant funnels multiple times per year.

### The Problem

Most healthcare programs run on a fragile chain of:
- ❌ Form submissions
- ❌ Spreadsheet tracking
- ❌ Email threads and calendar coordination
- ❌ Shared drives with inconsistent permissions

### The Solution

CohortFlow provides:
- ✅ **Configurable Pipeline**: Stages, reviewer queues, rubrics, decisions
- ✅ **Reusable Applicant Profile**: Standard info + artifacts
- ✅ **Export Mapping**: Matches existing spreadsheet exactly
- ✅ **Trust Layer**: Roles, least privilege, audit log

### Core Wedge

**Switch without changing your spreadsheet** - Export mapping that matches the existing spreadsheet reduces switching risk to near zero.

## Target Users

### 👥 Three Personas

1. **Program Coordinator** (Economic buyer and champion)
   - Owns intake, assigns reviewers, finalizes decisions, exports roster

2. **Reviewer**
   - Reads, scores, and comments using a rubric

3. **Applicant**
   - Submits documents, answers prompts, tracks status

## Key Features

### 🔄 Workflow Engine
- Configurable stages and state transitions
- Pipeline board visualization
- Bulk actions and filtering

### 📊 Rubric Scoring
- Customizable evaluation criteria
- Aggregated review scores
- Reviewer consistency tracking

### 📤 Export Mapping
- Field-to-column mapping saved per program
- CSV export matches existing spreadsheet exactly
- One-click roster generation

### 🔒 Trust Layer
- **RBAC**: Applicant, Reviewer, Coordinator roles
- **Least Privilege**: Reviewers only access assigned submissions
- **Audit Log**: File uploads/downloads, stage changes, exports

### 📁 Secure File Handling
- Time-limited file URLs
- Logged access events
- "Who saw what" visibility for coordinators

## Real-World Workflows

### Workflow A: Volunteer Program Intake
**Cadence**: 2 cycles/year, 150-400 applicants per cycle

**Stages**:
1. Eligibility screen (affiliation, time commitment, availability)
2. Document check (resume, schedule, optional transcript/references)
3. Training and attestations (code of conduct, safety module)
4. Orientation scheduling (group sessions)
5. Placement and final roster
6. Onboarding checklist (badge, first shift)

### Workflow B: Shadowing Program
1. Eligibility and interest area
2. Department sponsor matching
3. Schedule constraints
4. Coordinator review
5. Policy acknowledgements
6. Final export

### Workflow C: Research Assistant Intake
1. Eligibility and interest
2. Statement and artifact review
3. Rubric scoring (fit, experience, availability)
4. Interview shortlist
5. Offer and acceptance
6. Onboarding checklist

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: High-quality component library

### Backend
- **tRPC**: End-to-end type-safe API
- **PostgreSQL**: Relational database
- **Drizzle ORM**: Type-safe database queries
- **Zod**: Runtime validation

### Infrastructure
- **Vercel**: Deployment and hosting
- **Vercel Postgres**: Managed database
- **Vercel Blob**: Secure file storage
- **NextAuth.js**: Authentication with RBAC

## Project Structure

```
cohortflow/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/        # Next.js App Router pages
│       │   ├── components/ # React components
│       │   ├── server/     # tRPC server
│       │   └── lib/        # Utilities
│       └── public/         # Static assets
├── packages/
│   ├── db/                 # Database schema and migrations
│   ├── auth/               # Authentication utilities
│   └── types/              # Shared TypeScript types
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone https://github.com/MAIA-Biotech-Spring-2026/cohortflow.git
cd cohortflow

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run database migrations
pnpm db:push

# Seed synthetic data
pnpm db:seed

# Start development server
pnpm dev
```

Visit http://localhost:3000

### Demo Accounts

```
Coordinator: coordinator@example.com / demo123
Reviewer:    reviewer@example.com    / demo123
Applicant:   applicant@example.com   / demo123
```

## MVP Roadmap (6-8 Weeks)

### Week 1: Foundation
- [x] Requirements and workflow templates
- [x] Wireframes and UI mockups
- [x] Synthetic dataset generation
- [ ] Auth system with 3 roles

### Week 2-3: Core Features
- [ ] Program builder and templates
- [ ] Applicant profile and submission
- [ ] File upload and secure storage
- [ ] Basic pipeline visualization

### Week 4: Review System
- [ ] Pipeline board with drag-and-drop
- [ ] Stage transitions and assignments
- [ ] Reviewer queue and rubric scoring
- [ ] Review aggregation

### Week 5: Export and Audit
- [ ] Export mapping configuration
- [ ] CSV export generation
- [ ] Audit log v1 (core events)
- [ ] File access tracking

### Week 6: Polish
- [ ] Demo narrative and script
- [ ] UI polish and responsive design
- [ ] Testing and bug fixes
- [ ] Presentation preparation

### Week 7-8: Optional
- [ ] Messaging log improvements
- [ ] Basic analytics dashboard
- [ ] AI template generation (guardrailed)
- [ ] Clarity coach for applicants

## Success Metrics

### Measurable Outcomes
- ⏱️ **Setup Time**: Under 30 minutes from template to open intake
- 💼 **Time Saved**: 25-50 hours per intake cycle for coordinators
- 🚀 **Faster Decisions**: Reduced days of delay
- 📊 **Reviewer Consistency**: Higher rubric completion rate
- 📤 **Export Parity**: CSV matches existing spreadsheet exactly

## Trust and Compliance

### Data Boundaries (Student MVP)
- ✅ Use synthetic applicant data only
- ✅ Do NOT store or process PHI
- ✅ Do NOT integrate with EHRs or hospital identity systems
- ✅ Do NOT claim HIPAA compliance

### Trust Layer (v1)
- **RBAC Roles**: Applicant, Reviewer, Coordinator
- **Least Privilege**: Reviewers access only assigned submissions
- **Audit Events**: File uploads/downloads, submissions, reviews, stage changes, exports

### Practical File Handling
- Time-limited file URLs
- Logged access events
- "Who saw what" visibility

## Optional AI Features (Guardrailed)

### Applicant Side
- Clarity coach for short answers (rewrite suggestions)
- Completeness checks (missing required fields)

### Coordinator Side
- Generate draft rubric from program description (editable)

### Rules
- ❌ AI never auto-accepts or auto-rejects
- ✅ AI outputs are suggestions and must be editable
- ✅ Human always makes final decisions

## Market Context

### Target Market
- **6,100 U.S. hospitals** (AHA)
- 2-5 programs per hospital
- $6,000/year per program

### Competitive Positioning
**CohortFlow is purpose-built for recurring program intake** where spreadsheet compatibility, reviewer workflows, and access visibility matter.

**The real incumbent**: Forms + Spreadsheets + Email + Shared Drive

**Adjacent tools**: Airtable, Notion (flexible but not purpose-built for reviewer pipelines)

## Contributing

This is a MAIA Biotech Spring 2026 team project. For questions or contributions:

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Check the [Project Board](https://github.com/MAIA-Biotech-Spring-2026/cohortflow/projects)
3. Open an issue or PR

## Documentation

- [Product Specification](./docs/PRODUCT_SPEC.md) - Full product requirements
- [Architecture](./docs/ARCHITECTURE.md) - Technical design decisions
- [API Reference](./docs/API.md) - tRPC API documentation
- [Database Schema](./docs/DATABASE.md) - Data models and relationships
- [Deployment Guide](./docs/DEPLOYMENT.md) - How to deploy to production

## License

MIT License - See [LICENSE](./LICENSE) for details

## Team

**MAIA Biotech Spring 2026**
- Project Lead: Caleb Newton
- Organization: [MAIA-Biotech-Spring-2026](https://github.com/MAIA-Biotech-Spring-2026)
- Program: USC MAIA (Multi-modal AI in Biotechnology)

---

**Built for the future of healthcare operations** 🏥
