import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: { type: Date, required: true },
  is_present: { type: Boolean, default: true },
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
