const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async (req, res) => {
  try {
    res.render("dashboard");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/signup", async (req, res) => {
  try {
    res.render("signup");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;