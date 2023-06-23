const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    nameOfSchool : {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    phoneNumber: {
        type: String
    },
    schoolImage:{
        public_id: {
            type: String,
        },
        url:{ 
            type: String,
        }
    },
    address: {
        type: String
    },
    targetLine: {
        type: String
    },
    website: {
        type: String
    },
    country: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    token: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

const AdminSchema = mongoose.model("Admin", adminSchema)

module.exports = AdminSchema