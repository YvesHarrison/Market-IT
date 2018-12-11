const MongoClient = require("mongodb").MongoClient;

const settings = {
  mongoConfig: {
    serverUrl: "mongodb://localhost:27017/",
    database: "Market-IT"
  }
};

let fullMongoUrl =
  settings.mongoConfig.serverUrl + settings.mongoConfig.database;
let _connection = undefined;
let _db = undefined;


let connectDb = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(settings.mongoConfig.serverUrl,{ useNewUrlParser: true });
    _db = await _connection.db(settings.mongoConfig.database);
  }

  return _db;
};

module.exports = connectDb;
