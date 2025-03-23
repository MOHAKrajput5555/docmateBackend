const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const { type } = require("os");

// const usercontrolleer = require("./controllerUser");

const user_schema = new mongoose.Schema({
  CompanyName: {
    type: String,
  },
  companyGst: {
    type: String,
  },
  ProfileLink: {
    type: String,
  },
  CompanyADD: {
    type: String,
  },


  folder: {
    type: [
      {
        folderName: {
          type: String,
        },
        ClientData: {
          type: [
            {
              FileName: {
                type: String,
              },
              photo: {
                type: String,
              },
            },
          ],
        },
      },
    ],
  },

});


// user_schema.methods.SendOtp=async function(){
//   const otp=`${Math.floor(1000+Math.random()*9000)}`
//         console.log(otp)
//         const saltRound=10
//        const hashedOtp= await bcrypt.hash(otp,saltRound)
//        const newOtpVerification=await new otp({

//       otp:hashedOtp,
//       createdAt:Date.now,
//       expiresAt:Date.now+3600000

// })}
const client = mongoose.model("client", user_schema);
module.exports = client;
