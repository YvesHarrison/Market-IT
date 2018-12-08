const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async (req, res) => {
    try {
      res.render("products");
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

// router.get("/post", async (req, res) => {
//     try {
//       res.render("postproduct");
//     } catch (e) {
//       res.status(500).json({ error: e });
//     }
// });
module.exports = router;