import { useState, useEffect, FC } from 'react';
import LazyLoad from 'react-lazyload';
import { Recipe } from '../definitions/types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showIngredients, setShowIngredients] = useState<boolean>(false);

  const imageUrl = recipe.image ? recipe.image : 'src/assets/placeholder.png';

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // store favorite recipes in local storage
  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      favorites = favorites.filter((fav: Recipe) => fav.id !== recipe.id);
    } else {
      favorites.push(recipe);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.some((fav: Recipe) => fav.id === recipe.id)) {
      setIsFavorite(true);
    }
  }, [recipe.id]);

  return (
    <div className="border p-4 relative">
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
      <button
        onClick={toggleFavorite}
        className={`absolute top-5 right-5 h-12 w-12 p-1 text-3xl rounded-full bg-white/75 ${
          isFavorite ? 'text-blue-500' : 'text-gray-400'
        }`}
        aria-label={`${isFavorite ? 'unfavourite' : 'favourite'} ${recipe.title}`}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <button
        onClick={() => setShowIngredients((prev) => !prev)}
        className="text-sm text-blue-500 mb-2 focus:outline-none"
        aria-label={`View ingredients for ${recipe.title}`}
      >
        {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
      </button>
      {showIngredients && (
        <ul className="mt-2 list-disc pl-5">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeCard;
