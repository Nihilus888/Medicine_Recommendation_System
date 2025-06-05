import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack
from functools import lru_cache

# Load and prepare data
clean_df = pd.read_csv("data/Medicine_Details.csv")

# Initialize a single TF-IDF vectorizer instance
tfidf_vectorizer = TfidfVectorizer(stop_words='english')

# Fit the vectorizer on the combined corpus of all text fields to keep vocabulary consistent
combined_text = (
    clean_df['Uses'].astype(str) + " " +
    clean_df['Composition'].astype(str) + " " +
    clean_df['Side_effects'].astype(str)
)

tfidf_vectorizer.fit(combined_text)

# Transform each feature using the same vectorizer (to keep vocab consistent)
tfidf_matrix_uses = tfidf_vectorizer.transform(clean_df['Uses'].astype(str))
tfidf_matrix_composition = tfidf_vectorizer.transform(clean_df['Composition'].astype(str))
tfidf_matrix_side_effects = tfidf_vectorizer.transform(clean_df['Side_effects'].astype(str))

# Combine the feature matrices horizontally
tfidf_matrix_combined = hstack((
    tfidf_matrix_uses * 2.0,
    tfidf_matrix_composition * 1.0,
    tfidf_matrix_side_effects * 0.5
))

# Precompute the combined cosine similarity matrix (medicine-to-medicine)
cosine_sim_combined = cosine_similarity(tfidf_matrix_combined, tfidf_matrix_combined)

# ---------- Recommendation Functions ----------

def recommend_medicines_by_usage(medicine_name: str, top_n: int = 5) -> list[str]:
    """Recommend medicines similar based on 'Uses' field."""
    if medicine_name not in clean_df['Medicine Name'].values:
        suggestions = clean_df['Medicine Name'].str.contains(medicine_name[:3], case=False)
        return clean_df[suggestions]['Medicine Name'].head(top_n).tolist()

    index = clean_df[clean_df['Medicine Name'] == medicine_name].index[0]
    sim_scores = cosine_similarity(tfidf_matrix_uses, tfidf_matrix_uses[index]).flatten()
    similar_indices = sim_scores.argsort()[::-1][1:top_n+1]

    return clean_df.iloc[similar_indices]['Medicine Name'].tolist()



def recommend_medicines_by_symptoms(symptoms: list[str], top_n: int = 5) -> list[str]:
    """Recommend medicines based on symptom keywords."""
    symptom_str = ' '.join(symptoms)
    symptom_vector = tfidf_vectorizer.transform([symptom_str])

    sim_scores = cosine_similarity(tfidf_matrix_uses, symptom_vector).flatten()
    similar_indices = sim_scores.argsort()[::-1][:top_n]

    return clean_df.iloc[similar_indices]['Medicine Name'].tolist()

@lru_cache(maxsize=128)
def get_precomputed_similar(index: int, top_n: int = 5):
    sim_scores = cosine_sim_combined[index]
    top_indices = sim_scores.argsort()[::-1][1:top_n+1]
    return clean_df.iloc[top_indices]['Medicine Name'].tolist()