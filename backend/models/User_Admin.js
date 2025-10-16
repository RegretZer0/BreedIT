import mongoose from "mongoose";
import User from "./UserModel.js";

const adminSchema = new mongoose.Schema({
  position: { type: String },
  department: { type: String },
});

const Admin = User.discriminator("Admin", adminSchema);

export default Admin;
