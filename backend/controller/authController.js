
const nodemailer = require("nodemailer");

const UserModels = require("../models/authModel");

const userModels = new UserModels();

const otpStore = new Map();
const registerStore = new Map();

class UserController {

    static async register(req, res) {
        try {
            const {
                name,
                email,
                password
            } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Name, email and password are required"
                });
            }

            const existingUser = await userModels.forget(email);

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            const otp = Math.floor(
                10000 + Math.random() * 90000
            ).toString();

            console.log("Register OTP:", otp);

            registerStore.set(email, {
                name: name,
                password: password
            });

            otpStore.set(`register_${email}`, {
                otp: otp,
                verified: false,
                expires: Date.now() + 10 * 60 * 1000
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Registration Verification Code",
                text: `Hello ${name},

Your registration verification code is:

${otp}

This code will expire in 10 minutes.`
            });

            return res.status(200).json({
                message: "Verification code sent to your email"
            });

        } catch (err) {
            console.log("Register Error:", err);

            return res.status(500).json({
                message: "Unable to send verification code"
            });
        }
    }

    static async verifyRegister(req, res) {
        try {
            const {
                email,
                code
            } = req.body;

            if (!email || !code) {
                return res.status(400).json({
                    message: "Email and code are required"
                });
            }

            const otpData = otpStore.get(
                `register_${email}`
            );

            if (!otpData) {
                return res.status(400).json({
                    message: "OTP not found. Please request a new OTP"
                });
            }

            if (Date.now() > otpData.expires) {
                otpStore.delete(`register_${email}`);
                registerStore.delete(email);

                return res.status(400).json({
                    message: "OTP expired"
                });
            }

            if (String(otpData.otp) !== String(code)) {
                return res.status(400).json({
                    message: "Invalid verification code"
                });
            }

            const registerData = registerStore.get(email);

            if (!registerData) {
                return res.status(400).json({
                    message: "Registration data expired"
                });
            }

            await userModels.createUser(
                registerData.name,
                email,
                registerData.password
            );

            otpStore.delete(`register_${email}`);
            registerStore.delete(email);

            return res.status(201).json({
                message: "User Created Successfully"
            });

        } catch (err) {
            console.log("Verify Register Error:", err);

            return res.status(500).json({
                message: "Registration failed"
            });
        }
    }

    static async login(req, res) {
        try {
            const {
                email,
                password
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            const isLogin = await userModels.login(
                email,
                password
            );

            if (!isLogin) {
                return res.status(401).json({
                    message: "Invalid Email or Password"
                });
            }

            return res.status(200).json({
                message: "Login Successfully",
                user: isLogin
            });

        } catch (err) {
            console.log("Login Error:", err);

            return res.status(500).json({
                message: "Server Error"
            });
        }
    }

    static async forget(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    message: "Email field required"
                });
            }

            const isUser = await userModels.forget(email);

            if (!isUser) {
                return res.status(404).json({
                    message: "Email not registered"
                });
            }

            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            console.log("Forgot Password OTP:", otp);

            otpStore.set(`reset_${email}`, {
                otp: otp,
                verified: false,
                expires: Date.now() + 10 * 60 * 1000
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset OTP",
                text: `Your password reset verification code is:

${otp}

This code will expire in 10 minutes.`
            });

            return res.status(200).json({
                message: "Verification code sent to your email"
            });

        } catch (err) {
            console.log("Forgot Password Error:", err);

            return res.status(500).json({
                message: "Unable to send verification code"
            });
        }
    }

    static async verifyCode(req, res) {
        try {
            const {
                email,
                code
            } = req.body;

            if (!email || !code) {
                return res.status(400).json({
                    message: "Email and verification code are required"
                });
            }

            const otpData = otpStore.get(
                `reset_${email}`
            );

            if (!otpData) {
                return res.status(400).json({
                    message: "OTP not found or expired"
                });
            }

            if (Date.now() > otpData.expires) {
                otpStore.delete(`reset_${email}`);

                return res.status(400).json({
                    message: "OTP has expired"
                });
            }

            if (String(otpData.otp) !== String(code)) {
                return res.status(400).json({
                    message: "Invalid verification code"
                });
            }

            otpData.verified = true;

            otpStore.set(
                `reset_${email}`,
                otpData
            );

            console.log(
                "Password reset OTP verified:",
                email
            );

            return res.status(200).json({
                message: "OTP verified successfully"
            });

        } catch (err) {
            console.log("Verify Code Error:", err);

            return res.status(500).json({
                message: "Server error while verifying OTP"
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const {
                email,
                password
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            const otpData = otpStore.get(
                `reset_${email}`
            );

            if (!otpData || otpData.verified !== true) {
                return res.status(403).json({
                    message: "Please verify the OTP first"
                });
            }

            if (Date.now() > otpData.expires) {
                otpStore.delete(`reset_${email}`);

                return res.status(400).json({
                    message: "OTP expired"
                });
            }

            const result =
                await userModels.resetPassword(
                    email,
                    password
                );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            otpStore.delete(`reset_${email}`);

            return res.status(200).json({
                message: "Password changed successfully"
            });

        } catch (err) {
            console.log("Reset Password Error:", err);

            return res.status(500).json({
                message: "Password reset failed"
            });
        }
    }
}

module.exports = UserController;

