import slugify from "slugify";
import productModel from "../models/productModel.js";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
// set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB
}).single("image");

//create product

export const products = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const { name, description, model, type, price, offer } = req.body;

      if (
        !name ||
        !description ||
        !model ||
        !type ||
        !price ||
        !offer ||
        !req.file
      ) {
        return res.status(400).send({ error: "All fields are required" });
      }

      const product = new productModel({
        name,
        description,
        model,
        type,
        price,
        offer,
        image: req.file.filename,
        slug: slugify(name),
      });

      await product.save();
      res.status(200).send({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  });
};

// get all products
export const getProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send({ message: "All product fetched", data: products });
  } catch (error) {
    console.log(error);
  }
};

// get single product using slug
export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug });

    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {}
};
// update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, model, type, price, offer } = req.body;
    let image = req.file ? req.file.filename : req.body.image;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        model,
        type,
        price,
        offer,
        image,
        slug: slugify(name),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating product", error });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid product ID" });
    }
    await productModel.findByIdAndDelete(id);
    res
      .status(200)
      .send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
};

// add to cart functionality
export const addCartProduct = async (req, res) => {
  try {
    const { productID, userID, role } = req.body;
    console.log({ productID, userID, role });
    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await productModel.findById(productID);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if(!user.cart){
      user.cart=[]
    }

    user.cart.push(product)

    const updateUser = await user.save()
    console.log(updateUser)
    res.status(200).json({cart:updateUser.cart})
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false, message:'internal server error'})
  }
};


// get cart product
export const getCartProduct = async (req,res)=>{
try {
  const {userID} = req.body;
  console.log(userID)
  const user = await userModel.findById(userID).populate('cart')
  if(!user){
    res.status(404).json({success:false, message:'user not found'})
  }
  res.status(200).json({success:true, cart: user.cart})
} catch (error) {
  console.log(error)
}
}


// remove cart product
export const removeCartProduct = async(req,res)=>{
  try {
    const {productID, userID} = req.body;
    console.log({productID,userID})

    const user = await userModel.findById(userID)
    if(!user){
      return res.send(404).json({success:false, message:'User not found'})
    }

    if(!user.cart || user.cart.length === 0){
      return res.status(400).json({success:false, message:'user cart is empty'})
    }

    const updateCart = user.cart.filter((product)=> String(product._id) !== productID)
    user.cart = updateCart;
    const updatedUser = await user.save()
    console.log(updatedUser)
    res.status(200).json({cart: updatedUser.cart})
  } catch (error) {
    console.log(error)
  }
}

export const getRelatedProduct = async (req, res) => {
  try {
    const { model, type } = req.query; // Use req.query to get parameters from query string
    const products = await productModel.find({ model: model, type: type }).limit(2);
    res.status(200).json({
      success: true,
      products // Changed to 'products' to match the response
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Error in fetching related products",
      error: error.message, // Use error.message for better error handling
    });
  }
};
