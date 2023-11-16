import { Parent } from "../../models/parent-model";
import { parentValidation } from "../../utils/parent-validation";
import { Student } from "../../models/student-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Add Parents

export const addParent = async (req, res) => {
  try {
    const { error, value } = parentValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 400, { error: error.details[0].message });
    }
    const { name, email, password, role } = value;
    const authToken = jwt.sign(value, process.env.SECRET_KEY);
    const hashedPassword = await bcrypt.hash(password, 10);
    const parent = new Parent({
      name,
      email,
      password: hashedPassword,
      role,
      auth_token: authToken,
    });
    await parent.save();
    successResponse(res, 201, "Parent added", parent);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error adding Parent");
  }
};

// Manage Parents

export const editParent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid Student ID");
    }
    const updatedFields = req.body;
    const updatedParent = await Parent.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedParent) {
      return errorResponse(res, 404, "Parent not found");
    }
    successResponse(res, 200, "Parent edited", updatedParent);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error editing Parent");
  }
};

export const removeParent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid Parent ID");
    }
    const removedParent = await Parent.findByIdAndRemove(id);
    if (!removedParent) {
      return errorResponse(res, 404, "Parent not found");
    }
    successResponse(res, 200, "Parent removed", removedParent);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing Parent");
  }
};

// Associate Parents with their Children

export const associateWithChildren = async (req, res) => {
  try {
    const { student_id, parent_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      return errorResponse(res, 400, "Invalid Student ID");
    } else if (!mongoose.Types.ObjectId.isValid(parent_id)) {
      return errorResponse(res, 400, "Invalid Parent ID");
    }

    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const parent = await Parent.findById(parent_id);
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    if (parent.children.includes(student_id)) {
      return errorResponse(
        res,
        400,
        "Student already associated with his / her parent"
      );
    }
    parent.children.push(student_id);
    const updateParent = await Parent.findByIdAndUpdate(
      parent_id,
      { children: parent.children },
      { new: true }
    );
    if (updateParent) {
      return successResponse(
        res,
        200,
        "Student associated with his / her parent",
        parent
      );
    } else {
      return errorResponse(
        res,
        400,
        "Error associating parent with their children"
      );
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};
