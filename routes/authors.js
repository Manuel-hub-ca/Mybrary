const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const author = require("../models/author");
const Book = require("../models/book");
//All Authors Route

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    // Yes, you're correct! In the context of regular expressions, the "i" flag stands for
    // "case-insensitive." When you use the "i" flag in a regular expression, it indicates that the pattern
    // matching should be done without regard to the case of the letters. This means that it will match both
    // uppercase and lowercase letters.
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

//New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author",
    });
  }
});

//this router should be before the one router.get("/new" ...
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {}
});

router.put("/:id", async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    console.error(error);
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/new", {
        author: author,
        errorMessage: "Error updating Author",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.redirect("/");
    }

    await author.deleteWithCheck(); // Call the custom deleteWithCheck() method
    res.redirect(`/authors`);
  } catch (error) {
    console.error(error);
    if (error.message === "This author has books still") {
      // Handle error case where author has books
      // res.render("error-page", { errorMessage: error.message });
      return res.send(
        "<script>alert('This author has books and cannot be deleted.'); window.location.href = '/authors';</script>"
      );
    } else {
      res.redirect(`/authors/${req.params.id}`);
    }
  }
});

module.exports = router;
