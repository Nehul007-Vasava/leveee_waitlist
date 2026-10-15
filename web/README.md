This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. **Create the database.** In a Supabase project, open **SQL Editor** and run
   `supabase/migrations/20261015000000_create_waitlist.sql` (or `supabase db push` with the CLI).
   It creates the `waitlist` table with row-level security on and no public access.
2. **Import the repo in Vercel** and set **Root Directory** to `web`.
3. **Set environment variables** (Production and Preview):
   - `SUPABASE_URL`: Project Settings → Data API
   - `SUPABASE_SECRET_KEY`: Project Settings → API Keys → secret key (`sb_secret_...`).
     The legacy `SUPABASE_SERVICE_ROLE_KEY` also works. Keep it server-only: never `NEXT_PUBLIC_`.
   - Optional: `NEXT_PUBLIC_FOUNDER_CALL_URL`, `NEXT_PUBLIC_HELPLINE_URL`. See `.env.example`.
4. **Deploy.** Without the Supabase variables, signups fail on Vercel with a visible error.

Signups show up in Supabase → **Table Editor → waitlist**, where you can filter and export to CSV.
`position` (place in line) is the row's rank by `seq`. Locally, with no Supabase variables set,
signups go to `.data/waitlist.json`.
