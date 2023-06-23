const express = require("express");
const {teacherAuth} = require("../Utils/authorization");
const {teacherLogin,Forgotpassword,resetpassword,changePassword,teacherLogOut} = require("../Controllers/addTeacher");
const { addImage } = require("../Controllers/teacherTimeTable");
const {uploadResult, getAllResult, getSingleResult, updateResult, deleteResult} = require("../Controllers/result");
const { AllStudentsperClass } = require("../Controllers/addStudent");



const Route = express.Router();
Route.route("/teacher/login").post(teacherLogin); //checked
Route.route("/teacher/forgotPassword").post(Forgotpassword); //checked
Route.route("/teacher/resetPassword/:teacherId").post(resetpassword); //checked
Route.route("/teacherNewPassword/:teacherId").patch(changePassword); //checked
Route.route("/teacher/logout/:teacherId").post(teacherLogOut); //checked
Route.route("/teacher/timetable/:teacherId").post(addImage); //checked
Route.route("/teacher/ClassStudents/:classId").get(AllStudentsperClass);

//Route For Result with Teacher Auth
Route.route("/teacher/result/:teacherid/:studentid").post(uploadResult);
Route.route("/teacher/allResult").get(getAllResult);
Route.route("/teacher/:resultid").get(getSingleResult);
Route.route("/teacher/resultUpdate/:teacherid/:resultid").patch(teacherAuth,updateResult);
Route.route("/teacher/deleteResult/:teacherid/:studentid/:resultid").delete(teacherAuth,deleteResult);


module.exports = Route