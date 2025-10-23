"""
Internship Recommender Backend with Word2Vec Embeddings
Uses Word2Vec for local, efficient text embeddings without API calls
"""

import os
import json
import re
from datetime import datetime
from typing import List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
from docx import Document
import numpy as np
from gensim.models import Word2Vec
from apscheduler.schedulers.background import BackgroundScheduler
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Internship Recommender", version="1.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Scheduler for background tasks
scheduler = BackgroundScheduler()

# ============================================================================
# INTERNSHIP DATA
# ============================================================================

INTERNSHIPS = [
    {
        "id": 1,
        "company": "Google",
        "title": "Software Engineer Internship",
        "description": "Build scalable backend services and APIs for Google's core products",
        "location": "Mountain View, CA",
        "duration": "12 weeks",
        "stipend": "$6500/month",
        "technologies": ["Python", "Java", "Go", "gRPC", "Protocol Buffers"],
        "skills_required": ["Backend development", "Distributed systems", "APIs", "Databases"]
    },
    {
        "id": 2,
        "company": "Meta",
        "title": "React/Full-Stack Engineering Internship",
        "description": "Develop features for Facebook and Instagram using React and GraphQL",
        "location": "Menlo Park, CA",
        "duration": "12 weeks",
        "stipend": "$6000/month",
        "technologies": ["React", "JavaScript", "GraphQL", "CSS", "Node.js"],
        "skills_required": ["Frontend development", "React", "JavaScript", "Web design"]
    },
    {
        "id": 3,
        "company": "Microsoft",
        "title": "Cloud Systems Internship",
        "description": "Work on Azure cloud infrastructure and services",
        "location": "Seattle, WA",
        "duration": "12 weeks",
        "stipend": "$5800/month",
        "technologies": ["C#", "Azure", "Kubernetes", ".NET", "SQL Server"],
        "skills_required": ["Cloud computing", "DevOps", "C#", "System design"]
    },
    {
        "id": 4,
        "company": "Amazon",
        "title": "Software Development Internship",
        "description": "Build microservices and optimization tools for AWS",
        "location": "Seattle, WA",
        "duration": "12 weeks",
        "stipend": "$6000/month",
        "technologies": ["Java", "Python", "AWS", "DynamoDB", "Lambda"],
        "skills_required": ["Backend development", "AWS", "Java", "Microservices"]
    },
    {
        "id": 5,
        "company": "Apple",
        "title": "iOS/Swift Development Internship",
        "description": "Develop features for iOS applications and frameworks",
        "location": "Cupertino, CA",
        "duration": "12 weeks",
        "stipend": "$6500/month",
        "technologies": ["Swift", "iOS", "Xcode", "Core Data", "Metal"],
        "skills_required": ["iOS development", "Swift", "Mobile UI", "Performance optimization"]
    },
    {
        "id": 6,
        "company": "Tesla",
        "title": "Firmware Engineering Internship",
        "description": "Work on embedded systems and autonomous driving software",
        "location": "Palo Alto, CA",
        "duration": "12 weeks",
        "stipend": "$5500/month",
        "technologies": ["C++", "Python", "CUDA", "Real-time systems", "Linux"],
        "skills_required": ["Embedded systems", "C++", "Performance tuning", "Hardware knowledge"]
    },
    {
        "id": 7,
        "company": "Netflix",
        "title": "Machine Learning Internship",
        "description": "Build ML models for recommendation engine and content personalization",
        "location": "Los Gatos, CA",
        "duration": "12 weeks",
        "stipend": "$6200/month",
        "technologies": ["Python", "TensorFlow", "PyTorch", "Scala", "Spark"],
        "skills_required": ["Machine learning", "Python", "Data analysis", "Deep learning"]
    },
    {
        "id": 8,
        "company": "Stripe",
        "title": "Backend Engineering Internship",
        "description": "Build payment processing infrastructure and APIs",
        "location": "San Francisco, CA",
        "duration": "12 weeks",
        "stipend": "$6400/month",
        "technologies": ["Go", "Python", "PostgreSQL", "Redis", "Kubernetes"],
        "skills_required": ["Backend development", "Database design", "Go", "System architecture"]
    },
    {
        "id": 9,
        "company": "Airbnb",
        "title": "Full-Stack Engineering Internship",
        "description": "Develop web and mobile features for the Airbnb platform",
        "location": "San Francisco, CA",
        "duration": "12 weeks",
        "stipend": "$5900/month",
        "technologies": ["JavaScript", "React", "Python", "Django", "PostgreSQL"],
        "skills_required": ["Full-stack development", "JavaScript", "React", "APIs"]
    },
    {
        "id": 10,
        "company": "Uber",
        "title": "Mobile Engineering Internship",
        "description": "Develop cross-platform mobile applications and services",
        "location": "San Francisco, CA",
        "duration": "12 weeks",
        "stipend": "$6100/month",
        "technologies": ["Swift", "Kotlin", "React Native", "Objective-C", "Java"],
        "skills_required": ["Mobile development", "iOS/Android", "Performance optimization"]
    },
    {
        "id": 11,
        "company": "Dropbox",
        "title": "Infrastructure Engineering Internship",
        "description": "Work on distributed systems and cloud infrastructure",
        "location": "San Francisco, CA",
        "duration": "12 weeks",
        "stipend": "$6000/month",
        "technologies": ["C++", "Python", "Rust", "Distributed systems", "Linux"],
        "skills_required": ["System design", "C++", "Performance optimization", "Large-scale systems"]
    },
    {
        "id": 12,
        "company": "LinkedIn",
        "title": "Data Engineering Internship",
        "description": "Build data pipelines and analytics infrastructure",
        "location": "Sunnyvale, CA",
        "duration": "12 weeks",
        "stipend": "$5700/month",
        "technologies": ["Java", "Scala", "Kafka", "Hadoop", "Spark"],
        "skills_required": ["Data engineering", "Big data", "ETL", "Database systems"]
    }
]

