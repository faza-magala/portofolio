import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export class CloudinaryService {
  isAvailable(): boolean {
    return isConfigured;
  }

  /**
   * Generates a short-lived signature for secure direct client-to-Cloudinary uploads
   * without ever exposing CLOUDINARY_API_SECRET to the client.
   */
  generateUploadSignature(folder = 'portfolio_cms') {
    if (!isConfigured) {
      throw new Error('Cloudinary credentials are not configured in environment variables');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      folder,
    };
  }

  /**
   * Deletes an asset from Cloudinary by its public ID.
   */
  async deleteAsset(publicId: string) {
    if (!isConfigured) {
      return { result: 'skipped_not_configured' };
    }
    return cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryService = new CloudinaryService();
