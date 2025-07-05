import { supabase } from '../../core/supabaseClient.core';

export const uploadFile = async (
  userId: string,
  file: Express.Multer.File,
  storageType: string = ''
) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  console.log('Uploading file:', storageType);
  const { error: uploadError } = await supabase.storage
    .from(storageType)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage
    .from(storageType)
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};

export const deleteFile = async (
  publicUrl: string,
  storageType: string = ''
) => {
  if (!publicUrl) return;

  const url = new URL(publicUrl);
  const pathParts = url.pathname.split('/');
  const filePathInBucket = pathParts.slice(6).join('/');

  const { error: removeError } = await supabase.storage
    .from(storageType)
    .remove([filePathInBucket]);

  if (removeError)
    throw new Error(`Remove old resume failed: ${removeError.message}`);
};
