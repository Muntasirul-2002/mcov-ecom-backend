import imageModel from "../models/imageModel.js";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage }).single('image');

export const imageUploadController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    console.log(req.file); // Log the uploaded file details
    const imageName = req.file.filename;
    
    try {
      await imageModel.create({ image: imageName });
      res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};


export const getImageController = async (req,res) =>{
   try {
    const images = await imageModel.find({});
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}