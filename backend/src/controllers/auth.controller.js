const User = require('../models/user.model');
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    const user = await User.create({ name, email, password });

    res.status(200).json({
      message: "User Created Successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error " + error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Email not found" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ userId: user._id, userName: user.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error " + error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      secure: true,
      sameSite: "strict"
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error " + error);
    res.status(500).json({ message: "Logout failed!" });
  }
}