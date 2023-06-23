const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentAttendanceSchema = new mongoose.Schema({
    subjectTeacher: {
        type: String,
        required: [true, "Teacher's Name is required"]
    },
    attendanceDate: {
        type: Date,
        default: Date.now()
    },
    subject: {
        type: String
    },
    nameOfClass: {
        type: String,
        required: [true, "Class Name is required"]
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: "addStudent"
    }],
    present: {
        type: Boolean,
        default: false,
        required: true
    }
});


const studentAttendance = mongoose.model("studentAttendance", studentAttendanceSchema)

module.exports = studentAttendance