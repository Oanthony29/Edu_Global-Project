const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TeacherTimeTable = new mongoose.Schema({
    teacherName: {
        type: Schema.Types.ObjectId,
        ref: "addTeacher"
    },
    timetableImage: {
        public_id: {
            type: String,
        },
        url:{ 
            type: String,
        }
    }
},{
    timestamps: true
});

const teacherTimeTable = mongoose.model("TeachertimeTable", TeacherTimeTable)

module.exports = teacherTimeTable