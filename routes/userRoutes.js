const express = require("express");
const multer = require("multer");
const fs = require("fs");
const User = require("../models/userModel")


//spacify file/image type 
const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
}

//IMAGE UPLOAD SETUP
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },

    filename: (req, file, cb) => {
        const fileName = file?.originalname?.split(" ").join("-");
        const uniqueSuffix = Date.now()
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${uniqueSuffix}.${extension}`)
    }
})

const upload = multer({ storage }).single("image");

//Routing
const router = express.Router();

//add user 
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
})

//get list of user
router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.render("index", { title: "home page", users })
    } catch (error) {
        res.json({ message: error?.message })
    }

})

// delete user
router.get("/delete/:id", async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            res.json({ message: err.message, type: "danger" })
        } else {
            req.session.message = {
                type: "suucess",
                message: "User Deleted successfully"
            }
            try {
                fs.unlinkSync("./uploads/" + user?.image)
            } catch (error) {
                console.log("error ::", error)
            }
            res.redirect("/")
        }
    } catch (error) {
        res.json({ message: error?.message })
    }

});

//get edit user
router.get("/edit/:id", async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.json({ message: err.message, type: "danger" });
        }
        res.render("edit", { title: "Edit page", user })
    } catch (error) {
        res.json({ message: error?.message })
    }
});

//update user 
router.post('/update/:id', upload, async (req, res) => {


    let updatedImage;

    if (req?.file) {
        updatedImage = req?.file?.filename;
        try {
            fs.unlinkSync("./uploads/" + req?.body?.old_image)
        } catch (error) {
            console.log("error ::", error)
        }
    } else {
        updatedImage = req?.body?.old_image;
    }


    try {
        const response = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req?.body?.name,
                email: req?.body?.email,
                phone: req?.body?.phone,
                image: updatedImage
            },
            { new: true }
        );

        if (!response) {
            res.json({ message: err.message, type: "danger" })
        } else {
            req.session.message = {
                type: "success",
                message: "User Updated successfully"
            }
            res.redirect("/")
        }
    } catch (error) {
        res.json({ message: error?.message })
    }


});


router.get("/add", (req, res) => {
    res.render("add-user", { title: "user page", content: "hello friends" })
})

module.exports = router;