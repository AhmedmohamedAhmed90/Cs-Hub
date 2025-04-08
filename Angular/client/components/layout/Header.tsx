import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Search from '@/components/ui/search';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }: HeaderProps) => {
  const [location] = useLocation();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <i className="fas fa-graduation-cap text-primary dark:text-blue-400 text-2xl mr-2"></i>
              <span className="font-bold text-xl text-gray-800 dark:text-white">CS Learning Hub</span>
            </Link>
          </div>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <Search />
          </div>
          
          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium ${location === '/' ? 'text-primary dark:text-blue-400' : ''}`}>
              Home
            </Link>
            <Link href="/courses" className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium ${location === '/courses' ? 'text-primary dark:text-blue-400' : ''}`}>
              Courses
            </Link>
            <Link href="/tutorials" className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium ${location === '/tutorials' ? 'text-primary dark:text-blue-400' : ''}`}>
              Tutorials
            </Link>
            <Link href="/resources" className={`text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium ${location === '/resources' ? 'text-primary dark:text-blue-400' : ''}`}>
              Resources
            </Link>
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode} 
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode} 
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar} 
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-3">
          <Search isMobile={true} />
        </div>
      </div>
    </header>
  );
};

export default Header;
