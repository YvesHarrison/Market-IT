const express = require("express");
const router = express.Router();
const path = require("path");

var Posts = require('../data/users');
var Comments = require('../data/products');


router.get("/", async (req, res) => {
    try {
    
      res.render("products");
    } catch (e) {
      res.status(500).json({ error: e });

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
router.post("/productup", async (req, res) => {
  try {
    if (req.user) {
      var newProd = {
        p_name: req.body.p_name,
        p_description: req.body.p_description,
        posterId: req.cookies.AuthCookie,
        tags: req.body.tags,
        image_name: "",
        image_path: "",
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

router.get('/products/review',function(req,res){
  Posts.find({}, function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.render('index', { posts: posts });
      }
  }); 
});


router.get('/posts/detail/:id',function(req,res){
  Posts.addCommentsUser(req.params._id, function (err, postDetail) {
      if (err) {
        console.log(err);
      } else {
          Comments.find({'postId':req.params.id}, function (err, comments) {
              res.render('post-detail', { postDetail: postDetail, comments: comments, postId: req.params.id });
          });
      }
  }); 
});


module.exports = router;