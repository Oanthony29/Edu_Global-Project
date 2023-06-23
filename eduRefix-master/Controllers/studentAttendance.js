const studentAttendance = require("../Models/studentAttendanceModel");

exports.markAttendance = async(req,res)=>{
    try{}catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};