import express from 'express'
import { getImageController, imageUploadController } from '../controller/imageController.js'

const router = express.Router()

router.post('/image-upload', imageUploadController)
router.get('/get-image', getImageController)
export default router