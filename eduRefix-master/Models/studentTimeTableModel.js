const mongoose = require("mongoose");
const Schema = mongoose.Schema

const StudentTimeTable = new mongoose.Schema({
    studentName: {
        type: Schema.Types.ObjectId,
        ref: "addStudent"
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

const studentTimeTable = mongoose.model("StudenttimeTable", StudentTimeTable)

module.exports = studentTimeTable