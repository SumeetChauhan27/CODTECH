import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file, pathPrefix = 'messages') => {
    if (!file) return null;
    
    setIsUploading(true);
    setProgress(0);
    setError(null);

    if (file.size > 15 * 1024 * 1024) {
      setError('File size must be under 15MB');
      setIsUploading(false);
      return null;
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const storageRef = ref(storage, `${pathPrefix}/${fileName}`);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progressPercent);
        },
        (err) => {
          console.error("Upload error:", err);
          setError(err.message);
          setIsUploading(false);
          reject(err);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setIsUploading(false);
            setProgress(100);
            resolve(downloadURL);
          } catch (err) {
            setError(err.message);
            setIsUploading(false);
            reject(err);
          }
        }
      );
    });
  };

  return { uploadImage, progress, error, isUploading, setError };
}
