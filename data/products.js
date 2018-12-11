const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const users = require("./users");
const uuid = require("node-uuid");
var mongoose = require('mongoose');
/*------------------------------Comments-----------------------*/

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var Comments = mongoose.Schema({
comment :String,    
postId :String
});
module.exports = mongoose.model('Comments', Comments);


let exportedMethods = {
    getAllproducts() {
        return products().then(productCollection => {
            return productCollection.find({}).toArray();
        });
    },
    getProductsByTag(tag) {
        return products().then(productCollection => {
            return productCollection.find({
                tags: tag
            }).toArray();
        });
    },
    getProductById(id) {
        return products().then(productCollection => {
            return productCollection.findOne({
                product_id: id
            }).then(product => {
                if (!product) throw "product not found";
                return product;
            });
        });
    },
    addProduct(producData, posterId) {
        return products().then(productCollection => {
            return users.getUserById(posterId).then(userThatproducted => {
                let newproduct = {
                    p_name: producData.p_name,
                    p_description: producData.p_description,
                    posterId: posterId,
                    tags: producData.tags,
                    product_id: uuid.v4(),
                    comments: [],
                    image_name: "",
                    image_path: "",
                    price: producData.price,
                    quantity: producData.quantity
                };

                return productCollection
                    .insertOne(newproduct)
                    .then(newInsertInformation => {
                        return newInsertInformation.insertedId;
                    })
                    .then(newId => {
                        return this.getproductById(newId);
                    });
            });
        });
    },
    removeproduct(id) {
        return products().then(productCollection => {
            return productCollection.removeOne({
                product_id: id
            }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete product with id of ${id}`;
                } else {}
            });
        });
    },
    updateProduct(id, updatedproduct) {
        return products().then(productCollection => {
            let updatedproductData = {};

            if (updatedproduct.tags) {
                updatedproductData.tags = updatedproduct.tags;
            }

            if (updatedproduct.p_name) {
                updatedproductData.p_name = updatedproduct.p_name;
            }

            if (updatedproduct.p_description) {
                updatedproductData.p_description = updatedproduct.p_description;
            }
            if (updatedproduct.quantity) {
                updatedproductData.quantity = updatedproduct.quantity;
            }
            if (updatedproduct.price) {
                updatedproductData.price = updatedproduct.price;
            }


            let updateCommand = {
                $set: updatedproductData
            };

            return productCollection
                .updateOne({
                    product_id: id
                }, updateCommand)
                .then(result => {
                    return this.getproductById(id);
                });
        });
    },
    addCommentToProduct(commentData, productId) {
        return this.getProductById(productId).then(thisProduct => {
            return productCollection.updateOne({
                product_id: productId
            }, {
                $addToSet: {
                    comments: {
                        comment_id: uuid.v4(),
                        user_name: commentData.user_name,
                        commenter_id: commentData.commenter_id,
                        users_image_path: "",
                        comment: commentData.comment,
                    }
                }
            });
        });
    },
    rep_nameTag(oldTag, newTag) {
        let findDocuments = {
            tags: oldTag
        };

        let firstUpdate = {
            $pull: oldTag
        };

        let secondUpdate = {
            $addToSet: newTag
        };

        return productCollection
            .updateMany(findDocuments, firstUpdate)
            .then(result => {
                return productCollection.updateMany(findDocuments, secondUpdate);
            })
            .then(secondUpdate => {
                return this.getproductsByTag(newTag);
            });
    }
};

module.exports = exportedMethods;