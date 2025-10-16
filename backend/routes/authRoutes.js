const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import models
const User = require("../models/UserModel");
const FarmerImport = require("../models/User_Farmer");
const Farmer = FarmerImport.default || FarmerImport; // ✅ handle ES module default export

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { fullName, address, contact_info, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      address,
      contact_info,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register-farmer", async (req, res) => {
  const { fullName, address, contact_info, email, password, num_of_pens, pen_capacity } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastFarmer = await Farmer.findOne().sort({ _id: -1 });
    let nextNumber = 1;
    if (lastFarmer && lastFarmer.farmer_id) {
      const lastNum = parseInt(lastFarmer.farmer_id.split("-")[1]);
      if (!isNaN(lastNum)) nextNumber = lastNum + 1;
    }
    const farmer_id = `Farmer-${String(nextNumber).padStart(5, "0")}`;

    const newFarmer = new Farmer({
      fullName,
      address,
      contact_info,
      email,
      password: hashedPassword,
      role: "farmer",
      farmer_id,
      num_of_pens: num_of_pens || 0,
      pen_capacity: pen_capacity || 0,
    });

    await newFarmer.save();

    res.status(201).json({ message: "Farmer registered successfully", farmer_id });
  } catch (error) {
    console.error("Farmer register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/farmers", async (req, res) => {
  try {
    const farmers = await Farmer.find({ role: "farmer" }).select("-password");
    res.json(farmers);
  } catch (error) {
    console.error("Fetch farmers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
