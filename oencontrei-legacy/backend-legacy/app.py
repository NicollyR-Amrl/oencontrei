from flask import Flask, send_from_directory
from flask_cors import CORS
from db import mysql
import os

app = Flask(__name__)
CORS(app)

# CONFIG MYSQL
app.config['MYSQL_HOST'] = 'mysql'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'oencontrei'

# PASTA DE UPLOAD
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mysql.init_app(app)

# IMPORTA ROTAS
from routes.objetos import objetos_bp
app.register_blueprint(objetos_bp, url_prefix="/objetos")

# ROTA TESTE
@app.route("/")
def home():
    return {"mensagem": "API funcionando"}

# ROTA PRA MOSTRAR IMAGEM
@app.route('/uploads/<filename>')
def uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# START
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)