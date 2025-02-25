'use client';

import React from 'react';
import { Card, CardContent } from './ui/card';
import { OptimizedImage } from './ui/optimized-image';

interface RecipeCardProps {
  title?: string;
  imageUrl?: string;
  source?: string;
  onClick?: () => void;
}

const RecipeCard = ({
  title = 'Delicious Recipe',
  imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  source = '',
  onClick = () => {},
}: RecipeCardProps) => {
  return (
    <Card
      className="w-full h-[340px] bg-white cursor-pointer transform transition-all duration-150 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative w-full h-[250px] overflow-hidden rounded-t-lg">
        <OptimizedImage src={imageUrl} alt={title} width={500} height={300} className="rounded-t-lg" />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 truncate">{title}</h3>

        <div className="flex items-center">
          <span className="text-sm text-gray-600 truncate">{source || 'Unknown source'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
