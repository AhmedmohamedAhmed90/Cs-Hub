import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/use-search';
import { useLocation } from 'wouter';
import { SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchProps {
  isMobile?: boolean;
}

const Search = ({ isMobile = false }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, isLoading, search } = useSearch();
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 3) {
      search(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleResultClick = (type: string, slug: string) => {
    navigate(`/${type}/${slug}`);
    setIsOpen(false);
    setQuery('');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={isMobile ? "Search..." : "Search for courses, tutorials, topics..."}
          value={query}
          onChange={handleSearch}
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
        />
        <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300">
          <SearchIcon size={16} />
        </div>
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1.5 h-7 w-7 text-gray-400"
            onClick={handleClear}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute w-full mt-1 z-50 max-h-80 overflow-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : (
              <>
                {results.courses.length === 0 && results.tutorials.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No results found</div>
                ) : (
                  <>
                    {results.courses.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pt-2 pb-1">Courses</h3>
                        <ul>
                          {results.courses.map(course => (
                            <li 
                              key={course.id}
                              onClick={() => handleResultClick('courses', course.slug)}
                              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                            >
                              <div className="font-medium">{course.title}</div>
                              <div className="text-xs text-gray-500 truncate">{course.description}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {results.tutorials.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 pt-2 pb-1">Tutorials</h3>
                        <ul>
                          {results.tutorials.map(tutorial => (
                            <li 
                              key={tutorial.id}
                              onClick={() => handleResultClick('tutorials', tutorial.slug)}
                              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                            >
                              <div className="font-medium">{tutorial.title}</div>
                              <div className="text-xs text-gray-500 truncate">{tutorial.description}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Search;
