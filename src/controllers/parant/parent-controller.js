import { Parent } from "../../models/parent-model";
import { Student } from "../../models/student-model";
import { Teacher } from "../../models/teacher-model";
import { Grade } from "../../models/grade-model";
import { Message } from "../../models/message-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import bcrypt from "bcrypt";

// Parent Login

export const parentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const parent = await Parent.findOne({ email: email });
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    const token = req.header("Authorization");
    if (parent.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const passwordMatch = await bcrypt.compare(password, parent.password);
    if (passwordMatch) {
      return successResponse(res, 200, "Login Successful", parent);
    } else {
      return errorResponse(res, 404, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Parents view their child's informations

export const getChildInformation = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const student = await Student.findOne({ parent: parent_id }).populate(
      "class"
    );
    const grades = await Grade.findOne({ student: student._id }).populate(
      "grade"
    );
    successResponse(res, 200, "Child information listed", {
      student,
      grades,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error fetching child information");
  }
};

// Parents communicate with teachers to discuss their child's progress

export const communicateWithTeacher = async (req, res) => {
  try {
    const { parent_id, teacher_id, content } = req.body;
    const parent = await Parent.findById(parent_id);
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    const teacher = await Teacher.findById(teacher_id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const message = new Message({
      from: parent_id,
      to: teacher_id,
      content,
    });
    await message.save();
    successResponse(res, 201, "Message sent", message);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error sending the message");
  }
};
