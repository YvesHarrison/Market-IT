const mongoCollections = require("../config/mongoCollections");
const metadata = mongoCollections.metadata;
let exportedMethods = {
    addUserName(email) {
        return metadata().then(metadataCollection => {
            let newUser = email;
            metadataCollection.insertOne(newUser);
            return email;
        });
    },
    getUserByEmail(email) {
        return metadata().then(metadataCollection => {
          return metadataCollection.findOne(email).then(user => {
            if (!user) return false;
            return true;
          });
        });
      }
}