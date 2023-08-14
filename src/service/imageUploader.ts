import axios from 'axios';

export async function uploadImage(file: Blob | File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ''
    );
    const response = await axios.post(
      process.env.NEXT_PUBLIC_CLOUDINARY_URL || '',
      formData
    );
    return response.data.url;
  } catch (err) {
    console.log(err);
  }
}
