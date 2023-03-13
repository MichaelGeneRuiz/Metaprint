import logging

from flask import Flask, request, render_template
import psycopg2
from db_credentials import *

app = Flask(__name__)

def get_psql_conn():
    try:
        conn = psycopg2.connect(dbname=DB_NAME,
                                user=DB_USER,
                                password=DB_PASSWORD,
                                host=DB_HOST,
                                port=DB_PORT)
        print("Connected to PostgreSQL server")
    except psycopg2.OperationalError:
        pass
    return conn

@app.route("/")
def landing():
    return render_template("index.html")

@app.route("/home")
def home():
    conn = get_psql_conn()
    if conn.closed == 0:
        status = "open"
    else:
        status = "closed"
    return {"connection_status": status}


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
