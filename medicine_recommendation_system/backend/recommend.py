import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack

# Load and prepare data
clean_df = pd.read_csv("data/Medicine_Details.csv") 


# TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')

# Create TF-IDF matrices for relevant features
tfidf_matrix_uses = tfidf_vectorizer.fit_transform(clean_df['Uses'].astype(str))
tfidf_matrix_composition = tfidf_vectorizer.fit_transform(clean_df['Composition'].astype(str))
tfidf_matrix_side_effects = tfidf_vectorizer.fit_transform(clean_df['Side_effects'].astype(str))

# Ensure consistent row count
min_rows = min(tfidf_matrix_uses.shape[0], tfidf_matrix_composition.shape[0], tfidf_matrix_side_effects.shape[0])
tfidf_matrix_uses = tfidf_matrix_uses[:min_rows]
tfidf_matrix_composition = tfidf_matrix_composition[:min_rows]
tfidf_matrix_side_effects = tfidf_matrix_side_effects[:min_rows]
clean_df = clean_df.iloc[:min_rows].reset_index(drop=True)

# Combine feature matrices
tfidf_matrix_combined = hstack((tfidf_matrix_uses, tfidf_matrix_composition, tfidf_matrix_side_effects))

# Combined similarity matrix
cosine_sim_combined = cosine_similarity(tfidf_matrix_combined, tfidf_matrix_combined)

# ---------- Recommendation Functions ----------

def recommend_medicines_by_usage(medicine_name: str, top_n=5):
    try:
        index = clean_df[clean_df['Medicine Name'] == medicine_name].index[0]
    except IndexError:
        return []

    sim_scores = cosine_similarity(tfidf_matrix_uses, tfidf_matrix_uses[index])
    sim_scores = sim_scores.flatten()
    similar_indices = sim_scores.argsort()[::-1][1:top_n+1]

    return clean_df.iloc[similar_indices]['Medicine Name'].tolist()


def recommend_medicines_by_symptoms(symptoms: list[str], top_n=5):
    symptom_str = ' '.join(symptoms)
    symptom_vector = tfidf_vectorizer.transform([symptom_str])

    sim_scores = cosine_similarity(tfidf_matrix_uses, symptom_vector).flatten()
    similar_indices = sim_scores.argsort()[::-1][:top_n]

    return clean_df.iloc[similar_indices]['Medicine Name'].tolist()



# ---------- Optional Save Model/Data ----------
# You can persist these with:
# joblib.dump(tfidf_vectorizer, 'tfidf_vectorizer.pkl')
# joblib.dump(tfidf_matrix_uses, 'tfidf_matrix_uses.pkl')

