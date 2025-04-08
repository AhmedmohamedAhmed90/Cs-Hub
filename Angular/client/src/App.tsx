import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Tutorials from "@/pages/Tutorials";
import TutorialDetail from "@/pages/TutorialDetail";
import Resources from "@/pages/Resources";
import { useState, useEffect } from "react";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Initialize dark mode from local storage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  // Update local storage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    
    // Update document class for dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex-grow flex">
        <Sidebar sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ease-in-out p-4 md:p-6">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/courses" component={Courses} />
            <Route path="/courses/:slug" component={CourseDetail} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/tutorials/:slug" component={TutorialDetail} />
            <Route path="/resources" component={Resources} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
