const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const morgan = require('morgan');
const {User} = require('../models/user.js');
const {Prescription} = require('../models/prescription.js');

mongoose.Promise = bluebird;
const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

let config = {};

try {
  config = yaml.safeLoad(fs.readFileSync('../config/app.yml', 'utf-8'));
} catch (e) {
  console.log(e);
}

app.use( (req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin',null);
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type');
  next();
});

try {
  mongoose.connect(config.database.uri, {autoIndex: false});
  console.log(`Mongo Connection Success: ${config.database.uri}`);
} catch(e){
  console.log('Failed to connect to DB', e);
}

app.post('/doctor', (req, res) => {
  let newUser = new User();
  newUser.firstName = req.body.firstName || undefined;
  newUser.lastName = req.body.lastName || undefined;
  newUser.permissions = ['doctorView'];
  newUser.type = 'doctor';
  newUser.save(function(err) {
    if (err)
      return res.status(500);

    return res.json({msg: 'Doctor added successfully'});
  });
});

app.get('/doctor/:id', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return res.status(500);
    if (user && user.type === 'doctor') {
      return res.json(user);
    } else {
      return res.status(404).send({ msg: 'Doctor not found' });
    }
  });
});

app.delete('/doctor/:id', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return res.status(500);
    if (user && user.type === 'doctor') {
      user.remove();
      return res.json({msg: 'Doctor removed successfully'});
    } else {
      return res.status(404).send({ msg: 'Doctor not found' });
    }
  });
});

app.post('/patient', (req, res) => {
  let newUser = new User();
  newUser.firstName = req.body.firstName || undefined;
  newUser.lastName = req.body.lastName || undefined;
  newUser.permissions = ['patientView'];
  newUser.save(function(err) {
    if (err)
      return res.status(500);

    res.json({msg: 'Patient added successfully'});
  });
});

app.get('/patient/:id', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return res.status(500);
    if (user && user.type === 'patient') {
      res.json(user);
    } else {
      res.status(404).send({ msg: 'Patient not found' });
    }
  });
});

app.delete('/patient/:id', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      res.status(500);
    if (user && user.type === 'patient') {
      user.remove();
      res.json({msg: 'Patient removed successfully'});
    } else {
      res.status(404).send({ msg: 'Patient not found' });
    }
  });
});

app.post('/patient/:id/prescription', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return done(err);
    if (user && user.type === 'patient') {
      let data = req.body;
      user.prescriptions.push(new Prescription(data));
      user.save(function(err) {
        if (err)
          return res.status(500);

        res.json({msg: 'Prescription prescribed'});
      });
    } else {
      res.status(404).send({ msg: 'Patient not found' });
    }
  });
});

app.set('port', process.env.USER_PORT || config.ports.user);

app.listen(app.get('port'), function(){
  console.log(`Listening on port: ${app.get('port')}`);
});
