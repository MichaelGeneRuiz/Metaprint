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
    cursor = connection.cursor()
    query = "INSERT INTO activities VALUES (%s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(
        query,
        (activity_id, user_id, activity_type, company, amount, emissions, timestamp),
    )
    connection.commit()
    cursor.close()


def getUserActivities(connection, user_id):
    converted_user_id = uuid.UUID(user_id)

    cursor = connection.cursor()
    query = "SELECT * FROM activities WHERE userid = %s"
    cursor.execute(query, (converted_user_id,))
    data = cursor.fetchall()

    formatted_data = formatActivities(data)
    grouped_data = groupActivities(data)

    return formatted_data, grouped_data


def getAllActivities(connection):
    cursor = connection.cursor()
    query = "SELECT * FROM activities "
    cursor.execute(query)
    data = cursor.fetchall()

    formatted_data = formatActivities(data)
    grouped_data = groupActivities(data)

    return formatted_data, grouped_data


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
