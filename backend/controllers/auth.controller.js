import User from "./../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verification from "../models/verification.model.js";
import { sendEmail } from "../libs/sendEmail.js";
import aj from "../libs/arcjet.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const decision = await aj.protect(req, { email, requested: 1 });
    // console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email address" }));
    }

    const exisitingUser = await User.findOne({ email });

    if (exisitingUser) {
      return res.status(400).json({ message: "Email address already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, property: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    //send Email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const emailResult = await sendEmail(
      newUser.email,
      "Verify your email address",
      "views/verifyEmail.ejs",
      { name: newUser.name, verificationLink }
    );

    if (!emailResult.success) {
      return res.status(201).json({
        message:
          "User registered successfully, but failed to send verification email.",
        emailError: emailResult.error,
      });
    }

    res.status(201).json({
      message:
        "Verification email sent to your email. Please check and verify your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
