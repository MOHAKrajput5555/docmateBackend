const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config()
const { v4: uuidv4 } = require('uuid');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    
    const user=profile._json
    const password=uuidv4()
    const payload={
       name:user.name,
       email:user.email,
       password:password,
       profile_img:user.picture,
       user_id:user.sub
    }        
    
      return cb(null, payload);
    
  
  }
));

module.exports=passport