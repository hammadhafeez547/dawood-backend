import express from "express";
import User from "../model/User.js";
import bcrypt from "bcrypt";
// import Joi from "joi";
import authMiddleware from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import sendResponse from "../helpers/sendResponse.js";
const router = express.Router();
import nodemailer from "nodemailer";
const secretCode = process.env.Secret_code;
const pass = process.env.EMAIL_PASS;
const em = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: em,
        pass: pass,

    },
});




router.post("/signup", async (req, res) => {
  console.log(req.body)
  // const { error, value } = registerSchema.validate(req.body);
    const { name, email, password , phoneNo  } = req.body; 
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    
  // if (error) return sendResponse(res, 400, null, true, error.message);
  const user = await User.findOne({ email: email });
  if (user)
    return sendResponse(
      res,
      403,
      null,
      true,
      "User with this email already registered."
    );
  // const password = jwt.sign({ cnic: Cnic }, secretCode);
  const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  

  let newUser = new User({name , email ,phoneNo ,  password:hashedPassword });
    newUser = await newUser.save();
    const jwtToken = jwt.sign({ email: newUser.email, id: newUser._id }, secretCode, { expiresIn: "24h" });
    res.cookie("token", jwtToken);
    const verifyUrl = `http://localhost:4000/auth/verify?token=${jwtToken}`;
    const mailOptions = await transporter.sendMail({
        from: em,
        to: email,
        subject: "Verify your account",

        html: `
        <html>
            <body>
               <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", backgroundColor: "#f3f4f6", fontFamily: "sans-serif"
    }}>
      <div style={{
        backgroundColor: "white", padding: "2rem", borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", textAlign: "center"
      }}>
        <h2 style={{ color: "#4f46e5" }}>Verify Your Email</h2>
        <p style={{ color: "#555" }}>
          Please click the button below to verify your email.
        </p>
        <a
          href=${verifyUrl}
          style={{
            backgroundColor: "#4f46e5", color: "white", padding: "10px 24px",
            borderRadius: "8px", textDecoration: "none", display: "inline-block"
          }}
        >
          Verify Email
        </a>
      </div>
    </div>
            </body>
        </html>`,
    });
    console.log("email sent");
    


  sendResponse(res, 201, newUser, false, "User Registered Successfully");
});

router.post("/login", async (req, res) => {
 console.log(req.body)
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user)
    return sendResponse(res, 403, null, true, "User is not registered.");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return sendResponse(res, 403, null, true, "Invalid Credentials.");

    var token = jwt.sign( { userId: user._id, email: user.email }, secretCode);
    res.cookie("token" , token)

  sendResponse(res, 200, { user, token }, false, "User Login Successfully");
});
export default router;

router.post("/password-reset", async (req, res) => {
  try {
      const { email ,  newPassword } = req.body;

      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid or expired token." });
  }
});

// router.post("/forger-password", (req, res) => {}); 
router.post("/password-reset-request", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res , 404 ,null , true , "User not found."  );
        }

        const resetToken = jwt.sign({ email: user.email, id: user._id }, secretCode, { expiresIn: "1h" });
        const resetUrl = `http://localhost:3000/password-reset?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<h1>Password Reset</h1>
                   <p>Click the link below to reset your password:</p>
                   <a href="${resetUrl}">Reset Password</a>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/verify", async (req, res) => {

        const { token } = req.query;
        console.log(req.query);
        
        const verification = jwt.verify(token, secretCode);

        const user = await User.findOne({ email: verification.email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.isVerified = true; 
        await user.save();

        res.status(200).json({ message: "Account verified successfully." });
  
});


router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    console.log(req.body)
    const { currentPassword, newPassword, confirmPassword , user } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const users = await User.findById(user); // authMiddleware se aaya hoga

    const isMatch = await bcrypt.compare(currentPassword, users.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(newPassword, salt);
    await users.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});