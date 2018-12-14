const mongoCollections = require("../config/mongoCollections");
const metadata = mongoCollections.metadata;
let exportedMethods = {
  addProductEnquiry(producData) {

    return metadata().then(async productCollection => {
      console.log("hi");
      let newproduct = {
        p_name: producData.p_name,
        posterId: producData.posterId,
        buyerId: producData.buyerId,
        product_id: producData.product_id,
        price: producData.price,
      };
      console.log(newproduct);
      var nj = await productCollection.insertOne(newproduct);
      var newprod = await this.getEnquiredProductById(newproduct.product_id);
      return newprod;
    });

  },
  getEnquiredProductById(id) {
    if (!id) throw "Must provide an id";
    return metadata().then(productCollection => {
      return productCollection.findOne({
        product_id: id
      }).then(product => {
        if (!product) throw "product not found";
        return product;
      });
    });
  },
  getProductsByBuyerId(id) {
    return metadata().then(productCollection => {
        return productCollection.find({buyerId:id}).toArray();
    });
},
}
module.exports = exportedMethods;