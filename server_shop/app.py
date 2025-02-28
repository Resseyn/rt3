from flask import Flask, send_from_directory, send_file, jsonify
import json
import os

app = Flask(__name__, static_folder='../frontend')

@app.route('/')
def index():
    return send_file('../frontend/index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../frontend', filename)

@app.route('/api/products')
def products():
    with open('../server_admin/products.json') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=3000)
