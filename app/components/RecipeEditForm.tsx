'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { useAuth } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface RecipeEditFormProps {
  id: string;
}

export default function RecipeEditForm({ id }: RecipeEditFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recipe data here
    setLoading(false);
  }, [id, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="flex items-center" onClick={() => router.push(`/recipe/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipe
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500">Recipe edit form will be implemented here. This is a placeholder component.</p>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="mr-2" onClick={() => router.push(`/recipe/${id}`)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast({
                title: 'Not implemented',
                description: 'Recipe editing functionality is not yet implemented',
              });
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
