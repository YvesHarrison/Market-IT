const express = require("express");
const router = express.Router();
const path = require("path");
const xss = require('xss');
const multer = require("multer");
var DATA = require('../data');
var User = DATA.users;
var Prod = DATA.posts;
var Comments = require('../data/comment');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads/products/');
  },
  filename: function (req, file, callback) {
    callback(null, (new Date().toISOString().replace(/:/g,'_') + file.originalname));
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
  fileFilter: fileFilter
});



router.post("/tag", (req, res) => {
  try{
  console.log(xss(req.body));
  console.log("This is the body");
  var l_arrTags = xss(req.body.split(/[\s,]+/));
  res.render("products");
  }
catch (e) {
  res.status(500).json({
    error: e
  });
}
});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
router.get("/", async (req, res) => {
  try {
    console.log(xss(req.query.search));
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(xss(req.query.search)), 'gi');
      var products = await Prod.getProductsByTag(regex,xss(req.query.search));
      res.render("products", {
        products: products
      });
    } else {
      var products = await Prod.getAllproducts();
      res.render("products", {
        products: products
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
router.get("/productup", async (req, res) => {
  try {
  
    res.status(200).render("postproduct");
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
router.post("/productup", upload.single('productimage'), async (req, res) => {
  try {
    console.log(xss(req.user));
    if (xss(req.user)) {
  
      var l_strArrtags;
      if (xss(req.body.tags)) {
        var tags = xss(req.body.tags);
        l_strArrtags = tags.split(',');
      } else l_strArrtags = [];
      console.log(xss(req.file));
      var newProd = {
        p_name: xss(req.body.p_name),
        p_description: xss(req.body.p_description),
        posterId: xss(req.user._id),
        tags: l_strArrtags,
        image_name: xss(req.file.originalname),
        image_path: xss((req.file.path)).replace(/\\/g,"/"),
        price: xss(req.body.price),
        quantity: xss(req.body.quantity)
      };
      console.log("this is new: " + JSON.stringify(newProd));
      var newone = await Prod.addProduct(JSON.parse(JSON.stringify(newProd)));
      console.log("this is new added: " + newone);
      if (newone) {
        let l_objuser = await User.addPostedProductToUser(newone.posterId, newone.product_id);
        console.log(l_objuser);
        if (!l_objuser) {
          throw "User not found";
        }
      } else throw "product couldnt be added";
    } else {

      res.status(403).render("users/logout", {
        msg: "You are not authenticated"
      });

    }
    var allprods = await Prod.getAllproducts();
    res.status(200).redirect('/products');
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    var product = await Prod.getProductById(xss(req.params.id));
    console.log(xss(req.params.id));
    
    if (product)
      res.status(200).render("detail", {
        product: product
      });
    else throw "product not found";
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});

router.get('/detail',function(req,res){
  try{
        res.render('detail');
  }
  catch (e) {
    res.status(500).json({
      error: e
    });
  }
  }); 


router.get('/detail/comments', function(req,res){
  try{
    Comments.find({}, function(err,comments){
      res.json(comments);
    });
  }
    catch (e) {
      res.status(500).json({
        error: e
      });
    }
});

router.post('/detail/comments', function(req,res){
  var commentBody = xss(req.body.commentBody);
  var commentBy = xss(req.body.commentBy);
  var createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  
  //console.log(Comments);
  var comment = new Comments();
  comment.commentBody = commentBody;
  comment.commentBy = commentBy;
  comment.createdAt = createdAt;
  console.log(comment);
  comment.save(function(err){
      res.json({message:"Comment saved successfully"}); 
  });

  Prod.addCommentToProduct(comment, function (err, user) {
    if (err) throw err;
    console.log(comment);
  });
});



module.exports = router;