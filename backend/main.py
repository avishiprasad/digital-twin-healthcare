from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd

app = FastAPI()

# Allow frontend (Next.js) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later you can restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOAD MODEL + ENCODERS
# =========================
model = pickle.load(open("rf_model.pkl", "rb"))
encoders = pickle.load(open("encoders.pkl", "rb"))

le_gender = encoders["gender"]
le_condition = encoders["condition"]
le_drug = encoders["drug"]
le_side = encoders["side"]

# =========================
# ROOT API (TEST)
# =========================
@app.get("/")
def home():
    return {"message": "Digital Twin API is running 🚀"}

# =========================
# MAIN SIMULATION API
# =========================
@app.post("/simulate")
def simulate(data: dict):
    results = []

    for drug in data["drugs"]:
        try:
            # Encode inputs
            gender_enc = le_gender.transform([data["gender"]])[0]
            condition_enc = le_condition.transform([data["condition"]])[0]
            drug_enc = le_drug.transform([drug])[0]

            # Create DataFrame (IMPORTANT: same column names as training)
            input_df = pd.DataFrame(
                [[
                    int(data["age"]),
                    gender_enc,
                    condition_enc,
                    drug_enc,
                    int(data["dosage"]),
                    int(data["duration"])
                ]],
                columns=[
                    "Age",
                    "Gender",
                    "Condition",
                    "Drug_Name",
                    "Dosage_mg",
                    "Treatment_Duration_days"
                ]
            )

            # Prediction
            pred = model.predict(input_df)
            side_effect = le_side.inverse_transform(pred)[0]

            # Probability (risk score)
            prob = model.predict_proba(input_df).max()
            risk_score = round(float(prob * 100), 2)

            results.append({
                "drug": drug,
                "predicted_side_effect": side_effect,
                "risk_percentage": risk_score
            })

        except Exception as e:
            results.append({
                "drug": drug,
                "error": str(e)
            })

    return {"results": results}