import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} from "./EmailTemplate.js"
import { apiInstance, sender } from "./mail.auth.js";
import dotenv from 'dotenv';
dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
    const sendSmtpEmail = {
        sender: sender,
        to: [{ email }],
        subject: "Verify your email",
        htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        textContent: `Your verification code is: ${verificationToken}`,
        tags: ["Email Verification"]
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email sent successfully", response);
    } catch (error) {
        console.error("❌ Error sending verification email:", error.response?.body || error.message);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};


export const sendWelcomeEmail = async (email, fullName) => {
    const recipient = [{ email }];

    try {
        const response = await apiInstance.sendTransacEmail({
            sender: sender,
            to: recipient,
            templateId: 3,
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);

        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];
    const msg = ({
        sender,
        to: recipient,
        subject: "Reset your password",
        htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        tags: ["password-reset"],
    });
    try {
        const response = await apiInstance.sendTransacEmail(msg);
        console.log(response)
    } catch (error) {
        console.error(`Error sending password reset email`, error);

        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await apiInstance.sendTransacEmail({
            sender: sender,
            to: recipient,
            subject: "Password Reset Successful",
            htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
            tags: ["Password Reset"],
        });

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};