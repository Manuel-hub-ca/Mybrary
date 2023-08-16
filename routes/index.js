const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

// export default router
module.exports = router;
