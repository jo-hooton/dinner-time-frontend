import { useState, FC } from 'react';
import LazyLoad from 'react-lazyload';
import { Recipe } from '../definitions/types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imageUrl = recipe.image ? recipe.image : 'src/assets/placeholder.png';

  const handleImageLoad = () => {
    setIsLoaded(true);
  }

  return (
    <div className="border p-4">
      <LazyLoad height={160} once>
        <img
          src={imageUrl}
          alt={recipe.title}
          onLoad={handleImageLoad}
          className={`w-full h-40 object-cover mb-4 transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </LazyLoad>
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
