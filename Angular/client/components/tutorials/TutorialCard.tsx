import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { Tutorial } from '@shared/schema';

interface TutorialCardProps {
  tutorial: Tutorial;
  topicName: string;
}

const TutorialCard = ({ tutorial, topicName }: TutorialCardProps) => {
  const topicBgColor = 
    tutorial.topicId === 8 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : // Web Dev
    tutorial.topicId === 7 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : // Software Engineering
    tutorial.topicId === 5 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : // AI
    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';

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

  return (
    <Card className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      <img 
        src={tutorial.image}
        alt={tutorial.title} 
        className="w-full h-48 md:w-48 md:h-auto object-cover"
      />
      <CardContent className="p-5 flex-1">
        <div className="flex items-center mb-3">
          <span className={`${topicBgColor} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {topicName}
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">{tutorial.readTime} min read</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tutorial.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tutorial.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full ${getAvatarColor(tutorial.authorName)} flex items-center justify-center text-white font-semibold text-sm`}>
              {tutorial.authorAvatar}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">{tutorial.authorName}</span>
          </div>
          <Link href={`/tutorials/${tutorial.slug}`} className="text-primary dark:text-blue-400 font-medium hover:underline">
            Read Tutorial
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorialCard;
