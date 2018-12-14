const dbConnection = require("../config/mongoConnection");
const Userdata = require("../data/users");
const userInfo = Userdata.addUser;
const Productdata = require("../data/products");
const productInfo = Productdata.addProduct;
const bcrypt = require('bcrypt');
let SALT_ROUNDS = 16;
const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  let pws="aaaa";
  let password=bcrypt.hashSync(pws, SALT_ROUNDS);
  var newUser = ({
		firstName: "Sanchita",
		lastName: "Rastogi",
		phone: "5512297754",
		city: "Jersey City",
		address1: "10 Ave Summit",
		address2: "",
		email: "srastog1@stevens.edu",
		hashedPassword: password,
  });
  await Userdata.addUser(newUser);
  var newUser = ({
		firstName: "Shreesh",
		lastName: "Chavan",
		phone: "5512297751",
		city: "Jersey City",
		address1: "JFK Boulevard",
		address2: "",
		email: "shreeshchavan@gmail.com",
		hashedPassword: password
  });
  await Userdata.addUser(newUser);

  var newProducts = ({
		
  });
  // await productInfo.addProduct(
  //     "Apple HomePod",
  //     "Excellent bass and consistently superior sound quality across a wide variety of music genres. The speaker is easy to set up and Siri can hear you from across a room.",
  //     "",
  //     "Speakers",
  //     ["best buy product"],
  //     "$329",
  //     "20",
  // )
  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);