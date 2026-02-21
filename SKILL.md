---
name: Assure — Pre-Execution Safety Layer
description: A real-time safety layer for production workflows that evaluates contextual risk at the moment of action and intervenes before high-risk operations are executed. Built with a Railway-first, free-tier-optimized stack.
---

# Assure — Project Blueprint & Skill File

## 🎯 1. Project Overview & Identity
Assure is a **prevention-first safety layer** for high-risk digital actions. It acts as "seatbelts for digital decisions," catching human errors at the last responsible moment.

- **Tagline**: *Seatbelts for digital decisions.*
- **Core Value Proposition**: Assure prevents costly human errors before they happen by inserting an intelligent pre-flight check into risky digital actions.

---

## 📋 2. Product Requirements Document (PRD)

### Purpose & Problem Statement
Despite mature CI/CD pipelines, outages are frequently caused by unsafe operational changes (misconfigurations, destructive commands, forced migrations). Existing tools are reactive; Assure is **proactive and contextual**.

### Goals & Success Metrics
- **Primary Goals**: Prevent high-risk actions, reduce change-related incidents, provide explainable risk feedback.
- **Success Metrics**: % of high-risk actions intercepted, CFR (Change Failure Rate) reduction, operator compliance.

### Non-Goals
- Replacing CI/CD or cloud guardrails.
- Fully autonomous blocking without human override.
- Primary focus on post-incident root cause analysis.

### Core User Flows
- **Flow A: Interception**: Action initiated → Assure intercepts → Risk evaluation → Block/Warn.
- **Flow B: Explanation**: Surfacing contributing factors (timing, history, flags).
- **Flow C: Guidance**: Recommending safer paths (dry runs, backups) + accountable override.

---

## 🏗️ 3. System Architecture

### High-Level Layers
1. **Interface Layer**: Web dashboard + CLI hooks.
2. **Control Plane**: Policy enforcement & intervention logic.
3. **Intelligence Layer**: Risk scoring (Rules + ML).
4. **Data Layer**: Event store, audit logs, metadata.
5. **Integration Layer**: Cloud/CI/CD connectors.
6. **Integrity Layer**: Blockchain-anchored audit hashes (Polygon/Sepolia testnets).

### Visual Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    INTERFACE LAYER                       │
│         Next.js Dashboard • CLI Hooks • Webhooks         │
└─────────────┬───────────────────────────┬───────────────┘
              ▼                           ▼
┌─────────────────────────┐   ┌──────────────────────────┐
│    CONTROL PLANE (API)   │   │     INTEGRITY LAYER      │
│    Node.js + Fastify     │   │     Polygon Testnet      │
│    Auth • Policies       │   │     Audit Anchoring      │
└─────────────┬───────────┘   └──────────────────────────┘
              │                           ▲
              ▼                           │
┌─────────────────────────────────────────┴───────────────┐
│                 INTELLIGENCE LAYER (Python)              │
│              FastAPI + scikit-learn + XGBoost            │
│    Risk Scoring • Anomaly Detection • SHAP Explainability│
└─────────────┬───────────────────────────────────────────┘
              │
      ┌───────┴───────┬──────────────┐
      ▼               ▼              ▼
