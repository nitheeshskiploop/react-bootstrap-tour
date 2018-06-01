const express = require("express");
const router = express.Router();
// models
const hospitalData = require('../models/hospitalData');
const hospitalUserData = require('../models/hospitalUserData');
// passport and jwt
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");

//hospital get question from database
router.get('/', function (req, res) {
  hospitalData.find({})
    .then(data => {
      res.status(200).json({
        message: "hospital data",
        data
      })
    })
    .catch(err => res.status(500).json({ error: err }))
});

router.delete('/:id', function (req, res) {
  hospitalData.findByIdAndDelete({ _id: req.params.id })
    .then(data => {
      res.status(200).json({
        message: "data deleted",
      })
    })
    .catch(err => res.status(500).json({ error: err }))
});

// save new hospital question data to db
router.post('/', function (req, res) {
  // console.log(req.body)
  var field = req.body
  hospitalData.create({ question: field })
    .then(() => {
      res.status(201).json({
        message: "new data created",
      })
    })
    .catch(err => res.status(500).json({ error: err }))
})

// get the hospital question data to db using post
router.post('/hospitaldata', verifyToken, function (req, res) {
  // console.log("req.body", req.body.id);
  jwt.verify(req.token, config.secretKey, (err, authData) => {
    if (err) {
      // console.log("token expired")
      // res.redirect("/");
      res.status(403).json({
        success: true,
        message: "token expired"
      });
    } else {
      hospitalUserData.find({ _id: req.body.id })
        .then(data => {
          // console.log("data", data);
          if (data.length > 0 && data[0].loginUser) {
            // console.log("if cond");
            res.status(200).json({
              message: "user updated data",
              data: data[0].question
            });
          }
          else {
            hospitalData.find()
              .then(data => {
                // console.log("result", data);
                res.status(200).json({
                  message: "not updated data",
                  data: data[0].question
                });
              })
              .catch(err => res.status(500).json({ error: err }))
          }
        })
        .catch(err => res.status(500).json({ error: err }))
    }
  });
});

// update the user data
router.put('/storehospital', verifyToken, function (req, res) {
  var field = req.body;
  // console.log("field", field);
  jwt.verify(req.token, config.secretKey, (err, authData) => {
    if (err) {
      // console.log("token expired")
      // res.redirect("/");
      res.status(403).json({
        success: true,
        message: "token expired"
      });
    } else {
      hospitalUserData.find({ _id: field.loginUser._id })
        .then((data) => {
          // console.log("data", data);
          if (data.length > 0) {
            // console.log("if");
            hospitalUserData.find({ _id: field.loginUser._id }).update({ $set: { question: field.question } })
              .then(() => {
                res.status(202).json({
                  message: "user questions data updated"
                })
              })
              .catch(err => res.status(500).json({ error: err }))
          } else {
            // console.log("else");
            const hospital = new hospitalUserData({
              _id: field.loginUser._id,
              question: field.question,
              loginUser: field.loginUser
            })
            hospital.save()
              .then(() => {
                res.status(201).json({
                  message: "new user data created"
                })
              })
              .catch(err => res.status(500).json({ error: err }))
          }
        })
        .catch(err => res.status(500).json({ error: err }))
    }
  })
})

// verify or validate token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // console.log("req token send.....",req.token)
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
