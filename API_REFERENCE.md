# Internship Recommender API Reference

## Base URL
```
http://localhost:8000
```

---

## 🏥 Health Check Endpoint

### `GET /health`
Returns the health status of the application and embedding model.

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-23T10:24:46.894453",
  "total_internships": 12,
  "embeddings_ready": true,
  "embedding_model": "Word2Vec"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

## 📚 Get All Internships Endpoint

### `GET /internships`
Retrieves all available internships in the database.

**Request:**
```bash
curl http://localhost:8000/internships
```

**Response:**
```json
{
  "count": 12,
  "internships": [
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
    ...
  ]
}
```

**Status Codes:**
- `200 OK` - Internships retrieved successfully

---

## 🎯 Get Recommendations Endpoint

### `POST /recommend`
Returns personalized internship recommendations based on user profile and resume.

**Request Format:**
Multipart form data with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | Yes | User's full name |
| `email` | string | Yes | User's email address |
| `fieldOfStudy` | string | Yes | Field of study (e.g., "Computer Science") |
| `skills` | string | Yes | Comma-separated list of skills |
| `resume` | file | Yes | Resume file (PDF, DOCX, or TXT) |

**Example Request:**
```bash
curl -X POST http://localhost:8000/recommend \
  -F "fullName=John Smith" \
  -F "email=john.smith@example.com" \
  -F "fieldOfStudy=Computer Science" \
  -F "skills=Python,Java,AWS,Docker,Kubernetes" \
  -F "resume=@/path/to/resume.txt"
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "name": "John Smith",
    "email": "john.smith@example.com",
    "field": "Computer Science",
    "skills": [
      "python",
      "java",
      "aws",
      "docker",
      "kubernetes",
      "microservices",
      "react",
      "fastapi",
      "postgresql",
      "redis",
      "distributed systems",
      "apis"
    ]
  },
  "recommendations": [
    {
      "id": 8,
      "company": "Stripe",
      "title": "Backend Engineering Internship",
      "description": "Build payment processing infrastructure and APIs",
      "location": "San Francisco, CA",
      "duration": "12 weeks",
      "stipend": "$6400/month",
      "technologies": ["Go", "Python", "PostgreSQL", "Redis", "Kubernetes"],
      "skills_required": ["Backend development", "Database design", "Go", "System architecture"],
      "match_score": 0.6889932751655579,
      "match_percentage": 68
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
      "skills_required": ["Frontend development", "React", "JavaScript", "Web design"],
      "match_score": 0.6432170867919922,
      "match_percentage": 64
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
      "skills_required": ["Full-stack development", "JavaScript", "React", "APIs"],
      "match_score": 0.6184937357902527,
      "match_percentage": 61
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
      "skills_required": ["Backend development", "AWS", "Java", "Microservices"],
      "match_score": 0.6178224086761475,
      "match_percentage": 61
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
      "skills_required": ["System design", "C++", "Performance optimization", "Large-scale systems"],
      "match_score": 0.5826393365859985,
      "match_percentage": 58
    }
  ],
  "timestamp": "2025-10-23T10:25:14.396426"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "success" if recommendations found |
| `user` | object | User information with detected skills |
| `recommendations` | array | Top 5 recommended internships |
| `timestamp` | string | ISO 8601 timestamp of request |

**Recommendation Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `match_score` | float | 0-1 similarity score from Word2Vec |
| `match_percentage` | int | Percentage (0-100) for display |
| `technologies` | array | Tech stack for internship |
| `skills_required` | array | Required skills |

**Status Codes:**
- `200 OK` - Recommendations generated successfully
- `400 Bad Request` - Missing required fields or invalid file
- `500 Internal Server Error` - Server processing error

**Error Response Examples:**

Missing Fields:
```json
{
  "detail": "Missing required fields"
}
```

Invalid Resume:
```json
{
  "detail": "Could not extract text from resume"
}
```

---

## 📊 Understanding Match Scores

### What is match_score?
The `match_score` is a **semantic similarity score** computed by Word2Vec:
- **Range**: 0.0 to 1.0
- **0.0** = Completely different from user profile
- **1.0** = Perfect match with user profile
- **Typical Range**: 0.5 to 0.8

### What is match_percentage?
Simply `match_score × 100` for easy display:
- **60%** = 0.6 similarity
- **80%** = 0.8 similarity

### How is it Calculated?
```
User Profile Vector (300 dimensions)
         ↓
   Word2Vec Model
         ↓
