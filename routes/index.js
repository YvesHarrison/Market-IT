const mainRoutes = require("./main");
const productRoutes = require("./products");
const userRoutes = require("./users");
const path = require("path");

const constructorMethod = app => {
  app.use("/",  mainRoutes );
  app.use("/products", productRoutes);
  app.use("/users", userRoutes);
  app.get("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });

  app.use("*", (req, res) => {
    res.redirect("/products");
  });
};

module.exports = constructorMethod;
