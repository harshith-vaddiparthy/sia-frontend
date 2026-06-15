// Verification.js
import React from "react";
import { sendEmailVerification, auth } from "firebase/auth";

// Function to send a verification email to the user
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    console.log("Verification email sent to:", user.email);
    alert("A verification email has been sent. Please check your inbox.");
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    alert("Failed to send verification email. Please try again.");
  }
};

// Function to check if the user's email is verified
export const isEmailVerified = (user) => {
  return user.emailVerified;
};

// Default Verification Component
const Verification = () => {
  return (
    <div>
      <h2>Email Verification</h2>
      <p>Please check your email and click the verification link to complete the signup process.</p>
    </div>
  );
};

export default Verification;
