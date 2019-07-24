const mongoose = require("mongoose");

// Save reference to the Schema constructor
const Schema = mongoose.Schema;

// Use Schema constructor to create a new NoteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

// Creates model from the above schema - mongoose model method
var Note = mongoose.model("Note", NoteSchema);

// Export Note model
module.exports = Note;