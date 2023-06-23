const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new mongoose.Schema({
    nameOfClass: {
        type:String
    },
    classBranch: {
        type:  String
    },
    monthlyTutionFees: {
        type: String,
    },
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: "addTeacher"
    }],
    students:[{
        type: Schema.Types.ObjectId,
        ref: "addStudent"
    }]
},{
    timestamps: true
});

const classModel = mongoose.model("addClass", classSchema);

module.exports = classModel