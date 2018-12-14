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
  let user=await Userdata.addUser(newUser);
  let post_id=user._id;


  var newProducts = ({
		p_name: "Surface Laptop",
        p_description: "Really nice laptop with Windows 10 pro.",
        posterId: post_id,
        tags: ["Laptop"],
        image_name: "2018-12-11T22_54_49.280ZLaptop.jpg",
        image_path: "public/uploads/products/2018-12-11T22_54_49.280ZLaptop.jpg",
        price: 2100,
        quantity: 30
  });
  await Productdata.addProduct(newProducts);
  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);