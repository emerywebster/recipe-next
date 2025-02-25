import md5 from 'md5';
import { supabase } from '@/app/lib/supabase';

export function getGravatarUrl(email: string): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=200`;
}

export async function uploadAvatar(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error } = await supabase.storage.from('avatars').upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return publicUrl;
}
