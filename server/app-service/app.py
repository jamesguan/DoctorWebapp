from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from werkzeug.security import safe_str_cmp

import requests
import logging
import json
import yaml

class User(object):
    def __init__(self, *initial_data, **kwargs):
        for dictionary in initial_data:
            for key in dictionary:
                setattr(self, key, dictionary[key])
        for key in kwargs:
            setattr(self, key, kwargs[key])

app = Flask(__name__)
app.debug = True
cors = CORS(app, resources={r"/*": {"origins": "*"}})

headers = {'Content-Type':'application/json'}

app.config.from_object(__name__)

def set_config():
    with open('../config/app.yml', 'r') as f:
        app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=365)
        app.config.update(yaml.load(f))
set_config()

def get_endpoint(service, uri=''):
    return '%s:%s/%s' % (app.config['env']['url'], app.config['ports'][service], uri)

#app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=30)

@app.route('/auth', methods=['POST'])
def authenticate():
    endpoint = get_endpoint('user', 'user/%s' % (request.json['username']))
    user_dict = requests.get(endpoint).json()
    #if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
    if user_dict:
        user_dict['id'] = user_dict['_id']
        access_token = create_access_token(identity=user_dict)
        return jsonify({'access_token': access_token, 'type': user_dict['type']}), 200

def identity(payload):
    endpoint = get_endpoint('user', 'user/%s' % (payload['identity']))
    user = requests.get(endpoint).json()
    if user:
        return User(user)

jwt = JWTManager(app)

@app.route('/view/admin')
@jwt_required
def admin_view():
    user_dict = get_jwt_identity()
    if 'adminView' in user_dict['permissions'] and user_dict['type'] == 'admin':
        endpoint = get_endpoint('user', 'admin/%s/doctors' % (user_dict['_id']))
        doctors = requests.get(endpoint).json()
        endpoint = get_endpoint('user', 'admin/%s/patients' % (user_dict['_id']))
        patients = requests.get(endpoint).json()

        user = {
            'firstName': user_dict['firstName'],
            'lastName': user_dict['lastName'],
            'type': user_dict['type'],
            'permissions': user_dict['permissions']
        }
        payload = {
            'user': user,
            'doctors': doctors,
            'patients': patients
        }
        return jsonify(payload)
    abort(500)

@app.route('/doctor', methods=['POST'])
@jwt_required
def create_doctor():
    user_dict = get_jwt_identity()
    if 'adminView' in user_dict['permissions'] and user_dict['type'] == 'admin':
        endpoint = get_endpoint('user', 'user')
        request.json['type'] = 'doctor';
        req = requests.post(endpoint, data=json.dumps(request.json), headers=headers)
        return jsonify(req.json())
    abort(500)

@app.route('/doctor/<id>', methods=['GET'])
def get_doctor(id):
    endpoint = get_endpoint('user', 'doctor/%s' % (id))
    doctor = requests.get(endpoint, data=request.json).json()
    return jsonify(doctor)

@app.route('/user/<id>/inactive', methods=['PUT'])
@jwt_required
def deactivate_user(id):
    endpoint = get_endpoint('user', 'user/%s' % (id))
    user = requests.put(endpoint, data=json.dumps({'active': request.json['status']}), headers=headers).json()
    return jsonify({'msg': 'okay'})

@app.route('/admin/<id>/doctors', methods=['GET'])
def get_doctors(id):
    endpoint = get_endpoint('user', 'admin/%s/doctors' % (id))
    doctors = requests.get(endpoint, data=request.json).json()
    return jsonify(doctors)

@app.route('/appointment', methods=['POST'])
def appointment():
    endpoint = get_endpoint('appointment', 'appointment')
    appointment = requests.post(endpoint, data=request.json).json()
    return jsonify({'msg': 'okay'})

if __name__ == '__main__':
    app.logger.setLevel(logging.INFO)
    app.run(host='localhost', port=int(app.config['ports']['gateway']))
