/**
 * Created by qiujian on 7/18/17.
 */
var passport = require('koa-passport');
var db = require("./lib/configs.js");

passport.serializeUser(function (user, done) {
  done(null, user.google_id);
});

passport.deserializeUser(function (id, done) {
  db.users.findOne({id: id}, function (err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function (username, password, done) {
  db.users.findOne({username: username}, function (err, user) {
    if (err) {
      done(err)
    }
    if (!user) {
      done(null, user)
    } else {
      if (username === user.username && password === user.password) {
        done(null, user);
      } else {
        done(null, false);
      }
    }
  });
}));
const GoogleStrategy = require('passport-google-auth').Strategy;

passport.use(new GoogleStrategy({
    clientId: '729241955383-utj4or9j14smsr4vvfm2regs2tfkto33.apps.googleusercontent.com',
    clientSecret: '2X29nQZudpDGl-XVf6eP0J-P',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
  },
  function (token, tokenSecret, profile, done) {
    //we are using co function to use generator function yield functionality
    // co(function *() {
    //   var user = yield 1;// configs.users.findOne({google_id: profile.id});
    //   if (!user) {
    //     //fetch google profile and save if dose not exists
    //     user = {
    //       name: profile.displayName,
    //       email: profile.emails[0].value,
    //       username: profile.emails[0].value,
    //       provider: 'google',
    //       password: '1234',
    //       google_id: profile.id,
    //       imgurl: profile.image.url,
    //       gplusurl: profile.url,
    //       gender: profile.gender,
    //       createdAt: new Date,
    //       bdate: new Date,
    //       about: 'hi there',
    //       updatedAt: new Date
    //     };
    //     yield configs.users.insert(user);
    //   }
    //
    //   done(null, user)
    // }).catch();
    let user = {
      name: profile.displayName,
      email: profile.emails[0].value,
      username: profile.emails[0].value,
      provider: 'google',
      password: '1234',
      google_id: profile.id,
      imgurl: profile.image.url,
      gplusurl: profile.url,
      gender: profile.gender,
      createdAt: new Date,
      bdate: new Date,
      about: 'hi there',
      updatedAt: new Date
    };
    console.log(token);
    console.log(tokenSecret);
    console.log(user);
    done(null, user);
  }
));
module.exports = passport; // don’t forget to export