const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const registration = require('../models/registration');

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  registration.findById(id).then((user) => {
    done(null, user)
  })
})

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  registration.findOne({ _id: jwt_payload._id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

passport.use(new GoogleStrategy({
  callbackURL: 'http://localhost:3001/api/registration/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  //passport callback function
  registration.findOne({ email: profile.emails[0].value })
    .then((dbUserResult) => {
      if (dbUserResult) {
        console.log("user is already existing")
        done(null, dbUserResult)
      }
      else {
        registration.create({
          username: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value
        }).then((result) => {
          console.log("new user created");
          done(null, result);
        })
      }
    })
})
)
