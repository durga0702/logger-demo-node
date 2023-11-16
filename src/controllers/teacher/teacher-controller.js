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
// Teacher Login

export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Please add email or password");
    }
    const teacher = await Teacher.findOne({ email: email });
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const token = req.header("Authorization");
    if (teacher.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const passwordMatch = await bcrypt.compare(password, teacher.password);
    if (passwordMatch) {
      return successResponse(res, 200, "Login Successful", teacher);
    } else {
      return errorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// View assigned Classes

export const viewClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate({
      path: "class",
      select: "standard students",
    });
    const token = req.header("Authorization");
    if (teacher.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    successResponse(res, 200, "Viewing classes", teacher.class);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error fetching classes");
  }
};

// Add Student to Class

export const addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, student_id } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const token = req.header("Authorization");
    if (teacher.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const foundClass = await Class.findById(class_id);
    if (!foundClass) {
      return errorResponse(res, 404, "Class not found");
    }
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    foundClass.students.push(student_id);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { students: foundClass.students },
      { new: true }
    );
    if (updateClass) {
      return successResponse(res, 200, "Student added to class", {
        addedStudent: student_id,
      });
    } else {
      return errorResponse(res, 400, "Error adding student to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Remove Student from Class

export const removeStudentFromClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, student_id } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const token = req.header("Authorization");
    if (teacher.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    const foundClass = await Class.findById(class_id);
    if (!foundClass) {
      return errorResponse(res, 404, "Class not found");
    }
    const studentIndex = await foundClass.students.indexOf(student_id);
    if (studentIndex === -1) {
      return errorResponse(res, 404, "Student not found");
    }
    foundClass.students.splice(studentIndex, 1);
    const updateClass = await Class.findByIdAndUpdate(
      class_id,
      { students: foundClass.students },
      { new: true }
    );
    if (updateClass) {
      return successResponse(res, 200, "Student removed from class", {
        removedStudent: student_id,
      });
    } else {
      return errorResponse(res, 400, "Error adding student to class");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing Student");
  }
};

// Define Subjects

export const defineSubject = async (req, res) => {
  try {
    const { name, teacher_id } = req.body;
    const subject = new Subject({ name });
    const teacher = await Teacher.findById(teacher_id);
    if (!teacher) {
      return errorResponse(res, 404, "Teacher not found");
    }
    const token = req.header("Authorization");
    if (teacher.auth_token !== token) {
      return errorResponse(res, 401, "Invalid token");
    }
    teacher.subjects.push(subject._id);
    const updateTeacher = await Teacher.findByIdAndUpdate(
      teacher_id,
      { subjects: teacher.subjects },
      { new: true }
    );
    await subject.save();
    if (updateTeacher) {
      return successResponse(res, 201, "Subject defined", teacher.subjects);
    } else {
      return errorResponse(res, 400, "Error defining Subject");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Internal Server Error");
  }
};

// Manage Subjects

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    successResponse(res, 200, "Subject updated", subject);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating subject");
  }
};

export const removeSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndRemove(id);
    if (!subject) {
      return errorResponse(res, 404, "Subject not found");
    }
    successResponse(res, 200, "Subject removed", { removedSubject: id });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error removing subject");
  }
};

export const listAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    successResponse(res, 200, "Listing all subjects", subjects);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing subjects");
  }
};

// Upload study materials

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
  },
});

const upload = multer({
  storage: storage,
}).single("material");

export const uploadMaterial = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        return errorResponse(res, 400, error);
      } else {
        const { id } = req.params;
        const foundClass = await Class.findById(id);
        if (!foundClass) {
          return errorResponse(res, 404, "Class not found");
        }
        const newFile = {
          data: req.file.filename,
          content_type: req.file.mimetype,
        };
        foundClass.files.push(newFile);
        await foundClass.save();
        return successResponse(res, 201, "File uploaded", {
          files: foundClass.files,
        });
      }
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error uploading material");
  }
};

