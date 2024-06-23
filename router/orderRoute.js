import express from 'express'
import { createOrder } from '../controller/orderController.js';

const router = express.Router()


router.post('/create-order', createOrder)
export default router;