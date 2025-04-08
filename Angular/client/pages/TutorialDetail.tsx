import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tutorial, Topic } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Bookmark, Share2, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TutorialDetail = () => {
  const { slug } = useParams();
  
  const { data: tutorial, isLoading } = useQuery<Tutorial>({
    queryKey: [`/api/tutorials/${slug}`],
  });
  
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  const topic = topics?.find(t => tutorial && t.id === tutorial.topicId);
  
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    
    // Simple hash for consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-60 w-full mb-8 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </div>
    );
  }
  
  if (!tutorial) {
    return (
      <div className="container mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Tutorial Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The tutorial you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <a href="/tutorials">Browse All Tutorials</a>
        </Button>
      </div>
    );
  }
  
  const topicBgColor = 
    tutorial.topicId === 8 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : // Web Dev
    tutorial.topicId === 7 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : // Software Engineering
    tutorial.topicId === 5 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : // AI
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Helmet>
        <title>{tutorial.title} | CS Learning Hub</title>
        <meta name="description" content={tutorial.description} />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge className={topicBgColor}>
            {topic?.name || ''}
          </Badge>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock size={14} className="mr-1" />
            <span>{tutorial.readTime} min read</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {tutorial.title}
        </h1>
        
        <div className="flex items-center mb-8">
          <div className={`h-10 w-10 rounded-full ${getAvatarColor(tutorial.authorName)} flex items-center justify-center text-white font-semibold`}>
            {tutorial.authorAvatar}
          </div>
          <div className="ml-3">
            <div className="text-gray-900 dark:text-white font-medium">{tutorial.authorName}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Published on {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      <img 
        src={tutorial.image} 
        alt={tutorial.title}
        className="w-full rounded-lg shadow-md mb-8 object-cover h-auto max-h-96"
      />
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ThumbsUp size={16} />
            <span>Like</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Bookmark size={16} />
            <span>Save</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 size={16} />
            <span>Share</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{tutorial.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {tutorial.description}
          </p>
          
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This is a placeholder for the tutorial content. In a real application, 
              this would be a full tutorial with detailed explanations, code examples, 
              and possibly interactive elements.
            </p>
            <h3>Introduction</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
              In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat 
              aliquam. Integer et elit eget elit facilisis tristique.
            </p>
            <h3>Main Concepts</h3>
            <p>
              Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus 
              pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet 
              porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa.
            </p>
            <h3>Practical Example</h3>
            <p>
              Aliquam erat volutpat. Donec sodales malesuada purus, a gravida ipsum 
              molestie ac. Donec ac luctus leo, eget lobortis sapien. Quisque ultricies 
              egestas ipsum, tempor porta nulla facilisis eu.
            </p>
            <pre>
              <code className="language-javascript">
                {`// Example code
function example() {
  console.log("This is a code example");
  return true;
}

const result = example();
console.log(result); // true`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Related Tutorials</h3>
          <p className="text-gray-600 dark:text-gray-300">
            This section would show other tutorials related to the same topic.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialDetail;
