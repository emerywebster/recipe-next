import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Edit, ExternalLink, Star } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
}

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error);
        return;
      }

      // Convert snake_case to camelCase
      setRecipe({
        ...data,
        imageUrl: data.image_url,
        cookCount: data.cook_count,
        lastCooked: data.last_cooked,
      });
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="flex items-center"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/recipe/${id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Recipe
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title and Source */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        {recipe.source && (
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {recipe.source}
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Your Rating</div>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${index < recipe.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Times Cooked</div>
          <div className="text-xl font-semibold">{recipe.cookCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Last Cooked</div>
          <div className="text-xl font-semibold">
            {recipe.lastCooked
              ? format(new Date(recipe.lastCooked), "MMM d, yyyy")
              : "Never"}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">About this Recipe</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {recipe.description}
        </p>
      </div>
    </div>
  );
}
