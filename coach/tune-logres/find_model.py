from functools import cache

import optuna
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import confusion_matrix
from numpy import diag
from sklearn.ensemble import AdaBoostClassifier, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from load_data import load_data

x_train, x_test, y_train, y_test = train_test_split(
    load_data()[0],
    load_data()[1],
    test_size=0.2
)

vectorizer = TfidfVectorizer(lowercase=True, stop_words="english")

feats_train = vectorizer.fit_transform(x_train)
feats_test = vectorizer.transform(x_test)

def get_model(trial):
    names = [
        "Nearest Neighbors",
        "Linear SVM",
        "RBF SVM",
        "Decision Tree",
        "Random Forest",
        "Neural Net",
        "AdaBoost"
    ]

    classifiers = [
        KNeighborsClassifier(3),
        SVC(kernel="linear", C=0.025, random_state=42),
        SVC(gamma=2, C=1, random_state=42),
        # GaussianProcessClassifier(1.0 * RBF(1.0), random_state=42),
        DecisionTreeClassifier(max_depth=5, random_state=42),
        RandomForestClassifier(
            max_depth=5, n_estimators=10, max_features=1, random_state=42
        ),
        MLPClassifier(alpha=1, max_iter=1000, random_state=42),
        AdaBoostClassifier(random_state=42),
        # GaussianNB(),
        # QuadraticDiscriminantAnalysis(),
    ]

    selected_name = trial.suggest_categorical('model_name', names)

    for name, model in zip(names, classifiers):
        if name is selected_name:
            return make_pipeline(
                StandardScaler(with_mean=False),
                model
            )

    return None

def objective(trial):
    model = get_model(trial)
    model.fit(feats_train, y_train)

    labels = model.predict(feats_test)

    results = confusion_matrix(y_test, labels)

    fn = results.sum(axis=1) - diag(results)
    tp = diag(results)
    fnr = fn / (tp + fn)

    return fnr[0] + fnr[1]

if __name__ == "__main__":
    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=20, n_jobs=-1)

    print(study.best_trial)
