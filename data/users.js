const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
 
// User Schema
var UserSchema = mongoose.Schema({
  firstName:{
    type: String
  },
  lastName: {
    type: String
  },
	hashedPassword: {
		type: String
	},
	email: {
		type: String
	},
	products: {
		type: String
  },
  Phone: {
		type: String
  },

  city: {
    type: String
  },

  address1: {
    type: String
  },

  address2: {
    type: String
  }

});
var User = module.exports = mongoose.model('User', UserSchema);

// Posts Schema
var Posts = mongoose.Schema({
  title: String,
  description :String,
  by :String,
  });
  module.exports = mongoose.model('Posts', Posts);

let exportedMethods = {
  getAllUsers() {
    return users().then(userCollection => {
      return userCollection.find({}).toArray();
    });
  },

  getUserByemail(email) {
    return users().then(userCollection => {
      return userCollection.findOne({ email: email }).then(user => {
        
        if (!user) throw "User not found";

        return user;
      });
    });
  },

  getUserById(id) {
    return users().then(userCollection => {
      return userCollection.findOne({ _id: id }).then(user => {
        if (!user) throw "User not found";

        return user;
      });
    });
  },
  addUser(userData) {
    return users().then(userCollection => {
      let newUser = {
      
        firstName: userData.firstName,
        lastName: userData.lastName,
        _id: uuid.v4(),
        sessionId: "",
        email: userData.email,
        products: [],
        hashedPassword: userData.hashedPassword,
        Phone: userData.Phones,
        city: userData.city,
        state: userData.state,
        address1: userData.address1,
        address2: userData.address2,
        posted_products: [],
        bought_products: [],
        comments: []
      };

      return userCollection
        .insertOne(newUser)
        .then(newInsertInformation => {
          return newInsertInformation.insertedId;
        })
        .then(newId => {
          return this.getUserById(newId);
        });
    });
  },
  removeUser(id) {
    return users().then(userCollection => {
      return userCollection.removeOne({ _id: id }).then(deletionInfo => {
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete user with id of ${id}`;
        }
      });
    });
  },
  updateUser(id, updatedUser) {
    return this.getUserById(id).then(currentUser => {
      let updatedUser = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      };

      let updateCommand = {
        $set: updatedUser
      };

      return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
        return this.getUserById(id);
      });
    });
  },
  addBoughtProductToUser(userId, productId) {
    return this.getUserById(userId).then(currentUser => {
      return userCollection.updateOne(
        { _id: userId },
        {
          $addToSet: {
            bought_products:  productId
          }
        }
      );
    });
  },
  addPostedProductToUser(userId, productId) {
    return this.getUserById(userId).then(currentUser => {
      return userCollection.updateOne(
        { _id: userId },
        {
          $addToSet: {
            posted_products:  productId
          }
        }
      );
    });
  },
  addCommentsUser(userId, commentId) {
    return this.getUserById(userId).then(currentUser => {
      return userCollection.updateOne(
        { _id: userId },
        {
          $addToSet: {
            comments:  commentId
          }
        }
      );
    });
  },
  removePostedProductFromUser(userId, productId) {
    return this.getUserById(userId).then(currentUser => {
      return userCollection.updateOne(
        { _id: userId },
        {
          $pull: {
            posted_products: productId
          }
        }
      );
    });
  },
  removeBoughtProductFromUser(userId, productId) {
    return this.getUserById(userId).then(currentUser => {
      return userCollection.updateOne(
        { _id: userId },
        {
          $pull: {
            bought_products: productId
          }
        }
      );
    });
  }
};

module.exports = exportedMethods;
