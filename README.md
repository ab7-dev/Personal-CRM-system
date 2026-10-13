# Personal CRM Monitor

A focused personal relationship manager for tracking contacts, recording interactions, and staying on top of follow-ups.

Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Highlights

- Manage personal and professional contacts with searchable profiles and lead, active, or inactive status.
- Record calls, emails, meetings, and other interactions against each contact.
- Create, complete, and review follow-up reminders from a central dashboard.
- See contact, interaction, and follow-up activity at a glance.
- Authenticate with Supabase and keep each user's data isolated with row-level security.

## Tech stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Forms and validation:** React Hook Form, Zod
- **Backend and auth:** Supabase, PostgreSQL, Row Level Security

## Run locally

### Prerequisites

- Node.js 20 or later
- A Supabase project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

In your Supabase project, open the SQL Editor and run [`database/schema.sql`](database/schema.sql). It creates the contacts, interactions, and reminders tables, along with their indexes and row-level-security policies.

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and begin adding contacts.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack. |
| `npm run lint` | Run ESLint checks. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production server after building. |

## Data model

The app stores three user-owned resources:

- **Contacts** — people, companies, relationship status, and notes.
- **Interactions** — dated calls, emails, meetings, and other touchpoints.
- **Reminders** — scheduled follow-up tasks tied to a contact.

Each table is protected by Supabase Row Level Security so users can only access their own records.

## Project structure

```text
app/          Routes and pages
components/   Reusable interface components
actions/      Server-side data and authentication actions
database/     Supabase schema and security policies
lib/          Supabase clients and shared utilities
validations/  Zod schemas for form data
```
