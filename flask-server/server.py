import datetime
import logging

from functools import wraps
from flask import Flask, request, jsonify

# auth, database connection
import jwt, psycopg2, psycopg2.extras, account_utils, database_utils

from db_credentials import *


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': "Token is missing."}), 401

        try:
            data = jwt.decode(token, 'secret', algorithms=["HS256"])
            user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': "Invalid token"}), 401

        return f(user_id, *args, **kwargs)

    return decorated


def logged_out_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            token = auth_header.split(" ")[1]

        if token:
            try:
                jwt.decode(token, 'secret', algorithms=["HS256"])
                return jsonify({'message': "You are already logged in."}), 403
            except jwt.ExpiredSignatureError:
                pass
            except jwt.InvalidTokenError:
                pass

        return f(*args, **kwargs)

    return decorated


app = Flask(__name__)

# everything requires database connection anyways
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
)

psycopg2.extras.register_uuid()


@app.route("/")
def landing():
    # Don't put any pages here, we don't want the backend to generate
    # anything other than json responses for the frontend.
    return "Sample Landing Page"


@app.route("/home")
def home():
    cursor = conn.cursor()

    query = 'SELECT COUNT(userid) FROM users'
    cursor.execute(query)
    user_count = cursor.fetchall()
    return {'users': user_count}


@app.route("/auth/signup", methods=["POST"])
@logged_out_required
def signup():
    packet = request.get_json()

    f_name = packet.get('f_name')
    l_name = packet.get('l_name')
    email = packet.get('email')
    password = packet.get('password')

    # ensure no empty fields
    try:
        user_id, e_pass = account_utils.validate_credentials(
            f_name, l_name, email, password
        )
    except ValueError as err:
        return jsonify({'message': repr(err)}), 400

    # check if duplicate exists
    cursor = conn.cursor()
    query = 'SELECT email FROM users WHERE email = %s'
    # Needs to be a tuple for some reason
    cursor.execute(query, (email,))
    data = cursor.fetchone()

    if data:
        # duplicate email, 409 for conflict?
        return (
            jsonify({'message': "An account already exists with that email address."}),
            409,
        )

    query = 'INSERT INTO users VALUES (%s, %s, %s, %s, %s)'
    cursor.execute(query, (user_id, f_name, l_name, email, e_pass))
    conn.commit()
    cursor.close()

    # Http code 201 is a successful account creation
    return (
        jsonify({'message': "Registration successful! Please login to continue."}),
        201,
    )


@app.route("/auth/login", methods=["POST"])
@logged_out_required
def login():
    packet = request.get_json()
    email = packet.get('email')
    password = packet.get('password')

    if len(email) == 0:
        return jsonify({'message': "Email field cannot be empty."}), 400
    elif len(password) < 8:
        return jsonify({'message': "Password must be at least 8 characters."}), 400

    e_password = account_utils.md5_encrypt(password)

    cursor = conn.cursor()
    query = 'SELECT userid FROM users WHERE email = %s and password = %s'
    cursor.execute(query, (email, e_password))
    data = cursor.fetchone()
    if data:
        # create session for user, returning a JWT with the uuid, expiration, and
        # email address.
        d1 = (datetime.datetime.utcnow() + datetime.timedelta(hours=1)).timestamp()
        # Have to encode the uuid as a string, as JSON cannot pass
        # uuids.
        encoded_user = jwt.encode(
            {'user_id': str(data[0]), 'expiration': d1, 'email': email},
            'secret',
            algorithm='HS256',
        )
        return (
            jsonify(
                {'message': "Login request successful.", 'user_token': encoded_user}
            ),
            200,
        )

    # Http code 401 is auth fail
    return jsonify({'message': "Invalid username or password."}), 401


@app.route("/protected", methods=["GET"])
@token_required
def protected_data(user_id):
    return jsonify({'message': "This is protected data."})


@app.route("/inputActivity", methods=["POST"])
@token_required
def inputActivity(user_id):
    # Do something with post data
    packet = request.get_json()
    activity_type = packet.get('activity_type')
    company = packet.get('company')
    amount = packet.get('amount')
    emissions = packet.get('emissions')
    timestamp = packet.get('timestamp')

    try:
        activity_id = database_utils.validateActivity(user_id, activity_type,
                                                      company, amount,
                                                      emissions, timestamp)
    except ValueError as err:
        return jsonify({'message': repr(err)}), 400

    database_utils.inputActivity(conn.cursor(), activity_id, user_id,
                                 activity_type, company, amount, emissions,
                                 timestamp)

    return jsonify({'message': "Activity submitted! You may continue."}), 201


@app.route("/inputCompany", methods=["POST"])
def inputCompany():
    # Do something with post data
    return {'message': "input company success"}


@app.route("/viewTips", methods=["GET"])
def viewTips():
    return {'message': "tips"}


@app.route("/viewPersonalFootprint", methods=["GET"])
def viewPersonalFootprint():
    return {'message': "personal footprint"}


@app.route("/viewAggregateFootprint", methods=["GET"])
def viewAggregateFootprint():
    return {'message': "aggregate footprint"}


if __name__ == "__main__":
    app.run(debug=True)
