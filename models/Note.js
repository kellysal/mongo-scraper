const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;