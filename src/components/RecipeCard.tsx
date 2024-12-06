import React from 'react';
import { Recipe } from '../definitions/types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="border p-4">
      <img
        src={recipe.image ? recipe.image : 'src/assets/placeholder.png'}
        alt={recipe.title}
        className="w-full h-40 object-cover mb-4"
        width="500" height="600"
      />
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
