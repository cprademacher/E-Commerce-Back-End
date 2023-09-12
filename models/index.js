// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category
Product.belongsTo(Caterogy, {
  foreignKey: "category_id",
});
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
// Products belongToMany Tags (through ProductTag)
Products.belongsTo(Tag, {
  foreignKey: "tag_id",
});
// Tags belongToMany Products (through ProductTag)
Tag.belongsTo(Product, {
  foreignKey: "product_id",
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
