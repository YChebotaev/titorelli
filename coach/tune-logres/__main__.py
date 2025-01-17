import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from load_data import load_data

if __name__ == "__main__":
    x_train, x_test, y_train, y_test = train_test_split(
        load_data()[0],
        load_data()[1],
        test_size=0.2
    )

    vectorizer = TfidfVectorizer(lowercase=True, stop_words="english")

    feats_train = vectorizer.fit_transform(x_train)

    joblib.dump(vectorizer, 'data/tfidf-v.pkl')

    feats_test = vectorizer.transform(x_test)

    model = MLPClassifier(
        activation='relu',
        solver='lbfgs',
        learning_rate='constant',
        alpha=7.5,
        max_iter=500,
        random_state=42
    )
    model.fit(feats_train, y_train)

    joblib.dump(model, 'data/model.pkl')
