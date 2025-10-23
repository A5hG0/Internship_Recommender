import pandas as pd
import re

# ==============================
# 1. Load Dataset
# ==============================
# Example: your dataset might look like "internships.csv"
# Columns: title, company, location, skills

df = pd.read_csv("internships.csv")

# ==============================
# 2. Basic Cleaning Function
# ==============================
def clean_text(text):
    """Lowercase and remove unwanted symbols"""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s,]', '', text)
    return text.strip()

# Apply cleaning to all text columns
for col in ['title', 'company', 'location', 'skills']:
    df[col] = df[col].apply(clean_text)

# ==============================
# 3. Convert Skills to List of Tokens
# ==============================
# Example: "Python, Machine Learning, TensorFlow"
# → ['python', 'machine_learning', 'tensorflow']

df['skills'] = df['skills'].apply(
    lambda x: [s.strip().replace(' ', '_') for s in x.split(',') if s.strip()]
)

# ==============================
# 4. Tokenize Other Columns
# ==============================
df['title_tokens'] = df['title'].apply(lambda x: x.split())
df['company_tokens'] = df['company'].apply(lambda x: x.split())
df['location_tokens'] = df['location'].apply(lambda x: x.split())