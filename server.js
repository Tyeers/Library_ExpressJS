require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// **SIGNUP**
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Cek apakah user sudah ada
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user baru
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error occurred", error });
    }
});

// **LOGIN**
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Bandingkan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, userId: user.id, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Error occurred", error });
    }
});

const authMiddleware = require("./middleware/authMiddleware");

app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, { attributes: { exclude: ["password"] } });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});


// **Port**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
