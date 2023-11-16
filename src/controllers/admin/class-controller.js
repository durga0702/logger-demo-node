import { Class } from "../../models/class-model";
import { classValidation } from "../../utils/class-validation";
import { Student } from "../../models/student-model";
import { Subject } from "../../models/subject-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import mongoose from "mongoose";

// Add class

export const addClass = async (req, res) => {
  try {
    const { error, value } = classValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    const { standard } = value;
    const newClass = new Class({ standard });
    await newClass.save();
    successResponse(res, 201, "Class added", newClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding class");
  }
};

// Manage Classes

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = classValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    const updatedFields = value;
    const updatedClass = await Class.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedClass) {
      return errorResponse(res, 404, "Class not found");
    }
    successResponse(res, 200, "Class updated", updatedClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating class");
  }
};

export const removeClass = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid Class ID");
    }
    const removedClass = await Class.findByIdAndRemove(id);
    if (!removedClass) {
      return errorResponse(res, 404, "Class not found");
    }
    successResponse(res, 200, "Class removed", removedClass);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing class");
  }
};

export const listClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    successResponse(res, 200, "Classes listed", classes);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing Classes");
  }
};

// Add Subjects to Class

export const addSubjectToClass = async (req, res) => {
  try {
    const { class_id, subject_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return errorResponse(res, 400, "Invalid Class ID");
    } else if (!mongoose.Types.ObjectId.isValid(subject_id)) {
      return errorResponse(res, 400, "Invalid Subject ID");
    }

    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    const foundClass = await Class.findById(class_id);
    if (!foundClass) {
      return errorResponse(res, 404, "Class not found");
    }
    if (foundClass.subjects.includes(subject_id)) {
      return errorResponse(res, 400, "Subject already assigned");
    }
    foundClass.subjects.push(subject_id);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { subjects: foundClass.subjects },
      { new: true }
    );
    if (updateClass) {
      return successResponse(
        res,
        200,
        `Subject ${subject.name} added to ${foundClass.standard}`,
        foundClass.subjects
      );
    } else {
      return errorResponse(res, 400, "Error adding subject to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Assigning Students to Class

export const assignStudentToClass = async (req, res) => {
  try {
    const { student_id, class_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return errorResponse(res, 400, "Invalid Class ID");
    } else if (!mongoose.Types.ObjectId.isValid(student_id)) {
      return errorResponse(res, 400, "Invalid Student ID");
    }

    const foundClass = await Class.findById(class_id);
    if (!foundClass) {
      return errorResponse(res, 404, "Class not found");
    }
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    if (foundClass.students.includes(student_id)) {
      return errorResponse(res, 400, "Student already assigned");
    }
    foundClass.students.push(student_id);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { students: foundClass.students },
      { new: true }
    );
    if (updateClass) {
      return successResponse(
        res,
        200,
        `Student ${student.name} assigned to ${foundClass.standard}`,
        foundClass.students
      );
    } else {
      return errorResponse(res, 400, "Error assigning student to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
