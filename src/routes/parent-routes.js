import express from "express";
import {
  parentLogin,
  getChildInformation,
  communicateWithTeacher,
} from "../controllers/parant/parent-controller";
import { authTokenForParent } from "../middlewares/auth-middleware";

const router = express.Router();

router.post("/parent-login", authTokenForParent, parentLogin);
router.get("/child-info/:id", authTokenForParent, getChildInformation);
router.post("/communicate-teacher", authTokenForParent, communicateWithTeacher);

export default router;
