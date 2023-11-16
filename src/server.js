import express from "express";
import { connectDB } from "./configs/mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/administrator-routes";
import teacherRoutes from "./routes/teacher-routes";
import studentRoutes from "./routes/student-routes";
import parentRoutes from "./routes/parent-routes";
import userRegistrationRoutes from "./routes/user-register-routes";
import userLogin from "./routes/user-login"
import {server,app} from "./configs/socket";
var cors = require("cors");

dotenv.config();


app.use(cors());

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(express.static('uploads'))
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/user", userRegistrationRoutes);
app.use("/api/user", userLogin);


server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
