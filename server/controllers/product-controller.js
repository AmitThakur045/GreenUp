const prod = require("../model/product-model");
const User = require("../model/user-model");

const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, type, image_url, manufacture } = req.body;
    console.log("new Product", req.body);

    if (!name || !description || !type || !image_url || !manufacture) {
      return res.status(401).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email: manufacture });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const newProd = await prod.create({
      name,
      manufacture,
      image_url,
      type,
      description,
    });

    if (newProd) {
      // updating the product array
      user.products.push(newProd._id);

      // updating the total waste
      if (type === "pet") {
        user.wasteType.pet += 1;
      } else if (type === "hdpe") {
        user.wasteType.hdpe += 1;
      } else if (type === "pvc") {
        user.wasteType.pvc += 1;
      } else if (type === "ldpc") {
        user.wasteType.ldpc += 1;
      } else if (type === "pp") {
        user.wasteType.pp += 1;
      } else if (type === "ps") {
        user.wasteType.ps += 1;
      } else {
        user.wasteType.other += 1;
      }

      // updating the recycled waste
      // updating the total waste
      await user.save();
      console.log("user3", user);

      return res.status(201).json({
        _id: newProd._id,
        name: newProd.name,
        url: newProd.image_url,
        type: newProd.type,
        manufacture: newProd.manufacture,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Product not found",
    });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const product = await prod.findById(id);
    res.status(200).json({
      singleProd: product,
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

const companyProduct = async (req, res) => {
  const { email } = req.params;
  console.log("email", email);

  try {
    const user = await User.findOne({ email }).populate("products");
    console.log("user", user);

    res.status(200).json({ products: user.products });
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};

module.exports = { createProduct, getProduct, companyProduct };
