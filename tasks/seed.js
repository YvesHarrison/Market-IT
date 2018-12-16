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
		address2: "Apt #3",
		email: "shreesh.chavan@gmail.com",
		hashedPassword: password
  });
  let user=await Userdata.addUser(newUser);
  let post_id=user._id;


  var newProducts = ({
		p_name: "Surface Laptop",
        p_description: "Surface Book 2 is the most powerful Surface ever; built with power and versatility to be a laptop, tablet, and portable studio all-in-one.",
        posterId: post_id,
        tags: ["Laptop, surface,touchscreen,compact"],
        image_name: "2018-12-11T22_54_49.280ZLaptop.jpg",
        image_path: "public/uploads/products/2018-12-11T22_54_49.280ZLaptop.jpg",
        price: 2100,
        quantity: 30
  });
  let newone=await Productdata.addProduct(newProducts);
  await Userdata.addPostedProductToUser(newone.posterId, newone.product_id);
  console.log("Done seeding database");
  await db.serverConfig.close();
};

main().catch(console.log);