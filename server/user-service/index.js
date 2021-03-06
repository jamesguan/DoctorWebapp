const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const morgan = require('morgan');
const {User} = require('../models/user');
const {Prescription} = require('../models/prescription');
const {Appointment} = require('../models/appointment');

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
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type');
  next();
});

try {
  mongoose.connect(config.database.uri, {autoIndex: false});
  console.log(`Mongo Connection Success: ${config.database.uri}`);
} catch(e){
  console.log('Failed to connect to DB', e);
}

app.get('/doctors', (req, res) => {
  User.find(
    {type: 'doctor', active: true},
    '_id firstName lastName active',
    (err, doctors) => {
      return res.json(doctors);
    }
  );
});

app.get('/admin/:id/patients', (req, res) => {
  User.findOne({ _id : req.params.id }, (err, user) => {
    if (err)
      return res.status(500);
    if (user && user.type === 'admin' && user.active) {
      User.find(
        {type: 'patient', active: true},
        (err, patients) => {
          return res.json(patients);
        }
      );
    } else {
      return res.status(404).send({ msg: 'Admin not found' });
    }
  });
});

app.get('/admin/:id/doctors', (req, res) => {
  User.findOne({ _id : req.params.id }, (err, user) => {
    if (err)
      return res.status(500);
    if (user && user.type === 'admin' && user.active) {
      User.find(
        {type: 'doctor'},
        '_id firstName lastName active',
        (err, doctors) => {
          return res.json(doctors);
        }
      );
    } else {
      return res.status(404).send({ msg: 'Admin not found' });
    }
  });
});

app.post('/user', (req, res) => {
  let newUser = new User(req.body);
  switch (req.body.type){
    case 'admin':
      newUser.permissions = ['adminView'];
      newUser.type = 'admin';
      break
    case 'doctor':
      newUser.permissions = ['doctorView'];
      newUser.type = 'doctor';
      break;
    case 'patient':
      newUser.permissions = ['patientView'];
      newUser.type = 'patient';
      break;
    default:
      return res.status(500).send({msg: 'Type not defined'});
  }

  newUser.save(function(err) {
    if (err)
      return res.status(500);
    return res.json({id: newUser._id});
  });
});

app.get('/user/:id', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return res.status(500);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).send({ msg: 'User not found' });
    }
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
      return res.status(500);
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

app.put('/user/:id', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return res.status(500);
    if (user) {
      Object.assign(user, req.body);
      user.save((err) => {
        if (err)
          return res.status(500);

        res.json({msg: 'User edited successfully'});
      });
    } else {
      res.status(404).send({ msg: 'User not found' });
    }
  });
});

app.post('/user/:id/appointment/:appointment', (req, res) => {
  User.findOne({'_id': req.params.id}, (err, user) => {
    if (err)
      return res.status(500);
    if (user) {
      user.appointments.push(req.params.appointment);
      user.save(function(err) {
        if (err)
          return res.status(500);

        res.json({msg: 'Appointment set'});
      });
    } else {
      res.status(404).send({ msg: 'User not found' });
    }
  });
});

app.get('/user/:id/appointments', (req, res) => {
  User.findOne({'_id': req.params.id}).populate('appointments').exec(
    function(err, user){
      if (err) return res.status(500);
      if (user) {
        res.json(user.appointments);
      } else {
        res.json({msg: 'User not found'});
      }
    }
  );
});

app.set('port', process.env.USER_PORT || config.ports.user);

app.listen(app.get('port'), function(){
  console.log(`Listening on port: ${app.get('port')}`);
});
