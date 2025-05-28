// services/imageService.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const { getDirectoryPath, getFileName } = require('../utils/helpers');
const AppError = require('../utils/appError');

class ImageService {
  static async processAndSaveImages(files, agentId) {
    if (!files || Object.keys(files).length === 0) {
      return []; // No files to process
    }

    const dir = getDirectoryPath(agentId);
    const createDirPath = config.imagePathUrl + dir; // Ensure this is the actual physical path

    if (!fs.existsSync(createDirPath)) {
      fs.mkdirSync(createDirPath, { recursive: true });
    }

    const imageUrls = [];
    const imagePromises = Object.keys(files).map(async (item, index) => {
      const file = files[item];
      const fileName = getFileName(agentId, index);
      const filePath = path.join(createDirPath, fileName); // Use path.join for correct path concatenation

      try {
        await sharp(file.data)
          // .resize(320, 240) // Optional: resize images
          .toFile(filePath);
        imageUrls.push({ url: dir + fileName });
      } catch (err) {
        console.error(`ImageService#processAndSaveImages: Failed to process image ${fileName}: ${err.message}`);
        // Decide how to handle individual image failures (e.g., skip, throw error)
        // For now, we'll just log and continue for other images.
        throw new AppError(`Failed to process image: ${fileName}`, 500); // Re-throw to be caught by catchAsync
      }
    });

    await Promise.all(imagePromises); // Wait for all images to be processed
    return imageUrls;
  }
}

module.exports = ImageService;