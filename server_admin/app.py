from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS  # Добавляем CORS
from flasgger import Swagger, swag_from
import json
import os

app = Flask(__name__, static_folder='../admin_panel')
CORS(app)  # Включаем CORS для всех маршрутов
swagger = Swagger(app, template_file='./api_spec.yaml')

PRODUCTS_FILE = 'products.json'

def load_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_products(products):
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=4, ensure_ascii=False)

@app.route('/')
def serve_admin():
    return send_file('../admin_panel/index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('../admin_panel', filename)

@app.route('/api/products', methods=['GET'])
@swag_from('api_spec.yaml')
def get_products():
    """Получение списка всех товаров"""
    response = jsonify(load_products())
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/api/products', methods=['POST'])
@swag_from('api_spec.yaml')
def add_product():
    products = load_products()
    new_product = request.json

    if isinstance(new_product, dict):
        new_product = [new_product]

    next_id = max((p["id"] for p in products), default=0) + 1
    for product in new_product:
        if not all(k in product for k in ('name', 'price', 'description', 'categories')):
            return jsonify({'error': 'Invalid product format'}), 400
        product["id"] = next_id
        next_id += 1
        products.append(product)

    save_products(products)
    response = jsonify({'message': 'Товар(ы) добавлен(ы)', 'products': new_product})
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response, 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@swag_from('api_spec.yaml')
def update_product(product_id):
    products = load_products()
    for product in products:
        if product["id"] == product_id:
            product.update(request.json)
            save_products(products)
            response = jsonify({'message': 'Товар обновлен', 'product': product})
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response
    return jsonify({'error': 'Товар не найден'}), 404

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@swag_from('api_spec.yaml')
def delete_product(product_id):
    products = load_products()
    updated_products = [p for p in products if p["id"] != product_id]
    if len(products) == len(updated_products):
        return jsonify({'error': 'Товар не найден'}), 404
    save_products(updated_products)
    response = jsonify({'message': 'Товар удален'})
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/api/docs')
def swagger_ui():
    return send_from_directory('static', 'swagger-ui.html')

if __name__ == '__main__':
    app.run(port=8080, host='0.0.0.0', debug=True)
