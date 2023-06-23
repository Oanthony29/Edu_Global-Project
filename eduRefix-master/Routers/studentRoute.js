const express = require("express");
const{studentLogin,studentLogOut,Forgotpassword,resetpassword,changePassword} = require("../Controllers/addStudent");
const { addImage } = require("../Controllers/studentTimeTable");



const Route = express.Router();

// Route For  Student 
Route.route("/student/login").post(studentLogin);  //checked
Route.route("/student/logout/:studentId").post(studentLogOut); //checked
Route.route("/student/forgotPassword").post(Forgotpassword); //checked
Route.route("/student/resetPassword/:studentId").post(resetpassword);  //checked
Route.route("/studentnewPassword/:studentId").patch(changePassword); //checked
Route.route("/student/timetable/:studentId").post(addImage);


module.exports = Route