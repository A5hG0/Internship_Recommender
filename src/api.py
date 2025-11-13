# src/api.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import Optional
import numpy as np
import pandas as pd
import pickle
import logging

# Try to import gensim in a safe way
try:
    from gensim.models import KeyedVectors, Word2Vec
except Exception as e:
    KeyedVectors = None
    Word2Vec = None
    logging.exception("Failed to import gensim: %s", e)

BASE = Path(__file__).resolve().parent
MODEL_DIR = BASE / "models"
DATA_DIR = BASE / "data"

MODEL_PATH = MODEL_DIR / "internship_word2vec.model"
VECTORS_PATH = MODEL_DIR / "internship_vectors.pkl"
DATA_PATH = DATA_DIR / "internships.csv"

app = FastAPI(title="Internship Recommender API")

# Restrict CORS to your frontend domain (replace with your actual domain)
FRONTEND = "https://internifi.netlify.app"
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globals for lazy loading
_model = None
_internship_vectors = None
_data = None

def load_model():
    global _model
    if _model is not None:
        return _model

    if KeyedVectors is None and Word2Vec is None:
        raise RuntimeError("gensim is not available in the environment.")

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

    # Try to load KeyedVectors first (lighter)
    try:
        if KeyedVectors is not None:
            # KeyedVectors.load supports both keyed vectors and saved Word2Vec keyedvectors
            _model = KeyedVectors.load(str(MODEL_PATH))
        else:
            raise Exception("KeyedVectors not available")
    except Exception:
        # fallback to Word2Vec
        try:
            if Word2Vec is not None:
                _model = Word2Vec.load(str(MODEL_PATH))
            else:
                raise RuntimeError("Word2Vec not available")
        except Exception as ex:
            raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {ex}")

    return _model

def load_vectors():
    global _internship_vectors
    if _internship_vectors is not None:
        return _internship_vectors

    if not VECTORS_PATH.exists():
        raise FileNotFoundError(f"Vectors file not found at: {VECTORS_PATH}")

    with open(VECTORS_PATH, "rb") as f:
        _internship_vectors = pickle.load(f)

    # ensure numpy array
    _internship_vectors = np.asarray(_internship_vectors, dtype=float)
    return _internship_vectors

def load_data():
    global _data
    if _data is not None:
        return _data

    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Data CSV not found at: {DATA_PATH}")

    _data = pd.read_csv(DATA_PATH)
    return _data

def get_vector_from_text(model_obj, text: str) -> np.ndarray:
    """Return average vector for words present in model; safe for empty or OOV."""
    if not text or not isinstance(text, str):
        # return zero vector of correct size
        size = getattr(model_obj, "vector_size", None) or getattr(model_obj.wv, "vector_size", None)
        return np.zeros(size, dtype=float)

    text = text.lower().replace(",", " ")
    words = text.split()
    vecs = []
    # if we have keyed vectors: model_obj.key_to_index or model_obj.wv
    try:
        wv = model_obj if hasattr(model_obj, "key_to_index") else model_obj.wv
    except Exception:
        wv = model_obj  # best effort

    for w in words:
        if w in wv:
            vecs.append(wv[w])

    if not vecs:
        size = getattr(model_obj, "vector_size", None) or getattr(model_obj.wv, "vector_size", None)
        return np.zeros(size, dtype=float)

    return np.mean(vecs, axis=0)

def cosine_sim_matrix(vecs: np.ndarray, qvec: np.ndarray) -> np.ndarray:
    """Compute cosine similarity between each row in vecs and qvec safely."""
    if qvec is None or np.allclose(qvec, 0):
        # all zeros -> zero similarity
        return np.zeros((vecs.shape[0],), dtype=float)

    # compute norms
    vecs_norm = np.linalg.norm(vecs, axis=1)
    qnorm = np.linalg.norm(qvec)
    # avoid div by zero
    denom = vecs_norm * qnorm
    # where denom == 0 -> set denom to 1 to avoid inf; numerator will be 0
    denom_safe = np.where(denom == 0, 1.0, denom)
    numer = vecs.dot(qvec)
    sims = numer / denom_safe
    # clamp to [-1,1]
    sims = np.clip(sims, -1.0, 1.0)
    return sims

@app.get("/recommend")
def recommend(skill: Optional[str] = Query(..., min_length=1, description="Skill or query text")):
    """
    Recommend internships similar to the provided skill text.
    Example: /recommend?skill=python%20machine%20learning
    """
    try:
        model_obj = load_model()
        vectors = load_vectors()
        data = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    qvec = get_vector_from_text(model_obj, skill)
    sims = cosine_sim_matrix(vectors, qvec)

    # attach and return top 5
    data = data.copy()
    data["similarity"] = sims
    # ensure Title column exists
    if "Title" not in data.columns:
        raise HTTPException(status_code=500, detail="Data file missing 'Title' column")

    top5 = (
        data.sort_values("similarity", ascending=False)
        .drop_duplicates(subset=["Title"])
        .head(5)
    )

    results = top5[["Title", "Company", "Location", "similarity"]].to_dict(orient="records")
    return {"query": skill, "recommended_internships": results}

@app.get("/")
def root():
    return {"message": "Internship Recommender API is running!"}
