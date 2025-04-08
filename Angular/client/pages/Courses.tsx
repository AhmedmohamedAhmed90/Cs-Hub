import { useQuery } from '@tanstack/react-query';
import { Course, Topic } from '@shared/schema';
import { useLocation, useSearch } from 'wouter';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CourseCard from '@/components/courses/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Courses = () => {
  const [location] = useLocation();
  const search = useSearch();
  const topicSlug = new URLSearchParams(search).get('topic');
  
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string>('all');
  
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  const { data: allCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Find topic ID from slug if present in URL
  useEffect(() => {
    if (topicSlug && topics) {
      const topic = topics.find(t => t.slug === topicSlug);
      if (topic) {
        setSelectedTopicId(topic.id);
      }
    }
  }, [topicSlug, topics]);

  // Filter courses based on selected topic and difficulty
  const filteredCourses = allCourses?.filter(course => {
    const matchesTopic = selectedTopicId ? course.topicId === selectedTopicId : true;
    const matchesDifficulty = difficulty !== 'all' ? course.difficulty === difficulty : true;
    return matchesTopic && matchesDifficulty;
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
        <title>Courses | CS Learning Hub</title>
        <meta name="description" content="Browse all computer science courses and find the perfect learning path for your needs." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Courses</h1>
        
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
          
          <div className="md:w-1/3">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Filter by Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:w-1/3 flex items-end">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setSelectedTopicId(null);
                setDifficulty('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesLoading ? (
            // Skeleton loading state
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-5">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredCourses?.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No courses match your filter criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            filteredCourses?.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                topicName={getTopicName(course.topicId)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
