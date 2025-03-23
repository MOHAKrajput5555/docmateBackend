const User = require("../models/userModel");
const { promisify } = require("util");
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { upload } = require("../utils/s3");
const { result, slice } = require("lodash");
const Mailgen = require("mailgen");
const admin = require("firebase-admin");
// const { exec } = require('child_process');
let isTimeOutId;

// exports.requestSent = async (req, res) => {
//   const user1 = req.params.id;
//   const user2 = req.body.id2;
//   const UserName1 = req.body.UserName;
//   const friendPhoto = req.body.friendPhoto;

//   try {
//     // Generate a random UserId
//     const random =
//       Math.random().toString(36).substring(2, 15) +
//       Math.random().toString(36).substring(2, 15);

//     // Find the User of user1
//     let data = await User.findById(user1);

//     // Create UserId object
//     const userFriends = {
//       UserId: random,
//       friendId: user1,
//       friendPhoto: friendPhoto,
//       requestSent: "true",
//       requestAccept: "false",
//       UserName: UserName1,
//     };

//     // Check if user2 already has user1 as a friend
//     const user2Data = await User.findById(user2);
//     const friendExists = user2Data.userFriends.some(
//       (friend) => friend.friendId === user1
//     );

//     if (friendExists) {
//       return res.status(400).json({
//         status: false,
//         message: "Friend request already sent.",
//       });
//     }

//     // Update user2's User with the new UserId
//     const updatedUser2 = await User.findOneAndUpdate(
//       { _id: user2 },
//       {
//         $push: { userFriends: userFriends },
//       },
//       { new: true }
//     );

//     // Respond with success message and UserId
//     return res.status(200).json({
//       status: true,
//       message: "Request sent successfully.",
//       UserId: random,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

// exports.deleteReq = catchAsync(async (req, res, next) => {
//   const { id, reqId } = req.params;

//   // Log the incoming request parameters

//   // Use the $pull operator to remove the friend request from the userFriends array
//   const updatedUser = await User.findByIdAndUpdate(
//     {_id:id},
//     { $pull: { userFriends: { _id: reqId } } },
//     { new: true }
//   );

//   if (!updatedUser) {
//     return res.status(404).json({
//       status: false,
//       message: "User or friend request not found",
//     });
//   }

//   res.status(200).json({
//     status: true,
//     message: "Friend request deleted successfully",
//     data: updatedUser,
//   });
// });

// exports.requestAcc = async (req, res) => {
//   const user1 = req.params.id;
//   const user2 = req.body.friendId;
//   const UserName1 = req.body.friendname1;
//   const Userid = req.body.UserId;
//   const UserName2 = req.body.friendname2;
//   const userPhoto1 = req.body.userPhoto1;
//   const userPhoto2 = req.body.userPhoto2;

//   console.log("user1:", user1);
//   console.log("user2:", user2);
//   console.log("UserName1:", UserName1);
//   console.log("Userid:", Userid);
//   console.log("UserName2:", UserName2);

//   try {
//     // Create UserId object
//     const userFriends1 = {
//       UserId: Userid,
//       friendId: user2,
//       friendPhoto: userPhoto2,
//       requestAccepted: true,
//       Friendname: UserName2,

//     };

//     const userFriends2 = {
//       UserId: Userid,
//       friendId: user1,
//       friendPhoto: userPhoto1,
//       requestAccepted: true,

//       Friendname: UserName1,
//     };

//     console.log("userFriends1:", userFriends1);
//     console.log("userFriends2:", userFriends2);

//     // Update user1's User with the new UserId
//     const updatedUser1 = await User.findOneAndUpdate(
//       { _id: user1 },
//       { $push: { userFriendAccepted: userFriends1 } },
//       { new: true }
//     );
//     console.log("updatedUser1:", updatedUser1);

//     // Update user2's User with the new UserId
//     const updatedUser2 = await User.findOneAndUpdate(
//       { _id: user2 },
//       { $push: { userFriendAccepted: userFriends2 } },
//       { new: true }
//     );
//     console.log("updatedUser2:", updatedUser2);

//     // Respond with success message and UserId
//     return res.status(200).json({
//       status: true,
//       message: "Request sent successfully.",
//       UserId: Userid,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

// exports.UserALL = catchAsync(async (req, res) => {
//   const user = await User.find();
//   res.status(200).json({
//     data: {
//       user: user,
//     },
//   });
// });

