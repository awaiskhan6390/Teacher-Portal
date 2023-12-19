const express = require('express') //express import 
const app = express() //calling express

const cors = require('cors')       // cors import 
const connection = require('./database') //database file import 

const tutorRoutes = require("./routes/user") // routs imports

//middleware
app.use(cors()) //using cors
app.use(express.json())

//db connection
connection();

//routes
app.use("/api/tutor", tutorRoutes)

const port = 5713;
app.listen(port, () => console.log(`Listening on port ${port}`))