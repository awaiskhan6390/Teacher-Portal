const mongoose = require("mongoose"); //import mongoose
const jwt = require("jsonwebtoken");

// Tutor-Schema
const tutor = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  students: [{type: mongoose.Schema.Types.ObjectId, ref: 'students'}]
});

// student-Schema
const studentSchema = new mongoose.Schema({
  name: { type: String },
  rollNo: { type: String },
  course: { type: String },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "tutors" },
});

// JWT Token Generator Code
tutor.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "4qwerty4", {
    expiresIn: "7d",
  });
  return token;
};

const Tutors = mongoose.model("tutors", tutor);
const Student = mongoose.model("students", studentSchema)

module.exports = { Tutors, Student };
