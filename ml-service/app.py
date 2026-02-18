from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class URLItem(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"status": "Cyber Shield ML Service Running"}

@app.post("/predict")
def predict_phishing(item: URLItem):
    # Placeholder for ML model logic
    # In reality, this would load a trained model and features
    return {
        "url": item.url,
        "prediction": "safe", # manual mock
        "confidence": 0.95
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
