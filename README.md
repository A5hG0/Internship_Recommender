# Internify - AI-Powered Internship Recommender
### Hackathon-Ready Prototype | Full-Stack AI Application

A cutting-edge web application that matches students with internships using AI-powered resume analysis and intelligent ranking algorithms. Built with FastAPI, OpenAI embeddings, and a responsive modern frontend.

## 🚀 Features

- **Responsive Frontend**: Clean, modern UI with flashcard-style internship recommendations
- **AI-Powered Matching**: Uses OpenAI GPT for resume analysis and embeddings for similarity matching
- **Resume Parsing**: Supports PDF, DOC, and DOCX resume formats
- **Automated Scraping**: Hourly updates of internship data from various sources
- **Real-time Recommendations**: Get top 5 matched internships with match scores
- **Progress Bars**: Visual representation of match percentages
- **Mobile-Friendly**: Fully responsive design for all devices

## 📁 Project Structure

```
Internship_Recommender/
├── index.html              # Frontend HTML
├── style.css               # Frontend CSS styling
├── script.js               # Frontend JavaScript
├── backend.py              # FastAPI backend with AI integration
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── data/                  # Data directory
│   ├── internships.csv
│   └── internships_cleaned.csv
└── notebooks/             # Jupyter notebooks
    ├── data_cleaning.py
    └── Data_scraping.py
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8 or higher
- OpenAI API key
- Modern web browser

### Step 1: Clone and Setup

1. **Navigate to the project directory:**
   ```bash
   cd /Users/charan/Internship_Recommender
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv internify_env
   source internify_env/bin/activate  # On Windows: internify_env\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Step 2: OpenAI API Setup

1. **Get your OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

2. **Set up environment variable:**
   
   **Option A: Environment Variable (Recommended)**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key-here"
   ```
   
   **Option B: Direct in Code (For Testing)**
   - Edit `backend.py` line 47
   - Replace `"your-openai-api-key-here"` with your actual API key

### Step 3: Run the Application

1. **Start the backend server:**
   ```bash
   python backend.py
   ```
   
   The server will start on `http://localhost:8000`

2. **Open the frontend:**
   - Open `index.html` in your web browser
   - Or visit `http://localhost:8000/static/index.html`

## 🎯 How to Use

### For Users:

1. **Fill out the form:**
   - Enter your full name and email
   - Select your field of study
   - List your skills and interests (comma-separated)
   - Upload your resume (PDF, DOC, or DOCX)

2. **Get recommendations:**
   - Click "Get My Recommendations"
   - Wait for AI analysis (usually 10-30 seconds)
   - View your top 5 matched internships as flashcards

3. **Review results:**
   - Each card shows company, role, location, skills required
   - Match percentage is displayed as a progress bar
   - Click "Search Again" to try different criteria

### For Developers:

1. **API Endpoints:**
   - `POST /recommend` - Get internship recommendations
   - `GET /internships` - Get all available internships
   - `GET /health` - Health check endpoint

2. **Customization:**
   - Add more internship sources in `scraper._scrape_example_job_board()`
   - Modify AI prompts in `analyze_resume_with_gpt()`
   - Adjust similarity scoring in `compute_similarity_scores()`

## 🔧 Technical Details

### AI Integration

- **Resume Analysis**: Uses GPT-3.5-turbo to extract skills, experience level, and projects
- **Embeddings**: Uses OpenAI's text-embedding-ada-002 for vector representations
- **Similarity Matching**: Cosine similarity between user profile and internship embeddings

### Resume Parsing

- **PDF**: Uses PyPDF2 for text extraction
- **DOCX**: Uses python-docx for document parsing
- **Error Handling**: Graceful fallbacks for parsing errors

### Automated Scraping

- **Scheduler**: APScheduler runs every hour
- **Extensible**: Easy to add new job board sources
- **Deduplication**: Prevents duplicate internships

### Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Progress Animations**: Smooth progress bar animations
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Visual feedback during AI processing

## 🚨 Troubleshooting

### Common Issues:

1. **"OpenAI API Error"**
   - Check your API key is correct
   - Ensure you have sufficient OpenAI credits
   - Verify internet connection

2. **"Resume parsing failed"**
   - Ensure file is PDF, DOC, or DOCX format
   - Check file size is under 10MB
   - Try with a different resume file

3. **"No recommendations returned"**
   - Check backend logs for errors
   - Verify internship data is loaded
   - Try with different skills/field of study

4. **Frontend not loading**
   - Ensure backend is running on port 8000
   - Check browser console for errors
   - Try refreshing the page

### Debug Mode:

Enable debug logging by modifying `backend.py`:
```python
logging.basicConfig(level=logging.DEBUG)
```

## 🔮 Future Enhancements

- **User Accounts**: Save profiles and recommendation history
- **More Job Boards**: Integrate with LinkedIn, Indeed, Glassdoor
- **Advanced Filtering**: Filter by location, salary, company size
- **Email Notifications**: Alert users about new matching internships
- **Analytics Dashboard**: Track recommendation success rates
- **Mobile App**: Native iOS/Android applications

## 📊 Sample Data

The system comes with 12 pre-loaded internships from major companies:
- Google, Microsoft, Apple, Meta, Amazon
- Tesla, Netflix, Spotify, Airbnb, Stripe
- Uber, LinkedIn

Each includes realistic job descriptions, required skills, and locations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the backend logs
3. Create an issue in the repository

---

**Happy internship hunting! 🎓✨**