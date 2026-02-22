<div align="center">
  <h1>PolyDocs</h1>
  <p><b>Global Documentation Auto-Sync Platform</b></p>

  <p>
    <img src="https://img.shields.io/badge/Gemini_AI-experimental-blue?style=flat-square&logo=google" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Lingo.dev-Localization-indigo?style=flat-square" alt="Lingo.dev" />
    <img src="https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Supabase-DB-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  </p>

  <p>
    <a href="#demo">▶️ Demo Video</a> • 
    <a href="http://localhost:5173">🌍 Live Dashboard</a> • 
    <a href="http://localhost:3001/health">🏥 Backend Health</a>
  </p>
</div>

---

### 🚀 Overview

**PolyDocs** is a state-of-the-art, automated system designed to keep your technical documentation in perfect sync with your evolving codebase. Leveraging **Gemini AI** for intelligent generation and **Lingo.dev** for high-fidelity localization, PolyDocs ensures your global users always have up-to-date documentation in their native language.

### ✨ Key Features

- 🔍 **Intelligent Scanner:** Automatically detects code changes and triggers doc updates.
- 🤖 **AI-Powered Generation:** Beautiful English documentation generated directly from your source.
- 🌍 **Native Localization:** Seamlessly translates docs into Spanish, French, and Japanese using Lingo.dev.
- 📦 **Docker Orchestrated:** One-command production deployment for the entire stack.
- 🛡️ **Premium Dashboard:** Real-time visibility into your documentation lifecycle and build status.

### 🏗️ Project Architecture

```mermaid
graph TD
    User([User]) --> Frontend[React Dashboard]
    Github[GitHub Webhooks] --> Backend[Express Server]
    Backend --> Supabase[(Supabase DB)]
    Backend --> Lingo[Lingo.dev AI]
    Backend --> Git[(Local Git Cache)]
    Frontend --> Backend
```

### 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, GSAP (Animations)
- **Backend:** Node.js, Express, TypeScript
- **Intelligence:** Google Gemini AI, Lingo.dev Engine
- **Storage:** Supabase (PostgreSQL + Auth)
- **Ops:** Docker, Docker Compose, Nginx

---

### 📦 Getting Started

#### Prerequisites

- Node.js (v18+) & Docker
- Supabase Account & Lingo.dev API Key

#### Installation

1. **Clone & Install:**

   ```bash
   git clone https://github.com/your-repo/polydocs.git
   cd polydocs
   npm install
   ```

2. **Configure:**
   Create `.env` files in `backend/` and `frontend/` using the provided `.env.example` templates.

3. **Deploy with Docker:**
   ```bash
   npm run docker:up
   ```

---

### 🏥 System Status

- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **API Server:** [http://localhost:3001](http://localhost:3001)
- **Health Check:** [http://localhost:3001/health](http://localhost:3001/health)

---

<div align="center">
  <p>Built with ❤️ • Powered by <b>PolyDocs Intelligence</b></p>
  <p>© 2026 PolyDocs Platform. All Rights Reserved.</p>
</div>
