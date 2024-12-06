import React, { useState, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
}

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
    <div>
      <input
        type="text"
        value={input}
        placeholder="Enter ingredients..."
        onChange={handleInputChange}
      />
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeSearch;
