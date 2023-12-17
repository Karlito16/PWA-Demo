const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const homeRouter = require("./routes/home.router");
const uploadsRouter = require("./routes/uploads.router");
const { configureHost } = require("./utils/utils");

dotenv.config()

// Configure port, host and url
const { externalUrl, port, host, baseUrl } = configureHost();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Condifugre body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add response middleware
app.use((req, res, next) => {
    // This is important when fetching sw.js file, since it is saved in /static/js, and that effects it's scope
    // More on: https://itecnote.com/tecnote/javascript-service-workers-fetch-event-never-fires/
    if (req.path.endsWith("sw.js"))
        res.set("Service-Worker-Allowed", "/");
    next();
});

// Configure static content
app.use("/static", express.static(path.join(__dirname, "public")));

// Configure routers
app.use(homeRouter.path, homeRouter.router);
app.use(uploadsRouter.path, uploadsRouter.router);

if (externalUrl) {
    const hostname = "0.0.0.0";
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    app.listen(port, () => console.log(`Server running at ${baseUrl}/`));
}
