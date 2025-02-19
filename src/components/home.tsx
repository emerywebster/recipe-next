import React, { useState, useEffect } from "react";
import RecipeGrid from "./RecipeGrid";
import RecipeDialog from "./RecipeDialog";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
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

const Home = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  // Load recipes when user changes
  useEffect(() => {
    if (user) {
      loadRecipes();
    } else {
      setRecipes([]);
      setFilteredRecipes([]);
    }
  }, [user]);

  // Set up event listeners
  useEffect(() => {
    const handleSearch = (e: Event) => {
      const customEvent = e as CustomEvent<{ term: string }>;
      const searchTerm = customEvent.detail.term;
      let filtered = [...recipes];

      if (searchTerm) {
        filtered = filtered.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );
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
        filtered = filtered.filter((recipe) => recipe.tags.includes(filter));
      } else {
        filtered = recipes;
      }

      setFilteredRecipes(filtered);
    };

    const handleAddRecipe = () => {
      setDialogMode("add");
      setSelectedRecipe(null);
      setIsDialogOpen(true);
    };

    document.addEventListener("recipeSearch", handleSearch);
    document.addEventListener("recipeFilter", handleFilter);
    document.addEventListener("addRecipe", handleAddRecipe);

    return () => {
      document.removeEventListener("recipeSearch", handleSearch);
      document.removeEventListener("recipeFilter", handleFilter);
      document.removeEventListener("addRecipe", handleAddRecipe);
    };
  }, [recipes]);

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map((recipe) => ({
        ...recipe,
        imageUrl: recipe.image_url,
        cookCount: recipe.cook_count,
      }));

      setRecipes(formattedData);
      setFilteredRecipes(formattedData);
    } catch (error) {
      console.error("Error loading recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load recipes",
        variant: "destructive",
      });
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setDialogMode("edit");
    setSelectedRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleSaveRecipe = async (recipeData: any) => {
    try {
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
              user_id: user?.id,
              cook_count: 0,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        const newRecipe = {
          ...data,
          imageUrl: data.image_url,
          cookCount: data.cook_count,
        };
        setRecipes([newRecipe, ...recipes]);
        setFilteredRecipes([newRecipe, ...filteredRecipes]);
      } else if (selectedRecipe) {
        const { error } = await supabase
          .from("recipes")
          .update(dbData)
          .eq("id", selectedRecipe.id);

        if (error) throw error;

        const updatedRecipes = recipes.map((recipe) =>
          recipe.id === selectedRecipe.id
            ? { ...recipe, ...recipeData }
            : recipe,
        );
        setRecipes(updatedRecipes);
        setFilteredRecipes(updatedRecipes);
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

  return (
    <div>
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
    </div>
  );
};

export default Home;
