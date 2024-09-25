// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "de20of6mt", // replace with your Cloudinary cloud name
  api_key: "675983841487782",        // replace with your Cloudinary API key
  api_secret: "h1YeKwSadXh-gGn2gDvjYQ8-vfU",  // replace with your Cloudinary API secret
});

export default cloudinary;
