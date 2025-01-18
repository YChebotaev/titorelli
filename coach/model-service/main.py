from flask import Flask, request
from numpy.ma.core import transpose

from load_model import load_model
from load_vectorizer import load_vectorizer

service = Flask(__name__)

@service.route('/predict', methods=['POST'])
def predict():
    model = load_model()
    vecr = load_vectorizer()
    text = request.json['text']
    v = vecr.transform([text])
    [p] = model.predict_proba(v)
    preds = sorted(zip(p, model.classes_), key=lambda x: -x[0])
    [probability, label] = preds[0]

    return {
        'value': 'spam' if label == 1 else 'ham',
        'confidence': probability,
        'classifier': 'neuralnet'
    }

@service.route('/probe', methods=['GET'])
def probe():
    return {'ok': True}

if __name__ == '__main__':
    service.run(port=2999)