Internship Vector (300 dimensions)
         ↓
Cosine Similarity = (vec1 · vec2) / (||vec1|| × ||vec2||)
         ↓
Result: match_score (0.0 - 1.0)
```

---

## 🔧 Supported Resume Formats

| Format | Extension | Status |
|--------|-----------|--------|
| PDF | `.pdf` | ✅ Supported |
| Word | `.docx` | ✅ Supported |
| Word Legacy | `.doc` | ✅ Supported |
| Plain Text | `.txt` | ✅ Supported |

---

## 🎓 Recognized Skills

The system automatically detects 40+ tech skills from resumes:

**Languages:**
`python`, `javascript`, `java`, `cpp`, `csharp`, `typescript`, `golang`, `go`, `rust`

**Frontend:**
`react`, `vue`, `angular`, `html`, `css`

**Backend:**
`node`, `nodejs`, `django`, `flask`, `fastapi`

**Databases:**
`sql`, `postgresql`, `mongodb`, `redis`

**Cloud & DevOps:**
`aws`, `azure`, `gcp`, `docker`, `kubernetes`

**Other:**
`rest`, `graphql`, `git`, `machine learning`, `deep learning`, `tensorflow`, `pytorch`, `microservices`, `distributed systems`, `apis`, `databases`

---

## 💾 Complete cURL Example

```bash
# Create test resume
cat > resume.txt << 'RESUME'
SOFTWARE ENGINEER - JOHN DOE
Experience: 3 years building Python microservices
Skills: Python, Java, AWS, Docker, Kubernetes, React, PostgreSQL
RESUME

# Get health
curl http://localhost:8000/health

# Get all internships
curl http://localhost:8000/internships | jq '.internships[0]'

# Get personalized recommendations
curl -X POST http://localhost:8000/recommend \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "fieldOfStudy=Computer Science" \
  -F "skills=Python,AWS,Docker" \
  -F "resume=@resume.txt" | jq '.recommendations[0]'
```

---

## 🚀 Performance Expectations

- **Response Time**: 5-15ms for recommendations
- **File Upload Size**: Up to 100MB
- **Resume Parsing Time**: 50-200ms depending on file size
- **Concurrent Requests**: Handles 100+ simultaneous requests

---

## 🔒 Security Considerations

- ✅ Input validation on all fields
- ✅ File type validation (PDF, DOCX, TXT only)
- ✅ Resume files not stored (processed in memory only)
- ✅ No API keys stored or transmitted
- ✅ CORS enabled for frontend access

---

## 📋 Troubleshooting

**Server returns 500 error:**
- Check server logs
- Verify resume file format is PDF, DOCX, or TXT
- Ensure all required fields are provided

**No recommendations returned:**
- Verify resume has extractable text
- Check skills are comma-separated
- Try simpler test resume

**Match percentages all very low:**
- Add more internships to database
- Increase Word2Vec epochs for better training
- Ensure resume has sufficient content

---

## 📚 Additional Resources

- Full technical guide: `WORD2VEC_GUIDE.md`
- Implementation summary: `IMPLEMENTATION_SUMMARY.md`
- Frontend code: `frontend/index.html`, `frontend/script.js`
- Backend code: `backend/backend.py`

---

**Last Updated:** October 23, 2025
**API Version:** 1.0
**Model:** Word2Vec (Skip-gram)
