const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: [true, "AccoumtName is Required"]
    },
    studentName: {
        type: String,
        required: [true, "StudentName is REquired"]
    },
    className: { 
        type: String,
        required: [true, "ClassName is required"]
    },
    termlyFees: {
        type: String,
        required: [true, "termlyFees is required"]
    }
},{
    timestamps: true
});

const feesModel = mongoose.model("fees", feesSchema)

module.exports = feesModel