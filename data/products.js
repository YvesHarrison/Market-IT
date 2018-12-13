const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const users = require("./users");
const uuid = require("node-uuid");
var mongoose = require('mongoose');

let exportedMethods = {
    getAllproducts() {
        return products().then(productCollection => {
            return productCollection.find({}).toArray();
        });
    },
    getProductsByTag(tag, normaltag) {
        if (!tag) throw "You must provide a tag";
        return products().then(async productCollection => {
            var l_arrprodnamenormal = await productCollection.find({
                p_name: normaltag
            }).toArray();
            var l_arrprodname = await productCollection.find({
                p_name: tag
            }).toArray();
            console.log(l_arrprodname);
            console.log(productCollection);
            var l_arrprodtags = await productCollection.find({
                tags: tag
            }).toArray();
            console.log(l_arrprodtags.concat(l_arrprodname))
            return Array.from(new Set(l_arrprodtags.concat(l_arrprodname).concat(l_arrprodnamenormal)));
        });
    },
    getProductById(id) {
        if (!id) throw "Must provide an id";
        return products().then(productCollection => {
            return productCollection.findOne({
                product_id: id
            }).then(product => {
                if (!product) throw "product not found";
                return product;
            });
        });
    },
    addProduct(producData) {

        return products().then(async productCollection => {
            console.log("hi");
            let newproduct = {
                p_name: producData.p_name,
                p_description: producData.p_description,
                posterId: producData.posterId,
                tags: producData.tags,
                product_id: uuid.v4(),
                comments: [],
                image_name: producData.image_name,
                image_path: producData.image_path,
                price: producData.price,
                quantity: producData.quantity
            };
            console.log(newproduct);
            var nj = await productCollection.insertOne(newproduct);
            var newprod = await this.getProductById(newproduct.product_id);
            return newprod;
        });

    },
    removeproduct(id) {
        if (!id) throw "You must provide an id";
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
        if (!id) throw "You must provide an id";
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
                    return this.getProductById(id);
                });
        });
    },
    addCommentToProduct(commentData, productId) {

        return products().then( async productCollection => {
            console.log(productCollection);
            return productCollection.updateOne({
                product_id: productId
            }, {
                $addToSet: {
                    comments: {
                        comment_id: uuid.v4(),
                        //commentBy: commentData.user_name,
                        //commenter_id: commentData.commenter_id,
                        commentBy: commentData.commentBy,
                        users_image_path: "",
                        commentBody: commentData.commentBody,
                        createdAt: commentData.createdAt,
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