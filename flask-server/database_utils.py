import uuid


# accepts data, validates it, then returns a uuid for activity_id
def validateActivity(user_id, activity_type, company, amount, emissions, timestamp):
    if len(activity_type) == 0:
        raise ValueError("Activity type cannot be nothing")
    # company is allowed to be nothing
    elif amount <= 0:
        raise ValueError("Activity amount cannot be less than 0")
    elif emissions < 0:
        raise ValueError("Emissions cannot be less than 0")
    elif len(timestamp) == 0:
        raise ValueError("Timestamp cannot be nothing")

    activity_id = uuid.uuid4()

    return activity_id


def inputActivity(
    connection,
    activity_id,
    user_id,
    activity_type,
    company,
    amount,
    emissions,
    timestamp,
):
    converted_user_id = uuid.UUID(user_id)
    cursor = connection.cursor()
    print("submitting data with format specifiers")
    query = "INSERT INTO activities VALUES (%s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(
        query,
        (
            activity_id,
            converted_user_id,
            activity_type,
            company,
            amount,
            emissions,
            timestamp,
        ),
    )
    connection.commit()
    cursor.close()


def inputApproved(connection, kind, name):
    if kind == "company":
        query = "INSERT INTO approved_companies VALUES (%s)"
    else:
        query = "INSERT INTO approved_activities VALUES (%s)"
    cursor = connection.cursor()
    cursor.execute(query, name)
    connection.commit()
    cursor.close()


def getUserActivities(connection, user_id):
    converted_user_id = uuid.UUID(user_id)

    cursor = connection.cursor()
    query = "SELECT * FROM activities WHERE userid = %s"
    cursor.execute(query, (converted_user_id,))
    data = cursor.fetchall()
    cursor.close()

    formatted_data = formatActivities(data)
    grouped_data = groupActivities(data)

    return formatted_data, grouped_data


def getAggregateEmissionsHistorical(connection, preset_type):
    if preset_type == "day":
        query = (
            "SELECT * FROM activities WHERE " "timestamp >= now() - interval '1 day'"
        )
    elif preset_type == "week":
        query = (
            "SELECT * FROM activities WHERE " "timestamp >= now() - interval '1 week'"
        )
    else:
        query = "SELECT * FROM activities"
    cursor = connection.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()

    res = {}
    for entry in data:
        date = str(entry[6])
        if date in res:
            res[date] += entry[4] * entry[5]
        else:
            res[date] = entry[4] * entry[5]

    return res


def getAggregateEmissionsRange(connection, date_start, date_end):
    query = (
        "SELECT amount, emissions FROM activities WHERE "
        "timestamp >= %s AND "
        "timestamp <= %s"
    )

    cursor = connection.cursor()
    cursor.execute(query, (date_start, date_end))
    data = cursor.fetchall()
    cursor.close()

    res = 0
    for entry in data:
        res += entry[0] * entry[1]

    return res


def getAllActivities(connection):
    cursor = connection.cursor()
    query = "SELECT * FROM activities "
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()

    formatted_data = formatActivities(data)
    grouped_data = groupActivities(data)

    return formatted_data, grouped_data


def getTotalEmissions(connection, user_id=None):
    cursor = connection.cursor()
    if user_id:
        converted_user_id = uuid.UUID(user_id)
        query = "SELECT amount, emissions \
                FROM activities \
                WHERE userid = %s"
        cursor.execute(query, (converted_user_id,))
    else:
        query = "SELECT amount, emissions \
                FROM activities"
        cursor.execute(query)

    data = cursor.fetchall()
    cursor.close()
    res = 0
    for entry in data:
        res += entry[0] * entry[1]

    return res


def getSupportedActivities(connection):
    query = "SELECT * FROM approved_activities"
    cursor = connection.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    res = {}
    for elem in data:
        # 0 is the index for name, 1 is emissions in kg/unit
        # returns [activity_name, emission]
        res[elem[0]] = elem[1]
    return res


def getSupportedCompanies(connection):
    query = "SELECT name FROM approved_companies"
    cursor = connection.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    res = []
    for elem in data:
        # 0 is the index for name
        res.append(elem[0])
    return res


# formats activities into a list of dicts
def formatActivities(data):
    res = []
    for elem in data:
        res.append(
            {
                "activity_id": elem[0],
                "user_id": elem[1],
                "type": elem[2],
                "company": elem[3],
                "amount": elem[4],
                "emissions": elem[5],
                "date": elem[6],
            }
        )
    return res


def groupActivities(data):
    res = {}
    for elem in data:
        if elem[2] in res:
            res[elem[2]].append(
                {
                    "activity_id": elem[0],
                    "user_id": elem[1],
                    "company": elem[3],
                    "amount": elem[4],
                    "emissions": elem[5],
                    "date": elem[6],
                }
            )
        else:
            res[elem[2]] = [
                {
                    "activity_id": elem[0],
                    "user_id": elem[1],
                    "company": elem[3],
                    "amount": elem[4],
                    "emissions": elem[5],
                    "date": elem[6],
                }
            ]
    return res
