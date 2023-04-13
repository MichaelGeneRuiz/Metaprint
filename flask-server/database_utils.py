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
        (activity_id, converted_user_id, activity_type, company, amount, emissions, timestamp),
    )
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

def getUserActivitiesHistorical(connection, user_id, preset_type):
    converted_user_id = uuid.UUID(user_id)


    if (preset_type == "day"):
        query = "SELECT * FROM activities WHERE userid = %s AND" \
                "timestamp >= now() - interval '1 day'"
    elif (preset_type == "week"):
        query = "SELECT * FROM activities WHERE userid = %s AND" \
                "timestamp >= now() - interval '1 week'"
    else:
        query = "SELECT * FROM activities WHERE userid = %s"
    cursor = connection.cursor()
    cursor.execute(query, (converted_user_id))
    data = cursor.fetchall()
    cursor.close()

    return formatActivities(data)

def getAggregateEmissionsHistorical(connection, preset_type):
    if (preset_type == "day"):
        query = "SELECT * FROM activities WHERE" \
                "timestamp >= now() - interval '1 day'"
    elif (preset_type == "week"):
        query = "SELECT * FROM activities WHERE" \
                "timestamp >= now() - interval '1 week'"
    else:
        query = "SELECT * FROM activities"
    cursor = connection.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()

    res = {}
    for elem in data:
        if elem[6] in res:
            res[elem[6]] += int(elem[5])
        else:
            res[elem[6]] = int(elem[5])

    return res

def getUserActivitiesRange(connection, user_id, date_start, date_end):
    converted_user_id = uuid.UUID(user_id)

    query = "SELECT * FROM activities WHERE userid = %s AND" \
            "timestamp >= %s AND" \
            "timestamp <= %s"

    cursor = connection.cursor()
    cursor.execute(query, (converted_user_id, date_start, date_end))
    data = cursor.fetchall()
    cursor.close()

    return formatActivities(data)

def getAggregateEmissionsRange(connection, date_start, date_end):
    query = "SELECT * FROM activities WHERE" \
            "timestamp >= %s AND" \
            "timestamp <= %s"

    cursor = connection.cursor()
    cursor.execute(query, (date_start, date_end))
    data = cursor.fetchall()
    cursor.close()

    res = 0
    for elem in data:
        res += int(elem[6])

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
    if (user_id):
        converted_user_id = uuid.UUID(user_id)
        query = "SELECT SUM(emissions) AS total \
                FROM activities \
                WHERE userid = %s"
        cursor.execute(query, (converted_user_id,))
    else:
        query = "SELECT SUM(emissions) AS total \
                FROM activities"
        cursor.execute(query)

    data = cursor.fetchone()
    cursor.close()

    return data[0]

def getSupportedActivities(connection):
    query = "SELECT name FROM approved_activities"
    cursor = connection.cursor()
    cursor.execute(query)
    data = cursor.fetchall()
    res = []
    for elem in data:
        # 0 is the index for name
        res.append(elem[0])
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