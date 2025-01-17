from functools import cache

import joblib
from sklearn.neural_network import MLPClassifier


@cache
def load_model():
    model: MLPClassifier = joblib.load("../tune-logres/data/model.pkl")

    return model
