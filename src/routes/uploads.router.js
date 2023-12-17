const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const router = express.Router();

// Code from: https://stackoverflow.com/questions/65529221/how-to-change-a-file-originalname-in-multer
const UPLOAD_DIR = path.join(__dirname, "..", "public/uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, UPLOAD_DIR);
    },
    filename: (req, file, callback) => {
        let fn = file.originalname.replaceAll(":", "-");
        callback(null, fn);
    },
});
const upload = multer({ storage: storage });


router.get("/", (req, res) => {
    let images = fs.readdirSync(UPLOAD_DIR);
    images = images.reverse().slice(0, 10).map(image => { 
        return { 
            title: image.split("T")[0] + " " + image.split("T")[1].split(".")[0].replace("-", "h ").replace("-", "m ") + "s",
            url: image
        };});
    res.render("uploads", {
        images: images
    });
});


router.post("/", upload.single("image"), (req, res) => {
    res.sendStatus(201);
});


module.exports = {
    path: "/uploads",
    router: router
};