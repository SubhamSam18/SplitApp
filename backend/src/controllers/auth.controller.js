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
      token: token
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

exports.changePassword = async (req, res) => {
  try {
    // console.log(req.user);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (isMatch && newPassword === currentPassword) {
      return res.status(400).json({ message: "New password cannot be same as current password" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error " + error);
    res.status(500).json({ message: "Failed to change password!" });
  }
}