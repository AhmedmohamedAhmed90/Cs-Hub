import { useQuery } from '@tanstack/react-query';
import { Course, Topic } from '@shared/schema';
import { Link } from 'wouter';
import CourseCard from '@/components/courses/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedCourses = () => {
  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses/featured']
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
        <Link href="/courses" className="text-primary dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesLoading ? (
          // Skeleton loading state
          Array(3).fill(0).map((_, i) => (
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
        ) : (
          courses?.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              topicName={getTopicName(course.topicId)} 
            />
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
