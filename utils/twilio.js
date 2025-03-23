const SID = process.env.TWILIO_SID
const authToken = process.env.TWILIO_ACCESS_TOKEN;
const twilio = require('twilio')(SID, authToken);

    const OtpService = async (contactNumber, OTP) => {  
      try {
        await twilio.messages.create({
          from: "+12543562307",
          to: contactNumber,
          body:`Welcome buddy on Kounselo Education Services Pvt Ltd. Please enter this OTP: ${OTP} to verify your number.`,
        });
        console.log("OTP sent sucessfully");
        return ({
          status: "success",
          message: "OTP sent successfully"
        });
      } catch (err) {
        console.log(err);
        throw new Error("Failed to send OTP");
      }
    }

module.exports = OtpService;