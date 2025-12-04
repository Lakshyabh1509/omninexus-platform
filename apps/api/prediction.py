from pydantic import BaseModel
import random

class PredictionRequest(BaseModel):
    user_id: str
    recent_activity_score: float
    market_segment: str

class PredictionResponse(BaseModel):
    engagement_probability: float
    recommended_action: str
    confidence_score: float

class EngagementModel:
    def __init__(self):
        # Load model weights here (mocked)
        pass

    def predict(self, data: PredictionRequest) -> PredictionResponse:
        # Simulate model inference logic
        base_prob = 0.5
        if data.market_segment == "Enterprise":
            base_prob += 0.2
        
        prob = min(max(base_prob + (data.recent_activity_score * 0.1), 0.0), 1.0)
        
        # Add some noise
        prob = round(prob + random.uniform(-0.05, 0.05), 2)
        
        action = "Retain" if prob > 0.7 else "Nurture" if prob > 0.4 else "Re-engage"
        
        return PredictionResponse(
            engagement_probability=prob,
            recommended_action=action,
            confidence_score=0.85 # As per specs
        )

model = EngagementModel()

def get_prediction(request: PredictionRequest):
    return model.predict(request)
