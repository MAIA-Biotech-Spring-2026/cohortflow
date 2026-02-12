# CohortFlow Documentation

**Complete documentation for the CohortFlow healthcare program intake management system.**

---

## Quick Navigation

### For Product Understanding
- **[PRODUCT_SPEC.md](./PRODUCT_SPEC.md)** - Complete product specification
  - Problem statement, solution overview
  - User personas and workflows
  - Features, trust layer, market context
  - Roadmap and success metrics

### For Development
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and design decisions
  - System overview, tech stack rationale
  - Database design, API structure
  - Authentication, file handling, state machine
  - Security architecture, deployment patterns

- **[API.md](./API.md)** - Complete tRPC API reference
  - All procedures organized by resource
  - Input/output types with examples
  - Authentication requirements
  - Error handling and rate limiting

- **[DATABASE.md](./DATABASE.md)** - Database schema and queries
  - Complete schema with ER diagrams
  - Table definitions and relationships
  - Indexes, constraints, sample queries
  - Migration strategy and seeding

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Team development guide
  - Development setup instructions
  - Code style and conventions
  - Git workflow and PR process
  - Testing guidelines

### For Deployment
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
  - Environment variables setup
  - Local development with Docker
  - Vercel deployment steps
  - Database and file storage configuration
  - CI/CD pipeline, monitoring, troubleshooting

### For Decision Making
- **[AMBIGUITY.md](./AMBIGUITY.md)** - Open questions and decisions needed
  - Workflow and pipeline considerations
  - Feature prioritization trade-offs
  - Technical decisions and RBAC
  - Compliance, scaling, AI features
  - Decision log

---

## Documentation Structure

```
docs/
├── README.md              # This file (navigation guide)
├── PRODUCT_SPEC.md        # Product requirements (21 KB)
├── ARCHITECTURE.md        # Technical design (42 KB)
├── API.md                 # API reference (22 KB)
├── DATABASE.md            # Database schema (29 KB)
├── DEPLOYMENT.md          # Deployment guide (17 KB)
├── CONTRIBUTING.md        # Team guidelines (20 KB)
└── AMBIGUITY.md           # Open questions (27 KB)
```

**Total Documentation:** ~180 KB, ~3,500 lines

---

## Getting Started

### New Team Members
1. Read [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) - Understand the product
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the tech
3. Follow [CONTRIBUTING.md](./CONTRIBUTING.md) - Set up your dev environment
4. Review [AMBIGUITY.md](./AMBIGUITY.md) - Understand open decisions

### Implementing Features
1. Check [AMBIGUITY.md](./AMBIGUITY.md) for related decisions
2. Reference [API.md](./API.md) for endpoint patterns
3. Reference [DATABASE.md](./DATABASE.md) for schema
4. Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for code style

### Deploying
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) step-by-step
2. Set environment variables from the guide
3. Run migrations and seed data
4. Verify deployment checklist

---

## Key Concepts

### User Roles
- **Applicant:** Submits application, tracks status
- **Reviewer:** Evaluates applications, scores via rubric
- **Coordinator:** Manages program, assigns reviewers, exports roster

### Core Workflows
- **Workflow A:** Volunteer Program Intake (2 cycles/year, 150-400 applicants)
- **Workflow B:** Shadowing Program (3 cycles/year, 50-100 applicants)
- **Workflow C:** Research Assistant Intake (rolling, 20-50 applicants)

### Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** tRPC, Drizzle ORM, NextAuth.js
- **Infrastructure:** Vercel (hosting), Vercel Postgres (database), Vercel Blob (storage)

---

## Documentation Maintenance

### When to Update
- **PRODUCT_SPEC.md:** When requirements change
- **ARCHITECTURE.md:** When tech decisions made
- **API.md:** When endpoints added/modified
- **DATABASE.md:** When schema changes
- **DEPLOYMENT.md:** When deployment process changes
- **CONTRIBUTING.md:** When team conventions change
- **AMBIGUITY.md:** When decisions made or new questions arise

### How to Update
1. Edit the relevant markdown file
2. Update "Last Updated" date at the top
3. Commit with message: `docs: update [FILENAME] - [brief description]`
4. Open PR for team review (for major changes)

---

## Document Standards

### Formatting
- Use markdown headings (`#`, `##`, `###`)
- Include table of contents for long documents
- Use code blocks with syntax highlighting
- Add examples for complex concepts
- Link between related documents

### Code Examples
- Always include TypeScript types
- Show both good and bad examples when relevant
- Include comments for complex logic
- Use realistic data (not `foo`, `bar`)

### Diagrams
- ASCII art for simple diagrams
- Mermaid for ER diagrams and flowcharts
- Screenshots for UI examples (when available)

---

## External Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [Vercel Docs](https://vercel.com/docs)

### Learning Resources
- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [tRPC Quickstart](https://trpc.io/docs/quickstart)
- [Drizzle Getting Started](https://orm.drizzle.team/docs/get-started-postgresql)

---

## Questions or Feedback?

- **GitHub Issues:** Report bugs or suggest improvements
- **Team Chat:** Ask questions in real-time
- **Project Lead:** Reach out to Caleb Newton for major concerns

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-12 | Initial documentation created | MAIA Team |
| | | |

---

**Maintained By:** MAIA Biotech Spring 2026 Team
**Last Review:** February 12, 2026
