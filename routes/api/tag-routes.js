const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Tag, Product, ProductTag } = require("../../models");
const express = require("express");
const app = express();
app.use(express.json());

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    res.json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      res.status(404).json({ message: "No record with this ID" });
    } else {
      res.status(201).json(tagData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const newTag = await Tag.create({ tag_name });

    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
