
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from joblib import load
from pathlib import Path

# Initialize FastAPI
app = FastAPI(title="HealthCheckAI API")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
MODEL_PATH = (
    Path(__file__).parent
    / "healthcheckai_output"
    / "healthcheckai_model.joblib"
)

artifacts = load(MODEL_PATH)

vectorizer = artifacts["vectorizer"]
model = artifacts["classifier"]
labels = artifacts["labels"]


# Input format
class ClaimRequest(BaseModel):
    claim: str
    evidence: str


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "HealthCheckAI API is running",
        "model": "TF-IDF + LinearSVC"
    }


# Prediction endpoint
@app.post("/predict")
def predict(data: ClaimRequest):

    if not data.claim.strip():
        raise HTTPException(400, "Claim cannot be empty")

    if not data.evidence.strip():
        raise HTTPException(400, "Evidence cannot be empty")

    # Prepare input exactly as in your notebook
    combined_text = (
        f"Claim: {data.claim.strip()}\n"
        f"Evidence: {data.evidence.strip()}"
    )

    # TF-IDF transformation
    features = vectorizer.transform([combined_text])

    # Actual ML prediction
    prediction = model.predict(features)[0]

    # Calculate SVM decision margin
    scores = model.decision_function(features)[0]

    ranked = sorted(
        zip(model.classes_, map(float, scores)),
        key=lambda item: item[1],
        reverse=True
    )

    margin = ranked[0][1] - ranked[1][1]

    return {
        "prediction": str(prediction),
        "decision_margin": round(float(margin), 4),
        "claim": data.claim,
        "message": "Prediction generated using trained HealthCheckAI model",
        "mode": "live"
    }
