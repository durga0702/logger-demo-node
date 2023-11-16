import express from "express";
import {
  createAdmin,
  adminLogin,
  defineSubject,
  listAllUsers,
  blockUser,
  unblockUser,
  getUserDetails,
} from "../controllers/admin/administrator-controller";
import {
  addTeacher,
  editTeacher,
  removeTeacher,
  assignClassToTeacher,
  assignSubjectToTeacher,
} from "../controllers/admin/teacher-controller";
import {
  addStudent,
  editStudent,
  removeStudent,
} from "../controllers/admin/student-controller";
import {
  addParent,
  editParent,
  removeParent,
  associateWithChildren,
} from "../controllers/admin/parent-controller";
import {
  addClass,
  updateClass,
  removeClass,
  addSubjectToClass,
  assignStudentToClass,
  listClasses,
} from "../controllers/admin/class-controller";
import { authTokenForAdmin } from "../middlewares/auth-middleware";

const router = express.Router();

//  Admin
router.post("/create-admin", createAdmin);
router.post("/admin-login", authTokenForAdmin, adminLogin);

// Teachers
router.post("/add-teacher", authTokenForAdmin, addTeacher);
router.patch("/edit-teacher/:id", authTokenForAdmin, editTeacher);
router.delete("/remove-teacher/:id", authTokenForAdmin, removeTeacher);
router.post("/assign-class", authTokenForAdmin, assignClassToTeacher);
router.post("/assign-subject", authTokenForAdmin, assignSubjectToTeacher);

// Students
router.post("/add-student", authTokenForAdmin, addStudent);
router.patch("/edit-student/:id", authTokenForAdmin, editStudent);
router.delete("/remove-student/:id", authTokenForAdmin, removeStudent);

// Parents
router.post("/add-parent", authTokenForAdmin, addParent);
router.patch("/edit-parent/:id", authTokenForAdmin, editParent);
router.delete("/remove-parent/:id", authTokenForAdmin, removeParent);
router.post("/associate-children", authTokenForAdmin, associateWithChildren);

// Class
router.post("/add-class", authTokenForAdmin, addClass);
router.patch("/update-class/:id", authTokenForAdmin, updateClass);
router.delete("/remove-class/:id", authTokenForAdmin, removeClass);
router.post("/subject-to-class", authTokenForAdmin, addSubjectToClass);
router.post("/assign-student", authTokenForAdmin, assignStudentToClass);
router.get("/list-classes", authTokenForAdmin, listClasses);

// Subjects
router.post("/add-subject", authTokenForAdmin, defineSubject);

// Users
router.get("/list-users", authTokenForAdmin, listAllUsers);
router.post("/block-user", authTokenForAdmin, blockUser);
router.post("/unblock-user", authTokenForAdmin, unblockUser);
router.get("/get-user/:id", authTokenForAdmin, getUserDetails);

export default router;