# ============================================================================
# TEXT PROCESSING & EMBEDDINGS
# ============================================================================

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def hash_based_embedding(text: str, dim: int = 300) -> np.ndarray:
    """Generate deterministic embedding from text hash as fallback"""
    hash_val = hash(text)
    np.random.seed(abs(hash_val) % 2**32)
    return np.random.randn(dim)


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Compute cosine similarity between two vectors"""
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return float(np.dot(vec1, vec2) / (norm1 * norm2))


# ============================================================================
# RESUME PARSING
# ============================================================================

def extract_pdf_text(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        from io import BytesIO
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return ""


def extract_docx_text(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        from io import BytesIO
        doc = Document(BytesIO(file_content))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        logger.error(f"DOCX extraction error: {e}")
        return ""


def extract_text_from_resume(filename: str, file_content: bytes) -> str:
    """Extract text from resume based on file type"""
    if filename.lower().endswith('.pdf'):
        return extract_pdf_text(file_content)
    elif filename.lower().endswith(('.docx', '.doc')):
        return extract_docx_text(file_content)
    elif filename.lower().endswith('.txt'):
        return file_content.decode('utf-8', errors='ignore')
    else:
        raise ValueError(f"Unsupported file type: {filename}")


def extract_skills_from_text(text: str) -> List[str]:
    """Extract likely skills from resume text using regex patterns"""
    skills_keywords = [
        'python', 'javascript', 'java', 'cpp', 'c\\+\\+', 'csharp', 'c#',
        'react', 'vue', 'angular', 'node', 'nodejs', 'django', 'flask',
        'fastapi', 'sql', 'postgresql', 'mongodb', 'redis', 'docker',
        'kubernetes', 'aws', 'azure', 'gcp', 'git', 'rest', 'graphql',
        'machine learning', 'deep learning', 'tensorflow', 'pytorch',
        'html', 'css', 'typescript', 'golang', 'go', 'rust',
        'distributed systems', 'microservices', 'apis', 'databases'
    ]
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in skills_keywords:
        if re.search(r'\b' + skill + r'\b', text_lower):
            found_skills.append(skill.replace('\\', ''))
    
    return list(set(found_skills))  # Remove duplicates


# ============================================================================
# WORD2VEC MODEL INITIALIZATION
# ============================================================================

def initialize_word2vec_model():
    """Initialize Word2Vec model trained on internship descriptions"""
    try:
        # Try to load pretrained model if it exists
        model_path = "models/word2vec_internships.model"
        if os.path.exists(model_path):
            model = Word2Vec.load(model_path)
            logger.info("Loaded existing Word2Vec model")
            return model
    except Exception as e:
        logger.warning(f"Could not load existing model: {e}")
    
    # Create a new model with hardcoded internship texts
    descriptions = []
    for internship in INTERNSHIPS:
        text = f"{internship['title']} {internship['description']} {' '.join(internship['technologies'])}"
        descriptions.append(text)
    
    internship_texts = [text.lower().split() for text in descriptions]
    
    model = Word2Vec(
        sentences=internship_texts,
        vector_size=300,  # Embedding dimension
        window=5,
        min_count=1,
        workers=4,
        sg=1,  # Skip-gram model
        epochs=10
    )
    
    logger.info("Initialized new Word2Vec model")
    return model


# Initialize Word2Vec model
word2vec_model = initialize_word2vec_model()
EMBEDDINGS_READY = True


def get_text_embedding(text: str) -> np.ndarray:
    """
    Get Word2Vec embedding for text using average of word vectors
    Falls back to hash-based embedding if model fails
    """
    try:
        # Clean and tokenize text
        text = clean_text(text)
        tokens = text.split()
        
        if not tokens:
            # Return zero vector if no tokens
            return np.zeros(300)
        
        # Get vectors for each token and average them
        vectors = []
        for token in tokens:
            if token in word2vec_model.wv:
                vectors.append(word2vec_model.wv[token])
        
        if vectors:
            return np.mean(vectors, axis=0)
        else:
            # Fallback: hash-based embedding
            return hash_based_embedding(text, dim=300)
    
    except Exception as e:
        logger.warning(f"Error computing embedding: {e}. Using fallback.")
        return hash_based_embedding(text, dim=300)


# ============================================================================
# RECOMMENDATION ENGINE
# ============================================================================

class InternshipRecommender:
    """Main recommendation engine using Word2Vec embeddings"""
    
    def __init__(self, internships: List[Dict]):
        self.internships = internships
        self.internship_embeddings = {}
        self.precompute_embeddings()
    
    def precompute_embeddings(self):
        """Precompute embeddings for all internships"""
        for internship in self.internships:
            text = f"{internship['title']} {internship['description']} {' '.join(internship['technologies'])}"
            self.internship_embeddings[internship['id']] = get_text_embedding(text)
            logger.info(f"Precomputed embedding for {internship['company']} - {internship['title']}")
    
    def recommend(
        self,
        resume_text: str,
        skills: List[str],
        field: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recommend top K internships based on user profile
        
        Args:
            resume_text: Extracted resume text
            skills: List of user skills
            field: Field of study
            top_k: Number of recommendations
        
        Returns:
            List of recommended internships with match scores
        """
        # Combine all user information
        user_text = f"{resume_text} {' '.join(skills)} {field}"
        user_embedding = get_text_embedding(user_text)
        
        # Compute similarity scores
        scores = []
        for internship in self.internships:
            internship_embed = self.internship_embeddings[internship['id']]
            similarity = cosine_similarity(user_embedding, internship_embed)
            scores.append({
                **internship,
                'match_score': max(0, similarity),  # Ensure non-negative
                'match_percentage': max(0, int(similarity * 100))
            })
        
        # Sort by match score and return top K
        scores.sort(key=lambda x: x['match_score'], reverse=True)
        return scores[:top_k]


