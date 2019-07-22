const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summaryOne: {
        type: String,
        required: true
    },
    summaryTwo: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        required: false
    },
    note: []
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;