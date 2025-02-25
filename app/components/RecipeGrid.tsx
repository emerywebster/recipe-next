'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RecipeCard from './RecipeCard';
import { motion } from 'framer-motion';

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
}

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Homemade Pizza Margherita',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    source: 'italianfoodforever.com',
    rating: 5,
    cookCount: 12,
    tags: ['Italian', 'Comfort Food'],
  },
  {
    id: '2',
    title: 'Fresh Summer Salad',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    source: 'loveandlemons.com',
    rating: 4,
    cookCount: 8,
    tags: ['Healthy', 'Quick Meals', 'Vegetarian'],
  },
  {
    id: '3',
    title: 'Chocolate Chip Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    source: 'sallysbakingaddiction.com',
    rating: 5,
    cookCount: 15,
    tags: ['Desserts', 'Baking'],
  },
];

const RecipeGrid = ({ recipes = defaultRecipes, onRecipeClick = () => {} }: RecipeGridProps) => {
  const router = useRouter();

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
