import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  teacher: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Subject = mongoose.model("Subject", subjectSchema);
