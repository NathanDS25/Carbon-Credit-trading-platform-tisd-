const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabase = createClient(
  'https://lqdlnxlkfevzkssxirab.supabase.co',
  'Crackinmya$$69' // Using the password/key from your connection string logic
);

const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}-${path.basename(file.originalname)}`;
  const { data, error } = await supabase.storage
    .from('plantations')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    console.error('Supabase Upload Error:', error);
    throw new Error('Failed to upload image to satellite storage');
  }

  // Generate Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('plantations')
    .getPublicUrl(fileName);

  return publicUrl;
};

module.exports = { uploadToSupabase };
