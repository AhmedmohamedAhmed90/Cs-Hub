import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import CategoryTabs from '@/components/home/CategoryTabs';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import LatestTutorials from '@/components/home/LatestTutorials';
import LearningResources from '@/components/home/LearningResources';
import Newsletter from '@/components/home/Newsletter';

const Home = () => {
  return (
    <div className="container mx-auto">
      <Helmet>
        <title>CS Learning Hub | Computer Science Education Platform</title>
        <meta name="description" content="Access high-quality computer science courses, tutorials, and resources designed for students at all levels." />
      </Helmet>
      
      <HeroSection />
      <CategoryTabs />
      <FeaturedCourses />
      <LatestTutorials />
      <LearningResources />
      <Newsletter />
    </div>
  );
};

export default Home;