// exports.coinFunction = catchAsync(async (req, res) => {
//   const userId = req.params.id;
//   const amount = req.body.amount;
//   const Ride = req.body.RideName;
//   const location = req.body.location;
//   const MainRideId = req.body.MainRideId;

//   const timeRemaining = req.body.timeRemaining;

//   const RID = req.body.RID;
//   const currentUtcTime = new Date();
//   const utcOffset = 5.5 * 60 * 60 * 1000; // Offset for IST (5.5 hours ahead of UTC)
//   const istTime = new Date(currentUtcTime.getTime() + utcOffset);
//   const currentRideBefore = {
//     timeOfBooking: istTime,
//     RID: RID,
//     location: location,
//     coinConsumed: amount,
//     timeRemaining: new Date(
//       currentUtcTime.getTime() + utcOffset + amount * 60000
//     ).toISOString(),
//     RideName: Ride,
//     MainRideId: MainRideId,
//   };
//   const currentRideAfter = {
//     _id: null,
//     timeOfBooking: null,
//     RID: null,
//     location: null,
//     coinConsumed: null,
//     timeRemaining: null,
//     RideName: null,
//   };
//   const bookingInfo = {
//     timeOfBooking: currentRideBefore.timeOfBooking,
//     RID: RID,
//     location: location,
//     coinConsumed: amount,
//     finishTime: new Date(
//       currentUtcTime.getTime() + utcOffset + amount * 60000
//     ).toISOString(),
//     RideName: Ride, // Update RideName based on request body
//     MainRideId: MainRideId,
//   };

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       console.log("User not found.");
//       return res.status(404).json({
//         status: false,
//         message: "User not found.",
//       });
//     }

//     if (user.yourCoin < amount) {
//       console.log("Insufficient coins.");
//       return res.status(400).json({
//         status: false,
//         message: "Insufficient coins.",
//       });
//     }

//     const updatedCoins = user.yourCoin - amount;

