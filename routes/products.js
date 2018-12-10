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

router.post("/comment", async (req, res) => {
    try {
      console.log("receive");
      console.log(req.body);
      res.send(req.body);
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