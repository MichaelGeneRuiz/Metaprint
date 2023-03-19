import logging

from flask import Flask, request, jsonify

# Added this for auth stuff
import flask_login
import jwt

import psycopg2

from db_credentials import *

app = Flask(__name__)


def get_psql_conn():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
        )
        print("Connected to PostgreSQL server")
    except psycopg2.OperationalError:
        pass
    return conn


@app.route("/")
def landing():
    # Don't put any pages here, we don't want the backend to generate
    # anything other than json responses for the frontend.
    return "Sample Landing Page"


@app.route("/home")
def home():
    conn = get_psql_conn()
    if conn.closed == 0:
        status = "open"
    else:
        status = "closed"
    return {"connection_status": status}


@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    print(email, password)

    # Do flask-login stuff!

    # Http code 201 is a successful account creation
    return jsonify({"message": "Signup request received."}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    print(email, password)

    # Do flask-login stuff!

    # Http code 200 is a success
    return jsonify({"message": "Login request received."}), 200


@app.route("/inputActivity", methods=["POST"])
def inputActivity():
    # Do something with post data
    return {"message": "input activity success"}


@app.route("/inputCompany", methods=["POST"])
def inputCompany():
    # Do something with post data
    return {"message": "input company success"}


@app.route("/viewTips", methods=["GET"])
def viewTips():
    return {"message": "tips"}


@app.route("/viewPersonalFootprint", methods=["GET"])
def viewPersonalFootprint():
    return {"message": "personal footprint"}


@app.route("/viewAggregateFootprint", methods=["GET"])
def viewAggregateFootprint():
    return {"message": "aggregate footprint"}


if __name__ == "__main__":
    app.run(debug=True)
