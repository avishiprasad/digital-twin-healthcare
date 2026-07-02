# 🧠 Digital Twin for Patient Treatment Simulation

An AI-powered healthcare decision support system that simulates multiple treatment options for a patient and predicts potential side effects using Machine Learning. The application allows healthcare professionals to compare different medications under the same patient profile and recommends the treatment with the lowest predicted risk.

## 🌐 Live Demo : digital-twin-healthcare.vercel.app

---

## 📌 Project Overview

A Digital Twin is a virtual representation of a real-world entity. In this project, a patient's clinical profile acts as the digital twin. Instead of prescribing a treatment directly, the system simulates multiple drug options and predicts the most likely side-effect category for each treatment.

The goal is to assist clinicians by providing AI-based insights before selecting a treatment.

---

## ✨ Features

- 👤 Patient Profile Builder
  - Age
  - Gender
  - Medical Condition
  - Dosage
  - Treatment Duration

- 💊 Multi-Drug Treatment Simulation
  - Compare multiple medications for the same patient
  - Predict side-effect category for each treatment

- 🤖 Machine Learning Prediction
  - Predicts the most probable side-effect category
  - Generates a relative risk score

- 📊 Treatment Comparison Dashboard
  - Compare all simulated drugs
  - Highlights the safest treatment option

- ✅ AI Recommendation Engine
  - Automatically recommends the treatment with the lowest predicted risk

- 🎨 Modern Responsive UI
  - Built using Next.js
  - Tailwind CSS
  - Interactive cards and risk visualization

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python

### Machine Learning
- Scikit-learn
- Random Forest
- Decision Tree
- Logistic Regression
- XGBoost

### Dataset
Healthcare Drug Dataset containing:

- Patient Age
- Gender
- Medical Condition
- Drug Name
- Dosage
- Treatment Duration
- Side Effects

---

## 🧠 Machine Learning Pipeline

### Data Preprocessing

- Data cleaning
- Label Encoding
- Feature Selection
- Train-Test Split

### Feature Engineering

Input Features:

- Age
- Gender
- Medical Condition
- Drug Name
- Dosage
- Treatment Duration

Target:

- Side Effect Category

To improve prediction performance, similar side effects were grouped into broader clinical categories such as:

- Gastrointestinal Issues
- Neurological Disturbances
- Skin Reactions
- Fatigue & Tiredness
- Low Blood Sugar
- Other

This reduced class imbalance and improved model performance.

---

## 📈 Models Evaluated

- Random Forest
- Decision Tree
- Logistic Regression
- XGBoost

Models were evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score

The best-performing model was selected for deployment.

---

## 🏗 Project Structure

```text
digital-twin/
│
├── backend/
│   ├── main.py
│   ├── rf_model.pkl
│   ├── encoders.pkl
│   ├── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│
└── README.md
```

---


## 🔄 Workflow

1. Enter patient information.
2. Select multiple treatment options.
3. Run treatment simulation.
4. Backend predicts side-effect category for each drug.
5. Risk scores are generated.
6. Treatments are compared.
7. The safest treatment is recommended.

---

## 📊 Evaluation Metrics

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix
- Feature Importance

---

## 🚀 Future Enhancements

- Integration with MIMIC-III clinical dataset
- Drug interaction prediction
- Electronic Health Record (EHR) integration
- Explainable AI (SHAP/LIME)
- PDF report generation
- Personalized dosage optimization
- Authentication for healthcare professionals

---

## 🎓 Learning Outcomes

- Machine Learning Pipeline
- Healthcare Analytics
- Classification Algorithms
- FastAPI Backend Development
- Next.js Frontend Development
- REST API Integration
- Full-Stack AI Application Development



## 📄 License

This project is developed for academic and educational purposes.