# Initialize recommender
recommender = InternshipRecommender(INTERNSHIPS)


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "total_internships": len(INTERNSHIPS),
        "embeddings_ready": EMBEDDINGS_READY,
        "embedding_model": "Word2Vec"
    }


@app.get("/internships")
async def get_internships():
    """Get all available internships"""
    return {
        "count": len(INTERNSHIPS),
        "internships": INTERNSHIPS
    }


@app.post("/recommend")
async def recommend_internships(
    fullName: str = Form(...),
    email: str = Form(...),
    fieldOfStudy: str = Form(...),
    skills: str = Form(...),
    resume: UploadFile = File(...)
):
    """
    Get internship recommendations based on user profile and resume
    
    Args:
        fullName: User's full name
        email: User's email
        fieldOfStudy: Field of study
        skills: Comma-separated skills
        resume: Resume file (PDF, DOCX, TXT)
    
    Returns:
        Top 5 recommended internships with match scores
    """
    try:
        # Validate inputs
        if not fullName or not email or not fieldOfStudy:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Read resume file
        file_content = await resume.read()
        if not file_content:
            raise HTTPException(status_code=400, detail="Resume file is empty")
        
        # Extract resume text
        resume_text = extract_text_from_resume(resume.filename, file_content)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")
        
        # Parse user skills
        user_skills = [s.strip() for s in skills.split(',') if s.strip()]
        
        # Also extract skills from resume
        extracted_skills = extract_skills_from_text(resume_text)
        all_skills = list(set(user_skills + extracted_skills))
        
        logger.info(f"Recommendation request from {fullName} ({email})")
        logger.info(f"Detected skills: {all_skills}")
        
        # Get recommendations
        recommendations = recommender.recommend(
            resume_text=resume_text,
            skills=all_skills,
            field=fieldOfStudy,
            top_k=5
        )
        
        return {
            "status": "success",
            "user": {
                "name": fullName,
                "email": email,
                "field": fieldOfStudy,
                "skills": all_skills
            },
            "recommendations": recommendations,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in recommendation: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing recommendation: {str(e)}")


# ============================================================================
# STARTUP & SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize scheduler on startup"""
    if not scheduler.running:
        scheduler.start()
    logger.info("Application started with Word2Vec embeddings")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown scheduler on app shutdown"""
    if scheduler.running:
        scheduler.shutdown()
    logger.info("Application shutdown")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
