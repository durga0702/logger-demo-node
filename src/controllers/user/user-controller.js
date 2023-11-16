import { Teacher } from "../../models/teacher-model";
import { Class } from "../../models/class-model";
import { Parent } from "../../models/parent-model";
import { Subject } from "../../models/subject-model";
import { Assignment } from "../../models/assignment-model";
import { Exam } from "../../models/exam-model";
import { Grade } from "../../models/grade-model";
import { Attendance } from "../../models/attendance-model";
import { Student } from "../../models/student-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import bcrypt from "bcrypt";
import multer from "multer";
import { UserRegistration } from "../../models/userRegistration-model";
// Teacher Login

export const userRegistration = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const user = new UserRegistration({
      name,
      password,
     });
    await user.save();
    successResponse(res, 201, "User added", user);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding user");
  }
};

export const userLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return errorResponse(res, 400, "Please add name");
    }
    const user = await UserRegistration.findOne({ name });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    if (user) {
      return successResponse(res, 200, "Login Successful", user);
    } else {
      return errorResponse(res, 401, "Invalid name");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};


