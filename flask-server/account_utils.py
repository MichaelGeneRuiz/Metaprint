import uuid, hashlib


# accepts data packet with signup fields, then returns a uuid and encrypted password
def validate_credentials(f_name, l_name, email, password):
    if len(f_name) == 0:
        raise ValueError("First name field cannot be empty.")
    elif len(l_name) == 0:
        raise ValueError("Last name field cannot be empty.")
    elif len(email) == 0:
        raise ValueError("Email field cannot be empty.")
    elif len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")

    user_id = uuid.uuid1()

    return user_id, md5_encrypt(password)


def md5_encrypt(token):
    return (hashlib.md5(token.encode())).hexdigest()
