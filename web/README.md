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

1. Import the GitHub repo in Vercel and set **Root Directory** to `web` (framework auto-detects as Next.js).
2. In the project's **Storage** tab, add **Upstash Redis** (Marketplace) and connect it. This injects
   `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which the waitlist API uses to store signups.
   Without it, signups fail in production (Vercel's filesystem is read-only).
3. Optional: set `NEXT_PUBLIC_FOUNDER_CALL_URL` and `NEXT_PUBLIC_HELPLINE_URL`. See `.env.example`.
4. Deploy. Locally, with no Redis env set, signups go to `.data/waitlist.json`.
