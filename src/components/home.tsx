import React, { useState, useEffect } from "react";
import RecipeHeader from "./RecipeHeader";
import RecipeGrid from "./RecipeGrid";
import RecipeDialog from "./RecipeDialog";
import { AuthDialog } from "./auth/AuthDialog";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { toast } from "./ui/use-toast";

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
}

const defaultRecipes: Recipe[] = [
  {
    id: "1",
    title: "Homemade Pizza Margherita",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    rating: 5,
    cookCount: 12,
    tags: ["Italian", "Comfort Food"],
    description: "Classic Italian pizza with fresh mozzarella and basil",
  },
  {
    id: "2",
    title: "Fresh Summer Salad",
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    rating: 4,
    cookCount: 8,
    tags: ["Healthy", "Quick Meals", "Vegetarian"],
    description: "Light and refreshing salad perfect for summer days",
  },
  {
    id: "3",
    title: "Chocolate Chip Cookies",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    rating: 5,
    cookCount: 15,
    tags: ["Desserts", "Baking"],
    description: "Classic homemade chocolate chip cookies",
  },
];

const Home = () => {
  const { user, signOut } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (user) {
      loadRecipes();
    } else {
      setRecipes([]);
    }
  }, [user]);

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      // Convert snake_case to camelCase
      const formattedData = (data || []).map((recipe) => ({
        ...recipe,
        imageUrl: recipe.image_url,
        cookCount: recipe.cook_count,
      }));
      setRecipes(formattedData);
    } catch (error) {
      console.error("Error loading recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load recipes",
        variant: "destructive",
      });
    }
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddRecipe = () => {
    setDialogMode("add");
    setSelectedRecipe(null);
    setIsDialogOpen(true);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setDialogMode("edit");
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSaveRecipe = async (recipeData: any) => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    try {
      // Convert camelCase to snake_case for database
      const dbData = {
        title: recipeData.title,
        url: recipeData.url,
        image_url: recipeData.imageUrl,
        description: recipeData.description,
        rating: recipeData.rating,
        notes: recipeData.notes,
        tags: recipeData.tags,
      };

      if (dialogMode === "add") {
        const { data, error } = await supabase
          .from("recipes")
          .insert([
            {
              ...dbData,
              user_id: user.id,
              cook_count: 0,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        // Convert snake_case back to camelCase for frontend
        const newRecipe = {
          ...data,
          imageUrl: data.image_url,
          cookCount: data.cook_count,
        };
        setRecipes([newRecipe, ...recipes]);
      } else {
        const { error } = await supabase
          .from("recipes")
          .update(dbData)
          .eq("id", selectedRecipe?.id);

        if (error) throw error;
        setRecipes(
          recipes.map((recipe) =>
            recipe.id === selectedRecipe?.id
              ? { ...recipe, ...recipeData }
              : recipe,
          ),
        );
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive",
      });
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter
      ? recipe.tags.includes(selectedFilter)
      : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <RecipeHeader
        onSearch={handleSearch}
        onAddRecipe={handleAddRecipe}
        onFilterSelect={handleFilterSelect}
        availableTags={Array.from(
          new Set(recipes.flatMap((recipe) => recipe.tags)),
        )}
        onAuthClick={() => (user ? signOut() : setIsAuthDialogOpen(true))}
        isAuthenticated={!!user}
      />
      <RecipeGrid recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />
      <RecipeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        initialData={{
          title: selectedRecipe?.title || "",
          url: selectedRecipe?.url || "",
          imageUrl: selectedRecipe?.imageUrl || "",
          description: selectedRecipe?.description || "",
          rating: selectedRecipe?.rating || 0,
          notes: selectedRecipe?.notes || "",
          tags: selectedRecipe?.tags || [],
        }}
        onSave={handleSaveRecipe}
      />
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </div>
  );
};

export default Home;
