from functools import cache

import joblib
import numpy
from razdel import tokenize
from navec import Navec
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import confusion_matrix, classification_report
from load_data import load_data

nv = Navec.load('data/navec_hudlit_v1_12B_500K_300d_100q.tar')

def vectorize_text(text):
    vector = numpy.full(100000, 0)
    tokens = tokenize(text)
    i = 0

    for t in tokens:
        word = str(t.text).lower()

        emb = nv.get(word)

        if emb is None:
            i += 1
            continue

        for e in emb:
            vector[i] = e
            i += 1

    return vector

@cache
def get_train_test():
    return train_test_split(
        load_data()[0],
        load_data()[1],
        random_state=42,
        test_size=0.2
    )

def train():
    x_train, x_test, y_train, y_test = get_train_test()

    feats_train = [vectorize_text(text) for text in x_train]

    model = MLPClassifier(
        activation='relu',
        solver='adam',
        alpha=7.5,
        max_iter=80, # 500
        random_state=42
    )

    model.fit(feats_train, y_train)

    return model

def validate(model: MLPClassifier):
    x_train, x_test, y_train, y_test = get_train_test()

    y_true = y_test
    feats_test = [vectorize_text(text) for text in x_test]
    y_pred = model.predict(feats_test)

    return classification_report(y_true, y_pred)

if __name__ == "__main__":
    model = train()

    joblib.dump(model, 'data/model.pkl')

    print(validate(model))
