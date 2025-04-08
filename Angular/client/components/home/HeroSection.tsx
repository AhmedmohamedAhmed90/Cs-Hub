import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-2xl shadow-xl mb-8 overflow-hidden">
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4">
            Accelerate Your CS Education Journey
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8">
            Access high-quality computer science courses, tutorials, and resources designed for students at all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors">
              <Link href="/courses">
                Explore Courses
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors">
              <Link href="/learning-paths">
                View Learning Paths
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
            alt="Student working on computer science project" 
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
