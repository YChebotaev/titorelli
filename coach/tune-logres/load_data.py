from functools import cache
import sqlite3
from razdel import tokenize
from sklearn.feature_extraction.text import CountVectorizer

@cache
def load_data():
    conn = sqlite3.connect("data/db.sqlite3")
    curs = conn.cursor()
    curs.execute("SELECT text, label, reason FROM examples")
    rows = curs.fetchall()

    vectorizer = CountVectorizer(max_features=1000)

    def clean_text(text):
        tokens = tokenize(text)
        return ' '.join([t.text for t in tokens])

    examples = [clean_text(row[0]) for row in rows]

    bow = vectorizer.fit_transform(examples)

    labels = [1 if row[1] == 'spam' else 0 for row in rows]

    return (
        bow,
        labels
    )