//     // Update the user's yourCoin field and add bookingInfo to currentAndPrevious array
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         $set: {
//           yourCoin: updatedCoins,
//           testBuy: true,
//           current: currentRideBefore,
//         },
//       },
//       { new: true }
//     );

//     console.log("Updated user:", updatedUser);

//     // Return success response or perform additional actions
//     res.status(200).json({
//       status: true,
//       message: "Coins subtracted successfully. Testbuy set to true.",
//       updatedUser: updatedUser,
//     });

//     isTimeOutId = setTimeout(async () => {
//       // Reset testBuy status to false after 5 seconds
//       await User.findByIdAndUpdate(userId, {
//         $unset: { current: "" },

//         $push: { currentAndPrevious: bookingInfo },
//         new: true,
//       });
//       console.log("Testbuy status reset to false after 5 seconds.");
//     }, amount * 60 * 1000);

//     // Schedule a timer to set testBuy back to false after 5 seconds (5000 milliseconds)
//   } catch (error) {
//     console.error("Error in coinFunction:", error);
//     res.status(500).json({
//       status: false,
//       message: "Internal Server Error",
//     });
//   }
// });
// exports.leave = catchAsync(async (req, res, next) => {
//   const userId = req.params.id;
//   const amount = req.body.amount;
//   const Ride = req.body.RideName;
//   const location = req.body.location;
//   const MainRideId = req.body.MainRideId;
//   const starttime=req.body.starttime
//   const finishtime = req.body.finishtime;

//   const RID = req.body.RID;
//   const currentUtcTime = new Date();
//   const utcOffset = 5.5 * 60 * 60 * 1000; // Offset for IST (5.5 hours ahead of UTC)
//   const istTime = new Date(currentUtcTime.getTime() + utcOffset);
//   if (isTimeOutId) {
//     clearTimeout(isTimeOutId);
//     console.log("Timeout canceled.");
//   }
//   const bookingInfo = {
//     timeOfBooking:starttime ,
//     RID: RID,
//     location: location,
//     coinConsumed: amount,
//     finishTime: finishtime,
//     RideName: Ride, // Update RideName based on request body
//     MainRideId: MainRideId,
//   };
//   // Update the user's yourCoin field and add bookingInfo to currentAndPrevious array
//   const updatedUser = await User.findOneAndUpdate(
//     { _id: userId },
//     {
//       $unset: {
//         current: "",
//       },
//       $push: { currentAndPrevious: bookingInfo }
//     },
//     { new: true }

//   );
//   res.status(201).json({
//     status: true,
//   });
// });

// exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
//   const uploadSingle = upload("youthbuzzdata", "userData/", "user").single(
//     "photo"
//   );
//   uploadSingle(req, res, async (err) => {
//     if (err) {
//       return next(new AppError(err.message, 400));
//     }
//     if (req.file) {
//       req.body.photo = req.file.key;
//     }
//     console.log(req.file);
//     const blog = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(201).json({
//       status: "success",
//       message: "Image uploaded successfully",
//       data: {
//         blog,
//       },
//     });
//   });
// });
// const singnup = (id) => {
//   return jwt.sign({ id }, "this-is-my-super-longer-secret", {
//     expiresIn: "90d",
//   });
// };

// const createAndSendToken = (user, statusCode, res) => {
//   const token = singnup(user._id);

//   res.cookie("jwt", token, {
//     expiresIn: new Date(Date.now + 90 * 24 * 60 * 60 * 1000),
//     secure: false,
//     httpOnly: true,
//   });
//   res.status(statusCode).json({
//     statusbar: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };

// // Set up Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "careerclassroom4@gmail.com",
//     pass: "viqiqwwdppyjtntd",
//   },
// });

// // Configure Express session

// // API route to register user and send OTP
// exports.register = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Generate OTP
//     const otp = otpGenerator.generate(4, {
//       digits: true,
//       lowerCaseAlphabets: false,
//       upperCaseAlphabets: false,
//       specialChars: false,
//     });

//     // Store OTP in the session
//     req.session.otp = otp;

//     // Send OTP email
//     const mailOptions = {
//       from: "careerclassroom4@gmail.com",
//       to: email,
//       subject: "OTP Verification",
//       text: `Your OTP: ${otp}`,
//     };
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       status: "success",
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // API route to verify OTP and manage session
// // exports.verify = async (req, res) => {
// //   const { OTP } = req.body;

// //   try {
// //     // Get OTP from the session
// //     const sessionOtp = req.session.otp;

// //     if (!sessionOtp || sessionOtp !== otp) {
// //       return res.status(400).json({ error: 'Incorrect OTP' });
// //     }

// //     // Clear the OTP from the session
// //     req.session.otp = null;

// //     // Store session data indicating successful verification
// //     req.session.verified = true;

// //     res.status(200).json({ message: 'OTP verified successfully' });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // }

// // Protected route requiring verification

// exports.getOneuser = catchAsync(async (req, res) => {
//   const user = await User.findById(req.params.id);
//   res.status(200).json({
//     status: "true",
//     data: {
//       user,
//     },
//   });
// });

// // exports.signup = catchAsync(async (req, res, next) => {
// //   const {  email } = req.body;

// //   if ( !email ) {
// //     return res.status(422).json({
// //       status: false,
// //       message: "please provide required requested field",
// //     });
// //   }

// //   const user = await verify.findOne({ email: email });

// //   if (user) {
// //     return res.status(422).json({
// //       status: true,
// //       message: "email is already registered. please login",
// //     });
// //   }

// //   const otp = otpGenerator.generate(4, {
// //     digits: true,
// //     lowerCaseAlphabets: false,
// //     upperCaseAlphabets: false,
// //     specialChars: false,
// //   });
// //   let transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     host: "smtp.gmail.com",
// //     port: 587,
// //     secure: true, // true for 465, false for other ports
// //     auth: {
// //       user: "youthbuzz00@gmail.com",
// //       pass: "viqiqwwdppyjtntd" // generated ethereal password
// //     },
// //   });

// //   const mailGenerator = new Mailgen({
// //     theme: 'salted', // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
// //     product: {
// //       name: 'portal.youthbuzz.in',
// //       link: 'https://yourapp.com',
// //       // You can customize other product details here
// //     },
// //   });

// //   // Function to send OTP via email
// //   const sendOTPEmail = () => {
// //     // Create a Mailgen email template
// //     const email2 = {
// //       body: {
// //          // Customize the recipient's name
// //         intro: `Your OTP for verification is:${otp}`,
// //         // code: otp, // Replace with your generated OTP

// //         outro: 'If you did not request this OTP, please ignore this email.',
// //       },
// //     };

// //     // Generate the email HTML using Mailgen
// //     const emailBody = mailGenerator.generate(email2);

// //     // Create email options
// //     const mailOptions = {
// //       from: 'youthbuzz00@gmail.com',
// //       to: email,
// //       subject: 'OTP Verification',
// //       html: emailBody,
// //     };

// //     // Send the email
// //     transporter.sendMail(mailOptions, (error, info) => {
// //       if (error) {
// //         console.error('Error sending OTP email:', error);
// //       } else {
// //         console.log('OTP email sent:', info.response);
// //       }
// //     });
// //   };

// //   sendOTPEmail()

// //   const time = new Date();
// //   time.setMinutes(time.getMinutes() + 5);

// //   const OTP = {
// //     OTP: otp,
// //     createdAt: new Date().toLocaleTimeString(),
// //     expiresAt: time.toLocaleTimeString(),
// //   };

// //   const newusers = new User({

// //     email: email,

// //     OTP: OTP,

// //     });

// //   const savedResponse = await newusers.save();

// //   createAndSendToken(savedResponse, 201, res);
// // });
// exports.signup2 = catchAsync(async (req, res) => {
//   const uploadSingle = upload("youthbuzzdata", "userData/", "user").single(
//     "photo"
//   );

//   uploadSingle(req, res, async (err) => {
//     if (err) {
//       return next(new AppError(err.message, 400));
//     }
//     if (req.file) {
//       req.body.photo = req.file.key;
//     }
//     console.log(req.file);
//     const newUser = await User.create({
//       email: req.body.email,
//       lastname: req.body.lastname,
//       name: req.body.name,
//       password: req.body.password,
//       confirm_password: req.body.confirm_password,
//       gender: req.body.gender,
//       DOB: req.body.DOB,
//       phoneNumber: req.body.phoneNumber,
//       country: req.body.country,
//       photo: req.body.photo,
//     });

//     // const url = `${req.protocol}://${req.get('host')}/all-services`;
//     // await new sendEmail(newUser, url).sendWelcome();
//     console.log(newUser);
//     createAndSendToken(newUser, 201, res);
//   });
// });

// exports.resendOTP = catchAsync(async (req, res, next) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(422).json({
//       status: false,
//       message: "Please provide your email address.",
//     });
//   }

//   // Check if the user with the provided email exists
//   const existingUser = await User.findOne({ email: email });

//   if (!existingUser) {
//     return res.status(404).json({
//       status: false,
//       message: "User not found. Please sign up first.",
//     });
//   }

//   // Generate a new OTP and send it via email
//   const otp = otpGenerator.generate(4, {
//     digits: true,
//     lowerCaseAlphabets: false,
//     upperCaseAlphabets: false,
//     specialChars: false,
//   });
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: "youthbuzz00@gmail.com",
//       pass: "viqiqwwdppyjtntd", // generated ethereal password
//     },
//   });

//   const mailGenerator = new Mailgen({
//     theme: "salted", // Choose a Mailgen theme (e.g., 'salted' or 'neopolitan')
//     product: {
//       name: "portal.youthbuzz.in",
//       link: "https://yourapp.com",
//       // You can customize other product details here
//     },
//   });

//   // Function to send OTP via email
//   const sendOTPEmail = () => {
//     // Create a Mailgen email template
//     const email2 = {
//       body: {
//         name: existingUser.name, // Customize the recipient's name
//         intro: `Your OTP for verification is:${otp}`,
//         // code: otp, // Replace with your generated OTP

//         outro: "If you did not request this OTP, please ignore this email.",
//       },
//     };

//     // Generate the email HTML using Mailgen
//     const emailBody = mailGenerator.generate(email2);

//     // Create email options
//     const mailOptions = {
//       from: "careerclassroom4@gmail.com",
//       to: email,
//       subject: "OTP Verification",
//       html: emailBody,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending OTP email:", error);
//       } else {
//         console.log("OTP email sent:", info.response);
//       }
//     });
//   };

//   // Usage example:
//   // Replace with the recipient's email
//   // Replace with your generated OTP
//   sendOTPEmail();
//   // const emailSent = await sendOTPByEmail(email, otp);

//   if (!sendOTPEmail) {
//     return res.status(500).json({
//       status: false,
//       message: "Failed to send OTP via email. Please try again later.",
//     });
//   }

//   // Update the user's OTP in the database
//   const time = new Date();
//   time.setMinutes(time.getMinutes() + 5);

//   existingUser.OTP = {
//     OTP: otp,
//     createdAt: new Date().toLocaleTimeString(),
//     expiresAt: time.toLocaleTimeString(),
//   };

//   await existingUser.save();

//   res.status(200).json({
//     status: true,
//     message: "OTP has been resent successfully.",
//   });
// });
// exports.verify = async (req, res) => {
//   const { OTP } = req.body;

//   // Assuming 'User' is your model name
//   const user = await User.findOne({ "OTP.OTP": OTP });

//   if (!user) {
//     res.status(400).send("Invalid OTP");
//   } else {
//     const currentTime = new Date().getTime();
//     const expiresAt = new Date(user.OTP.expiresAt).getTime();

//     if (currentTime > expiresAt) {
//       res.status(400).send("OTP has expired");
//     } else {
//       await User.findOneAndUpdate(
//         { "OTP.OTP": OTP },
//         { $unset: { OTP: 1 }, verified: true }
//       );

//       res.status(201).json({
//         statusbar: "true",
//       });
//     }
//   }
// };

// // Start the server

// // exports.signup = catchAsync(async (req, res, next) => {
// //   const newUser = await User.create({
// //     email: req.body.email,
// //     name: req.body.name,
// //     lastname: req.body.lastname,
// //     password: req.body.password,
// //     confirm_password: req.body.confirm_password,

// //   });
// //   // const url = `${req.protocol}://${req.get('host')}/all-services`;
// //   // await new sendEmail(newUser, url).sendWelcome();
// //   console.log(newUser);
// //   createAndSendToken(newUser, 201, res);
// // });

// exports.login = catchAsync(async (req, res, next) => {
//   const { emailOrphoneNumber, password } = req.body;

//   // Check if emailOrPhone is an email
//   const isEmail = /\S+@\S+\.\S+/.test(emailOrphoneNumber);

//   // Find the user by email or phone
//   const user = await User.findOne(
//     isEmail
//       ? { email: emailOrphoneNumber }
//       : { phoneNumber: emailOrphoneNumber }
//   );

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Compare passwords
//   const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//   createAndSendToken(user, 201, res);
// });

// exports.loginWithOtp = catchAsync(async (req, res, next) => {
//   const { phoneNumber } = req.body;

//   if (!phoneNumber) {
//     return next(new AppError("Please provide email and OTP.", 400));
//   }

//   const user = await User.findOne({ phoneNumber });

//   if (!user) {
//     res.status(400).send("Invalid OTP");
//   }
//   createAndSendToken(user, 201, res);
// });

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return next(
//       new AppError("You are not logged in! Please log in to get access.", 401)
//     );
//   }
//   const decode = await promisify(jwt.verify)(
//     token,
//     "this-is-my-super-longer-secret"
//   );

//   // const freshUser =await User.findById(decode.id)
//   // if(!freshUser){
//   //   return next(new AppError('user not exist',401))
//   // }
//   // if(freshUser.changePasswordAfter(decode.iat))
//   // {
//   //   return next(new AppError('password changed',401))
//   // }
//   // req.user=freshUser;

//   next();
// });

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles ['admin', 'lead-guide']. role='user'
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }

//     next();
//   };
// };

// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(
//       new AppError("There is no user with the provided email address.", 404)
//     );
//   }

//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send it to the user's email
//   const resetURL = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/users/reset/${resetToken}`;

//   try {
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // Use false for port 587
//       auth: {
//         user: "youthbuzz00@gmail.com",
//         pass: "viqiqwwdppyjtntd", // Use your Gmail password
//       },
//     });

//     const mailGenerator = new Mailgen({
//       theme: "salted",
//       product: {
//         name: "youthbuzz.in",
//         link: "https://yourapp.com",
//       },
//     });

//     // Create a Mailgen email template
//     const email = {
//       body: {
//         name: user.name, // Customize the recipient's name
//         intro: "Forgot your password?",
//         action: {
//           instructions:
//             "Please reset your password by clicking the button below:",
//           button: {
//             color: "#007bff",
//             text: "Reset Your Password",
//             link: `https://youthbuzz.in/reset/${resetToken}`,
//           },
//         },
//         outro: "If you didn't forget your password, please ignore this email.",
//       },
//     };

//     // Generate the email HTML using Mailgen
//     const emailBody = mailGenerator.generate(email);

//     // Create email options
//     const mailOptions = {
//       from: "youthbuzz00@gmail.com",
//       to: user.email,
//       subject: "Password Reset",
//       html: emailBody,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Password reset email sent:", info.response);

//     // Send a response to the client
//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email!",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       new AppError("There was an error sending the email. Try again later!"),
//       500
//     );
//   }
// });

// exports.reset = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the token

//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new AppError("Token is invalid or has expired", 400));
//   }
//   user.password = req.body.password;
//   user.confirm_password = req.body.confirm_password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   //   const token=jwt.sign({id:user._id},'this-is-my-super-longer-secret',{
//   //     expiresIn:"90d"
//   //   })
//   //   res.status(200).json({
//   //     statusbar:'success',
//   //     token

//   //   })
//   createAndSendToken(user, 200, res);
// });

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) Get user from collection
//   const user = await User.findById(req.params.id).select("+password");

