import express from "express";
import {
  teacherLogin,
  viewClasses,
  addStudentToClass,
  removeStudentFromClass,
  defineSubject,
  updateSubject,
  removeSubject,
  listAllSubjects,
  uploadMaterial,
  giveAssignments,
  scheduleExam,
  inputGrades,
  updateGrade,
  deleteGrade,
  listGrades,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  listAttendance,
  sendMessageToParent,
  sendReportToParent,
} from "../controllers/teacher/teacher-controller";
import { authTokenForTeacher } from "../middlewares/auth-middleware";

const router = express.Router();

router.post("/teacher-login", authTokenForTeacher, teacherLogin);
router.get("/view-class/:id", authTokenForTeacher, viewClasses);
router.post("/add-student/:id", authTokenForTeacher, addStudentToClass);
router.delete(
  "/remove-student/:id",
  authTokenForTeacher,
  removeStudentFromClass
);
router.post("/define-subject", authTokenForTeacher, defineSubject);
router.patch("/update-subject/:id", authTokenForTeacher, updateSubject);
router.delete("/remove-subject/:id", authTokenForTeacher, removeSubject);
router.get("/list-subjects", authTokenForTeacher, listAllSubjects);
router.post("/upload-material/:id", authTokenForTeacher, uploadMaterial);
router.post("/assignments", authTokenForTeacher, giveAssignments);
router.post("/exams", authTokenForTeacher, scheduleExam);
router.post("/input-grades", authTokenForTeacher, inputGrades);
router.patch("/update-grade/:id", authTokenForTeacher, updateGrade);
router.delete("/delete-grade/:id", authTokenForTeacher, deleteGrade);
router.get("/list-grades", authTokenForTeacher, listGrades);
router.post("/mark-attendance", authTokenForTeacher, markAttendance);
router.patch("/update-attendance/:id", authTokenForTeacher, updateAttendance);
router.delete("/delete-attendance/:id", authTokenForTeacher, deleteAttendance);
router.get("/list-attendance", authTokenForTeacher, listAttendance);
router.post("/send-message/:id", authTokenForTeacher, sendMessageToParent);
router.get("/send-report", authTokenForTeacher, sendReportToParent);

export default router;
