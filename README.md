# FabricLog

FabricLog is a portfolio-ready full-stack demo for a fabric and textile business. It showcases a polished SaaS-style dashboard for customers, fabric records, orders, invoices, and payment tracking while remaining completely public-safe.

## Highlights

- Next.js 16 App Router application with TypeScript
- English and Azerbaijani locale support
- Typed mock backend with route handlers under `src/app/api`
- Reusable dashboard UI with `shadcn/ui`, Tailwind CSS, TanStack Table, and Recharts
- Portfolio-safe fictional sample data only

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
- React Hook Form

## Project Structure

```text
src/
  app/
    [locale]/
      (marketing)/
      (app)/
    api/
  components/
    dashboard/
    data-table/
    forms/
    layout/
    navigation/
    shared/
    ui/
  features/
    customers/
    dashboard/
    fabrics/
    invoices/
    orders/
    payments/
  lib/
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

## Demo Principles

- No real customer or business information
- No secrets or production credentials
- No production database or external services
- All records are fictional and intentionally portfolio-safe

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

## Recommended Next Step

Add create/edit flows on top of the existing typed services and schemas, starting with orders and invoices.
