import datetime
import logging

from flask import Flask, request, jsonify

# auth, database connection
import jwt, psycopg2, account_utils

from db_credentials import *

app = Flask(__name__)

# everything requires database connection anyways
conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
        )


@app.route("/")
def landing():
    # Don't put any pages here, we don't want the backend to generate
    # anything other than json responses for the frontend.
    return "Sample Landing Page"


@app.route("/home")
def home():
    cursor = conn.cursor()
    if conn.closed == 0:
        status = "open"
    else:
        status = "closed"

    query = "SELECT COUNT(userid) FROM users"
    cursor.execute(query)
    user_count = cursor.fetchall();
    return {"users": user_count}


@app.route("/auth/signup", methods=["POST"])
def signup():
    packet = request.get_json()

    f_name = packet.get("first_name")
    l_name = packet.get("l_name")
    email = packet.get("email")
    password = packet.get("password")

    # ensure no empty fields
    try:
        user_id, e_pass = account_utils.validate_credentials(f_name, l_name, email, password)
    except ValueError as error:
        return jsonify({"message": repr(error)}), 400

    # check if duplicate exists
    cursor = conn.cursor()
    query = "SELECT email FROM users WHERE email = %s"
    cursor.execute(query, packet.get("email"))
    data = cursor.fetchone()

    if (data):
        # duplicate email, 409 for conflict?
        return jsonify({"message": "Existing account with email", "email" : data["email"]}), 409

    query = "INSERT INTO users VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (user_id, f_name, l_name, email, e_pass))
    cursor.commit()
    cursor.close()

    # Http code 201 is a successful account creation
    return jsonify({"message": "Signup request success."}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if (len(email) == 0):
        return jsonify({"message": "Email is empty"}), 400
    elif (len(password) == 0):
        return jsonify({"message": "Password is empty"}), 400

    e_password = account_utils.md5_encrypt(password)

    cursor = conn.cursor()
    query = "SELECT userid FROM users WHERE email = %s and password = %s"
    cursor.execute(query, (email, e_password))
    data = cursor.fetchone()
    if (data):
        # create session for user
        d1 = datetime.datetime.now() + datetime.timedelta(hours=1)
        encoded_user = jwt.encode({"user_id": data["uuid"], "expiration": d1}, "secret", algorithm="HS256")
        return jsonify({"message": "Login request success", "user_token": encoded_user}), 200

    # Http code 401 is auth fail
    return jsonify({"message": "Login request failed"}), 401


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
