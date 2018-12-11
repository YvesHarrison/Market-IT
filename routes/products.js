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