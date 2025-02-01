const express = require("express");
const { otpSend, otpVarification, resendOtp } = require("../controllers/otpVarification");

const otpRouter = express.Router();

// Route to send OTP
otpRouter.post("/send-otp", otpSend);

// Route to verify OTP
otpRouter.post("/verify-otp", otpVarification);

// Route to resend OTP
otpRouter.post("/resend-otp", resendOtp);

module.exports = otpRouter;
