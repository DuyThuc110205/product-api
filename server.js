const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Product API is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// GET tất cả Product
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET Product theo pid
app.get("/api/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// POST - tạo Product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product({
      pid: req.body.pid,
      pname: req.body.pname,
      price: req.body.price,
      quantity: req.body.quantity
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// PUT - cập nhật Product
app.put("/api/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      {
        pname: req.body.pname,
        price: req.body.price,
        quantity: req.body.quantity
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE - xóa Product
app.delete("/api/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});