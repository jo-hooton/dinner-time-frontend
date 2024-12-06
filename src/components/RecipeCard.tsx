import React from 'react';
import { Recipe } from '../definitions/types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="border p-4">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-40 object-cover mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <ul>
        {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeCard;
