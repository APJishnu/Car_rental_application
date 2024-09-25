import { GraphQLUpload } from 'graphql-upload';
import Manufacturer from '../../models/manufacturer-model.js';
import cloudinary from '../../../../config/cloudinary.js';

const manufacturerResolver = {
  Upload: GraphQLUpload,

  Query: {
    getManufacturers: async () => {
      try {
        return await Manufacturer.findAll(); // Fetch all manufacturers from the database
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
        throw new Error('Failed to fetch manufacturers');
      }
    },
  },

  Mutation: {
    addManufacturer: async (_, { name, country, image }) => {
        
      try {

        console.log(image)
        // Wait for the image upload
        const { createReadStream } = await image;
        const stream = createReadStream();
  

        // Upload the image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, 
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          stream.pipe(uploadStream); // Pipe the stream to Cloudinary
        });

        const imageUrl = uploadResult.secure_url; // Get the secure URL of the uploaded image

        // Create a new manufacturer in the database
        const manufacturer = await Manufacturer.create({
          name,
          country,
          imageUrl,
        });

        console.log(imageUrl)

        return manufacturer; // Return the newly created manufacturer
      } catch (error) {
        console.error('Error adding manufacturer:', error);
        throw new Error('Failed to add manufacturer');
      }
    },
  },
};

export default manufacturerResolver;
