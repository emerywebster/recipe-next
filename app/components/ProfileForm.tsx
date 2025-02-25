'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { getGravatarUrl, uploadAvatar } from '@/app/lib/avatar';

interface Profile {
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}

export function ProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    display_name: user?.user_metadata?.display_name || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
    bio: user?.user_metadata?.bio || '',
  });

  useEffect(() => {
    if (user?.email && !profile.avatar_url) {
      // Check if Gravatar exists
      fetch(getGravatarUrl(user.email), { method: 'HEAD' }).then((response) => {
        if (response.ok) {
          setProfile((p) => ({
            ...p,
            avatar_url: getGravatarUrl(user.email!),
          }));
        }
      });
    }
  }, [user, profile.avatar_url]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile,
      });

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const publicUrl = await uploadAvatar(file);
      setProfile((p) => ({ ...p, avatar_url: publicUrl }));

      toast({
        title: 'Avatar uploaded',
        description: 'Your avatar has been successfully uploaded',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Picture</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
          {user?.email && !profile.avatar_url && (
            <p className="text-sm text-muted-foreground">Using Gravatar if available</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          value={profile.display_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProfile((p) => ({ ...p, display_name: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}
