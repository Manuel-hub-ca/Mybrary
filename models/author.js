// const mongoose = require("mongoose");
// const Book = require("./book");
// // import mongoose from "mongoose";
// const authorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
// });

// authorSchema.pre("remove", function (next) {
//   Book.find({ author: this.id }, (err, books) => {
//     if (err) {
//       next(err);
//     } else if (books.lenght > 0) {
//       next(new Error("This auhtor has books still"));
//     } else {
//       next();
//     }
//   });
// });

// module.exports = mongoose.model("Author", authorSchema);

const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Custom method to delete an author and check associated books
authorSchema.methods.deleteWithCheck = async function () {
  const books = await Book.find({ author: this.id });

  if (books.length > 0) {
    throw new Error("This author has books still");
  }

  await this.deleteOne();
};

module.exports = mongoose.model("Author", authorSchema);
