const express = require("express");
const {
  login,
  getAllUsers,
  updateUserDetails,
  deleteUser,
  verifyToken,
  initiateRegistration,
  verifyOTPAndRegister,
  resendOTP,
} = require("../controllers/auth");

const authRouter = express.Router();



// Login a user
authRouter.post("/login", login);

// Get all users
authRouter.get("/users", getAllUsers);
authRouter.get("/verify-token", verifyToken);
authRouter.post("/initiate-registration",initiateRegistration);
authRouter.post("/verify-otp-register",verifyOTPAndRegister);
authRouter.post("/resend-otp", resendOTP);

// Update user details (partial updates for different stages)
authRouter.patch("/user/:userId", updateUserDetails);

authRouter.delete("/:id", deleteUser);
module.exports = authRouter;
