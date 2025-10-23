from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from gensim.models import Word2Vec
import pandas as pd
import numpy as np
import pickle

app = FastAPI(title="Internship Recommender API")

# Allow frontend to connect (important)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://127.0.0.1:5500"] if you're using VSCode Live Server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Load Models and Data
# =========================
model = Word2Vec.load(r"Z:\Python\Internship_Recommender\models\internship_word2vec.model")
with open("internship_vectors.pkl", "rb") as f:
    internship_vectors = pickle.load(f)

data = pd.read_csv("internships.csv")

# =========================
# Helper Function
# =========================
def get_vector(text):
    if not isinstance(text, str) or not text.strip():
        return np.zeros(model.vector_size)
    words = text.lower().replace(",", " ").split()
    vectors = [model.wv[w] for w in words if w in model.wv]
    return np.mean(vectors, axis=0) if vectors else np.zeros(model.vector_size)

# =========================
# API Endpoint
# =========================
@app.get("/recommend")
def recommend(skill: str):
    query_vec = get_vector(skill)
    sims = np.dot(internship_vectors, query_vec) / (
        np.linalg.norm(internship_vectors, axis=1) * np.linalg.norm(query_vec)
    )

    data["similarity"] = sims
    top5 = (
        data.sort_values("similarity", ascending=False)
        .drop_duplicates(subset=["Title"])
        .head(5)
    )

    return {
        "query": skill,
        "recommended_internships": top5[["Title", "Company", "Location"]].to_dict(orient="records"),
    }

@app.get("/")
def root():
    return {"message": "Internship Recommender API is running!"}
