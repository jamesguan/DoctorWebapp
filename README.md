# Willhelm International

Tech Stack:
  Webapp: Angular 5
  Gateway: Python 3.6.4
  Microservices: Node v9.8.0 npm v5.6.0
  Database: MongoDB 3.6

Steps to run the app:
  1. Install angular cli: npm install -g @angular/cli
  2. cd into doctor folder
  3. Run: ng serve --open

Steps to run the backend:
  Database:
    1. Install Mongo version 3.6
    2. Import the database from the mongo archive folder dump in the db directory
  Gateway:
    1. Install virtualenv and activate
    2. cd into server directory
    3. Run: pip install --upgrade -r py_requirements.txt
    4. cd into app-service directory and run: python app.py

  Services:
    1. cd into server folder
    2. Run: npm Install
    3. cd into <service name>-service
    4. Run node index.js
    5. Do this for the user service and appointment service
