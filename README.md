# FabricLog

FabricLog is a bilingual, portfolio-ready SaaS demo for a fabric and textile business. It presents a polished internal operations workspace for customers, products, orders, invoices, payments, reports, and record detail views while remaining fully public-safe.

## Public Demo Safety

- All business records, customer profiles, invoices, payments, and activities are fictional sample data.
- The authentication flow is mock-only and uses one intentionally public demo account.
- No production credentials, third-party services, databases, or private APIs are required.
- This repository is designed to be safe for a public GitHub portfolio.

## Demo Credentials

These credentials are intentionally public and only power the mock sign-in flow:

- Email: `ayla@fabriclog.demo`
- Password: `FabricLog2026`

## Highlights

- Next.js 16 App Router application with TypeScript
- English and Azerbaijani locale support
- Mock data and service-layer architecture for a realistic product feel
- Localized auth, dashboard, list views, and dedicated detail pages
- Reusable design system built with `shadcn/ui`, Tailwind CSS, TanStack Table, and Recharts

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- `shadcn/ui`
- `next-intl`
- Zod
- TanStack Table
- Recharts

## Project Structure

```text
src/
  app/
    [locale]/
      (marketing)/
      (auth)/
      (app)/
    api/
  components/
    dashboard/
    data-table/
    layout/
    navigation/
    shared/
    ui/
  features/
    auth/
    customers/
    dashboard/
    invoices/
    orders/
    payments/
    products/
    reports/
    settings/
  lib/
    auth/
    constants/
    formatting/
    i18n/
  messages/
  server/
    demo-data/
    mappers/
    repositories/
    services/
  types/
public/
  brand/
  demo/
```

## Environment

No secrets are required for the public demo. A minimal [.env.example](./.env.example) is included to document that the app runs without runtime credentials.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## API Endpoints

- `/api/dashboard`
- `/api/customers`
- `/api/fabrics`
- `/api/orders`
- `/api/invoices`
- `/api/payments`

## Before Publishing

- Confirm the repo does not include local `.env` files or generated build output.
- Keep the mock demo credentials clearly labeled as public-demo-only values.
- Treat `/products` as the canonical catalog route; `/fabrics` is retained only as a compatibility redirect.

