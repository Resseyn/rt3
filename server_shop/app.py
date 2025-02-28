from flask import Flask, send_file, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('../frontend/index.html')

@app.route('/api/products')
def products():
    with open('../server_admin/products.json') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=3000)
