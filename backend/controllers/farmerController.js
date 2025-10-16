const bcrypt = require("bcrypt");
const Farmer = require("../models/User_Farmer");

// Register new farmer
const registerFarmer = async (req, res) => {
  try {
    const { fullName, address, contact_info, email, password } = req.body;

    const existing = await Farmer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Farmer already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = new Farmer({
      fullName,
      address,
      contact_info,
      email,
      password: hashedPassword,
      role: "farmer",
      farmer_id: `FARM-${Date.now()}`, // unique ID
    });

    await farmer.save();
    res.status(201).json({ message: "Farmer registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all farmers
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({ role: "farmer" }).select("-password");
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerFarmer, getFarmers };
