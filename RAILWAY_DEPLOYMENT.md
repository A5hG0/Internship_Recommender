# 🚂 Railway Deployment Guide for Internify

## What is Railway?

**Railway** is a modern cloud platform that makes deployment incredibly simple. It:
- Auto-detects your project type (Python, Node, etc.)
- Builds and deploys automatically
- Provides PostgreSQL databases
- Handles SSL certificates automatically
- Costs only $5/month starting

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Push Code to GitHub
```bash
cd /Users/charan/Internship_Recommender-1

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Internify with Word2Vec"
git branch -M main
git remote add origin https://github.com/yourusername/Internship_Recommender.git
git push -u origin main
```

### Step 2: Connect to Railway
1. Go to **https://railway.app**
2. Click **"Create New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select **Internship_Recommender** repository
6. Click **"Deploy Now"**

### Step 3: Wait for Deployment
Railway will:
- ✅ Detect Python project
- ✅ Read `requirements.txt`
- ✅ Build Docker image (5-10 minutes)
- ✅ Deploy to live URL
- ✅ Show you the live app URL

### Step 4: Access Your App
```
Your app is now live at:
https://internship-recommender-prod.railway.app

(or whatever custom domain you configure)
```

---

## 🔧 Configuration Files (Already Created)

### `Dockerfile`
- Defines how to build your app
- Uses Python 3.11 slim image
- Installs dependencies
- Starts Gunicorn server

**Location:** `/Dockerfile`

### `railway.json`
- Configuration for Railway
- Tells Railway how to build and deploy

**Location:** `/railway.json`

### `.env.example`
- Template for environment variables
- Copy and modify in Railway dashboard

**Location:** `/.env.example`

### `.dockerignore`
- Files to exclude from Docker build (optimization)

**Location:** `/.dockerignore`

### `.gitignore`
- Files to exclude from Git

**Location:** `/.gitignore`

---

## 🌐 Detailed Setup Steps

### Prerequisites
- GitHub account (free)
- Railway account (free tier available)
- Git installed locally

### Step 1: Prepare Local Repository

#### Create .env file locally (optional for testing)
```bash
cp .env.example .env
# Edit .env if needed, but don't commit it
```

#### Verify structure
```bash
ls -la
# Should show:
# ✅ backend/
# ✅ frontend/
# ✅ requirements.txt
# ✅ Dockerfile
# ✅ railway.json
# ✅ .env.example
# ✅ .gitignore
# ✅ README.md
```

#### Test locally (optional)
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
cd backend
python3 -m uvicorn backend:app --reload
# Visit: http://localhost:8000/health
```

#### Commit everything
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Account

1. Visit **https://railway.app**
2. Click **"Start Free"**
3. Sign up with GitHub (easiest)
4. Authorize Railway
5. Complete setup

### Step 3: Create Railway Project

1. After login, click **"Create New Project"**
2. Choose **"Deploy from GitHub repo"**
3. Authorize Railway to access GitHub
4. Select your repository
5. Click **"Deploy"**

Railway will now:
- Detect it's a Python project
- Build the Docker image
- Deploy to a live URL
- Start your application

### Step 4: Monitor Deployment

1. Go to **"Deployments"** tab
2. Watch build logs:
   ```
   Building from Dockerfile...
   Installing Python dependencies...
   Starting application...
   ✅ Deployment successful!
   ```

3. Click the generated URL to access your app

### Step 5: Test Your Live App

```bash
# Get your Railway URL from dashboard
RAILWAY_URL="https://internship-recommender-prod.railway.app"

# Test health check
curl $RAILWAY_URL/health

# Test internships listing
curl $RAILWAY_URL/internships

# Test recommendations (with form data)
curl -X POST $RAILWAY_URL/recommend \
  -F "fullName=Test User" \
  -F "email=test@example.com" \
  -F "fieldOfStudy=Computer Science" \
  -F "skills=Python,Java" \
  -F "resume=@resume.txt"
