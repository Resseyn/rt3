from flask import Flask, request, jsonify
import json

app = Flask(__name__)

PRODUCTS_FILE = 'products.json'

def load_products():
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)

def save_products(products):
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(products, f, indent=4)

@app.route('/api/products', methods=['POST'])
def add_product():
    products = load_products()
    new_products = request.json
    if isinstance(new_products, dict):
        new_products = [new_products]
    products.extend(new_products)
    save_products(products)
    return jsonify({'message': 'Product(s) added'}), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    products = load_products()
    for product in products:
        if product['id'] == product_id:
            product.update(request.json)
            save_products(products)
            return jsonify({'message': 'Product updated'})
    return jsonify({'error': 'Product not found'}), 404

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    products = load_products()
    products = [p for p in products if p['id'] != product_id]
    save_products(products)
    return jsonify({'message': 'Product deleted'})

if __name__ == '__main__':
    app.run(port=8080)
