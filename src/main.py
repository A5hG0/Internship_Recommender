import pandas as pd
import numpy as np
import pickle
from gensim.models import Word2Vec
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

# ------------------------------
# 1. Load trained Word2Vec model (trained on resumes)
# ------------------------------
model = Word2Vec.load(r'Z:\Python\Internship_Recommender\models\internship_word2vec.model')  # load using .model
print("Word2Vec model loaded from internship_word2vec.model")

# ------------------------------
# 2. Load internships dataset
# ------------------------------
data = pd.read_csv(r'Z:\Python\Internship_Recommender\data\internship_finalP_dataset_v2.csv')  # must have 'skills' column
print("Internship dataset loaded with", len(data), "internships.")

# ------------------------------
# 3. Convert internship skills to vectors
# ------------------------------
def get_vector(text):
    words = text.lower().replace(',', ' ').split()
    vecs = [model.wv[w] for w in words if w in model.wv]
    return np.mean(vecs, axis=0) if vecs else np.zeros(model.vector_size)

internship_vectors = np.array([get_vector(text) for text in data['Skills']])
print("Internship vectors shape:", internship_vectors.shape)

# ------------------------------
# 4. Save internship vectors
# ------------------------------
with open(r'Z:\Python\Internship_Recommender\models\internship_vectors.pkl', 'wb') as f:
    pickle.dump(internship_vectors, f)
print("Internship vectors saved to internship_vectors.pkl")

# ------------------------------
# 5. K-Means clustering on internships
# ------------------------------
num_clusters = 5
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
kmeans.fit(internship_vectors)
data['cluster'] = kmeans.labels_
print("Cluster assignments added to internships.")

# ------------------------------
# 6. Function to find internships similar to a given resume vector
# ------------------------------
# def find_similar_internships(resume_vector, topn=5):
#     sims = cosine_similarity(resume_vector.reshape(1,-1), internship_vectors)[0]
#     indices = sims.argsort()[::-1][:topn]
#     return data.iloc[indices][['Title']]

def find_similar_internships(resume_vector, topn=5): #Updated code
    sims = cosine_similarity(resume_vector.reshape(1, -1), internship_vectors)[0]
    indices = sims.argsort()[::-1]  # all indices sorted by similarity (descending)
    
    # Get unique titles in order of similarity
    seen_titles = set()
    unique_rows = []
    for i in indices:
        title = data.iloc[i]['Title']
        if title not in seen_titles:
            seen_titles.add(title)
            unique_rows.append(data.iloc[i])
        if len(unique_rows) == topn:
            break
    
    return pd.DataFrame(unique_rows)[['Title']]

# ------------------------------
# 7. Example: match first resume to internships
# ------------------------------
resume_vector = get_vector("javascript, react, c++")  # example resume skills
print("\nTop 5 internships matching the resume:")
print(find_similar_internships(resume_vector))