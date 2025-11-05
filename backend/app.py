from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os

app = Flask(__name__)
CORS(app)  # allow frontend access

DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/api/pins", methods=["GET"])
def get_pins():
    return jsonify(load_data())

@app.route("/api/pins", methods=["POST"])
def add_pin():
    data = load_data()
    new_pin = request.json
    new_pin["id"] = len(data) + 1
    new_pin["replies"] = []
    data.append(new_pin)
    save_data(data)
    return jsonify(new_pin)

@app.route("/api/pins/<int:pin_id>/reply", methods=["POST"])
def add_reply(pin_id):
    data = load_data()
    for pin in data:
        if pin["id"] == pin_id:
            pin["replies"].append(request.json)
            save_data(data)
            return jsonify(pin)
    return jsonify({"error": "Pin not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
