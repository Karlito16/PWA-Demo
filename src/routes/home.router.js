const express = require("express");
const walk = require("walk");
const path = require("path");

const router = express.Router();


router.get("/", async(req, res) => {
    res.render("home", {
    });
});


router.get("/404", async(req, res) => {
    res.render("404", {
    });
});


router.get("/about", async(req, res) => {
    res.render("about", {
    }) 
 });


router.get("/home", async(req, res) => {
    res.render("home", {
    });
});


router.get("/offline", async(req, res) => {
    res.render("offline", {
    });
});


router.get("/static", async(req, res) => {
    // Returns all static paths that server offers
    let dir = path.join(__dirname, "..", "public");
    let files = [];

    let walker = walk.walk(dir, { followLinks: false });

    walker.on("file", (root, stat, next) => {
        const relativePath = root.split("public")[1];
        files.push("/static" + relativePath + "/" + stat.name);
        next();
    });

    walker.on("end", () => {
        res.send(JSON.stringify(files));
    });
});


module.exports = {
    path: "/",
    router: router
};