from flask import Flask
from flask import jsonify
from flask import request

import requests
import logging
import yaml

app = Flask(__name__)
app.config.from_object(__name__)

def set_config():
    with open('../config/app.yml', 'r') as f:
        app.config.update(yaml.load(f))
set_config()

def get_endpoint(service, uri=''):
    return '%s:%s/%s' % (app.config['env']['url'], app.config['ports'][service], uri)

@app.route('/doctor', methods=['POST'])
def create_doctor():
    endpoint = get_endpoint('user', 'doctor')
    req = requests.post(endpoint, data= request.json)
    return jsonify({'msg': 'okay'})

@app.route('/doctor/<id>', methods=['GET'])
def get_doctor(id):
    endpoint = get_endpoint('user', 'doctor/%s' % (id))
    doctor = requests.get(endpoint, data=request.json).json()
    return jsonify(doctor)

@app.route('/appointment', methods=['POST'])
def appointment():
    endpoint = get_endpoint('appointment', 'appointment')
    appointment = requests.post(endpoint, data=request.json).json()
    return jsonify({'msg': 'okay'})

if __name__ == '__main__':
    app.logger.setLevel(logging.INFO)
    app.run(host='localhost', port=int(app.config['ports']['gateway']))
