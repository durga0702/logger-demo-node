import mongoose, { mongo } from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Exam = mongoose.model("Exam", examSchema);
