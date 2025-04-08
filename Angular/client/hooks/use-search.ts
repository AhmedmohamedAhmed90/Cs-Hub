import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Course, Tutorial } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

interface SearchResults {
  courses: Course[];
  tutorials: Tutorial[];
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery<SearchResults>({
    queryKey: ['/api/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 3) {
        return { courses: [], tutorials: [] };
      }
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    },
    enabled: searchQuery.length >= 3,
  });

  const search = (query: string) => {
    setSearchQuery(query);
  };

  return {
    search,
    results: data || { courses: [], tutorials: [] },
    isLoading,
  };
}
