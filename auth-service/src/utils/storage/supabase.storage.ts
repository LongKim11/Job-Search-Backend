import { supabase } from '../../core/supabaseClient.core';

export const uploadFile = async (userId: string, file: Express.Multer.File) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (uploadError)
    throw new Error(`Upload avatar failed: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};

export const deleteFile = async (publicUrl: string) => {
  if (!publicUrl) return;

  const url = new URL(publicUrl);
  const pathParts = url.pathname.split('/');
  const filePathInBucket = pathParts.slice(6).join('/');

  const { error: removeError } = await supabase.storage
    .from('avatars')
    .remove([filePathInBucket]);

  if (removeError)
    throw new Error(`Remove old avatar failed: ${removeError.message}`);
};
