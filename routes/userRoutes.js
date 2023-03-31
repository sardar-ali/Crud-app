const express = require("express");
const multer = require("multer");
const User = require("../models/userModel")

//IMAGE UPLOAD SETUP
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },

    filename: (req, file, cb) => {
        const fileName = file?.originalname?.split(" ").join("-");
        const uniqueSuffix = Date.now()
        cb(null, fileName + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage }).single("image")

//Routing
const router = express.Router();

router.post("/add", upload, async (req, res) => {
    const user = new User({
        name: req?.body?.name,
        email: req?.body?.email,
        phone: req?.body?.phone,
        image: req?.file?.filename,
    })

    const result = await user.save();

    if (!result) {
        res.json({ message: err.message, type: "danger" })
    } else {
        req.session.message = {
            type: "success",
            message: "User added successfully"
        }
        res.redirect("/")
    }

    // res.render("index", { title: "home page", content: "hello friends" })
})

router.get("/", (req, res) => {
    res.render("index", { title: "home page", content: "hello friends" })
})

router.get("/add", (req, res) => {
    res.render("add-user", { title: "user page", content: "hello friends" })
})

module.exports = router;