```

---

## 🔐 Environment Variables on Railway

### Add Variables
1. Go to your Railway project dashboard
2. Click **"Variables"** tab
3. Click **"Add Variable"**
4. Enter key-value pairs

### Example Variables to Add

```
KEY                     VALUE
────────────────────────────────────────
DEBUG                   false
LOG_LEVEL               INFO
ALLOWED_ORIGINS         *
OPENAI_API_KEY          (leave empty - Word2Vec doesn't need it)
```

### Note
- `.env` file is NOT uploaded to Railway
- Use Dashboard to set production variables
- Railway provides variables as environment variables

---

## 📊 Monitoring Your Deployment

### View Logs
1. Go to Railway dashboard
2. Click your project
3. Click **"Logs"** tab
4. See real-time application logs

### Useful Log Messages
```
✅ Application startup complete
✅ Uvicorn running on http://0.0.0.0:8000
❌ ModuleNotFoundError - missing dependency
❌ Address already in use - port conflict
```

### Check Health
```bash
# Your Railway URL
curl https://your-app.railway.app/health

# Should return:
{
  "status": "healthy",
  "embedding_model": "Word2Vec",
  "total_internships": 12
}
```

---

## 🌍 Custom Domain (Optional)

### Add Custom Domain
1. Go to Railway project settings
2. Click **"Domains"**
3. Click **"Add Domain"**
4. Enter your domain (e.g., `internify.com`)
5. Railway generates DNS records
6. Update your domain DNS settings
7. Wait 5-15 minutes for propagation

### Example
```
Your Railway URL: https://internship-recommender-prod.railway.app
Your Custom URL:  https://internify.com
```

---

## 🔄 Continuous Deployment

### How It Works
1. Make changes locally
2. Commit to GitHub: `git push origin main`
3. Railway detects change
4. **Automatically rebuilds and deploys** ✨
5. Your app updates within 5-10 minutes

### Example Workflow
```bash
# Make changes
vim backend/backend.py

# Commit and push
git add backend/backend.py
git commit -m "Improve recommendation matching"
git push origin main

# Railway automatically:
# ✅ Detects change
# ✅ Builds new Docker image
# ✅ Deploys to production
# ✅ Zero downtime

# Check logs in Railway dashboard
```

---

## 💾 Add PostgreSQL Database (Optional)

If you want persistent storage:

1. In Railway dashboard, click **"+ Create Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway creates and configures PostgreSQL
4. Get connection string from **"Variables"** tab
5. Update `backend/backend.py` to use database

```python
from sqlalchemy import create_engine

# Get DATABASE_URL from Railway variables
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)
```

---

## 🚀 Scaling Up (When You Get Users)

### Default: 1 Container ($5/month)

### Scale to 2 Containers
```
Railway Dashboard → Project → Settings → Scaling
```

### Advanced: Multiple Regions
```
Railway → Add Service → Select Region
```

### Cost Scaling
```
1 Container:  $5/month   (~1K users/day)
2 Containers: $10/month  (~5K users/day)
4 Containers: $20/month  (~20K users/day)
```

---

## 🐛 Troubleshooting Railway Deployment

### Issue: "Build Failed"
**Solution:**
1. Check build logs in Railway
2. Verify all dependencies in `requirements.txt`
3. Check Python version (should be 3.11+)

### Issue: "Application Crashed"
**Solution:**
1. Check logs: Railway Dashboard → Logs
2. Look for errors
3. Fix and push to GitHub
4. Railway auto-redeploys

### Issue: "Module not found"
**Solution:**
```bash
# Add to requirements.txt
pip freeze > backend/requirements.txt

# Commit and push
git add backend/requirements.txt
git commit -m "Update dependencies"
git push origin main
```

### Issue: "API returns 500 error"
**Solution:**
1. Check Railway logs for error message
2. Test locally: `python -m uvicorn backend:app`
3. Fix locally, then push

### Issue: "Slow response time"
**Solution:**
1. Scale to 2 containers
2. Check logs for bottlenecks
3. Optimize Word2Vec model
4. Add caching with Redis

---

## 📋 Pre-Deployment Checklist

Before pushing to Railway:

- [ ] `requirements.txt` has all dependencies
- [ ] `Dockerfile` is in root directory
- [ ] `railway.json` is in root directory
- [ ] `.env.example` shows all variables
- [ ] `.gitignore` is configured
- [ ] Backend runs locally
- [ ] Frontend loads locally
- [ ] No hardcoded secrets in code
- [ ] Git repository initialized
- [ ] All files committed

---

## ✅ Post-Deployment Checklist

After Railway deployment:

- [ ] App URL is live
- [ ] Health check responds: `curl /health`
- [ ] Internships endpoint works: `curl /internships`
- [ ] Recommendations work: test with POST request
- [ ] Frontend loads properly
- [ ] No errors in Railway logs
- [ ] Environment variables set
- [ ] Custom domain configured (optional)

---

## 🎯 Next Steps After Deployment

### Week 1: Monitor
```
✅ Check logs daily
✅ Test all endpoints
✅ Monitor response times
✅ Collect user feedback
```

### Week 2-4: Optimize
```
✅ Add caching (Redis)
✅ Optimize queries
✅ Add analytics
✅ Setup alerts
```

### Month 2+: Scale
```
✅ Add database (PostgreSQL)
✅ Scale to 2 containers
✅ Add custom domain
✅ Setup monitoring
```

---

## 📚 Useful Links

### Railway Documentation
- [Railway Docs](https://docs.railway.app)
- [Python Deployment Guide](https://docs.railway.app/deploy/deployments)
- [Environment Variables](https://docs.railway.app/develop/variables)

### Related Guides
- FastAPI: https://fastapi.tiangolo.com
- Docker: https://docker.com
- Railway Support: https://railway.app/support

---

## 💡 Cost Breakdown

### Railway Pricing
```
Free Tier:        $5 credit/month
Standard Plan:    $5/month base + usage
Business Plan:    Custom pricing

Your Typical Cost:
- 1 Container:    $5/month
- PostgreSQL:     $15/month (optional)
- Total:          $20/month
```

### Cost Comparison (vs other platforms)
```
Platform        Free Tier    Paid Start    Reliability
────────────────────────────────────────────────────────
Railway         $5 credit    $5/month      Excellent
Heroku          1 dyno       $7/month      Good
Render          Free*        $7/month      Good
Vercel          -            $20/month     Excellent
AWS             1 year       $10/month     Excellent

*Free tier sleeps after 15 min inactivity
```

---

## 🎉 You're Ready!

Your Internify app is now deployment-ready for Railway.

### Quick Deploy
1. Push to GitHub
2. Go to railway.app
3. Deploy from repo
4. Done! ✨

### Support
- Check deployment logs if issues
- Email: support@railway.app
- Docs: docs.railway.app

**Happy deploying!** 🚂🚀
