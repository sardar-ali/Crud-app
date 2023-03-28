const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index",{title:"home page", content:"hello friends"})
})

router.get("/add", (req, res) => {
    res.render("add-user",{title:"user page", content:"hello friends"})
})

module.exports = router;