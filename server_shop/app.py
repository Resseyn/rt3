from flask import Flask, send_from_directory, send_file
from graphene import ObjectType, String, Schema, Float, List
from flask_graphql import GraphQLView
from flask_cors import CORS 
import json
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app, resources={r"/*": {"origins": "*"}})

with open('../server_admin/products.json') as f:
    products = json.load(f)

class Product(ObjectType):
    id = String()
    name = String()
    price = Float()
    description = String()
    categories = List(String)

class Query(ObjectType):
    products = List(Product)

    def resolve_products(self, info):
        return products

schema = Schema(query=Query)

app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

@app.route('/')
def index():
    return send_file('../frontend/index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../frontend', filename)

if __name__ == '__main__':
    app.run(port=3000)
