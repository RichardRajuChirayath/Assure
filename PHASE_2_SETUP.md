# Assure Phase 2 — Setup & Deployment Guide

This guide covers how to run the new, standalone Phase 2 architecture.

## 1. Prerequisites
- **Node.js**: v20+
- **Python**: v3.10+
- **Prisma**: Configured to your Neon Postgres database.

## 2. Component Setup

### A. Intelligence Layer (Python ML v2)
The risk engine now uses XGBoost and Isolation Forest.
```bash
cd engine
pip install -r requirements.txt
python main.py
```
*Port: 8000*

### B. Control Plane (Fastify Backend)
The standalone decision engine and policy store.
```bash
cd backend
npm install
# In a separate terminal or background
npx tsx src/index.ts
```
*Port: 3001*

### C. Assure CLI
Install the interceptor locally.
```bash
cd cli
npm install
npm link
```
**Usage:**
```bash
# Intercept a dangerous command
assure preflight "rm -rf some/dir" --env production
```

### D. GitHub Action
1. Copy `scripts/assure-gate.js` to your repository.
2. Add your `ASSURE_BACKEND_URL` to GitHub Action Secrets.
3. Add the workflow in `.github/workflows/assure-gate.yml`.

### E. Blockchain Anchoring
The Solidity contract is in `contracts/AssureAudit.sol`.
- Deploy it to **Polygon Amoy** using Remix or Hardhat.
- Update `backend` or `src/lib/blockchain.ts` with the new contract address.

## 3. Deployment (Railway First)
- **Backend & Engine**: Deploy both to Railway as separate services.
- **Redis**: Use Railway's Redis plugin for the backend's rate limiting and caching.
- **Frontend**: Keep Vercel for the Next.js dashboard, but point the API calls to your new Railway backend.

---

## 🚦 Phase 2 Verification Checklist
- [ ] `assure preflight` successfully calls Backend (3001) -> Engine (8000).
- [ ] Block verdicts (risk > 85) exit with code 1.
- [ ] Warn verdicts (risk > 50) prompt for human confirmation.
- [ ] All evaluations are persisted in Postgres with ML details.
