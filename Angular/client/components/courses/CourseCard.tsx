import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { Course } from '@shared/schema';
import { formatRating } from '@/lib/data-utils';

interface CourseCardProps {
  course: Course;
  topicName: string;
}

const CourseCard = ({ course, topicName }: CourseCardProps) => {
  const difficultyColor = 
    course.difficulty === 'Beginner' ? 'bg-green-600' :
    course.difficulty === 'Intermediate' ? 'bg-blue-600' :
    'bg-purple-600';
  
  const topicBgColor = 
    course.topicId === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
    course.topicId === 2 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
    course.topicId === 5 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';

  const stars = [];
  const ratingOutOf5 = course.rating / 10;
  const fullStars = Math.floor(ratingOutOf5);
  const hasHalfStar = ratingOutOf5 - fullStars >= 0.5;
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="fas fa-star text-yellow-400"></i>);
  }
  
  // Half star if needed
  if (hasHalfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
  }
  
  // Empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
  }

  return (
    <Card className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={course.image}
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 ${difficultyColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {course.difficulty}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center mb-3">
          <span className={`${topicBgColor} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {topicName}
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">{course.durationWeeks} weeks</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex">
              {stars}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
              {formatRating(course.rating)} ({course.reviewCount})
            </span>
          </div>
          <Link href={`/courses/${course.slug}`} className="text-primary dark:text-blue-400 font-medium hover:underline">
            View Course
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
