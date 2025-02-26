'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RecipeCard from './RecipeCard';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth';
import { Skeleton } from '@/app/components/ui/skeleton';

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  source?: string;
  rating: number;
  cookCount: number;
  tags: string[];
}

interface RecipeGridProps {
  recipes?: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  isLoading?: boolean;
}

const RecipeGrid = ({ recipes = [], onRecipeClick = () => {}, isLoading = false }: RecipeGridProps) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Show loading state while authentication is being determined
  if (isLoading || loading) {
    return (
      <div className="w-full min-h-screen p-6">
        <div className="max-w-[2520px] mx-auto xl:pl-20 xl:pr-20">
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-x-6 md:gap-y-10">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="w-full">
                  <div className="w-full h-[340px] bg-white rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-[250px]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // If there are no recipes, show a message
  if (recipes.length === 0) {
    return (
      <div className="w-full min-h-screen p-6">
        <div className="max-w-[2520px] mx-auto xl:pl-20 xl:pr-20">
          <div className="flex flex-col items-center justify-center py-20">
            <h3 className="text-2xl font-semibold mb-4">
              {user ? "You don't have any recipes yet" : 'Sign in to start saving recipes'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {user
                ? "Click the 'Add Recipe' button to get started"
                : 'Create an account to save and organize your favorite recipes'}
            </p>
            {!user && (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-[2520px] mx-auto xl:pl-20 xl:pr-20">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:gap-x-6 md:gap-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <RecipeCard
                title={recipe.title}
                imageUrl={recipe.imageUrl}
                source={recipe.source}
                onClick={() => router.push(`/recipe/${recipe.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RecipeGrid;
