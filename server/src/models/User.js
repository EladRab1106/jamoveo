import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin","player","singer"],
    default: "player",
  },
  instrument: {
    type: String,
    default: "none",
  }},
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;