┌──────────┐    ┌──────────┐    ┌──────────────┐
│PostgreSQL│    │  Redis   │    │    MLflow    │
│ (Railway)│    │ (Caching)│    │ (Exp/Models) │
└──────────┘    └──────────┘    └──────────────┘
```

---

## 🛠️ 4. Tech Stack (Railway-First, Free-Tier Optimized)

### Frontend
- **Framework**: Next.js (React) on Vercel
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: TanStack Query
- **Visualization**: Recharts / D3
- **Icons**: Lucide
- **Auth**: Clerk (Next.js integrated)

### Backend & API
- **Runtime**: Node.js on Railway
- **Framework**: Fastify (REST + Webhooks)
- **Validation**: Zod
- **Auth**: Clerk (OAuth 2.0 + JWT)
- **Feature Flags**: Unleash (OSS self-hosted on Railway)

### Intelligence Layer (Risk Engine)
- **Language**: Python (FastAPI service on Railway)
- **Libraries**: pandas, NumPy, scikit-learn, XGBoost, LightGBM
- **Anomaly Detection**: Isolation Forest
- **Explainability**: SHAP
- **Inference**: ONNX Runtime
- **Rules Engine**: Custom YAML/JSON policy engine

### Data Layer
- **Primary DB**: PostgreSQL (Railway free tier)
- **Cache/Queue**: Redis (Railway free tier)
- **ORM**: Prisma (OSS)
- **Integrity**: Polygon Amoy / Sepolia Testnet (ethers.js)

### DevOps & Observability
- **Platform**: Railway (Automated builds, no Docker required)
- **Monitoring**: Prometheus + Grafana (OSS)
- **Error Tracking**: GlitchTip (OSS alternative to Sentry)
- **Uptime**: Uptime Kuma

---

## 🔑 5. Core Features (Phased Roadmap)

### Phase 1 (MVP)
1. **CLI/Hook Interception**: Basic rule-based intervention.
2. **Explainable Warnings**: Human-readable risk scores.
3. **Audit Trail**: Basic Postgres logging + override history.
4. **Basic Dashboard**: Risk trends and prevented errors.

### Phase 2 (Intelligence)
1. **ML Risk Models**: Trained on historical failure patterns.
2. **Cryptographic Anchoring**: Merkle-batching hashes to Blockchain testnets for audit integrity.
3. **Richer Signals**: Integration with temporal (time) and human (experience/fatigue) signals.

---

## 📁 6. Project Structure

```
d:\FS\failfast\
├── .env                        # Credentials (not in git)
├── .env.local                  # Local development keys
├── SKILL.md                    # This blueprint
├── package.json
├── prisma/
│   └── schema.prisma           # User, Workflow, RiskEvent, AuditLog models
├── engine/                     # Python Risk Engine (FastAPI)
│   ├── main.py                 # Signal-based risk scoring + API
│   └── requirements.txt        # FastAPI, XGBoost, SHAP, scikit-learn
├── cli/                        # Assure CLI Tool
│   ├── package.json            # npm bin: "assure"
│   └── src/index.js            # check, guard, status, override commands
├── src/
│   ├── app/                    # Next.js Pages (App Router)
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout (Clerk + dark theme)
│   │   ├── demo/               # Interactive Simulation
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Overview (live stats + simulator)
│   │   │   ├── layout.tsx      # Sidebar + header
│   │   │   ├── workflows/      # Workflow management (CRUD)
│   │   │   ├── analytics/      # Recharts (risk trends + verdicts)
│   │   │   ├── audit/          # Forensic audit log + blockchain
│   │   │   └── settings/       # Engine config + toggles + flags
│   │   └── api/
│   │       ├── webhooks/clerk/ # Clerk user sync webhook
│   │       ├── events/         # SSE real-time updates endpoint
│   │       ├── health/         # Health check (Uptime Kuma compatible)
│   │       ├── metrics/        # Prometheus-compatible metrics
│   │       └── flags/          # Feature flags API
│   ├── components/
│   │   ├── risk-simulator.tsx  # Simulation → Engine → DB flow
│   │   ├── risk-dashboard.tsx  # Core risk visualization
│   │   ├── dashboard-client.tsx # Dashboard UI (animated)
│   │   ├── analytics-client.tsx # Recharts charts
│   │   ├── audit-client.tsx    # Audit table + anchor button
│   │   ├── navbar.tsx          # Top navigation
│   │   ├── hero.tsx            # Landing hero section
│   │   └── background-particles.tsx
│   ├── lib/
│   │   ├── actions.ts          # Server actions (Zod validated)
│   │   ├── blockchain.ts       # ethers.js keccak256 + on-chain anchor
│   │   ├── engine.ts           # Python engine bridge
│   │   ├── cache.ts            # Redis caching + rate limiter
│   │   ├── flags.ts            # Feature flags (local + Unleash)
│   │   ├── useRealtime.ts      # SSE React hook
│   │   └── db.ts               # Prisma singleton
│   └── middleware.ts           # Clerk Auth Protection
```

---

## 📝 7. Key Project Principles
1. **Prevent, don't just detect**: Inline enforcement is priority #1.
2. **Context over static policy**: Rules change based on timing (e.g., Friday deployments).
3. **Human-in-the-loop**: High risk requires verified human handshake.
4. **Premium Aesthetic**: Maintain the "Command Center" dark-mode visual excellence.
5. **Transparency**: Every risk verdict must be explainable (SHAP-inspired).
6. **Audit Integrity**: Blockchain-anchored logs (Tamper-evident).