//   // 2) Check if POSTed current password is correct
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError("Your current password is wrong.", 401));
//   }

//   // 3) If so, update password
//   user.password = req.body.password;

//   await user.save();

//   // User.findByIdAndUpdate will NOT work as intended!

//   // 4) Log user in, send JWT
//   //   const token=jwt.sign({id:user._id},'this-is-my-super-longer-secret',{
//   //     expiresIn:"90d"
//   //   })
//   //   res.status(200).json({
//   //     statusbar:'success',
//   //     token

//   //   })

//   createAndSendToken(user, 201, res);
// });

// exports.deleteuser = catchAsync(async (req, res, next) => {
//   const seller = await User.findByIdAndDelete(req.params.id);

//   if (!seller) {
//     return next(new AppError(`No ${seller} found with that ID`, 404));
//   }
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// // Generate OTP and send email
// // exports.sentOtp= async (req, res) => {
// //   const { email } = req.body;
// //   const generatedOTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });

// //   const user = new User({
// //     email,
// //     otp: generatedOTP,
// //     otpExpiry: new Date().getTime() + 5 * 60 * 1000, // OTP valid for 5 minutes
// //   });

// //   await user.save();

// //   const mailOptions = {
// //     from: 'your-email@gmail.com',
// //     to: email,
// //     subject: 'Your OTP Code',
// //     text: `Your OTP code is: ${generatedOTP}`,
// //   };

