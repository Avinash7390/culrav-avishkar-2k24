import jwt from "jsonwebtoken";
import User from "../../Models/user.model.js";
import VerificationToken from "../../Models/verificationToken.model.js";
import {
  checkEmail,
  checkOtherCollegeEmail,
  checkPassword,
  generateVerificationEmail,
  generateVerificationToken,
} from "../../Utils/auth/auth.utils.js";
import { isMatch } from "../../Utils/auth/encriptionAndDecription.js";
import SendEmail from "../../Utils/auth/sendEmail.js";

// Login a user
const Login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // .............. checks start ...............
    if (email.includes("@mnnit.ac.in")) {
      if (!checkEmail(email)) {
        return res.status(400).json({ message: "Invalid mnnit email" });
      }
    } else {
      if (!checkOtherCollegeEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    if (!checkPassword(password)) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // .............. checks end ...............

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare the password
    const match = await isMatch(
      password,
      user.password.encryptedData,
      user.password.iv
    );
    if (!match) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    // Check if the user is verified
    if (!user.isVerifiedUser) {
      // Generate a new verification token
      const verificationToken = generateVerificationToken();
      const token = new VerificationToken({
        email: email,
        token: verificationToken,
      });
      await token.save();

      // Send verification email
      const subject = "Email verification";
      const text = generateVerificationEmail(verificationToken, subject);
      SendEmail(email, subject, text);

      return res.status(401).json({
        message: "Please verify your email",
        isVerifiedEmail: user.isVerifiedUser,
      });
    }
    // Check if the user has paid the registration fee
    if (!email.includes("@mnnit.ac.in") && !user.isFeePaid) {
      if (user.paymentLink === null) {
        return res
          .status(400)
          .json({ message: "Please pay the registration fee" });
      } else {
        return res
          .status(400)
          .json({ message: "Payment verification under process" });
      }
    }
    // Create a token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
        college: user.college,
        participatingTeam: user.participatingTeam,
        pendingTeam: user.pendingTeam,
        participatingEvents: user.participatingEvents,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export default Login;
