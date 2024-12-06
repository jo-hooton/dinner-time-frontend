import React, { useState, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import RecipeCard from './RecipeCard';
import { Recipe } from '../definitions/types';

const RecipeSearch: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const debouncedSearch = useMemo(() => {
    return debounce(async (query: string) => {
      if (!query) {
        setRecipes([]);
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/recipes', {
          params: { query },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }, 300);
  }, []);

  // Update input and invoke debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  // Clean up the debounced function on component unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cancel any pending debounce calls
    };
  }, [debouncedSearch]);

  return (
    <div className='grid min-h-screen w-full'>
      <input
        type="text"
        value={input}
        placeholder="Enter ingredients..."
        onChange={handleInputChange}
        className='h-12 w-full border py-2 px-3 mb-3 leading-tight focus:outline-none'
      />
      <div className="grid gap-4 grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;
