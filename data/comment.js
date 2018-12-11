const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const users = require("./users");
const uuid = require("node-uuid");
var mongoose = require('mongoose');
/*------------------------------Comments-----------------------*/

var commentSchema = mongoose.Schema({

    commentBody : String,
    commentBy: String,
    createdAt : String

});

var Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;