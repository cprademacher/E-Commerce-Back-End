const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");
const sequelize = require("../../config/connection");
const express = require("express");
const app = express();
app.use(express.json());

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll();
    res.json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id);
    if (!productData) {
      res.status(404).json({ message: "No record with this ID" });
    } else {
      res.status(201).json(productData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const { product_name, price, stock, category_id } = req.body;

    if (!product_name) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const newProduct = await Product.create({
      product_name,
      price,
      stock,
      category_id,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
