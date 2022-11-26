import cloudinary from './cloud.js'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'





const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'delivery_media',
      format: async (req, file) => 'png',
    },
  });
  const parser = multer({ storage: storage });
    
export const tryUpload = (parser.single('image'))
export const tryMultipleUpload = (parser.array('image'))
  