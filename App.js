const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const compression = require('compression');

const uploadclient=require("./routes/folder")
// const verify=require("./routes/verify")
// const admin=require("./routes/adminRoute")
// const upcoming=require("./routes/upcomingRoutes")
const session=require("express-session")
// const blog=require("./routes/blogroutes")
// const contact=require("./routes/contactusroute")
// const linkedinOathRouter = require('./routes/linkedln-outh');
// const  googleOathRouter  = require('./routes/googleRouter');

const cors = require('cors');

const app = express()

app.use(express.static("public"))
app.use(cors("*"))
app.enable('trust-proxy');
    
// Set a security HTTP Header
app.use(helmet());

// Set a rate-limtiter to a particular ip
const limiter = rateLimit({
    max : 500,
    windowms: 30*60*1000,
    message: 'Too many requests from this IP, please try again in an hour'
});


  app.use(
    session({
      secret: 'this-is-my-super-longer-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: 'none', // Adjust based on your needs
        secure: true,    // Make sure to use HTTPS in production
      },
    })
  );
app.use(limiter);

// Data Sanitization against NoSql Query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

//Body parser, reading data from body into req.body 
app.use(express.json());
app.use(cookieParser());

// Generating logs
console.log(process.env.NODE_ENV);
    app.use(morgan('dev'));

// compress the text data
app.use(compression());

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});





// Routes
// app.use("/api/v1/mail",contact)
// app.use('/api/v1/blogs', blog);


app.use('/api/v1/client',uploadclient)
// app.use('/api/v1/verify', verify);
// app.use('/api/v1/admin', admin);
// app.use("/auth", googleOathRouter)
// app.use("/linkedin",linkedinOathRouter)
// app.use('/api/v1/upcoming', upcoming);


// Global Error Handler
//  app.all('*', (req,res,next)=>{
//      next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//  });

//  app.use(globalErrorHandler);

module.exports = app;
