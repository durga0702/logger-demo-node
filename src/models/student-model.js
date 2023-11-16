import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  section: { type: String, required: true, enum: ["A", "B"] },
  role: { type: String, required: true },
  auth_token: { type: String },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Student = mongoose.model("Student", studentSchema);
