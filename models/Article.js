const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

//Using the Schema constructor - create a new UserSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // saved: {
    //     type: Boolean,
    //     required: true,
    //     dafeult: false
    // },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// Create our model from the above schema - using mongoose model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model - for other files
module.exports = Article;