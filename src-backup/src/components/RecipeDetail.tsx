import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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

export default function RecipeDetail() {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
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

      navigate('/');
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove recipe',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || !user) return;

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

      if (error) {
        console.error('Error fetching recipe:', error);
        return;
      }

      if (!data || !data.recipe) {
        console.error('No recipe data found');
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
  }, [id, user]);

  if (!recipe) {
    return <div>{/* Add loading spinner if needed */}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="flex items-center" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/recipe/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
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
          <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
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
                className={`w-5 h-5 ${index < recipe.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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
            {recipe.lastCooked ? format(new Date(recipe.lastCooked), 'MMM d, yyyy') : 'Never'}
          </div>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Recipe</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this recipe from your collection?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Description */}
      {recipe.description && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-700">{recipe.description}</p>
        </div>
      )}

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {recipe.instructions && recipe.instructions.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal space-y-4 ml-5">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700 pl-2">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
