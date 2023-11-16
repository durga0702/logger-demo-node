import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  standard: { type: String, required: true, unique: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  files: [{ data: Buffer, content_type: String }],
  schedule: {
    days: [{ type: String }],
    periods: [
      {
        day: { type: String },
        start_time: { type: String },
        end_time: { type: String },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
      },
    ],
  },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Class = mongoose.model("Class", classSchema);
