const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/products/');
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/bmp' || file.mimetype == 'image/jpg')
    callback(null, true);
  else
    callback(null, false);
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6
  },
  fileFilter:fileFilter
});
var DATA = require('../data');
var User = DATA.users;
var Prod = DATA.posts;
router.get("/", async (req, res) => {
  try {
    res.render("products");
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
router.post("/productup", upload.single('productImage'), async (req, res) => {
  try {
    console.log(req.file);
    if (req.user) {
      var newProd = {
        p_name: req.body.p_name,
        p_description: req.body.p_description,
        posterId: req.cookies.AuthCookie,
        tags: req.body.tags,
        image_name: req.file.originalname,
        image_path: req.file.path,
        price: req.body.price,
        quantity: req.body.quantity
      };
      Prod.addProduct(newProd, function (err, product) {
        if (err) throw err;
        console.log(product);
      });
    } else {

      res.status(403).render("users/logout", {
        msg: "You are not authenticated"
      });
    }
    var allprods = await Prod.getAllproducts();
    res.status(200).render("products");
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
router.get("/productup", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).render("postproduct");
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});

router.post("/comment", async (req, res) => {
  try {
    console.log("receive");
    console.log(req.body);
    res.send(req.body);
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
module.exports = router;