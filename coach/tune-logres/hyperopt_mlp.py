from functools import cache

import optuna
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import f1_score, confusion_matrix, accuracy_score, classification_report
from numpy import diag
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from load_data import load_data

x_train, x_test, y_train, y_test = train_test_split(
    load_data()[0],
    load_data()[1],
    test_size=0.2
)

vectorizer = TfidfVectorizer(lowercase=True, stop_words="english")

feats_train = vectorizer.fit_transform(x_train)
feats_test = vectorizer.transform(x_test)

def objective(trial):
    solver = trial.suggest_categorical('solver', ['lbfgs', 'sgd', 'adam'])
    learning_rate = trial.suggest_categorical('learning_rate', ['constant', 'invscaling', 'adaptive'])

    model = MLPClassifier(
        activation=trial.suggest_categorical('activation', ['identity', 'logistic', 'tanh', 'relu']),
        solver=solver,
        learning_rate=learning_rate,
        alpha=trial.suggest_float('alpha', 0.0001, 10),
        max_iter=1000,
        random_state=42
    )
    model.fit(feats_train, y_train)

    labels = model.predict(feats_test)

    results = confusion_matrix(y_test, labels)

    # fp = results.sum(axis=0) - diag(results)
    fn = results.sum(axis=1) - diag(results)
    tp = diag(results)
    # tn = results.sum() - (fp + fn + tp)
    fnr = fn / (tp + fn)

    return fnr[0] + fnr[1]

if __name__ == "__main__":
    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=20, n_jobs=-1)

    print(study.best_trial)

solver = 'lbfgs'
learning_rate = 'constant'
activation = 'relu'
alpha = 7.5
