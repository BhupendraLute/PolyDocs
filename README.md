# PolyDocs: Global Documentation Auto-Sync Platform

PolyDocs is an automated system that keeps your documentation synchronized with your codebase and localizes it into multiple languages using Lingo.dev.

## Features

- **Auto-Sync:** Keeps documentation updated with every merge.
- **Multilingual:** Supports English, Spanish, French, and Hindi.
- **Code Protection:** Prevents code blocks and API signatures from being translated.
- **Versioned Docs:** Docs are treated as compiled artifacts tied to commit hashes.

## Project Structure

- `backend/`: Node.js + Express + TypeScript server.
- `frontend/`: React + Vite + TypeScript dashboard.
- `docs/`: Versioned multilingual documentation storage.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account
- Lingo.dev CLI

### Setup

1. Clone the repository.
2. Run `npm install` in the root (installs all workspace dependencies).
3. Create `.env` files in `backend/` and `frontend/` using the provided `.env.example` templates.
4. Set up your Supabase project and add credentials to the `.env` files.

### Running Locally

To run both backend and frontend simultaneously:

```bash
npm run dev
```

Individual components:

- Backend: `npm run dev:backend`
- Frontend: `npm run dev:frontend`

## Current Phase: Phase 1 (Foundation)

- Monorepo structure initialized.
- Backend (Express) and Frontend (React) scaffolded.
- Supabase connection ready.
- Basic health endpoint and UI shell.
