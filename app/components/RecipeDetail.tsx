'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from './ui/use-toast';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit, ExternalLink, MoreVertical, Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabase';
import { OptimizedImage } from './ui/optimized-image';

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  url?: string;
  description?: string;
  rating: number;
  cookCount: number;
  lastCooked?: string;
  tags: string[];
  source?: string;
  userRecipeId: string;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeDetailProps {
  id: string;
  initialRecipe?: Recipe;
}

export default function RecipeDetail({ id, initialRecipe }: RecipeDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe || null);
  const [isLoading, setIsLoading] = useState(!initialRecipe);
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      // Only delete the user's connection to the recipe
      const { error } = await supabase.from('user_recipes').delete().eq('recipe_id', id).eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: 'Recipe removed',
        description: 'The recipe has been removed from your collection',
      });

      router.push('/');
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove recipe',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // If we have initialRecipe, no need to fetch
    if (initialRecipe) return;

    const fetchRecipe = async () => {
      if (!id || !user) return;

      setIsLoading(true);

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
        .eq('recipe_id', id)
        .eq('user_id', user.id)
        .single();

      setIsLoading(false);

      if (error) {
        console.error('Error fetching recipe:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recipe',
          variant: 'destructive',
        });
        return;
      }

      if (!data || !data.recipe) {
        console.error('No recipe data found');
        toast({
          title: 'Recipe not found',
          description: 'The requested recipe could not be found',
          variant: 'destructive',
        });
        router.push('/');
        return;
      }

      // Use any type to bypass TypeScript checks
      const recipeData = data.recipe as any;

      setRecipe({
        id: recipeData.id,
        title: recipeData.title,
        url: recipeData.url,
        imageUrl: recipeData.image_url,
        description: recipeData.description,
        source: recipeData.source,
        rating: data.rating,
        cookCount: data.cook_count,
        lastCooked: data.last_cooked,
        tags: data.tags || [],
        userRecipeId: data.id,
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
      });
    };

    fetchRecipe();
  }, [id, user, initialRecipe]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  if (!recipe) {
    return <div className="flex justify-center items-center h-[60vh]">Recipe not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="flex items-center" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/recipe/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Recipe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Recipe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Recipe Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3">
          <OptimizedImage
            src={recipe.imageUrl}
            alt={recipe.title}
            width={500}
            height={400}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          {recipe.source && (
            <p className="text-muted-foreground mb-4">
              Source:{' '}
              {recipe.url ? (
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  {recipe.source} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ) : (
                recipe.source
              )}
            </p>
          )}
          {recipe.description && <p className="mb-4">{recipe.description}</p>}
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < recipe.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Cooked {recipe.cookCount} {recipe.cookCount === 1 ? 'time' : 'times'}
            </div>
            {recipe.lastCooked && (
              <div className="text-sm text-muted-foreground">
                Last cooked: {format(new Date(recipe.lastCooked), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4 list-decimal list-inside">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="pl-2">
                    <span className="ml-2">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <div>
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the recipe from your collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
