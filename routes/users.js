var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var db = mongoose.connection;

/* GET users listing ordered by creationdate. */
router.get('/', function (req, res, next) {
    User.find().sort('-creationdate').exec(function(err, users) {
      if (err) res.status(500).send(err);
      else res.status(200).json(users);
    });
});

/* GET single user by Id , el id es el numero de verdad, me tengo q saber el id, aunq anteriormente definimos usauario como id*/
router.get('/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

/* POST a new user*/
router.post('/', function (req, res, next) {
  User.create(req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* PUT an existing user */
router.put('/:id', function (req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* DELETE an existing user */
router.delete('/:id', function (req, res, next) {
  User.findByIdAndDelete(req.params.id, function (err, userinfo) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* Check if user exists */
router.post('/signin', function (req, res, next) {
  User.findOne({username: req.body.username}, function (err, user) {
    if (err) res.status(500).send('Error checking user!');
    // If user exists...
    if (user!=null){
      user.comparePassword(req.body.password,function(err, isMatch){
        if(err) return next(err);
          // If password is correct...
          if (isMatch)
            res.status(200).send({message: 'ok', role: user.role, id: user._id});
          else
            res.status(401).send({message: 'ko'});
      });
    }else res.status(401).send({message: 'ko'});
  });
});

module.exports = router;
