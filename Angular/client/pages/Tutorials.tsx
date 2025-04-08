import { useQuery } from '@tanstack/react-query';
import { Tutorial, Topic } from '@shared/schema';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import TutorialCard from '@/components/tutorials/TutorialCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Tutorials = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  const { data: allTutorials, isLoading: tutorialsLoading } = useQuery<Tutorial[]>({
    queryKey: ['/api/tutorials'],
  });

  // Filter tutorials based on selected topic
  const filteredTutorials = allTutorials?.filter(tutorial => {
    return selectedTopicId ? tutorial.topicId === selectedTopicId : true;
  });

  const handleTopicChange = (value: string) => {
    setSelectedTopicId(value === 'all' ? null : parseInt(value));
  };

  const getTopicName = (topicId: number) => {
    const topic = topics?.find(t => t.id === topicId);
    return topic?.name || '';
  };

  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Tutorials | CS Learning Hub</title>
        <meta name="description" content="Browse computer science tutorials on various topics to enhance your learning." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tutorials</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Filter by Topic
            </label>
            <Select value={selectedTopicId?.toString() || 'all'} onValueChange={handleTopicChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics?.map(topic => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:w-1/3 md:self-end">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setSelectedTopicId(null)}
              disabled={selectedTopicId === null}
            >
              Clear Filter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tutorialsLoading ? (
            // Skeleton loading state
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                <Skeleton className="w-full h-48 md:w-48 md:h-auto" />
                <div className="p-5 flex-1">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredTutorials?.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No tutorials match your filter criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            filteredTutorials?.map(tutorial => (
              <TutorialCard 
                key={tutorial.id} 
                tutorial={tutorial} 
                topicName={getTopicName(tutorial.topicId)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
