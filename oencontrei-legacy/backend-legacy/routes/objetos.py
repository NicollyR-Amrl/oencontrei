from flask import Blueprint, request, jsonify
from db import mysql
import os

objetos_bp = Blueprint("objetos", __name__)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@objetos_bp.route("/", methods=["GET"])
def listar_objetos():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM objetos")
    dados = cursor.fetchall()

    lista = []
    for item in dados:
        lista.append({
            "id": item[0],
            "nome": item[1],
            "descricao": item[2],
            "foto": item[4]
        })

    return jsonify(lista)


@objetos_bp.route("/", methods=["POST"])
def cadastrar_objeto():

    nome = request.form.get("nome")
    descricao = request.form.get("descricao")
    local = request.form.get("local")
    foto = request.files.get("foto")


    filename = ""

    if foto:
        filename = foto.filename
        caminho = os.path.join(UPLOAD_FOLDER, filename)
        foto.save(caminho)

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO objetos (nome, descricao, foto, local_encontrado)
        VALUES (%s, %s, %s, %s)
    """, (nome, descricao, filename, local))

    mysql.connection.commit()

    return jsonify({"mensagem": "cadastrado"})