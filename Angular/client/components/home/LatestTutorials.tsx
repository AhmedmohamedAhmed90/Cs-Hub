import { useQuery } from '@tanstack/react-query';
import { Tutorial, Topic } from '@shared/schema';
import { Link } from 'wouter';
import TutorialCard from '@/components/tutorials/TutorialCard';
import { Skeleton } from '@/components/ui/skeleton';

const LatestTutorials = () => {
  const { data: tutorials, isLoading: tutorialsLoading } = useQuery<Tutorial[]>({
    queryKey: ['/api/tutorials/latest']
  });

  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['/api/topics']
  });

  const getTopicName = (topicId: number) => {
    const topic = topics?.find(t => t.id === topicId);
    return topic?.name || '';
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Tutorials</h2>
        <Link href="/tutorials" className="text-primary dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tutorialsLoading ? (
          // Skeleton loading state
          Array(2).fill(0).map((_, i) => (
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
        ) : (
          tutorials?.map(tutorial => (
            <TutorialCard 
              key={tutorial.id} 
              tutorial={tutorial} 
              topicName={getTopicName(tutorial.topicId)} 
            />
          ))
        )}
      </div>
    </section>
  );
};

export default LatestTutorials;
