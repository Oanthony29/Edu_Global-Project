const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ResultSchema = new mongoose.Schema({
    studentName: {
        type: Schema.Types.ObjectId,
        ref: "addStudent"
    },
    currentSchoolTerm: {
        type: String,
        required: [true, "Current School Term is required" ]
    },
    resultImage: {
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

const ResultModel = mongoose.model("result", ResultSchema)

module.exports = ResultModel