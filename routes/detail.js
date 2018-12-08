const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async (req, res) => {
    try {
      res.render("detail");
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

module.exports = router;