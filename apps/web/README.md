# CohortFlow Web Application

A modern Next.js 14 application for managing volunteer program applications with role-based access control.

## Features

- **Role-Based Access Control (RBAC)**: Three distinct user roles
  - Applicant: Submit and track applications
  - Reviewer: Evaluate applications using rubrics
  - Coordinator: Manage programs and oversee the entire process

- **Applicant Portal**
  - Dashboard with application status tracking
  - Profile management
  - Program browsing and application submission
  - Document upload

- **Reviewer Queue**
  - Assigned applications list
  - Rubric-based scoring interface
  - Review comments and recommendations
  - Performance statistics

- **Coordinator Dashboard**
  - Pipeline board (Kanban-style)
  - Program management
  - CSV export functionality
  - Audit log viewer
  - System-wide statistics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **API**: tRPC for type-safe API calls
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `NEXTAUTH_SECRET`: Generate a secure random string
- `NEXTAUTH_URL`: Your application URL (default: http://localhost:3000)

### Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

The application includes three demo accounts for testing:

1. **Applicant**
   - Email: `applicant@demo.com`
   - Password: any password works in demo mode

2. **Reviewer**
   - Email: `reviewer@demo.com`
   - Password: any password works in demo mode

3. **Coordinator**
   - Email: `coordinator@demo.com`
   - Password: any password works in demo mode

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── applicant/         # Applicant portal pages
│   ├── reviewer/          # Reviewer portal pages
│   ├── coordinator/       # Coordinator dashboard pages
│   ├── auth/              # Authentication pages
│   └── api/               # API routes (NextAuth, tRPC)
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   └── ...               # Application-specific components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── mock-data.ts      # Demo data
│   ├── trpc/             # tRPC client/server setup
│   └── utils.ts          # Helper functions
├── server/                # tRPC server
│   ├── routers/          # API route handlers
│   └── trpc.ts           # tRPC setup and middleware
└── types/                 # TypeScript type definitions
```

## Key Features Explained

### Authentication & RBAC

- NextAuth.js provides authentication
- JWT-based sessions
- Role-based middleware in tRPC protects API routes
- Demo mode allows any password for testing

### Type-Safe API with tRPC

- End-to-end type safety between client and server
- No need for API documentation
- Auto-completion in IDE
- Runtime validation with Zod

### Pipeline Management

- Kanban-style board for tracking applications
- Drag-and-drop support (ready for implementation)
- Real-time status updates
- Filterable by program

### Rubric-Based Reviews

- Configurable evaluation criteria
- Weighted scoring system
- Comments and recommendations
- Aggregated scores across reviewers

### Data Export

- CSV export for applications
- Configurable field mappings
- Includes applicant data, reviews, and documents metadata
- Privacy-compliant data handling

## Building for Production

```bash
npm run build
npm run start
```

## Type Checking

```bash
npm run type-check
```

## Notes

- Currently uses in-memory data storage (demo mode)
- Ready for database integration (Prisma recommended)
- File uploads are simulated (ready for real implementation)
- Designed for scalability and production deployment

## Future Enhancements

- Database integration (PostgreSQL + Prisma)
- Real file upload to cloud storage
- Email notifications
- Advanced analytics
- Multi-program application support
- Reviewer workload balancing
- Advanced search and filtering

## License

MIT
