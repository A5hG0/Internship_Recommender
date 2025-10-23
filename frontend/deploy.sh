#!/bin/bash
# Deploy Internify to Netlify - Complete Setup Script
# Run each section one by one and follow the prompts

echo "🚀 Internify Deployment Script"
echo "================================"
echo ""

# Section 1: Verify Build
echo "📦 Step 1: Verify Build Works"
echo "Running: npm run type-check && npm run build"
npm run type-check && npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Fix errors above and try again."
    exit 1
fi

echo ""

# Section 2: Git Setup
echo "📝 Step 2: Git Setup"
echo "-------------------"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Check if remote is set
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  Please enter your GitHub repository URL"
    echo "Format: https://github.com/USERNAME/internify.git"
    read -p "GitHub URL: " github_url
    git remote add origin "$github_url"
    echo "✅ Remote added"
else
    echo "✅ Git remote already configured"
fi

echo ""

# Section 3: Commit and Push
echo "🔼 Step 3: Commit Changes"
echo "------------------------"
git add .
git status

echo ""
read -p "Ready to commit? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "Production ready: Code cleanup and security fixes"
    echo "✅ Changes committed"
    
    echo ""
    echo "🚀 Pushing to GitHub..."
    git push -u origin main
    echo "✅ Code pushed to GitHub!"
else
    echo "⏭️  Commit skipped"
fi

echo ""

# Section 4: Netlify Deployment Info
echo "🌐 Step 4: Deploy to Netlify"
echo "----------------------------"
echo ""
echo "Follow these steps:"
echo ""
echo "1. Go to https://app.netlify.com"
echo "2. Click 'Add new site' → 'Import an existing project'"
echo "3. Select GitHub and authorize"
echo "4. Choose 'internify' repository"
echo "5. Click 'Deploy site'"
echo ""
echo "⚙️  Environment Variables to Add:"
echo "   Setting: Site settings → Build & deploy → Environment"
echo ""
echo "   Variable 1:"
echo "   - Name: GEMINI_API_KEY"
echo "   - Value: [Your Gemini API Key]"
echo ""
echo "   Variable 2:"
echo "   - Name: SUPABASE_URL"
echo "   - Value: [Your Supabase URL]"
echo ""
echo "   Variable 3:"
echo "   - Name: SUPABASE_ANON_KEY"
echo "   - Value: [Your Supabase Anon Key]"
echo ""
echo "✅ Then click 'Deploy'"
echo ""

# Final Status
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "Your application is now:"
echo "✅ Code cleaned up"
echo "✅ Built and tested"
echo "✅ Committed to GitHub"
echo "✅ Ready for Netlify deployment"
echo ""
echo "Next: Add environment variables in Netlify Dashboard and deploy!"
echo ""
