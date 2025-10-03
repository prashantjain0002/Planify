import User from "./../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../libs/sendEmail.js";
import aj from "../libs/arcjet.js";
import Verification from "../models/verification.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const decision = await aj.protect(req, { email, requested: 1 });

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
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    //send Email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

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
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    if (!user.isEmailVerified) {
      const exisitingVerification = await Verification.findOne({
        userId: user._id,
      });
      if (
        exisitingVerification &&
        exisitingVerification.expiresAt > Date.now()
      ) {
        return res.status(400).json({
          message: "Email is not verified. Please verify your email address.",
        });
      } else {
        await Verification.findByIdAndDelete(exisitingVerification._id);

        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });

        //send Email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

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
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;
    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({ userId, token });
    if (!verification) {
      return res.status(404).json({ message: "Verification token not found" });
    }

    const isTokenExpired = verification.expiresAt < Date.now();
    if (isTokenExpired) {
      return res.status(400).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is not verified. Please verify your email address.",
      });
    }

    const exisitingVerification = await Verification.findOne({
      userId: user._id,
    });
    if (exisitingVerification && exisitingVerification.expiresAt > Date.now()) {
      return res.status(400).json({
        message:
          "Reset password link is already sent to your email. Please check and reset your password.",
      });
    }
    if (exisitingVerification && exisitingVerification.expiresAt < Date.now()) {
      await Verification.findByIdAndDelete(exisitingVerification._id);
    }

    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    //send Email
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

    const emailResult = await sendEmail(
      user.email,
      "Reset your password",
      "views/resetPassword.ejs",
      { name: user.name, resetPasswordLink }
    );

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send reset password email. Please try again later.",
      });
    }

    res.status(200).json({
      message: "Password reset email sent to your email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;
    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verifiaction = await Verification.findOne({ userId, token });
    if (!verifiaction) {
      return res.status(401).json({ message: "Verification token not found" });
    }

    const isTokenExpired = verifiaction.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: "Verification token expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await Verification.findByIdAndDelete(verifiaction._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
