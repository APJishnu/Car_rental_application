import axios from 'axios';
import { Readable } from 'stream';

const urlToFile = async (url) => {
  try {
    const validUrl = url.trim();
    if (!validUrl || !validUrl.startsWith('http')) {
      throw new Error(`Invalid URL: ${validUrl}`);
    }

    // Fetch the image
    const response = await axios.get(validUrl, {
      responseType: 'arraybuffer',
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the content type and create buffer
    const contentType = response.headers['content-type'];
    const buffer = Buffer.from(response.data);

    // Generate filename with extension based on content type
    const extension = contentType.split('/')[1];
    const filename = `image-${Date.now()}.${extension}`;

    // Return an object that matches what your uploadToMinio expects
    return {
      filename,
      createReadStream: () => {
        const readable = new Readable({
          read() {
            this.push(buffer);
            this.push(null);
          },
        });
        return readable;
      },
      mimetype: contentType,
    };
  } catch (error) {
    throw error;
  }
};

export default urlToFile