# Important Info

When you clone this repository, you will have both a folder called "Metaprint"
containing both the "client" and "flask-server" directories.

## Install Instructions:

### Backend

Cd into the "flask-server" directory, open the terminal, and create a local
virtual environment (for your sake).\
On Windows, you can do this by typing 'python -m venv venv'\
On Mac, (i think) you can do this by typing 'python3 -m venv venv'

Next you want to activate the virtual environment.\
On Windows, you can do this by typing '.\venv\Scripts\activate'.\
On Mac, (i think) you can do this by typing 'source venv/bin/activate'.

**Starting the virtual environment is essential before doing anything to the server!**

Once the virtual environment is activated, type 'pip install -r
requirements.txt'.\
**Please do this whenever there are package changes for the backend!**

Now you will have all the dependencies needed to run the backend server.\
To start the backend server, type 'python server.py'.\
If you want to leave the venv, type deactivate and it will take you back to
the default terminal in the "flask-server" directory.

### Frontend

**If you don't have NodeJS installed, download it.**

Cd into the "client" directory, open the terminal and type "npm install".\
**Please do this whenever there are package changes for the frontend!** \
Once this is done, you can type "npm start" to start the frontend server. (it may take a while)

## Adding Packages

### Backend

Activate the virtual environment using the Activate script. \
Type 'pip install (package name)'. 

To ensure everyone else knows you changed the packages, please update the requirements.txt. \
You can do this by (while still in the virtual environment) typing 'pip freeze > requirements.txt'.

### Frontend

Type 'npm install --save (package name)' into your console. \
When you push your changes, the package.json and package-lock.json will update to include
the packages you just added.

## Additional Notes

Start the backend before the frontend.

Hope this helped :>
