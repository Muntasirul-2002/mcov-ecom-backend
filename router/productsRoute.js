import express from 'express';
import { addCartProduct, deleteProduct, getCartProduct, getProduct, getRelatedProduct, getSingleProduct, products, removeCartProduct, updateProduct } from '../controller/productsController.js';
  import formidable from 'express-formidable'
import {isAdmin, requireSignIn} from '../middleware/authenticationMiddleware.js'
const router = express.Router();

//create products
router.post('/products', products)
//get all product
router.get('/get-product', getProduct)

//get product by slug
router.get('/get-product/:slug', getSingleProduct)

//update product 
router.put('/update-product/:id', isAdmin,requireSignIn, formidable() ,updateProduct)

//delete product
router.delete('/delete-product/:id', deleteProduct )

// add to cart
router.post('/cart/add-product', addCartProduct)

//get cart products
router.post('/cart/get-product', getCartProduct)

//remove product from cart
router.post('/cart/remove-product', removeCartProduct)

//get related products
router.get('/get-related-products', getRelatedProduct)


export default router