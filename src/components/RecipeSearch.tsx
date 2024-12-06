import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import RecipeCard from './RecipeCard';
import { Recipe } from '../definitions/types';
import LoadingSpinner from './LoadingSpinner';

const RecipeSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [exclude, setExclude] = useState<string>('');
  const [time, setTime] = useState<string>('');
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
    debounce(async (query: string, exclude: string, time: string, page: number) => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/recipes', {
          params: { query, exclude, time, page, per: 10 },
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

  // update query and invoke debounced search
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setCurrentPage(1);
    debouncedSearch(value, exclude, time, 1);
  };

  // update exclude and invoke debounced search
  const handleExcludeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExclude(value);
    setCurrentPage(1);
    debouncedSearch(query, value, time, 1);
  };

  // update time and invoke debounced search
  const handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTime(value);
    setCurrentPage(1);
    debouncedSearch(query, exclude, value, 1);
  };

  // fetch recipes when page or input changes
  useEffect(() => {
    if (query || exclude || time || currentPage > 1) {
      debouncedSearch(query, exclude, time, currentPage);
    }
  }, [currentPage, query, exclude, time, debouncedSearch]);

  // clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // cancel any pending debounce calls
    };
  }, [debouncedSearch]);

  return (
    <div className='grid min-h-screen w-full'>
      <div className='flex flex-col mb-3'>
        <input
          type="text"
          value={query}
          placeholder="Enter ingredients..."
          onChange={handleQueryChange}
          className='h-12 w-full border py-2 px-3 mb-3'
        />
        <input
          type="text"
          value={exclude}
          placeholder="Exclude ingredients..."
          onChange={handleExcludeChange}
          className='h-12 w-full border py-2 px-3 mb-3'
        />
        <div className="flex h-12 mb-3">
          <select onChange={handleTimeChange} className="border py-2 px-3">
            <option value="">No time limit</option>
            <option value="15">Under 15 minutes</option>
            <option value="30">Under 30 minutes</option>
            <option value="60">Under 1 hour</option>
          </select>
        </div>
      </div>
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
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default RecipeSearch;