// //   transporter.sendMail(mailOptions, (error, info) => {
// //     if (error) {
// //       console.log(error);
// //       res.status(500).send('Error sending OTP');
// //     } else {
// //       console.log('Email sent: ' + info.response);
// //       res.send('OTP sent successfully');
// //     }
// //   });
// // }

// exports.updateUser = catchAsync(async (req, res) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!user) {
//     return next(new AppError(`No seller found with that ID`, 404));
//   }
//   res.status(201).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });

// exports.logout = (req, res) => {
//   res.cookie("jwt", "loggedout", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: false,
//   });
//   res.status(200).json({ status: "success" });
// };
exports.CreateClient = catchAsync(async (req, res, next) => {
  const data = await User.create({
    CompanyName: req.body.CompanyName,
    companyGst: req.body.companyGst,
    
    CompanyADD: req.body.CompanyADD,
  });
  data.ProfileLink = `http://localhost:3000/user/${data._id}/${data.CompanyName}`;
  res.status(201).json({
    data: {
      data,
    },
    status:  true,
  });
});












exports.uploadP = catchAsync(async (req, res, next) => {
  const uploadSingle = upload("clientdata123", "client/", "client").single("photo");

  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    // Find the client (user) by ID and populate the folder property
    const client = await User.findById(req.params.id).populate('folder');
    if (!client) {
      return next(new AppError("Client not found", 404));
    }

    // Find the folder by folderId
    const folder = client.folder.find(f => f._id.toString() === req.params.folderId);
    if (!folder) {
      return next(new AppError("Folder not found", 404));
    }

    // Find the ClientData object by its ID
    const clientData = folder.ClientData.id(req.params.fileId);
    if (!clientData) {
      return next(new AppError("File not found", 404));
    }

    // Update the photo property with the S3 file key
    clientData.photo = req.file.key;

    // Save updated client data
    await client.save();

    res.status(200).json({
      status: "success",
      message: "Photo uploaded successfully to S3",
      data: {
        fileKey: req.file.key, 
        fileUrl: req.file.location, 
      },
    });
  });
});



exports.createFolder = catchAsync(async (req, res, next) => {
  const { folderName } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.folder.push({ folderName });
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Folder created successfully",
    data: { user },
  });
});

// Controller to get all folders for a user
exports.getFolders = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { folders: user.folder },
    fullData:{user}
  });
});

exports.uploadFileName = catchAsync(async (req, res, next) => {
  const { fileName } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const folder = user.folder.id(req.params.folderId);
  if (!folder) {
    return next(new AppError("Folder not found", 404));
  }

  folder.ClientData.push({ FileName: fileName });
  await user.save();

  res.status(201).json({
    status: "success",
    message: "File name uploaded successfully",
    data: { folder },
  });
});
