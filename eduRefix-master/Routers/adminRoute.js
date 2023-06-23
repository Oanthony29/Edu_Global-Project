const express = require("express");
const{newAdmin, confirmVerify,adminLogin, updateProfile,adminLogOut, getAllAdmin,Forgotpassword, resetpassword, changePassword, getSingleAdmin} = require("../Controllers/adminController");
const{newStudent,getAllStudents, deleteStudents,AllStudentsperClass, updateStudent, getSingleStudent} = require("../Controllers/addStudent");
const{allClass, oneClass, updateClass, deleteClass, createClass} = require("../Controllers/addClass");
const {newTeacher,getAllTeachers,AllTeachersperClass,deleteTeacher,updateTeacher, getOne} = require("../Controllers/addTeacher")
const {roleAuth} = require("../Utils/authorization");
const { getAllTimetable } = require("../Controllers/teacherTimeTable");
const { getAllStudentTimetable } = require("../Controllers/studentTimeTable");
// const Image = require("../Utils/multer");


const Route = express.Router();

// Route For Admin 
Route.route("/admin/sign").post(newAdmin); //checked
Route.route("/userVerify/:id").post(confirmVerify); //checked
Route.route("/admin/login").post(adminLogin);  //checked
Route.route("/admin/logout/:adminId").post(adminLogOut); //checked
Route.route("/admin/allAdmin").get(getAllAdmin);  //checked
Route.route("/admin/Admin/:adminId").get(getSingleAdmin); //checked
Route.route("/admin/updatedProfile/:adminid").patch(updateProfile);  //checked
Route.route("/admin/forgotPassword").post(Forgotpassword); //checked
Route.route("/admin/resetPassword/:Resetid").post(resetpassword);  //checked
Route.route("/admin/changePassword/:adminId").patch(changePassword); //checked

// Route For Students with Admin authorization
Route.route("/admin/:userid/:classId").post(roleAuth, newStudent);  //checked
Route.route("/admin/allStudent/:userid").get(roleAuth,getAllStudents);  //checked
Route.route("/admin/Student/:studentid").get(getSingleStudent) //checked
Route.route("/admin/allStudentsPerClass/:userid/:classId").get(roleAuth, AllStudentsperClass); //checked
Route.route("/student/:userid/:studentId").patch(roleAuth,updateStudent); //checked
Route.route("/admin/deleteStudent/:studentid/:classId").delete(deleteStudents); //checked
Route.route("/admin/alltimetable/student/:userid").get(roleAuth,getAllStudentTimetable); //checked


// Route For Teachers with Admin authorization
Route.route("/admin/:classId").post(newTeacher); //
Route.route("/admin/allTeacher/:userid").get(roleAuth,getAllTeachers); //checked
Route.route("/admin/Teacher/:teacherid").get(getOne); //checked
Route.route("/admin/allTeachersPerClass/:userid/:classId").get(roleAuth,AllTeachersperClass); //checked
Route.route("/teacher/:userid/:teacherId").patch(roleAuth,updateTeacher); //checked
Route.route("/admin/deleteTeacher/:teacherid/:classId").delete(deleteTeacher); //checked
Route.route("/admin/alltimetable/teacher/:userid").get(roleAuth,getAllTimetable); //checked

// Route For Class with Admin authorization
Route.route("/admin/allClass/:userid").get(roleAuth, allClass); //checked
Route.route("/admin/oneClass/:userid/:classId").get(roleAuth, oneClass); //checked
Route.route("/admin/:userid/class/:classId").patch(roleAuth, updateClass); //checked
Route.route("/admin/deleteClass/:userid/:classId").delete(roleAuth, deleteClass); //checked
Route.route("/classNew").post(createClass)



module.exports = Route