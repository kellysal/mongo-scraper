// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools
const axios = ("axios");
const cheerio = ("cheerio");

// Require models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize express
const app = express();

// Use morgan for logging requests
app.use(logger("dev"));
// Parse req body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json);
// Public static folder (bucket)
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("index", __dirname + "/views");

// Connect to MongoDB - if deployed then use monolab - else use local db
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes

app.get("/", function (req, res) {
    db.Article.find({ saved: false }, function (err, result) {
        if (err) throw err;
        res.render("index", { result })
    })
});

app.get("/newscrape", function (req, res) {
    var $ = cheerio.load(response.data)
    $("h2 span").each(function (i, element) {
        var headline = $(element).text();
        var link = "https://www.nytimes.com";
        link = link + $(element).parents("a").attr("href");

        var summaryOne = $(element).parent().parent().siblings().children("li:first-child").text();
        var summaryTwo = $(element).parent().parent().siblings().children("li:last-child").text();

        if (headline && summaryOne && link) {
            results.push({
                headline: headline,
                summaryOne: summaryOne,
                summaryTwo: summaryTwo,
                link: link
            })
        }
    });

    db.Article.create(results)
        .then(function (dbArticle) {
            res.render("index", { dbArticle });
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        })
    app.get("/", function (req, res) {
        res.render("index")
    })
});

app.put("/update/:id", function (req, res) {
    console.log("Update");
    db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true } }, function (err, result) {
        if (result.changedRows === 0) {
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});

app.put("/unsave/:id", function (req, res) {
    console.log("Unsave");
    console.log(req.body);

    db.Article.updateOne({ _id: req.params.id }, { $set: { saved: false } }, function (err, result) {
        if (result.changedRows === 0) {
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});

app.put("/newnote/:id", function (req, res) {
    console.log(req.body);
    console.log(req.body._id);
    console.log(req.body.note);

    db.Article.updateOne({ _id: req.body._id }, { $push: { note: req.body.note } }, function (err, result) {
        console.log(result)
        if (result.changedRows === 0) {
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});

app.get("/saved", function (req, res) {
    const savedArticles = [];

    db.Article.find({ saved: true }, function (err, saved) {
        if (err) throw err;
        savedArticles.push(saved)
        res.render("saved", { saved })
    })
});

app.listen(port, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
