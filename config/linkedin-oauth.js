const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

passport.use(new LinkedInStrategy({
    clientID:process.env.LINKEDIN_CLIENT_ID,
    clientSecret:process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/linkedin/auth/callback',
    scope: ['r_emailaddress', 'r_liteprofile'], 
}, (accessToken, refreshToken, profile, done) => {
    
    

    const {emails,name,photos}=profile
    const password=uuidv4()
    

    const payload={
        name:name.givenName,
        lastname:name.familyName,
        email:emails[0].value,
        password:password,
        profile_img:photos[0].value,
     }   

    return done(null, payload);
}));

module.exports = passport;