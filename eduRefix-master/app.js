const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: "./Config/config.env"});
const cors = require("cors");
const fileUpload = require("express-fileupload")

const admin = require("./Routers/adminRoute");
const student = require("./Routers/studentRoute");
const teacher = require("./Routers/teacherRoute")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("./uploads"))

app.use(fileUpload({ 
    useTempFiles: true
}))


app.use("/api",admin);
app.use("/api", student);
app.use("/api", teacher)

app.get("/", (req,res)=>{
    res.send("Welcome Message to Edu Global")
});

app.use("/uploaded-image", express.static(process.cwd() + "/uploads"));

module.exports = app