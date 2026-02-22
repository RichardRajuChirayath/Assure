# 🛡️ Assure: Real-Time Safety Intelligence for DevOps

Assure is a production-grade safety engine designed to prevent catastrophic infrastructure failures, security breaches, and accidental data destruction. It uses a **Hybrid Deep Learning** approach to analyze DevOps commands and code changes in real-time.

---

## 🧠 Core Intelligence (Phase 3.5 Enterprise)

Assure is powered by a multi-model "Safety Ensemble" that reasons about risk across four distinct layers:

1.  **Neural Perception (CodeBERT)**: Uses Microsoft’s CodeBERT transformer to understand the mathematical intent of code tokens, detecting "masked" malicious intent that simple regex misses.
2.  **Graph Discovery (NetworkX)**: Models your entire infrastructure as a Directed Graph. It uses risk propagation to calculate the true **Blast Radius** of a command.
3.  **Explainable Forensics (SHAP)**: Uses Shapley Additive Explanations to provide human-readable breakdowns of every risk score.
4.  **Temporal & Fatigue Analysis**: A "Prophet" inspired forecaster that increases vigilance during high-fatigue windows (late nights/Friday afternoons).

---

## 📦 Project Structure

```bash
├── engine/             # Python-based Real-Intelligence Engine (BERT/XGBoost/GNN)
├── backend/            # Fastify API (JWT Auth, Risk Orchestration)
├── vscode-extension/   # VS Code Extension for real-time IDE safety
├── src/                # Next.js Dashboard & Analytics Frontend
└── prisma/             # Database Schema & Migrations
```

---

## 🚀 Production Deployment Guide

### 1. Engine (Python)
The engine requires a GPU (optional but recommended) or a multi-core CPU for the Transformers.
```bash
cd engine
pip install -r requirements.txt
python main.py
```
*Port: 8000*

### 2. Backend (Fastify)
Ensure your `.env` is configured with `DATABASE_URL` and `JWT_SECRET`.
```bash
cd backend
npm install
npm run build
npm start
```
*Port: 3001*

### 3. Frontend (Next.js)
```bash
npm install
npm run build
npm start
```
*Port: 3000*

---

## 🔐 Security & Env Configuration

**DO NOT** push `.env` files. Ensure you set the following in your environment:
- `JWT_SECRET`: Master signature for safety handshakes.
- `DATABASE_URL`: PostgreSQL/Prisma connection string.
- `ASSURE_API_URL`: URL where the backend is hosted.

---

## 🛠️ Community & Development

Developed for the future of Autonomous SRE. For local development, check out the `launch.json` in `.vscode`.

**License: MIT**
