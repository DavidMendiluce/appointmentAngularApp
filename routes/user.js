const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const router = express.Router();

router.post("/signupExpress", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash=> {
      const user = new User({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: hash
      });
      user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
            message: 'Invalid authentication credentials!'
        });
      });
    });
  const user = new User({
    email: req.email,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname
  });
});

router.post('/loginExpress', (req, res, next) => {
  let fetchedUser;
  console.log(req.body.email);
  User.find({ email: req.body.email })
    .then(user=> {
      console.log(user[0].email);
      if(!user) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user[0].password)
    })
    .then(result => {

      if(!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser[0].email, userId: fetchedUser[0]._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser[0]._id
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
    })
  })
});

module.exports = router;