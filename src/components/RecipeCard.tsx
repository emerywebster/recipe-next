import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";

interface RecipeCardProps {
  title?: string;
  imageUrl?: string;
  rating?: number;
  cookCount?: number;
  tags?: string[];
  onClick?: () => void;
}

const RecipeCard = ({
  title = "Delicious Recipe",
  imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  rating = 4,
  cookCount = 3,
  tags = ["Quick Meals", "Vegetarian"],
  onClick = () => {},
}: RecipeCardProps) => {
  return (
    <Card
      className="w-[340px] h-[420px] bg-white cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative w-full h-[250px] overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>

        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {cookCount} times cooked
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
