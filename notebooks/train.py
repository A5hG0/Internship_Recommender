# # ==============================
# # Internship Recommendation - Word2Vec Model Training
# # ==============================

# import pandas as pd
# from gensim.models import Word2Vec
# import re

# # ==============================
# # 1. Load Dataset
# # ==============================
# # Example: your dataset might look like "internships.csv"
# # Columns: title, company, location, skills

# df = pd.read_csv(r"Z:\Python\Internship_Recommender\data\internship_finalP_dataset.csv")

# # ==============================
# # 2. Basic Cleaning Function
# # ==============================
# def clean_text(text):
#     """Lowercase and remove unwanted symbols"""
#     text = str(text).lower()
#     text = re.sub(r'[^a-zA-Z0-9\s,]', '', text)
#     return text.strip()

# # Apply cleaning to all text columns
# for col in ['Title', 'Company', 'Location', 'Skills']:
#     df[col] = df[col].apply(clean_text)

# # ==============================
# # 3. Convert Skills to List of Tokens
# # ==============================
# # Example: "Python, Machine Learning, TensorFlow"
# # → ['python', 'machine_learning', 'tensorflow']

# df['Skills'] = df['Skills'].apply(
#     lambda x: [s.strip().replace(' ', '_') for s in x.split(',') if s.strip()]
# )

# # ==============================
# # 4. Tokenize Other Columns
# # ==============================
# df['title_tokens'] = df['Title'].apply(lambda x: x.split())
# df['company_tokens'] = df['Company'].apply(lambda x: x.split())
# df['location_tokens'] = df['Location'].apply(lambda x: x.split())

# # ==============================
# # 5. Combine All Tokens for Context
# # ==============================
# # Each record becomes a "sentence" for Word2Vec
# df['combined_tokens'] = df.apply(
#     lambda row: row['title_tokens'] + row['company_tokens'] + row['location_tokens'] + row['Skills'],
#     axis=1
# )

# sentences = df['combined_tokens'].tolist()

# # ==============================
# # 6. Train Word2Vec Model
# # ==============================
# model = Word2Vec(
#     sentences=sentences,
#     vector_size=100,    # embedding dimension
#     window=3,           # context window size
#     min_count=1,        # include even rare skills
#     sg=1,               # 1 = skip-gram; 0 = CBOW
#     workers=4,          # parallel threads
#     epochs=30           # training iterations
# )

# # ==============================
# # 7. Save the Model
# # ==============================
# model.save(r"Z:\Python\Internship_Recommender\models\internship_word2vec.model")
# print("✅ Word2Vec model trained and saved as 'internship_word2vec.model'")

# # ==============================
# # 8. Example Usage
# # ==============================
# # Find most similar skills
# print("\nTop skills similar to 'python':")
# print(model.wv.most_similar('python', topn=5))

# # Get vector representation
# vector = model.wv['python']
# print("\nVector for 'python':", vector[:10], "...")  # show first 10 values




import pandas as pd
from gensim.models import Word2Vec
import re

# Load data
df = pd.read_csv(r"Z:\Python\Internship_Recommender\data\internship_finalP_dataset.csv")  # assuming column 'skills'

# Preprocess skills column
def clean_skills(skill_str):
    # Lowercase
    skill_str = str(skill_str).lower()
    # Remove unwanted chars
    skill_str = re.sub(r'[^a-zA-Z0-9, ]', '', skill_str)
    # Split by comma and strip whitespace
    skills = [s.strip() for s in skill_str.split(',') if s.strip()]
    return skills

df['skills_list'] = df['Skills'].apply(clean_skills)

# Prepare data for Word2Vec
sentences = df['skills_list'].tolist()

# Train Word2Vec
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)

model.save(r"Z:\Python\Internship_Recommender\models\internship_word2vec.model")
print("✅ Word2Vec model trained and saved as 'internship_word2vec.model'")

# Example: most similar skills to Python
print(model.wv.most_similar('python',topn=10))