from functools import cache
import optuna
import sqlite3
import sklearn
# from navec import Navec
from razdel import tokenize
from sklearn.feature_extraction.text import CountVectorizer
from load_data import load_data

def objective(trial):
    x, y = load_data()

    classifier_obj = sklearn.svm.NuSVC(
        nu=trial.suggest_float('nu', 0.01, 0.09)
    )

    score = sklearn.model_selection.cross_val_score(classifier_obj, x, y, n_jobs=1, cv=3)

    accuracy = score.mean()

    return accuracy

if __name__ == "__main__":
    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=100)

    print(study.best_trial)
