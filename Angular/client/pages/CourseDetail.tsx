import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import { Course, Topic } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRating } from '@/lib/data-utils';

const CourseDetail = () => {
  const { slug } = useParams();
  
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${slug}`],
  });
  
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  const topic = topics?.find(t => course && t.id === course.topicId);
  
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/2 h-80 rounded-lg" />
          <div className="md:w-1/2">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-5 w-4/5 mb-6" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="container mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <a href="/courses">Browse All Courses</a>
        </Button>
      </div>
    );
  }
  
  const difficultyColor = 
    course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
    course.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
  
  // Calculate stars for rating display
  const ratingOutOf5 = course.rating / 10;
  const fullStars = Math.floor(ratingOutOf5);
  const hasHalfStar = ratingOutOf5 - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>{course.title} | CS Learning Hub</title>
        <meta name="description" content={course.description} />
      </Helmet>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className={difficultyColor}>
            {course.difficulty}
          </Badge>
          {topic && (
            <Badge variant="outline">
              {topic.name}
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {course.title}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full rounded-lg shadow-md object-cover h-auto md:h-80"
            />
            
            <div className="mt-4 flex items-center">
              <div className="flex">
                {[...Array(fullStars)].map((_, i) => (
                  <i key={`full-${i}`} className="fas fa-star text-yellow-400"></i>
                ))}
                {hasHalfStar && <i className="fas fa-star-half-alt text-yellow-400"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                  <i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                {formatRating(course.rating)} ({course.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">About this course</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h3>
                  <p className="text-gray-900 dark:text-white">{course.durationWeeks} weeks</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Topic</h3>
                  <p className="text-gray-900 dark:text-white">{topic?.name}</p>
                </div>
              </div>
              
              <Button className="w-full">Enroll in Course</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This is a sample course content section. In a real application, this would include:
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>Course modules and lessons</li>
          <li>Course materials and resources</li>
          <li>Assessments and projects</li>
          <li>Prerequisites and learning outcomes</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseDetail;
