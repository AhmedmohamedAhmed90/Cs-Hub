import { useQuery } from '@tanstack/react-query';
import { Resource } from '@shared/schema';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const Resources = () => {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  const getIconColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'green': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      'purple': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'yellow': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    };
    
    return colorMap[color] || colorMap['blue'];
  };

  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Learning Resources | CS Learning Hub</title>
        <meta name="description" content="Access computer science learning resources including e-books, code challenges, video lectures, and study groups." />
      </Helmet>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Learning Resources
      </h1>
      
      <div className="mb-12">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Explore our comprehensive collection of computer science learning resources to supplement your education journey.
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-7 w-3/4 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-5 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources?.map(resource => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`flex items-center justify-center mb-4 h-12 w-12 rounded-lg ${getIconColorClasses(resource.color)}`}>
                  <i className={`fas fa-${resource.icon} text-xl`}></i>
                </div>
                <CardTitle>{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {resource.description}
                </p>
                <Link 
                  href={resource.link} 
                  className="text-primary dark:text-blue-400 font-medium hover:underline inline-flex items-center"
                >
                  {resource.buttonText}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Request Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Don't see what you're looking for? Let us know what learning resources would be helpful for your studies.
            </p>
            <Link 
              href="/contact" 
              className="text-primary dark:text-blue-400 font-medium hover:underline inline-flex items-center"
            >
              Contact Us
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
