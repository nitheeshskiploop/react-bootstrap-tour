const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const registration = require('../models/registration.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');

// get request
router.get('/', (req, res) => {
  registration.find({})
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ error: err }))
});

router.delete('/:id', function (req, res) {
  registration.findByIdAndDelete({ _id: req.params.id })
    .then(data => {
      res.status(200).json({
        message: "data deleted",
      })
    })
    .catch(err => res.status(500).json({ error: err }))
});

router.get('/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  registration.find({ _id: req.params.userId })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => res.status(500).json({ error: err }))
});

// google authantication
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
})
);

router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  // console.log("req.user", req.user);
  if (req.user.hospital) {
    let token = jwt.sign(req.user.toJSON(), config.secretKey, {
      expiresIn: "1h"
    });
    res.cookie('jwt', token);
    res.redirect(`http://localhost:3000/registerWithGoogle/`);
  } else {
    // res.cookie('jwt', token);
    res.redirect(`http://localhost:3000/registerWithGoogle/${req.user._id}`)
  }
})

// post request
router.post('/', (req, res) => {
  registration.find({ email: req.body.email })
    .then(user => {
      // console.log(user);
      if (user.length >= 1) {
        return res.status(400).json({
          message: "Mail already exists",
          success: true
        });
      } else {
        //encrypt password using bcrypt
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
              return res.status(500).json({
                error: err
              })
            } else {
              // store hash in your password DB.
              const register = new registration({
                email: req.body.email,
                password: hash,
                hospital: req.body.hospital,
                isVerified: req.body.isVerified,
              })
              register.save()
                .then(result => {
                  // console.log("result", result)

                  // send confirmation mail 
                  const url = `http://localhost:3000/verifyUser/${result._id}`;
                  const mailAccount = {
                    user: 'test.skiploop@gmail.com',
                    password: 'Test@123',
                  }
                  nodemailer.createTestAccount((err, account) => {
                    let transporter = nodemailer.createTransport({
                      host: 'smtp.gmail.com',
                      port: 587,
                      secure: false,
                      auth: {
                        user: mailAccount.user,
                        pass: mailAccount.password
                      }
                    });
                    let mailOptions = {
                      from: `"Confirm Email" <${mailAccount.user}>`,
                      to: req.body.email,
                      subject: 'Confirm Your Email',
                      html: `Hello !!<br/>Please click this link to confirm your email: <a href="${url}">${url}</a>`,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        // return console.log(error);
                        return res.status(500).json({
                          error: error,
                          message: "email can't be sent"
                        })
                      }
                      console.log('Message sent: %s', info.messageId);
                      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                  })
                  res.status(201).json({
                    message: "Registered succesfully"
                  })
                })
                .catch(err => res.status(500).json({ error: err }))
            }
          });
        });
      }
    })
    .catch(err => res.status(500).json({ error: err }))
});

// put request
router.put('/:userId', (req, res) => {
  registration.findOne({ _id: req.params.userId })
    .then(data => {
      if (data.hospital) {
        res.status(400).json({
          message: "Failed, hospital already updated",
          success: false
        })
      } else {
        registration.findByIdAndUpdate({ _id: req.params.userId }, req.body)
          .then(() => {
            registration.findOne({ hospital: req.body.hospital })
              .then(result => {
                // console.log("result", result)
                let token = jwt.sign(result.toJSON(), config.secretKey, {
                  expiresIn: "1h"
                });
                // res.cookie('jwt', token);
                res.status(201).json({
                  message: "Account updated, Wait.. Redirecting to Login page",
                  success: true,
                  token: token
                })
              })
              .catch(err => res.status(500).json(err))
          })
      }
    })
    .catch(err => res.status(500).json(err))
})

router.put('/verifyUser/:userId', (req, res) => {
  registration.findByIdAndUpdate({ _id: req.params.userId })
    .then(result => {
      // console.log("result", result)
      if (result.isVerified === false) {
        registration.findByIdAndUpdate({ _id: req.params.userId }, { isVerified: true })
          .then(updatedResult => {
            // console.log("updatedresult", updatedResult);
            res.status(200).json({
              message: "User verified susscfully",
              success: true
            })
          })
          .catch(err => res.status(500).json({ error: err }))
      } else {
        res.status(401).json({
          message: "Already verified",
          success: false
        })
      }
    })
    .catch(err => res.status(500).json({ error: err }))
})

module.exports = router;