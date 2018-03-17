from flask import Flask
import requests
import logging
import yaml

app = Flask(__name__)
app.config.from_object(__name__)

def set_config():
    with open('../config/app.yml', 'r') as f:
        app.config.update(yaml.load(f))
set_config()

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.logger.setLevel(logging.INFO)
    app.run(host='localhost', port=int(app.config['ports']['gateway']))
