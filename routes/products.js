const express = require("express");
const router = express.Router();
const path = require("path");
const xss = require('xss');
const multer = require("multer");
var DATA = require('../data');
var User = DATA.users;
var Prod = DATA.posts;
var metadata = DATA.metadata;
var Comments = require('../data/comment');
var nodemailer = require('nodemailer');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads/products/');
  },
  filename: function (req, file, callback) {
    callback(null, (new Date().toISOString().replace(/:/g, '_') + file.originalname));
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
  try {
    console.log(xss(req.body));
    console.log("This is the body");
    var l_arrTags = xss(req.body.split(/[\s,]+/));
    res.render("products");
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
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
      var products = await Prod.getProductsByTag(regex, xss(req.query.search));
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
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});
router.get("/productup", async (req, res) => {
  try {
    if(req.user)
    res.status(200).render("postproduct");
    else throw "You are not authenticated."
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/login');
  }
});
router.post("/productup", upload.single('productimage'), async (req, res) => {
  try {
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
        image_path: xss((req.file.path)).replace(/\\/g, "/"),
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
      res.status(403).render("login", {
        msg: "You are not authenticated"
      });
      req.flash('failure_msg', "You are not authenticated");
    }
    res.status(200).redirect('/products');
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});
router.post("/buy/:id", async (req, res) => {
  try {
    if (req.user) {
      var product = await Prod.getProductById(xss(req.params.id));
      if (product) {
        var seller = await User.getUserById(xss(product.posterId));
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'saveit.team@gmail.com',
            pass: 'save1234'
          }
        });
        var mailOptions = {
          from: 'saveit.team@gmail.com',
          to: seller.email,
          subject: xss(req.user.firstName) + ' wants to buy ' + xss(product.p_name) + ' from you',
          text: 'Hi Seller,\nCongratulations! ' + xss(req.user.firstName) + ' wants to buy your product: ' + xss(product.p_name) + ' in quantity = ' + xss(req.body.quantity) + '. Following is his message:\n\n' + xss(req.body.message) + '\n\n Please contact ' + xss(req.user.firstName) + ' on email: ' + xss(req.user.email) + '\n\nRegards,\nTeam Market IT'
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        var updateduser = await User.addBoughtProductToUser(xss(req.user._id), xss(product.product_id));
        if (updateduser) {
          var addMetadata = {
            p_name: product.p_name,
            posterId: product.posterId,
            buyerId: req.user._id,
            product_id: product.product_id,
            price: product.price,
          };
          var newone = await metadata.addProductEnquiry(addMetadata);
          res.redirect('/products');
        } else throw "product couldnt be bought";
      } else throw "product not found";
    } else {
      req.flash('failure_msg', "You are not authenticated, please log in");
      res.redirect('/login');
    }
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});
router.get("/buy/:id", async (req, res) => {
  try {
    var product = await Prod.getProductById(xss(req.params.id));
    if (product) {
      var seller = await User.getUserById(xss(product.posterId));
      res.status(200).render("buy", {
        product: product,
        seller: seller
      });
    } else throw "product not found";
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});
router.get("/edit/:id", async (req, res) => {
  try {
    var product = await Prod.getProductById(xss(req.params.id));
    if (product) {
      var seller = await User.getUserById(xss(product.posterId));
      var tags = (product.tags).join().toString();
      res.status(200).render("updateproduct", {
        product: product,
        seller: seller,
        tag: tags
      });
    } else throw "product not found";
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }

});
router.delete("/delete/:id", async (req, res) => {
  try {
    var product = await Prod.getProductById(xss(req.params.id));
    if (product) {
      await Prod.removeproduct(product.product_id, product.posterId);
      res.status(200).redirect(`../products/edit/${product.posterId}`);
      // res.status(200);
    } else throw "product not found";
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }

});
router.post("/edit/:id", async (req, res) => {
  try {
    console.log(req.body);
    var product = await Prod.getProductById(xss(req.params.id));
    if (xss(req.user) && xss(req.user._id) == product.posterId) {
      var l_strArrtags;
      if (xss(req.body.etags)) {
        var tags = xss(req.body.etags);
        l_strArrtags = tags.split(',');
      } else l_strArrtags = [];
      if (xss(req.body.ep_description) == product.p_description || xss(req.body.ep_description) == '') {
        var p_desc = product.p_description
      } else var p_desc = xss(req.body.ep_description);
      var updatedProd = {
        p_name: xss(req.body.ep_name),
        p_description: p_desc,
        tags: l_strArrtags,
        price: xss(req.body.eprice),
        quantity: xss(req.body.equantity)
      };
      console.log("this is new: " + JSON.stringify(updatedProd));
      var newone = await Prod.updateProduct(product.product_id, JSON.parse(JSON.stringify(updatedProd)));
      console.log("this is new added: " + newone);
      
    } else {
      req.flash('failure_msg', 'You are not authenticated');
      res.status(403).redirect("/login");

    }
    // res.status(200);
    res.status(200).redirect('/products');
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});

router.get("/:id", async (req, res) => {
  try {
    var product = await Prod.getProductById(xss(req.params.id));
    console.log(xss(req.params.id));

    if (product) {
      var tags = (product.tags).join().toString();
      var reviews = product.comments.length;
      res.status(200).render("detail", {
        product: product,
        tag: tags,
        reviews :reviews
      });
    } else throw "product not found";
  } catch (e) {
    console.log(e);
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});

router.get('/detail', function (req, res) {
  try {
    res.render('detail');
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }
});


router.post('/:id/detail/comment', async function (req, res) {
  try {
    let pro_id = xss(req.body.pro_id);
    let commentset = await Prod.getcomment(pro_id);
    //console.log("router",commentset);
    res.json(commentset);
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(403).redirect('/' + req.params.id + '/detail/comment');
  }

});

router.post('/:id/detail/comments', async function (req, res) {
  try {
    if (xss(req.user)) {
      var commentBody = xss(req.body.commentBody);
      var createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      //console.log("user id",req.user._id);
      var comment = new Comments();
      comment.commentBody = commentBody;
      comment.commentBy = xss(req.user.firstName);
      comment.createdAt = createdAt;
      console.log("comment:", comment);
      comment.save(function (err) {
        res.json({
          message: "Comment saved successfully"
        });
      });
      await Prod.addCommentToProduct(comment, xss(req.params.id), function (err, user) {
        if (err) throw err;
        console.log("store:", comment);
      });
      res.json(comment);
    } else {
      let checkmessage = {
        status: false
      };
      res.json(checkmessage);
    }
  } catch (e) {
    var msg = (typeof (e) == String) ? e : e.message;
    msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
    req.flash('failure_msg', msg);
    res.status(500).redirect('/products');
  }

});



module.exports = router;