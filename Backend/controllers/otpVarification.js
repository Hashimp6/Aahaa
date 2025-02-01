const crypto = require("crypto");
const sendMail = require("../configs/nodeMailer");

let otpStorage = {}; // Temporary storage for OTPs

// Generate and send OTP
const otpCreation = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  console.log(`Generated OTP for ${email}:`, otp);
  
  otpStorage[email] = otp; // Store OTP
  
  try {
    const response = await sendMail(email, otp);
    console.log("Mail sent response:", response);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending OTP");
  }
};

// Send OTP
const otpSend = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await otpCreation(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await otpCreation(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
const otpVarification = (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`Verifying OTP for ${email}:`, otp);
    
    const storedOtp = otpStorage[email];
    
    if (!storedOtp) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }
    
    if (storedOtp === otp) {
      console.log("OTP verification successful");
      delete otpStorage[email]; // Remove OTP after verification
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      console.log("OTP verification failed");
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

module.exports = { otpSend, otpVarification, resendOtp };
