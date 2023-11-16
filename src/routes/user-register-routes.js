import express from "express";
import {
  parentLogin,
  getChildInformation,
  communicateWithTeacher,
} from "../controllers/parant/parent-controller";
import { authTokenForParent } from "../middlewares/auth-middleware";
import { userRegistration } from "../controllers/user/user-controller";

const router = express.Router();

router.post("/user-register", userRegistration);

export default router;
