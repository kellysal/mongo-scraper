// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require models
const db = require("./models");

// PORT
const PORT = process.env.PORT || 3000;

// Initialize express
const app = express();

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan for logging requests
app.use(logger("dev"));

// Parse req body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public static folder (bucket)
app.use(express.static("public"));

// Connect to MongoDB - if deployed then use monolab - else use local db
// const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines";
const MONGODB_URI = process.env.MONGO_URI || "mongodb://user1:password1@ds253537.mlab.com:53537/heroku_mh6z8dv5";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the buzzfeed website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.buzzfeed.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".story-card").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).find("h2").text();
            result.summary = $(this).find("p").text();
            result.link = $(this).find("a").attr("href");
            // result.image = $(this).children(".card_image").children("img").attr("url");
            // result.image = $(this).find("img").attr("href");
            // result.image = $(this).find("a").find("img").attr("src");

            db.Article.find({ title: result.title }).then(function (data) {
                if (result.link && result.summary && !data.length) {

                    // Create a new Article using the `result` object built from scraping
                    db.Article.create(result).then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);

                    }) // If an error occurred, log it
                        .catch(err => console.log(err));
                }
            });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// GET route - Index
app.get("/", function (req, res) {
    db.Article.find({ saved: false }).then(function (articles) {
        res.render("index", { articles });
    });
});

// PUT route - to save one article
app.put("/saveArticle/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (data) {
        console.log(data);
        res.send("Saved article.");
    });
});

// GET route - to show all saved articles
app.get("/savedArticles", function (req, res) {
    db.Article.find({ saved: true }).then(function (articles) {
        res.render("saved", { articles });
    });
});

// DELETE route - to delete all articles
app.delete("/delete", function (req, res) {
    db.Article.deleteMany({}).then(function (data) {
        console.log(data);
        res.render("index", data);
    });
});

// PUT route - to remove one article
app.put("/removeFromSaved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }).then(function (data) {
        res.send("Removed");
    });
});

// POST route - to save a note
app.post("/saveNote/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// GET route - to show notes per article (*NEED TO FIX)
app.get("/getNotes/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

// DELETE route - to delete a note
app.delete("/deleteNote/:noteid", function (req, res) {
    db.Note.deleteOne({ _id: req.params.noteid }).then(function (data) {
        console.log(data);
        res.send("Deleted");
    })
});

// Start the server
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
