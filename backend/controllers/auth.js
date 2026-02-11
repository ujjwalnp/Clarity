const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await UserModel.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    loginUser,
    registerUser,
}