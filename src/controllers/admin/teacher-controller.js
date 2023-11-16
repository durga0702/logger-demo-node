import { Teacher } from "../../models/teacher-model";
import { teacherValidation } from "../../utils/teacher-validation";
import { Class } from "../../models/class-model";
import { Subject } from "../../models/subject-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import jwt from "jsonwebtoken";
import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

// Add Teachers

export const addTeacher = async (req, res) => {
  try {
    const { error, value } = teacherValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    const { employee_id, name, email, password, role } = value;
    const authToken = jwt.sign(value, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({
      employee_id,
      name,
      email,
      password: hashedPassword,
      role,
      auth_token: authToken,
    });
    await teacher.save();
    successResponse(res, 201, "Teacher added", teacher);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding Teacher");
  }
};

// Manage Teachers

export const editTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return errorResponse(res, 400, "Invalid Teacher ID");
    }
    const updatedFields = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedTeacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    successResponse(res, 200, "Teacher edited", updatedTeacher);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error editing Teacher");
  }
};

export const removeTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid Teacher ID");
    }
    const removedTeacher = await Teacher.findByIdAndRemove(id);
    if (!removedTeacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    successResponse(res, 200, "Teacher removed", removedTeacher);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing Teacher");
  }
};

// Assigning Class to Teacher

export const assignClassToTeacher = async (req, res) => {
  try {
    const { class_id, teacher_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return errorResponse(res, 400, "Invalid Class ID");
    } else if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
      return errorResponse(res, 400, "Invalid Teacher ID");
    }

    const foundClass = await Class.findById(class_id);
    if (!foundClass) {
      return errorResponse(res, 404, "Class not found");
    }
    const teacher = await Teacher.findById(teacher_id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    if (teacher.class.includes(class_id)) {
      return errorResponse(res, 400, "Class already assigned");
    }
    teacher.class.push(class_id);
    foundClass.teachers.push(teacher_id);

    const updateTeacher = await Teacher.findByIdAndUpdate(
      teacher_id,
      { class: teacher.class },
      { new: true }
    );
    const updateFoundClass = await Class.findByIdAndUpdate(
      class_id,
      { teachers: foundClass.teachers },
      { new: true }
    );
    if (updateTeacher && updateFoundClass) {
      return successResponse(
        res,
        200,
        `${foundClass.standard} added to Teacher ${teacher.name}`,
        teacher.class
      );
    } else {
      return errorResponse(res, 400, "Error assigning class to teacher");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Assigning Subject to Teacher

export const assignSubjectToTeacher = async (req, res) => {
  try {
    const { subject_id, teacher_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
      return errorResponse(res, 400, "Invalid Teacher ID");
    } else if (!mongoose.Types.ObjectId.isValid(subject_id)) {
      return errorResponse(res, 400, "Invalid Subject ID");
    }

    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    const teacher = await Teacher.findById(teacher_id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    if (teacher.subjects.includes(subject_id)) {
      return errorResponse(res, 400, "Subject already assigned");
    }
    teacher.subjects.push(subject_id);
    subject.teacher.push(teacher_id);

    const updateTeacher = await Teacher.findByIdAndUpdate(
      teacher_id,
      { subjects: teacher.subjects },
      { new: true }
    );
    const updateSubject = await Subject.findByIdAndUpdate(
      subject_id,
      { teacher: subject.teacher },
      { new: true }
    );
    if (updateTeacher && updateSubject) {
      return successResponse(
        res,
        200,
        `Subject ${subject.name} assigned to Teacher ${teacher.name}`,
        teacher.subjects
      );
    } else {
      return errorResponse(res, 400, "Error assigning subject to teacher");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
