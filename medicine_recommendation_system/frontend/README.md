# 🩺 Symptom-Based Medicine Recommendation System

This is an AI/ML-powered medicine recommendation system that suggests over-the-counter or general prescription medicines based on user-input symptoms. It uses **Flask** for the backend and **React** for the frontend. The recommendation engine is powered by **TF-IDF vectorization** and **cosine similarity** to find the most relevant medicines from a dataset.

---

## 🔍 Features

- 🔬 **Intelligent Recommendations** based on symptom keywords
- 🧠 **AI/ML Component** using Scikit-learn and NLP techniques
- 🎯 Suggests medicines with similar usage, composition, or side effects
- ⚛️ Clean and modern **React UI**
- 🚀 Fast response with real-time recommendations

---

## 🧠 How It Works

The backend uses the `Medicine_Details.csv` dataset and builds a model based on three key fields:
- `Uses`
- `Composition`
- `Side_effects`

It applies **TF-IDF vectorization** on these fields and computes **cosine similarity** to recommend the top N most relevant medicines.

Two primary recommendation modes:
1. `recommend_medicines_by_usage(medicine_name)`  
   → Returns medicines similar to the given one by use-case.

2. `recommend_medicines_by_symptoms(symptoms_list)`  
   → Returns medicines that match symptom-related keywords input by the user.

---

## 🧪 Technologies Used

| Layer         | Tech Stack                     |
|--------------|---------------------------------|
| Frontend     | React, MUI (Material-UI)        |
| Backend      | Flask, Scikit-learn, Pandas     |
| ML Technique | TF-IDF, Cosine Similarity       |
| Data         | CSV File (`Medicine_Details.csv`) |

---

## 🖥️ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

## 🔙 Backend Setup (Flask)
```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Next steps
Looking to deploy the frontend with netlify or vercel and the backend with Render.

## 📌 Notes
This is not a replacement for professional medical advice.

All medicine recommendations are based on text-based similarity, not clinical evaluation.

