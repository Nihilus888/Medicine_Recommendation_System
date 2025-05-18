import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack

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
tfidf_matrix_combined = hstack((tfidf_matrix_uses, tfidf_matrix_composition, tfidf_matrix_side_effects))

# Precompute the combined cosine similarity matrix (medicine-to-medicine)
cosine_sim_combined = cosine_similarity(tfidf_matrix_combined, tfidf_matrix_combined)

# ---------- Recommendation Functions ----------

def recommend_medicines_by_usage(medicine_name: str, top_n: int = 5) -> list[str]:
    """Recommend medicines similar based on 'Uses' field."""
    try:
        index = clean_df[clean_df['Medicine Name'] == medicine_name].index[0]
    except IndexError:
        return []

    # Similarity of all medicines to the given medicine by 'Uses'
    sim_scores = cosine_similarity(tfidf_matrix_uses, tfidf_matrix_uses[index])
    sim_scores = sim_scores.flatten()
    similar_indices = sim_scores.argsort()[::-1][1:top_n+1]

    return clean_df.iloc[similar_indices]['Medicine Name'].tolist()


def recommend_medicines_by_symptoms(symptoms: list[str], top_n: int = 5) -> list[str]:
    """Recommend medicines based on symptom keywords."""
    symptom_str = ' '.join(symptoms)
    symptom_vector = tfidf_vectorizer.transform([symptom_str])

    sim_scores = cosine_similarity(tfidf_matrix_uses, symptom_vector).flatten()
    similar_indices = sim_scores.argsort()[::-1][:top_n]

    return clean_df.iloc[similar_indices]['Medicine Name'].tolist()