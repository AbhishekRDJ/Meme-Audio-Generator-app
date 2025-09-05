import User from "../models/User.js"
import jwt from "jsonwebtoken"

import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with that email or username already exists" });
        }
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: "Signup failed", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};