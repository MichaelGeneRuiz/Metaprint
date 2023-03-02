from flask import Flask
from flask import request

app = Flask(__name__)


@app.route("/home")
def home():
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
