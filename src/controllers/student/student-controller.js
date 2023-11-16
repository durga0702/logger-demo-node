import { Student } from "../../models/student-model";
import { Class } from "../../models/class-model";
import { Grade } from "../../models/grade-model";
import { Attendance } from "../../models/attendance-model";
import { Assignment } from "../../models/assignment-model";
import { successResponse, errorResponse } from "../../middlewares/response";
import bcrypt from "bcrypt";

// Student Login

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const student = await Student.findOne({ email: email });
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const token = req.header("Authorization");
    if (student.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const passwordMatch = await bcrypt.compare(password, student.password);
    if (passwordMatch) {
      return successResponse(res, 200, "Login Successful", student);
    } else {
      return errorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Students accessing information about their class

export const getClassInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const token = req.header("Authorization");
    if (student.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const classInfo = await Class.findById(student.class._id);
    if (!classInfo) {
      return errorResponse(res, 404, "Class not found");
    }
    successResponse(res, 200, "Got Class information", classInfo);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// View Assignments

export const viewAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const token = req.header("Authorization");
    if (student.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const assignments = await Assignment.find({ student: id });
    successResponse(res, 200, "Viewing assignments", assignments);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error viewing assignments");
  }
};

// Students submit their work

export const submitWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignment_id, submitted_work } = req.body;
    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
      return errorResponse(res, 404, "Assignment not found");
    }
    assignment.submitted_work = submitted_work;
    assignment.submitted_by = id;
    await assignment.save();
    successResponse(res, 200, "Work submitted successfully", assignment);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error submitting work");
  }
};

// View grades for assignments and exams

export const viewGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const token = req.header("Authorization");
    if (student.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const grades = await Grade.findOne({ student_id: id }).select("grade");
    successResponse(res, 200, "Viewing grades", {
      student: student.name,
      grades,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error viewing grades");
  }
};

// Students view their attendance records

export const viewAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const token = req.header("Authorization");
    if (student.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const attendanceRecords = await Attendance.findOne({ student_id: id });
    successResponse(res, 200, "Viewing attendance records", {
      student: student.name,
      attendanceRecords,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error viewing attendance records");
  }
};

// export const viewStudents = async (req, res) => {
//   try {
//     const students = await Student.find({
//       section: "A",
//       role: "Student",
//     }).exec();
//     if (!students) {
//       return errorResponse(res, 404, "Not found");
//     }
//     successResponse(res, 200, "Student details", students);
//   } catch (error) {
//     console.error(error);
//     errorResponse(res, 500, "Internal Server Error");
//   }
// };

// export const viewClassDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const student = await Student.findById(id).populate("class");
//     successResponse(res, 200, "Student details", student);
//   } catch (error) {
//     console.error(error);
//     errorResponse(res, 500, "Internal Server Error");
//   }
// };
