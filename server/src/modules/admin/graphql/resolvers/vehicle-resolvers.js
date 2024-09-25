// vehicle-resolvers.js
import vehicleHelper from '../../helper/admin-helpers/vehicle-helper.js';


const vehicleResolvers = {
  Query: {
    getVehicles: async () => {
      return await vehicleHelper.getVehicles();
    },
    getVehicle: async (_, { id }) => {
      return await vehicleHelper.getVehicle(id);
    },
  },

  Mutation: {
    addVehicle: async (_, { input }, { files }) => {
      // Handle the file uploads using multer
      const { primaryImage, otherImages } = files;

      // Assuming primaryImage and otherImages are arrays of file objects
      const primaryImageUrl = await uploadFileToS3(primaryImage[0]);
      const otherImagesUrls = await Promise.all(otherImages.map(file => uploadFileToS3(file)));

      const vehicleInput = {
        ...input,
        primaryImage: primaryImageUrl,
        otherImages: otherImagesUrls,
      };

      return await vehicleHelper.addVehicle(vehicleInput);
    },

    editVehicle: async (_, { id, input }) => {
      return await vehicleHelper.editVehicle(id, input);
    },

    deleteVehicle: async (_, { id }) => {
      return await vehicleHelper.deleteVehicle(id);
    },
  },
};

const uploadFileToS3 = (file) => {
  // Use the AWS SDK to upload the file to S3 and return the URL
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `vehicles/${Date.now().toString()}_${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.Location); // The URL of the uploaded image
    });
  });
};

export default vehicleResolvers;
