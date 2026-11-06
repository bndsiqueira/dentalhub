# DentalHub

Clinic management for small dental practices, the ones with two to five people still running on spreadsheets, paper and WhatsApp. The goal was a tool simpler than a spreadsheet.

**Status:** paused after the first phase. Accounts, patients, services and a super admin panel work. The calendar, sales pipeline and finance screens were planned but not built, and the app was never deployed.

## What works

- Sign-up creates a clinic and its owner in one transaction
- Email and password login with NextAuth v5 and bcrypt
- Patients: list, search, record page, create, edit and delete
- Services: create, edit, delete and active toggle
- Every query is scoped to the logged-in clinic
- Super admin panel with an overview of all clinics

## Stack

Next.js 16 (App Router, Server Actions), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma 7, PostgreSQL, NextAuth v5, Vitest and Testing Library.

## Run locally

You need Node.js and a PostgreSQL database.

```bash
cp .env.example .env    # fill in your values
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Then open http://localhost:3000 and create an account.

To create a super admin, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, then run `npx tsx prisma/seed.ts`.

## Tests

```bash
npm run test:run
```

## License

All rights reserved. The code is public for reference.
