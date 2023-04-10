require("dotenv").config();
const path = require("path");
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const mongoose = require('mongoose');
const router = require("./routes/userRoutes")
const app = express();

const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}))

app.use((req, res, next) => {
    res.locals.message = req?.session?.message;
    delete req.session.message;
    next();
});


//view engine settings
app.use(express.static(__dirname + '/uploads'))
app.set('views', path.join(__dirname + "/views"));
app.set("view engine", "ejs");

mongoose.connect(process.env.DB_URI)
.then((res) => {
    console.log("DB connected successfully");
})
.catch((err) => {
    console.log("Unable to connect to MongoDB. Error: " + err);
});


app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})