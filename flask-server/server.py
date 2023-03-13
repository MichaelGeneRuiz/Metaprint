import logging

from flask import Flask, request, render_template
import psycopg2
from db_credentials import *

app = Flask(__name__)

def get_psql_conn():
    conn = psycopg2.connect(dbname=DB_NAME,
                            user=DB_USER,
                            password=DB_PASSWORD,
                            host=DB_HOST,
                            port=DB_PORT)
    print("Connected to PostgreSQL server")
    return conn

@app.route("/")
def landing():
    return render_template("index.html")

@app.route("/home")
def home():
    get_psql_conn()
    return {"stuff": "hello"}


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    print(data["stuff"])
    return {"message": "this is the login response"}


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
