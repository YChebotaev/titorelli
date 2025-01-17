from functools import cache
import sqlite3
from razdel import tokenize


@cache
def load_data():
    def clean_text(text):
        tokens = tokenize(text)
        return ' '.join([t.text for t in tokens])

    conn = sqlite3.connect("data/db.sqlite3")
    curs = conn.cursor()
    curs.execute("SELECT text, label, reason FROM examples")
    rows = curs.fetchall()

    examples = [clean_text(row[0]) for row in rows]
    labels = [1 if row[1] == 'spam' else 0 for row in rows]

    return examples, labels
