import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-graduation-cap text-primary dark:text-blue-400 text-2xl mr-2"></i>
              <span className="font-bold text-xl text-gray-800 dark:text-white">CS Learning Hub</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Comprehensive computer science education resources for students at all levels.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Courses</Link></li>
              <li><Link href="/tutorials" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Tutorials</Link></li>
              <li><Link href="/resources" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Resources</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Learning Paths</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Feedback</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Report an Issue</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-blue-400">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} CS Learning Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
