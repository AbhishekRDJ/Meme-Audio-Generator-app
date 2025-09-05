import User from "../models/User"
import jwt from "jsonwebtoken"

import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userFound = await User.findOne({ email: email })
        if (userFound) return new Error("User already exists")

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SERVER ERROR IN SIGNUP CONTROLLER"
        })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const FoundUser = await User.findOne({ email: email })
    if (!FoundUser) return new Error("User not exist")
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return new Error("User passwor")

    const token = jwt.sign({ id: FoundUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: FoundUser._id, username: FoundUser.username } });

}