// Give Assignments and Schedule Exams

export const giveAssignments = async (req, res) => {
  try {
    const { title, description, due_date, student } = req.body;
    const assignment = new Assignment({
      title,
      description,
      due_date,
      student,
    });
    await assignment.save();
    successResponse(res, 201, "Assignment created", assignment);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error creating Assignment");
  }
};

export const scheduleExam = async (req, res) => {
  try {
    const { title, date, student } = req.body;
    const exam = new Exam({
      title,
      date,
      student,
    });
    await exam.save();
    successResponse(res, 201, "Exam scheduled", exam);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error scheduling Exam");
  }
};

// Input Grades for Exams and Assignments

export const inputGrades = async (req, res) => {
  try {
    const { student_id, assignment_id, exam_id, grade } = req.body;
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const assignment = await Assignment.findById(assignment_id);
    if (!assignment) {
      return errorResponse(res, 404, "Assignment not found");
    }
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return errorResponse(res, 404, "Exam not found");
    }
    const gradeEntry = await new Grade({
      student_id,
      assignment_id,
      exam_id,
      grade,
    });
    await gradeEntry.save();
    successResponse(res, 200, "Grade added", gradeEntry);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error inputting grades");
  }
};

// Manage Grades

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade } = req.body;
    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      { grade },
      { new: true }
    );
    if (!updatedGrade) {
      return errorResponse(res, 404, "Grade not found");
    }
    successResponse(res, 200, "Grade updated", { grade: updatedGrade });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating grade");
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGrade = await Grade.findByIdAndRemove(id);
    if (!deletedGrade) {
      return errorResponse(res, 404, "Grade not found");
    }
    successResponse(res, 200, "Grade deleted", deletedGrade._id);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error deleting grade");
  }
};

export const listGrades = async (req, res) => {
  try {
    const grades = await Grade.find();
    successResponse(res, 200, "Listing grades", { grades });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing grades");
  }
};

// Mark Student Attendance

export const markAttendance = async (req, res) => {
  try {
    const { student_id, date, is_present } = req.body;
    const student = await Student.findById(student_id);
    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }
    const attendanceEntry = await Attendance.create({
      student_id,
      date,
      is_present,
    });
    successResponse(res, 200, "Attendance marked", attendanceEntry);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error marking attendance");
  }
};

// Manage Attendance records

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_present } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { is_present },
      { new: true }
    );
    if (!attendance) {
      return errorResponse(res, 404, "Attendance record not found");
    }
    successResponse(res, 200, "Attendance record updated", attendance);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error updating attendance record");
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndRemove(id);
    if (!attendance) {
      return errorResponse(res, 404, "Attendance record not found");
    }
    successResponse(res, 200, "Attendance record deleted", {
      deletedRecord: id,
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error deleting attendance record");
  }
};

export const listAttendance = async (req, res) => {
  try {
    const attndanceRecords = await Attendance.find();
    successResponse(res, 200, "Listing attendance records", attndanceRecords);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error listing attendance records");
  }
};

// Communicate with Parents about their children's progress

// Send messages to parent

export const sendMessageToParent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const parent = await Parent.findById(id);
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    parent.messages.push(content);
    const updateParent = await Parent.findByIdAndUpdate(
      id,
      {
        messages: content,
      },
      { new: true }
    );
    if (updateParent) {
      return successResponse(
        res,
        200,
        "Message sent to parent",
        parent.messages
      );
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error sending message to parent");
  }
};

// Send report to parent

export const sendReportToParent = async (req, res) => {
  try {
    const { parent_id, report } = req.body;
    const parent = await Parent.findById(parent_id);
    if (!parent) {
      return errorResponse(res, 404, "Parent not found");
    }
    parent.reports.push(report);
    await parent.save();
    successResponse(res, 200, "Report sent to parent", parent.reports);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Error sending report to parent");
  }
};
