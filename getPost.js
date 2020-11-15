// Express handlebars setup
var express = require("express");

var app = express();
var handlebars = require("express-handlebars").create({
    defaultLayout: "main",
});

// BodyParser middleware
var bodyParser = require("body-parser");

// More clear way to set the parser up
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded({ extended: false });

app.use(urlParser);
app.use(jsonParser);

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 10292);

// My code below ------------------------------------------------------

// GET URL
app.get("/", function (req, res) {
    var urlData = [];
    console.log(req.query);
    for (var i in req.query) {
        urlData.push({ name: i, value: req.query[i] });
    }

    var context = {};
    context.URLData = urlData;
    context.type = "GET";
    res.render("get", context);
});

// POST JSON ------------------------------------
app.post("/", function (req, res) {
    // Get (name,value) pairs from body instead of query
    var jsonData = [];
    for (var i in req.body) {
        jsonData.push({ name: i, value: req.body[i] });
    }

    var urlData = [];
    // Get (name,value) paris from query instead of body
    for (var j in req.query) {
        urlData.push({ name: j, value: req.query[j] });
    }

    // Send the data over so that it can show up in handlebars
    var context = {};
    context.URLData = urlData;
    context.JSONData = jsonData;
    context.type = "POST";
    res.render("post", context);
});

// Boiler plate below, handles 404/505 ------------------------------------------------
app.use(function (req, res) {
    res.status(404);
    res.render("404");
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type("plain/text");
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), function () {
    console.log(
        "Express started on http://localhost:" +
            app.get("port") +
            "; press Ctrl-C to terminate."
    );
});
