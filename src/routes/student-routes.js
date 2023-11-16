import express from "express";
import {
  studentLogin,
  getClassInformation,
  viewAssignments,
  submitWork,
  viewGrades,
  viewAttendance,
  // viewStudents,
  // viewClassDetails,
} from "../controllers/student/student-controller";
import { authTokenForStudent } from "../middlewares/auth-middleware";

const router = express.Router();

router.post("/student-login", authTokenForStudent, studentLogin);
router.get("/view-class/:id", authTokenForStudent, getClassInformation);
router.get("/assignments/:id", authTokenForStudent, viewAssignments);
router.post("/submit-work/:id", authTokenForStudent, submitWork);
router.get("/grades/:id", authTokenForStudent, viewGrades);
router.get("/attendance/:id", authTokenForStudent, viewAttendance);
// router.get("/view-students", viewStudents);
// router.get("/view-class/:id", viewClassDetails);

export default router;
