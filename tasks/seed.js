const dbConnection = require("../config/mongoConnection");
const Userdata = require("../data/users");
const userInfo = Userdata.addUser;
const Productdata = require("../data/products");
const productInfo = Productdata.addProduct;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  await userInfo.addUser(
      "Sanchita",
      "Rastogi",
      "srastog1@stevens.edu",
      ["Ultra HD TV"],
      "5512297754",
      "Jersey City",
      "New Jersey",
      "10 Ave Summit",
      [""],
      [""],
      ["Good Product"],
  )
  await userInfo.addUser(
    "Shreesh",
    "Chavan",
    "shreeshchavan@gmail.com",
    ["ipad"],
    "5512297751",
    "Jersey City",
    "New Jersey",
    "JFK Boulevard",
    [""],
    [""],
    ["Great Product"],
)


  await productInfo.addProduct(
      "Apple HomePod",
      "Excellent bass and consistently superior sound quality across a wide variety of music genres. The speaker is easy to set up and Siri can hear you from across a room.",
      "",
      "Speakers",
      ["best buy product"],
      "$329",
      "20",
  )
  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);