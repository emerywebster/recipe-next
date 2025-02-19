import React from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { motion } from "framer-motion";

interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
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
    id: "1",
    title: "Homemade Pizza Margherita",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    rating: 5,
    cookCount: 12,
    tags: ["Italian", "Comfort Food"],
  },
  {
    id: "2",
    title: "Fresh Summer Salad",
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    rating: 4,
    cookCount: 8,
    tags: ["Healthy", "Quick Meals", "Vegetarian"],
  },
  {
    id: "3",
    title: "Chocolate Chip Cookies",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    rating: 5,
    cookCount: 15,
    tags: ["Desserts", "Baking"],
  },
];

const RecipeGrid = ({
  recipes = defaultRecipes,
  onRecipeClick = () => {},
}: RecipeGridProps) => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
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
          >
            <RecipeCard
              title={recipe.title}
              imageUrl={recipe.imageUrl}
              rating={recipe.rating}
              cookCount={recipe.cookCount}
              tags={recipe.tags}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecipeGrid;
