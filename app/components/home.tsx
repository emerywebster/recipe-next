'use client';

import React, { useState, useEffect } from 'react';
import RecipeGrid from './RecipeGrid';
import RecipeDialog from './RecipeDialog';
import { useAuth } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabase';
import { toast } from './ui/use-toast';

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  cookCount: number;
  tags: string[];
  url?: string;
  description?: string;
  notes?: string;
  userRecipeId?: string;
  ingredients?: string[];
  instructions?: string[];
}

interface HomeProps {
  initialRecipes?: Recipe[];
}

const Home = ({ initialRecipes = [] }: HomeProps) => {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(initialRecipes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
    // If we have initial recipes, we're not loading
    if (initialRecipes.length > 0) {
      setIsLoading(false);
    }
  }, [initialRecipes]);

  // Load recipes when user changes
  useEffect(() => {
    if (user && isClient) {
      loadRecipes();
    } else if (!loading && isClient) {
      // If auth is done loading and we're on client, we can stop showing loading state
      setIsLoading(false);
    }
  }, [user, loading, isClient]);

  // Set up event listeners
  useEffect(() => {
    const handleSearch = (e: Event) => {
      const customEvent = e as CustomEvent<{ term: string }>;
      const searchTerm = customEvent.detail.term;
      let filtered = [...recipes];

      if (searchTerm) {
        filtered = filtered.filter((recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));
      } else {
        filtered = recipes;
      }

      setFilteredRecipes(filtered);
    };

    const handleFilter = (e: Event) => {
      const customEvent = e as CustomEvent<{ filter: string }>;
      const filter = customEvent.detail.filter;
      let filtered = [...recipes];

      if (filter) {
        filtered = filtered.filter((recipe) => recipe.tags?.includes(filter));
      } else {
        filtered = recipes;
      }

      setFilteredRecipes(filtered);
    };

    const handleAddRecipe = () => {
      setDialogMode('add');
      setSelectedRecipe(null);
      setIsDialogOpen(true);
    };

    document.addEventListener('recipeSearch', handleSearch);
    document.addEventListener('recipeFilter', handleFilter);
    document.addEventListener('addRecipe', handleAddRecipe);

    return () => {
      document.removeEventListener('recipeSearch', handleSearch);
      document.removeEventListener('recipeFilter', handleFilter);
      document.removeEventListener('addRecipe', handleAddRecipe);
    };
  }, [recipes]);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select(
          `
          id,
          rating,
          cook_count,
          last_cooked,
          notes,
          tags,
          created_at,
          recipe:recipe_library(
            id,
            url,
            title,
            image_url,
            description,
            source,
            ingredients,
            instructions
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map((item) => {
        // Use type assertion to help TypeScript
        const recipe = item.recipe as any;

        return {
          id: recipe.id,
          title: recipe.title,
          url: recipe.url,
          imageUrl: recipe.image_url,
          description: recipe.description,
          source: recipe.source,
          rating: item.rating,
          cookCount: item.cook_count,
          lastCooked: item.last_cooked,
          notes: item.notes,
          tags: item.tags || [],
          userRecipeId: item.id,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
        };
      });

      setRecipes(formattedData);
      setFilteredRecipes(formattedData);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recipes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setDialogMode('edit');
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleSaveRecipe = async (recipeData: any) => {
    try {
      if (dialogMode === 'add') {
        // First, check if the recipe URL already exists in the library
        let recipeId;
        if (recipeData.url) {
          const { data: existingRecipe } = await supabase
            .from('recipe_library')
            .select('id')
            .eq('url', recipeData.url)
            .single();

          if (existingRecipe) {
            recipeId = existingRecipe.id;
          }
        }

        // If no existing recipe, create a new one in the library
        if (!recipeId) {
          const { data: newLibraryRecipe, error: libraryError } = await supabase
            .from('recipe_library')
            .insert([
              {
                title: recipeData.title,
                url: recipeData.url,
                image_url: recipeData.imageUrl,
                description: recipeData.description,
                source: recipeData.url ? new URL(recipeData.url).hostname.replace('www.', '') : null,
                first_submitted_by: user?.id,
                ingredients: recipeData.ingredients,
                instructions: recipeData.instructions,
              },
            ])
            .select()
            .single();

          if (libraryError) throw libraryError;
          recipeId = newLibraryRecipe.id;
        }

        // Create user-specific recipe entry
        const { data: userRecipe, error: userRecipeError } = await supabase
          .from('user_recipes')
          .insert([
            {
              user_id: user?.id,
              recipe_id: recipeId,
              rating: recipeData.rating,
              notes: recipeData.notes,
              tags: recipeData.tags,
              cook_count: 0,
            },
          ])
          .select()
          .single();

        if (userRecipeError) throw userRecipeError;

        // Fetch the complete recipe data to add to the UI
        const { data: completeRecipe, error: fetchError } = await supabase
          .from('user_recipes')
          .select(
            `
            id,
            rating,
            cook_count,
            last_cooked,
            notes,
            tags,
            created_at,
            recipe:recipe_library(
              id,
              url,
              title,
              image_url,
              description,
              source,
              ingredients,
              instructions
            )
          `
          )
          .eq('id', userRecipe.id)
          .single();

        if (fetchError) throw fetchError;

        // Use type assertion to help TypeScript
        const completeRecipeData = completeRecipe.recipe as any;

        const newRecipe = {
          id: completeRecipeData.id,
          title: completeRecipeData.title,
          url: completeRecipeData.url,
          imageUrl: completeRecipeData.image_url,
          description: completeRecipeData.description,
          source: completeRecipeData.source,
          rating: completeRecipe.rating,
          cookCount: completeRecipe.cook_count,
          lastCooked: completeRecipe.last_cooked,
          notes: completeRecipe.notes,
          tags: completeRecipe.tags || [],
          userRecipeId: completeRecipe.id,
          ingredients: completeRecipeData.ingredients || [],
          instructions: completeRecipeData.instructions || [],
        };

        setRecipes([newRecipe, ...recipes]);
        setFilteredRecipes([newRecipe, ...filteredRecipes]);
      } else if (dialogMode === 'edit' && selectedRecipe) {
        // Update only user-specific data
        const { error: updateError } = await supabase
          .from('user_recipes')
          .update({
            rating: recipeData.rating,
            notes: recipeData.notes,
            tags: recipeData.tags,
          })
          .eq('id', selectedRecipe.userRecipeId);

        if (updateError) throw updateError;

        const updatedRecipes = recipes.map((recipe) =>
          recipe.id === selectedRecipe.id ? { ...recipe, ...recipeData } : recipe
        );
        setRecipes(updatedRecipes);
        setFilteredRecipes(updatedRecipes);
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to save recipe',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeGrid
        recipes={filteredRecipes}
        onRecipeClick={handleRecipeClick}
        isLoading={isLoading || loading || !isClient}
      />
      <RecipeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={{
          title: selectedRecipe?.title || '',
          url: selectedRecipe?.url || '',
          imageUrl: selectedRecipe?.imageUrl || '',
          description: selectedRecipe?.description || '',
          rating: selectedRecipe?.rating || 0,
          notes: selectedRecipe?.notes || '',
          tags: selectedRecipe?.tags || [],
        }}
        onSave={handleSaveRecipe}
      />
    </div>
  );
};

export default Home;
