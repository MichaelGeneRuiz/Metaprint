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
        auth_header = request.headers.get("Authorization")

        if auth_header:
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing."}), 401

        try:
            data = jwt.decode(token, "secret", algorithms=["HS256"])
            user_id = data["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token."}), 401

        return f(user_id, *args, **kwargs)

    return decorated


def logged_out_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")

        if auth_header:
            token = auth_header.split(" ")[1]

        if token:
            try:
                jwt.decode(token, "secret", algorithms=["HS256"])
                return (
                    jsonify(
                        {
                            "message": "Access denied. Only logged-out users can access this route."
                        }
                    ),
                    403,
                )
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


@app.route("/home")
def home():
    cursor = conn.cursor()

    query = "SELECT COUNT(userid) FROM users"
    cursor.execute(query)
    user_count = cursor.fetchall()
    return jsonify({"users": user_count}), 200


@app.route("/auth/signup", methods=["POST"])
@logged_out_required
def signup():
    packet = request.get_json()

    f_name = packet.get("f_name")
    l_name = packet.get("l_name")
    email = packet.get("email")
    password = packet.get("password")

    # ensure no empty fields
    try:
        user_id, e_pass = account_utils.validate_credentials(
            f_name, l_name, email, password
        )
    except ValueError as err:
        return jsonify({"message": repr(err)}), 400

    # check if duplicate exists
    cursor = conn.cursor()
    query = "SELECT email FROM users WHERE email = %s"
    # Needs to be a tuple for some reason
    cursor.execute(query, (email,))
    data = cursor.fetchone()

    if data:
        # duplicate email, 409 for conflict?
        return (
            jsonify({"message": "An account already exists with that email address."}),
            409,
        )

    query = "INSERT INTO users VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (user_id, f_name, l_name, email, e_pass))
    conn.commit()
    cursor.close()

    # Http code 201 is a successful account creation
    return (
        jsonify({"message": "Registration successful! Please login to continue."}),
        201,
    )


@app.route("/auth/login", methods=["POST"])
@logged_out_required
def login():
    packet = request.get_json()
    email = packet.get("email")
    password = packet.get("password")

    if len(email) == 0:
        return jsonify({"message": "Email field cannot be empty."}), 400
    elif len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters."}), 400

    e_password = account_utils.md5_encrypt(password)

    cursor = conn.cursor()
    query = "SELECT userid FROM users WHERE email = %s and password = %s"
    cursor.execute(query, (email, e_password))
    data = cursor.fetchone()
    if data:
        # create session for user, returning a JWT with the uuid, expiration, and
        # email address.
        d1 = (datetime.datetime.utcnow() + datetime.timedelta(hours=1)).timestamp()
        # Have to encode the uuid as a string, as JSON cannot pass
        # uuids.
        encoded_user = jwt.encode(
            {"user_id": str(data[0]), "expiration": d1, "email": email},
            "secret",
            algorithm="HS256",
        )
        return (
            jsonify(
                {"message": "Login request successful.", "user_token": encoded_user}
            ),
            200,
        )

    # Http code 401 is auth fail
    return jsonify({"message": "Invalid username or password."}), 401


@app.route("/inputActivity", methods=["POST"])
@token_required
def inputActivity(user_id):
    # Do something with post data
    packet = request.get_json()
    activity_type = packet.get("activity_type")
    company = packet.get("company")
    amount = int(packet.get("amount"))
    emissions = float(packet.get("emissions"))
    timestamp = packet.get("timestamp")

    try:
        activity_id = database_utils.validateActivity(
            user_id, activity_type, company, amount, emissions, timestamp
        )
    except ValueError as err:
        return jsonify({"message": repr(err)}), 400

    database_utils.inputActivity(
        conn, activity_id, user_id, activity_type, company, amount, emissions, timestamp
    )

    return jsonify({"message": "Activity submitted! You may continue."}), 201


@app.route("/getActivityFields", methods=["GET"])
def getActivityFields():
    supportedActivities = database_utils.getSupportedActivities(conn)
    supportedCompanies = database_utils.getSupportedCompanies(conn)

    return (
        jsonify(
            {
                "message": "success",
                "activities": supportedActivities,
                "companies": supportedCompanies,
            },
        ),
        200,
    )


@app.route("/viewPersonalFootprint", methods=["GET"])
@token_required
def viewPersonalFootprint(user_id):
    all_data, grouped_data = database_utils.getUserActivities(conn, user_id)
    total_user = database_utils.getTotalEmissions(conn, user_id)

    return (
        jsonify(
            {
                "message": "personal footprint",
                "activities": all_data,
                "grouped_activities": grouped_data,
                "total_user_emissions": total_user,
            }
        ),
        200,
    )


@app.route("/viewHistoricalAggregateFootprint", methods=["POST"])
@token_required
def viewHistoricalAggregateFootprint(user_id):
    packet = request.get_json()
    preset = packet.get("preset")

    if preset:
        preset_type = packet.get("preset_type")

        res = database_utils.getAggregateEmissionsHistorical(conn, preset_type)
        kind = preset_type

    else:
        date_start = packet.get("date_start")
        date_end = packet.get("date_end")

        res = database_utils.getAggregateEmissionsRange(conn, date_start, date_end)
        kind = date_start + "-" + date_end

    return (
        jsonify(
            {"message": "historical aggregate footprint", "kind": kind, "data": res}
        ),
        200,
    )


@app.route("/viewAggregateFootprint", methods=["GET"])
@token_required
def viewAggregateFootprint(user_id):
    all_data, grouped_data = database_utils.getAllActivities(conn)
    total = database_utils.getTotalEmissions(conn)
    total_user = database_utils.getTotalEmissions(conn, user_id)
    annual_company = database_utils.getCompanyEmissions(conn)
    return (
        jsonify(
            {
                "message": "aggregate footprint",
                "total_emissions": total,
                "total_user_emissions": total_user,
                "annual_company_emissions": annual_company
            }
        ),
        200,
    )


@app.route("/inputApprovedCompany", methods=["POST"])
@token_required
def inputApprovedCompany(user_id):
    packet = request.get_json()
    companyName = packet.get("company")
    database_utils.inputApproved(conn, "company", companyName)
    return jsonify({"message": "Company submitted! You may continue."}), 201


@app.route("/inputApprovedActivity", methods=["POST"])
@token_required
def inputApprovedActivity(user_id):
    packet = request.get_json()
    activityName = packet.get("company")
    database_utils.inputApproved(conn, "activity", activityName)
    return jsonify({"message": "Activity submitted! You may continue."}), 201


if __name__ == "__main__":
    app.run(debug=True)
