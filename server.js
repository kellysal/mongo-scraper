// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

const exphbs = require("express-handlebars");

// Require models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize express
const app = express();

// Use morgan for logging requests
app.use(logger("dev"));
// Parse req body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public static folder (bucket)
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//app.set("index", __dirname + "/views");

// Connect to MongoDB - if deployed then use monolab - else use local db
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// app.get("/", (req, res) => {
//     res.render("index");
// })

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
            result.title = $(element).find("h2").text();
            result.summary = $(element).find("p").text();
            result.link = $(element).find("a").attr("href");
            // result.image = $(this).find("img").attr("href");


            db.Article.find({ title: result.title }).then(function (data) {
                if (result.link && result.summary && !data.length) {

                    // Create a new Article using the `result` object built from scraping
                    db.Article.create(result)
                        .then(function (dbArticle) {
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

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we are able to successfully find Articles - send the back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/", function (req, res) {
    db.Article.find({ saved: false }).then(function (articles) {
        res.render("index", { articles });
    });
});

// Route to delete
app.delete("/delete", function (req, res) {
    db.Article.deleteMany({}).then(function (data) {
        console.log(data);
        res.render("index", data);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.put("/saveArticle/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (data) {
        console.log(data);
        res.send("Saved");
    });
});

// Route for saving/updating an Article's associated Note
app.get("/savedArticles", function (req, res) {
    db.Article.find({ saved: true }).then(function (articles) {
        res.render("saved", { articles });
    });
});

app.put("/removeFromSaved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }).then(function (data) {
        res.send("Removed");
    });
});

app.post("/saveComment/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: db.Note._id } }, { new: true });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.get("/getComments/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

// Route to delete
app.delete("/deleteComment/:noteid", function (req, res) {
    db.Note.deleteOne({ _id: req.params.noteid }).then(function (data) {
        console.log(data);
        res.send("Comment Deleted");
    })
});


// Start the server
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});