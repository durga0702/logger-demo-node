import mongoose from "mongoose";

const userRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
});

export const UserRegistration = mongoose.model("UserRegistration", userRegistrationSchema);
