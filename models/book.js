const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [{ type: String, default: [] }]
})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book;