/**
 * General Image Upload API
 * HTTP layer for uploading images to the platform
 */
import axiosInstance from '@/services/axiosInstance';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface UploadedImage {
  id: number;
  url: string;
}

/**
 * Upload a generic image file
 * @param file - The image file to upload
 * @returns Uploaded image info with id and url
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<ApiResponse<UploadedImage>>(
    '/api/images/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.result;
}

/**
 * Upload multiple image files sequentially
 * @param files - Array of image files
 * @returns Array of uploaded image URLs
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const result = await uploadImage(file);
    urls.push(result.url);
  }

  return urls;
}