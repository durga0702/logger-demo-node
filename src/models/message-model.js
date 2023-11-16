import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  content: { type: String, required: true },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now() },
});

export const Message = mongoose.model("Message", messageSchema);
