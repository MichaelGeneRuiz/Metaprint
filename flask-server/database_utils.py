import uuid

# accepts data, validates it, then returns a uuid for activity_id
def validateActivity(user_id, activity_type, company, amount, emissions, timestamp):

    if len(user_id) != 36:
        raise ValueError("Invalid user token")
    elif len(activity_type) == 0:
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

def inputActivity(cursor, activity_id, user_id, activity_type, company, amount,
                  emissions, timestamp):
    query = 'INSERT INTO activities VALUES (%s, %s, %s, %s, %s, %s, %s)'
    cursor.execute(query, (activity_id, user_id, activity_type,
                           company, amount, emissions, timestamp))
    cursor.commit()
    cursor.close()