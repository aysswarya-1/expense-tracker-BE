import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();
import User from "../models/User.model.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mail/email.js";

const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    return token
};

export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const user = await User.create({
            fullName, email, password, profileImageUrl, verificationToken, verificationTokenExpireAt
        })

        await sendVerificationEmail(user.email, verificationToken)
        return res.status(201).json({ id: user._id, user, token: generateToken(user._id, res) });
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpireAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid or Expired verification code" });
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpireAt = undefined
        await user.save()

        sendWelcomeEmail(user.email, user.fullName)
        return res.status(201).json({ message: "Email verified successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error verifying user", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        return res.status(200).json({ id: user._id, user, token: generateToken(user._id, res) });
    } catch (error) {
        return res.status(500).json({ message: "Error Login user", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "No Email exists!" });
        }

        // generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 //1hr

        user.resetPasswordToken = resetToken
        user.resetPasswordExpireAt = resetTokenExpiresAt

        await user.save()

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        return res.status(201).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        return res.status(500).json({ message: "Error forgot-password user", error: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        user.password = password;
        user.resetPasswordToken = undefined
        user.resetPasswordExpireAt = undefined

        await user.save();

        await sendResetSuccessEmail(user.email)

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("isVerified");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ isVerified: user.isVerified });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
