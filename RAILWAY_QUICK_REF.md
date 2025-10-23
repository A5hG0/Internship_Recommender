# 🚂 Railway Deployment Quick Reference Card

## One-Liner Deploy
```bash
# Assumes GitHub account, repo created, code committed
# Go to railway.app → Create Project → Deploy from GitHub → Select repo → Done ✨
```

---

## Essential Files Needed for Railway

| File | Purpose | Status |
|------|---------|--------|
| `Dockerfile` | Build instructions | ✅ Ready |
| `requirements.txt` | Python dependencies | ✅ Ready |
| `railway.json` | Platform config | ✅ Ready |
| `.env.example` | Env variables template | ✅ Ready |
| `.gitignore` | Git ignore rules | ✅ Ready |
| `.dockerignore` | Docker build optimization | ✅ Ready |

---

## Pre-Deploy Checklist (5 Minutes)

```bash
# 1. Verify git
cd /Users/charan/Internship_Recommender-1
git status  # Should be clean

# 2. Commit everything
git add .
git commit -m "Deploy: Internify with Word2Vec"

# 3. Push to GitHub
git push origin main

# Done! Now go to railway.app
```

---

## Deploy on Railway (3 Clicks)

1. **Login** → https://railway.app
2. **Create Project** → "Deploy from GitHub repo"
3. **Select** → Internship_Recommender
4. **Wait** → 8-15 minutes for deployment

---

## Test Deployment

```bash
# Replace with your Railway URL
RAILWAY_URL="https://internship-recommender-prod.railway.app"

# Test 1: Health Check
curl $RAILWAY_URL/health

# Should return: 
# {"status": "healthy", "embedding_model": "Word2Vec", "total_internships": 12}

# Test 2: Get Internships
curl $RAILWAY_URL/internships

# Should return: [{"id": 1, "company": "..."}, ...]

# Test 3: Visit Frontend
open $RAILWAY_URL
```

---

## After Deployment

| Task | Command |
|------|---------|
| Check logs | Railway Dashboard → Logs |
| Set variables | Railway Dashboard → Variables |
| Add domain | Railway Dashboard → Domains |
| Scale up | Railway Dashboard → Scaling |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check Railway logs for errors |
| App crashes | Check Railway logs → fix → git push → auto-redeploys |
| Port conflict | Already handled (uses $PORT env var) |
| Slow startup | Normal first time (5-10 min build) |
| 500 error | Check logs + test locally with `python -m uvicorn` |

---

## Important Details

**App Info:**
- Language: Python 3.11
- Framework: FastAPI
- Server: Gunicorn (4 workers)
- Port: 8000
- Model: Word2Vec (300D embeddings)

**Internships:** 12 pre-loaded tech companies
**Recommendation Engine:** Cosine similarity matching

**Cost:** $5/month (Railway free tier)

---

## Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/internships` | GET | List all internships |
| `/recommend` | POST | Get recommendations |
| `/` | GET | Frontend (HTML) |

---

## Directory Structure

```
/Users/charan/Internship_Recommender-1/
├── backend/
│   ├── backend.py          (FastAPI app)
│   ├── requirements.txt     (dependencies)
│   ├── main.py
│   └── config/
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── data/
│   └── internships_cleaned.csv
├── Dockerfile              (✅ for Railway)
├── railway.json            (✅ for Railway)
├── .env.example            (✅ env template)
├── .gitignore              (✅ git rules)
├── .dockerignore           (✅ docker optimization)
├── README.md
├── RAILWAY_DEPLOYMENT.md   (detailed guide)
└── DEPLOYMENT_CHECKLIST.md (verification)
```

---

## Example: Full Deployment

```bash
# Step 1: Prepare
cd /Users/charan/Internship_Recommender-1
git status

# Step 2: Commit
git add .
git commit -m "Ready for Railway deployment"

# Step 3: Push
git push origin main

# Step 4: Deploy
# Go to railway.app
# Click "Create New Project"
# Select "Deploy from GitHub repo"
# Choose "Internship_Recommender"
# Click "Deploy Now"
# Wait 8-15 minutes...

# Step 5: Test (replace URL with your Railway URL)
curl https://your-app.railway.app/health

# ✅ Success! App is live
```

---

## Continuous Deployment

After first deployment:
1. Make changes locally
2. `git push origin main`
3. Railway automatically rebuilds and deploys
4. App updates within 5-10 minutes

**No manual redeploy needed!** 🎉

---

## Environment Variables (in Railway Dashboard)

```
DEBUG              false
LOG_LEVEL          INFO
ALLOWED_ORIGINS    *
PORT               8000  (auto-set)
```

*(No OPENAI_API_KEY needed - using Word2Vec model)*

---

## Monitor Your App

```bash
# View logs in real-time
# Railway Dashboard → Your Project → Logs

# Common log messages:
# ✅ "Application startup complete"
# ✅ "Uvicorn running on http://0.0.0.0:8000"
# ❌ "ModuleNotFoundError" = missing dependency
# ❌ "Address already in use" = port conflict
```

---

## Useful Links

| Resource | Link |
|----------|------|
| Railway Home | https://railway.app |
| Railway Docs | https://docs.railway.app |
| FastAPI Docs | https://fastapi.tiangolo.com |
| Python Support | https://python.org |
| Gunicorn Docs | https://gunicorn.org |

---

## Status: ✅ READY TO DEPLOY

All files configured ✓
All dependencies documented ✓
Dockerfile optimized ✓
Git repository prepared ✓
Documentation complete ✓

**Next:** `git push` → Go to railway.app → Click deploy!

---

*Created for Internify Application*  
*Railway Deployment v1.0*  
*Last Updated: 2025*
