import express from "express";
import {
  parentLogin,
  getChildInformation,
  communicateWithTeacher,
} from "../controllers/parant/parent-controller";
import { authTokenForParent } from "../middlewares/auth-middleware";
import { userLogin } from "../controllers/user/user-controller";

const router = express.Router();

router.post("/user-login", userLogin);

export default router;
