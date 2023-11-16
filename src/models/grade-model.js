import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  grade: { type: Number, required: true },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Grade = mongoose.model("Grade", gradeSchema);
