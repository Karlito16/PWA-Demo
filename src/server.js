const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");
const homeRouter = require("./routes/home.router");
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

// Configure static content
app.use("/static", express.static(path.join(__dirname, "public")));

// Configure routers
app.use(homeRouter.path, homeRouter.router);

if (externalUrl) {
    const hostname = "0.0.0.0";
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    https.createServer({
        key: Buffer.from(process.env.PWAD_SERVER_KEY, "base64").toString("ascii"),
        cert: Buffer.from(process.env.PWAD_SERVER_CERT, "base64").toString("ascii")
    }, app).listen(port, function () {
        console.log(`Server running at ${baseUrl}/`);
    });
}
