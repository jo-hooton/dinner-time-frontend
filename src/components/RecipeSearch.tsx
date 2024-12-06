import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import RecipeCard from './RecipeCard';
import { Recipe } from '../definitions/types';

const RecipeSearch: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // observe the last element for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRecipeElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // use useCallback to memoize the debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, page: number) => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/recipes', {
          params: { query, page, per: 10 },
        });
        if (page === 1) {
          setRecipes(response.data);
        } else {
          setRecipes((prevRecipes) => [...prevRecipes, ...response.data]);
        }

        if (response.data.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // update input and invoke debounced search
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setCurrentPage(1); // Reset to first page on a new search
    debouncedSearch(value, 1);
  };

  // fetch recipes when page or input changes
  useEffect(() => {
    if (input || currentPage > 1) {
      debouncedSearch(input, currentPage);
    }
  }, [currentPage, input, debouncedSearch]);

  // clean up the debounced function on component unmount
  useEffect(() => {
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
        {recipes.map((recipe, index) => {
          if (recipes.length === index + 1) {
            return (
              <div ref={lastRecipeElementRef} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </div>
            );
          } else {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          }
        })}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default RecipeSearch;
