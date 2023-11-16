import { Student } from "../../models/student-model";
import { studentValidation } from "../../utils/student-validation";
import { successResponse, errorResponse } from "../../middlewares/response";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Add Students

export const addStudent = async (req, res) => {
  try {
    const { error, value } = studentValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    const { student_id, name, email, password, role } = value;
    const authToken = jwt.sign(value, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      student_id,
      name,
      email,
      password: hashedPassword,
      role,
      class: value.class,
      section: value.section,
      auth_token: authToken,
    });
    await student.save();
    successResponse(res, 201, "Student added", student);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding student");
  }
};

// Manage Students

export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid Student ID");
    }
    const updatedFields = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedStudent) {
      return errorResponse(res, 404, "Student not found");
    }
    successResponse(res, 200, "Student edited", updatedStudent);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error editing Student");
  }
};

export const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid Student ID");
    }
    const removedStudent = await Student.findByIdAndRemove(id);
    if (!removedStudent) {
      return errorResponse(res, 404, "Student not found");
    }
    successResponse(res, 200, "Student removed", removedStudent);
  } catch (error) {
    errorResponse(res, 500, "Error removing Student");
  }
};
