const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Category, Product } = require("../../models");
const express = require("express");
const app = express();

app.use(express.json());

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
      attribues: {
        include: [[sequelize.literal("(SELECT * FROM category)"), "products"]],
      },
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock"],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM product WHERE product.category_id = category_id)"
            ),
            "product_count",
          ],
        ],
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: "Category with that id not found." });
      return;
    }

    console.log(categoryData);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(201).json(categoryData);
  } catch (err) {
    console.err(err);
    res.status(500).json(err);
  }
});

// the above is not working, I think it might be because the content type
// when I try to post is text/html; charset=utf-8 but I can't figure out
// how to fix that.

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData[0]) {
      res.status(404).json({ message: "Category with that id not found." });
      return;
    }
    res.status(200).json({ message: "Category updated successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData) {
      res.status(404).json({ message: "Category with that id not found." });
      return;
    }
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
