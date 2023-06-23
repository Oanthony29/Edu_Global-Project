const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherAttendanceSchema = new mongoose.Schema({
    Teacher: {
        type: Schema.Types.ObjectId,
        ref: "addTeacher",
        required: [true, "Teacher's Name is required"]
    },
    attendanceDate: {
        type: Date,
        default: Date.now()
    },
    present: {
        type: Boolean,
        default: false,
        required: true
    }
});


const teacherAttendance = mongoose.model("teacherAttendance", teacherAttendanceSchema)

module.exports = teacherAttendance