import mongoose from "mongoose";
import User from "./UserModel.js";

const farmerSchema = new mongoose.Schema({
  farmer_id: { type: String, required: true },
  num_of_pens: { type: Number, default: 0 },
  pen_capacity: { type: Number, default: 0 },
});

const Farmer = User.discriminator("Farmer", farmerSchema);

export default Farmer;
