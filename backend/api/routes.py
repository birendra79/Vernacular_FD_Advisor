from fastapi import APIRouter
from pydantic import BaseModel
from utils.llm import chat_with_llm, translate_to_language
import joblib
import pandas as pd
import os

router = APIRouter()

# Load Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'fd_model.pkl')
try:
    if os.path.exists(MODEL_PATH):
        dt_model = joblib.load(MODEL_PATH)
    else:
        dt_model = None
except Exception:
    dt_model = None

class ChatRequest(BaseModel):
    message: str
    language: str = "Hinglish"

class CalculateRequest(BaseModel):
    amount: float
    duration_months: int
    interest_rate: float

class RecommendRequest(BaseModel):
    amount: float
    duration_months: int
    risk_preference: str  # low, medium, high
    age: int = 30
    language: str = "Hinglish"

class TranslateRequest(BaseModel):
    text: str
    target_language: str

@router.post("/chat")
def handle_chat(req: ChatRequest):
    reply = chat_with_llm(req.message, req.language)
    return {"reply": reply}

@router.post("/translate")
def handle_translate(req: TranslateRequest):
    translated = translate_to_language(req.text, req.target_language)
    return {"translated_text": translated}

@router.post("/calculate")
def calculate_fd(req: CalculateRequest):
    # A = P(1 + r/100)^t
    # duration_months to years for t
    P = req.amount
    r = req.interest_rate
    t = req.duration_months / 12.0
    
    A = P * ((1 + r/100)**t)
    interest_earned = A - P
    
    return {
        "invested_amount": round(P, 2),
        "interest_earned": round(interest_earned, 2),
        "maturity_amount": round(A, 2)
    }

@router.post("/recommend")
def recommend_fd(req: RecommendRequest):
    # 1. Rule-based logic
    recommendation = ""
    reason = ""
    
    if req.age >= 60:
        recommendation = "Senior Citizen FD"
        reason = "Since you are a senior citizen, you get an extra 0.5% interest rate!"
    elif req.risk_preference == "low":
        recommendation = "SBI / Post Office FD"
        reason = "You prefer low risk, so government-backed schemes are the safest."
    elif req.duration_months < 12:
        recommendation = "Short-Term Flexi FD"
        reason = "For short durations under 1 year, flexi FDs offer better liquidity."
    elif req.amount > 500000 and req.risk_preference == "high":
        recommendation = "Corporate FD or Small Finance Bank FD"
        reason = "Higher amounts with a high risk appetite can yield much better returns in these banks."
    else:
        recommendation = "Standard Bank FD"
        reason = "A standard 1-year to 3-year FD suits your balanced profile."

    # 2. Simple ML-based logic (if model exists)
    ml_prediction = None
    if dt_model:
        try:
            risk_map = {"low": 0, "medium": 1, "high": 2}
            risk_val = risk_map.get(req.risk_preference.lower(), 1)
            
            features = pd.DataFrame([[req.amount, req.duration_months, risk_val, req.age]], 
                                    columns=["amount", "duration_months", "risk_level", "age"])
            pred = dt_model.predict(features)
            ml_prediction = pred[0]
        except Exception as e:
            print(f"ML Model prediction error: {e}")

    final_reason = reason
    if ml_prediction and ml_prediction != recommendation:
         final_reason += f" (Our ML AI model also suggests looking into: {ml_prediction})"
         
    # Translate if not Hinglish/English
    if req.language.lower() not in ["hinglish", "english"]:
        recommendation = translate_to_language(recommendation, req.language)
        final_reason = translate_to_language(final_reason, req.language)

    return {
        "recommendation": recommendation,
        "reason": final_reason,
        "ml_suggestion": ml_prediction
    }
