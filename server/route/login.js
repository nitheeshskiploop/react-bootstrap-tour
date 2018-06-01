const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const login = require('../models/login.js');
const registration = require('../models/registration.js');
const jwt = require('jsonwebtoken');
const config = require('../config/keys')

// get request
router.get('/', (req, res) => {
});

// post request
router.post('/', (req, res) => {
  registration.findOne({ email: req.body.email })
    .then(result => {
      if (!result) {
        res.status(404).json({
          succes: false,
          message: 'Authentication failed. User not found'
        })
      }
      else if (!result.isVerified) {
        res.status(401).json({
          succes: false,
          message: 'Email not verified, Verify your email to Login'
        })
      } else {
        bcrypt.compare(req.body.password, result.password, function (err, resp) {
          // resp == true || fasle
          if (resp) {
            let token = jwt.sign(result.toJSON(), config.secretKey, { expiresIn: "1h" });
            res.status(200).json({
              success: true,
              message: 'Login succesfully',
              token: token
            });
          } else {
            res.status(401).json({
              success: false,
              message: 'Authentication failed. Password did not match'
            });
          }
        });
      }
    })
    .catch(err => res.status(500).json({ error: err }))
})

module.exports = router;