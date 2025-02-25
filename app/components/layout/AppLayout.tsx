'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecipeHeader from '../RecipeHeader';
import { useAuth } from '@/app/lib/auth';
import { AuthDialog } from '../auth/AuthDialog';
import { supabase } from '@/app/lib/supabase';
import { NoiseBackground } from '../ui/noise-background';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch all unique tags
  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;

      const { data, error } = await supabase.from('user_recipes').select('tags').eq('user_id', user.id);

      if (error) {
        console.error('Error fetching tags:', error);
        return;
      }

      // Flatten and get unique tags
      const allTags = Array.from(new Set(data.flatMap((recipe) => recipe.tags || []).filter(Boolean))).sort();

      setAvailableTags(allTags);
    };

    fetchTags();
  }, [user]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const searchEvent = new CustomEvent('recipeSearch', {
      detail: { term },
    });
    document.dispatchEvent(searchEvent);
  };

  const handleAddRecipe = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }
    const addRecipeEvent = new CustomEvent('addRecipe');
    document.dispatchEvent(addRecipeEvent);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    const filterEvent = new CustomEvent('recipeFilter', {
      detail: { filter },
    });
    document.dispatchEvent(filterEvent);
  };

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen">
      <NoiseBackground />
      <div className="relative z-10">
        <RecipeHeader
          onSearch={handleSearch}
          onAddRecipe={handleAddRecipe}
          onFilterSelect={handleFilterSelect}
          availableTags={availableTags}
          onAuthClick={handleAuthClick}
          isAuthenticated={!!user}
        />
        <main>{children}</main>
        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      </div>
    </div>
  );
}
