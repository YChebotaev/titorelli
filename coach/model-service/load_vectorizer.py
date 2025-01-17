from functools import cache
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib


@cache
def load_vectorizer():
    vectorizer: TfidfVectorizer = joblib.load("../tune-logres/data/tfidf-v.pkl")

    return vectorizer
