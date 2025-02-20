import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Plus, Search, Filter, BookMarked } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { Link } from "react-router-dom";

interface RecipeHeaderProps {
  onSearch?: (term: string) => void;
  onAddRecipe?: () => void;
  onFilterSelect?: (filter: string) => void;
  availableTags?: string[];
  onAuthClick?: () => void;
  isAuthenticated?: boolean;
}

const RecipeHeader = ({
  onSearch = () => {},
  onAddRecipe = () => {},
  onFilterSelect = () => {},
  availableTags = [
    "Quick Meals",
    "Vegetarian",
    "Desserts",
    "Main Course",
    "Breakfast",
  ],
  onAuthClick = () => {},
  isAuthenticated = false,
}: RecipeHeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2 mr-8">
        <BookMarked className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold">Cookmarks</span>
      </Link>

      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search recipes..."
            className="pl-10 w-full"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableTags.map((tag) => (
              <DropdownMenuItem key={tag} onClick={() => onFilterSelect(tag)}>
                {tag}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onAddRecipe}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
        {isAuthenticated ? (
          <UserAvatar />
        ) : (
          <Button variant="ghost" onClick={onAuthClick}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
};

export default RecipeHeader;
