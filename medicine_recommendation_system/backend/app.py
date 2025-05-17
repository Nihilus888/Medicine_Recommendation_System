from flask import Flask, request, jsonify
from recommend import recommend_medicines_by_usage, recommend_medicines_by_symptoms
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/recommend/usage')
def recommend_by_usage():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Missing medicine name'}), 400

    recommendations = recommend_medicines_by_usage(name)
    if not recommendations:
        return jsonify({'error': 'Medicine not found'}), 404

    return jsonify({'recommended': recommendations})


@app.route('/recommend/symptoms')
def recommend_by_symptoms():
    symptoms = request.args.get('symptoms')
    if not symptoms:
        return jsonify({'error': 'Missing symptoms'}), 400

    symptom_list = [s.strip() for s in symptoms.split(',')]
    recommendations = recommend_medicines_by_symptoms(symptom_list)
    return jsonify({'recommended': recommendations})


if __name__ == '__main__':
    app.run(debug=True)
