const router = require("express").Router();
const { Tutors, Student } = require("../models/schema");
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

//tutor signup api
router.post("/signup", async (req, res) => {
  try {
    await new Tutors({ ...req.body }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//tutor login api
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Tutors.findOne({ email, password });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/getTutorId", async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, "4qwerty4");
    const userId = decoded._id;

    const tutor = await Tutors.findOne({ _id: userId });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.status(200).json({ tutorId: tutor._id });
  } catch (error) {
    console.error("Error getting tutor ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/submitStudentData", async (req, res) => {
  try {
    const { tutorId, name, rollNo, course } = req.body;

    const tutor = await Tutors.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const student = new Student({ name, rollNo, course });
    await student.save();

    tutor.students.push(student);
    await tutor.save();

    res.status(201).json({ message: "Student data saved successfully" });
  } catch (error) {
    console.error("Error saving student data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getSubmittedData", async (req, res) => {
  try {
    const authToken = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(authToken, "4qwerty4");
    const tutorId = decoded._id;

    const tutor = await Tutors.findOne({ _id: tutorId });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    
    const populatedTutor = await Tutors.findOne({ _id: tutorId }).populate('students');

    if (!populatedTutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.status(200).json(populatedTutor.students);
  } catch (error) {
    console.error("Error fetching submitted data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = router;
