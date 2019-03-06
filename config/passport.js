const db = require('../models');
const User = db.users;
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;
const CookieStrategy = require('passport-cookie').Strategy
const keys = require('./keys');
const bcrypt = require('bcryptjs');




passport.use(new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'password',
    //are there other options?
    //emailField did not seem to do anything
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
    async (req, email, password, done) =>{
        const user = await User.findOne({where : {email : email}})
        if(!user){
            return done(null, false, { message: 'Incorrect username.' })
        }
        const passwordUser = user.dataValues.password
        const isValidPass = await bcrypt.compare(password, passwordUser);
        if(user && isValidPass){
            return done(null, user)
        }
        else{
            return done(null, false , { message: 'Incorrect password.' })
        }
        }
    ))
    

passport.serializeUser((user, done) =>{
    // console.log('user in cookie :', user);
    done(null, user.dataValues.id)  
})

passport.deserializeUser((idIncoki, done) =>{
const userrecord = User.findOne({where : {id : idIncoki}})
console.log('idIncoki :', idIncoki);

if(userrecord){
  return done(null, userrecord)
} else{
  return done(null, false)
}
})


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, async () => {
        // passport callback function
        // console.log('profile :', profile);
        // try {
        //     const user = await User.findOne({where: {id : Number(profile.id)}})
        //     if(user){ console.log('message : user already taken');
        //     }
        //     else{
        //        const newUser = await User.create({name: profile.name.familyName + profile.name.givenName})
        //        console.log('newUser :', newUser);
        //     }
        // } catch (error) {
        //     throw Error(error.message)
        // }
        
        
    })
);
passport.use(
  new facebookStrategy({
      // options for google strategy
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: '/auth/facebook/redirect'
  }, () => {
      // passport callback function

  })
);
