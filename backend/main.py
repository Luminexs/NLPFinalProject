from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from inference import predict_review

app = FastAPI(title="Fake Review Detection API")

# Add CORS support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    probabilities: dict

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: ReviewRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        start_time = time.time()
        result = predict_review(request.text)
        latency = time.time() - start_time
        
        print(f"Prediction for '{request.text[:50]}...' took {latency:.3f}s")
        return result
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
