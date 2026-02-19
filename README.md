# PolyDocs: Global Documentation Auto-Sync Platform

PolyDocs is an automated system that keeps your documentation synchronized with your codebase and localizes it into multiple languages using Lingo.dev.

## Features

- **Code Change Scanner:** Automatically detects modified source files in the repository.

## Project Structure

- `backend/`: Node.js + Express + TypeScript server.
  - `src/services/git.ts`: Git integration service.
  - `src/services/scanner.ts`: Logic to detect and filter file changes.
  - `src/controllers/scanController.ts`: API endpoint for triggering scans.
- `frontend/`: React + Vite + TypeScript dashboard with Tailwind CSS.
- `docs/`: Versioned multilingual documentation storage.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account
- Lingo.dev CLI (optional for now)
- Git installed and accessible in the system path.

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

### Key API Endpoints

- **GET /health**: Check backend status.
- **POST /api/scan**: Trigger a code change scan. Returns a list of modified files.

## Current Phase: Phase 3 (Documentation Compiler Engine) - COMPLETE

- **Phase 1 (Foundation):** Monorepo setup, basic backend/frontend, Supabase integration, Tailwind CSS.
- **Phase 2 (Scanner):** Git integration, file change detection, and scanner API.
- **Phase 3 (Compiler):** Documentation generation engine (mocked), versioned storage in `docs/`.
