const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
var DATA = require('../data');
var User = DATA.users;
var Prod = DATA.posts;
var Posts = require('../data/users');
var Comments = require('../data/products');
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
  console.log(req.body);
  console.log("This is the body");
  var l_arrTags = req.body.split(/[\s,]+/);
  res.render("products");
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
router.get("/", async (req, res) => {
  try {
    console.log(req.query.search);
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      var products = await Prod.getProductsByTag(regex,req.query.search);
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
    console.log("hi");
    res.status(200).render("postproduct");
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
router.post("/productup", upload.single('productimage'), async (req, res) => {
  try {
    console.log(req.user);
    if (req.user) {
      console.log("prod herr1");
      var l_strArrtags;
      if (req.body.tags) {
        var tags = req.body.tags;
        l_strArrtags = tags.split(',');
      } else l_strArrtags = [];
      console.log(req.file);
      var newProd = {
        p_name: req.body.p_name,
        p_description: req.body.p_description,
        posterId: req.user._id,
        tags: l_strArrtags,
        image_name: req.file.originalname,
        image_path: (req.file.path).replace(/\\/g,"/"),
        price: req.body.price,
        quantity: req.body.quantity
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
    var product = await Prod.getProductById(req.params.id);
    if (product)
      res.status(200).render("details", {
        product: product
      });
    else throw "product not found";
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});
router.get('/detail', function (req, res) {
  Posts.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render('detail', {
        posts: posts
      });
    }
  });
});

router.get('/products/detail/:id', function (req, res) {
  Posts.addCommentsUser(req.params.id, function (err, postDetail) {
    if (err) {
      console.log(err);
    } else {
      Comments.find({
        'commentId': req.params.id
      }, function (err, comments) {
        res.render('detail', {
          postDetail: postDetail,
          comments: comments,
          commentId: req.params.id
        });
      });
    }
  });
});




module.exports = router;