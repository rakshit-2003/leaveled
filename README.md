# LeaveLedger

> PTO request management and leave balance tracking for teams.

A full-stack web application where employees submit leave requests and managers approve or reject them — with real-time balance tracking, role-based access, and a clean dashboard.

**Live demo → https://leaveled.vercel.app** *(deploy URL — update after deployment)*

---

## Features

- Submit, cancel, and track leave requests
- Admin approval / rejection with review notes
- Leave balance tracking per type, per year
- Role-based access — Admin, Manager, Employee
- Team calendar showing upcoming approved leave
- Responsive, keyboard-navigable UI

## Tech Stack

Next.js 16 · TypeScript · PostgreSQL (Prisma 7) · Tailwind CSS · Auth.js · Neon · Vercel

## Quick Start

```bash
git clone https://github.com/you/leaveled && cd leaveled
cp .env.example .env        # fill in DATABASE_URL and AUTH_SECRET
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev                 # http://localhost:3000
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Session signing secret (32+ chars) |
| `NEXTAUTH_URL` | App base URL |

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@demo.com` | `Admin1234` |
| Employee | `demo@demo.com` | `Demo1234` |

## Architecture

- **Framework**: Next.js App Router — SSR, API routes, server actions in one repo
- **Auth**: Auth.js credentials provider with JWT sessions and RBAC middleware
- **Database**: PostgreSQL via Neon, Prisma ORM with migrations committed to git
- **UI**: Tailwind CSS + Radix UI primitives, sonner toasts, lucide icons

See `docs/architecture.md` for the full data model.

## License

MIT — see LICENSE
