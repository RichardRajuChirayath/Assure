from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uvicorn
import random
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import numpy as np

app = FastAPI(title="Assure Risk Engine", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Simple ML Model Training ───────────────────────────────
# We simulate training on historical logs (Success/Failure patterns)
def train_model():
    # Features: [Is_Prod, Hour, Action_ID, Force_Flag]
    # Label: 0 (Safe), 1 (Risky)
    X = np.array([
        [1, 14, 0, 1], [1, 3, 0, 1], [0, 14, 1, 0], [1, 23, 1, 1],
        [0, 10, 0, 0], [1, 15, 2, 1], [0, 12, 1, 0], [1, 1, 0, 1]
    ])
    y = np.array([1, 1, 0, 1, 0, 1, 0, 1]) # 1 = High Probability of Failure
    
    model = RandomForestClassifier(n_estimators=10)
    model.fit(X, y)
    return model

ml_model = train_model()

# ─── Models ──────────────────────────────
class RiskRequest(BaseModel):
    action_type: str
    environment: str
    payload: dict = {}
    operator_id: str = "unknown"
    threshold: int = 70

class RiskResponse(BaseModel):
    risk_score: float
    verdict: str
    reasoning: list[str]
    signals: dict
    ml_confidence: float

# ─── Intelligence Logic ──────────────────────────────

def get_action_severity(action: str) -> float:
    dangerous = ["DATABASE_MIGRATION", "FORCE_DELETE", "ROOT_ACCESS", "SECRET_ROTATION"]
    return 40.0 if action in dangerous else 10.0

@app.get("/")
async def health():
    return {"status":"online","engine":"Assure AI v4.0","mode":"ML_ACTIVE"}

@app.post("/evaluate", response_model=RiskResponse)
async def evaluate(request: RiskRequest):
    signals = {}
    
    # 1. Temporal Signal (Friday afternoon logic)
    now = datetime.now()
    is_friday = now.weekday() == 4
    is_off_hours = now.hour > 14 or now.hour < 8
    signals["temporal"] = 25.0 if (is_friday and is_off_hours) else 0.0
    
    # 2. Environment Signal
    is_prod = 1 if request.environment.upper() == "PRODUCTION" else 0
    signals["environment"] = 20.0 if is_prod else 0.0
    
    # 3. Action Severity
    signals["action_severity"] = get_action_severity(request.action_type)
    
    # 4. Payload Signal
    force_flag = 1 if "--force" in str(request.payload) else 0
    signals["payload"] = 15.0 if force_flag else 0.0

    # 5. ML PREDICTION (The Real AI Part)
    action_map = {"DATABASE_MIGRATION": 0, "FORCE_DELETE": 1, "OTHER": 2}
    feat_action = action_map.get(request.action_type, 2)
    features = np.array([[is_prod, now.hour, feat_action, force_flag]])
    
    ml_prob = ml_model.predict_proba(features)[0][1] # Probability of failure
    ml_signal = ml_prob * 100
    
    # Synthesis
    base_score = sum(signals.values())
    final_score = (base_score * 0.6) + (ml_signal * 0.4)
    final_score = min(99.9, max(5.0, final_score + random.uniform(-2, 2)))

    # Reasoning Extraction
    reasons = []
    if is_prod: reasons.append("Targeting PRODUCTION environment")
    if is_friday and is_off_hours: reasons.append("Deployment outside safe temporal window (Friday Patch Rule)")
    if force_flag: reasons.append("Dangerous payload flags detected (--force)")
    if ml_prob > 0.7: reasons.append("AI Model cross-reference: High similarity to historical outages")

    # Verdict
    if final_score > request.threshold:
        verdict = "BLOCK"
    elif final_score > (request.threshold / 1.5):
        verdict = "WARN"
    else:
        verdict = "ALLOW"

    return RiskResponse(
        risk_score=round(final_score, 2),
        verdict=verdict,
        reasoning=reasons,
        signals=signals,
        ml_confidence=round(ml_prob, 2)
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
