import { 
  users, User, InsertUser, 
  topics, Topic, InsertTopic,
  learningPaths, LearningPath, InsertLearningPath,
  courses, Course, InsertCourse,
  tutorials, Tutorial, InsertTutorial, 
  resources, Resource, InsertResource
} from "@shared/schema";

export interface IStorage {
  // User methods (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Topic methods
  getTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;

  // Learning Path methods
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPath(id: number): Promise<LearningPath | undefined>;
  getLearningPathBySlug(slug: string): Promise<LearningPath | undefined>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getCoursesByTopic(topicId: number): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Tutorial methods
  getTutorials(): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  getTutorialBySlug(slug: string): Promise<Tutorial | undefined>;
  getTutorialsByTopic(topicId: number): Promise<Tutorial[]>;
  getLatestTutorials(limit?: number): Promise<Tutorial[]>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;

  // Resource methods
  getResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Search method
  search(query: string): Promise<{
    courses: Course[];
    tutorials: Tutorial[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private learningPaths: Map<number, LearningPath>;
  private courses: Map<number, Course>;
  private tutorials: Map<number, Tutorial>;
  private resources: Map<number, Resource>;
  
  private userId: number;
  private topicId: number;
  private pathId: number;
  private courseId: number;
  private tutorialId: number;
  private resourceId: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.learningPaths = new Map();
    this.courses = new Map();
    this.tutorials = new Map();
    this.resources = new Map();
    
    this.userId = 1;
    this.topicId = 1;
    this.pathId = 1;
    this.courseId = 1;
    this.tutorialId = 1;
    this.resourceId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // User methods (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Topic methods
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(
      (topic) => topic.slug === slug
    );
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.topicId++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }

  // Learning Path methods
  async getLearningPaths(): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values());
  }

  async getLearningPath(id: number): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }

  async getLearningPathBySlug(slug: string): Promise<LearningPath | undefined> {
    return Array.from(this.learningPaths.values()).find(
      (path) => path.slug === slug
    );
  }

  async createLearningPath(insertPath: InsertLearningPath): Promise<LearningPath> {
    const id = this.pathId++;
    const path: LearningPath = { ...insertPath, id };
    this.learningPaths.set(id, path);
    return path;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(
      (course) => course.slug === slug
    );
  }

  async getCoursesByTopic(topicId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.topicId === topicId
    );
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.featured
    );
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Tutorial methods
  async getTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values());
  }

  async getTutorial(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }

  async getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
    return Array.from(this.tutorials.values()).find(
      (tutorial) => tutorial.slug === slug
    );
  }

  async getTutorialsByTopic(topicId: number): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).filter(
      (tutorial) => tutorial.topicId === topicId
    );
  }

  async getLatestTutorials(limit = 10): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).slice(0, limit);
  }

  async createTutorial(insertTutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.tutorialId++;
    const tutorial: Tutorial = { ...insertTutorial, id };
    this.tutorials.set(id, tutorial);
    return tutorial;
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceId++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  // Search method
  async search(query: string): Promise<{ courses: Course[]; tutorials: Tutorial[] }> {
    const lowerQuery = query.toLowerCase();
    
    const courses = Array.from(this.courses.values()).filter(
      (course) => 
        course.title.toLowerCase().includes(lowerQuery) || 
        course.description.toLowerCase().includes(lowerQuery)
    );
    
    const tutorials = Array.from(this.tutorials.values()).filter(
      (tutorial) => 
        tutorial.title.toLowerCase().includes(lowerQuery) || 
        tutorial.description.toLowerCase().includes(lowerQuery)
    );
    
    return { courses, tutorials };
  }

  // Initialize with sample data
  private initializeData() {
    // Sample topics
    const algorithmsTopic = this.createTopic({
      name: "Algorithms & Data Structures",
      icon: "code",
      slug: "algorithms"
    });

    const databasesTopic = this.createTopic({
      name: "Databases",
      icon: "database",
      slug: "databases"
    });

    const networksTopic = this.createTopic({
      name: "Computer Networks",
      icon: "network-wired",
      slug: "networks"
    });

    const osTopic = this.createTopic({
      name: "Operating Systems",
      icon: "desktop",
      slug: "operating-systems"
    });

    const aiTopic = this.createTopic({
      name: "Artificial Intelligence",
      icon: "brain",
      slug: "ai"
    });

    const securityTopic = this.createTopic({
      name: "Cybersecurity",
      icon: "shield-alt",
      slug: "security"
    });

    const seTopic = this.createTopic({
      name: "Software Engineering",
      icon: "laptop-code",
      slug: "software-engineering"
    });

    const webDevTopic = this.createTopic({
      name: "Web Development",
      icon: "project-diagram",
      slug: "web-development"
    });

    // Sample learning paths
    this.createLearningPath({
      name: "Web Developer Path",
      description: "Become a full-stack web developer",
      color: "blue",
      slug: "web-developer"
    });

    this.createLearningPath({
      name: "Data Science Path",
      description: "Master data science and analytics",
      color: "green",
      slug: "data-science"
    });

    this.createLearningPath({
      name: "Machine Learning Path",
      description: "Learn machine learning and AI",
      color: "indigo",
      slug: "machine-learning"
    });

    // Sample courses
    this.createCourse({
      title: "Advanced Algorithms and Data Structures",
      description: "Master advanced algorithmic techniques and complex data structures to solve computational problems efficiently.",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      difficulty: "Intermediate",
      topicId: 1, // Algorithms
      durationWeeks: 8,
      rating: 45, // 4.5 out of 5
      reviewCount: 128,
      slug: "advanced-algorithms",
      featured: true
    });

    this.createCourse({
      title: "Web Development with React",
      description: "Learn modern React development from fundamentals to advanced patterns and build professional web applications.",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      difficulty: "Beginner",
      topicId: 8, // Web Development
      durationWeeks: 10,
      rating: 49, // 4.9 out of 5
      reviewCount: 215,
      slug: "react-web-development",
      featured: true
    });

    this.createCourse({
      title: "Machine Learning Fundamentals",
      description: "Explore core machine learning concepts, algorithms, and techniques with hands-on Python implementation.",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      difficulty: "Intermediate",
      topicId: 5, // AI
      durationWeeks: 12,
      rating: 40, // 4.0 out of 5
      reviewCount: 98,
      slug: "machine-learning-fundamentals",
      featured: true
    });

    this.createCourse({
      title: "Database Design and SQL",
      description: "Learn to design efficient databases and master SQL for data manipulation and retrieval.",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      difficulty: "Beginner",
      topicId: 2, // Databases
      durationWeeks: 6,
      rating: 47, // 4.7 out of 5
      reviewCount: 152,
      slug: "database-design-sql",
      featured: false
    });

    // Sample tutorials
    this.createTutorial({
      title: "Building REST APIs with Node.js and Express",
      description: "Learn how to design and implement efficient RESTful APIs using Node.js and Express framework.",
      image: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topicId: 8, // Web Development
      readTime: 30,
      authorName: "John Smith",
      authorAvatar: "JS",
      slug: "building-rest-apis"
    });

    this.createTutorial({
      title: "Understanding Memory Management in C++",
      description: "Explore how C++ handles memory allocation, deallocation, and common pitfalls to avoid memory leaks.",
      image: "https://images.unsplash.com/photo-1616469829935-c2f33ebd89b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topicId: 7, // Software Engineering
      readTime: 45,
      authorName: "Anna Lee",
      authorAvatar: "AL",
      slug: "cpp-memory-management"
    });

    this.createTutorial({
      title: "Introduction to Neural Networks",
      description: "Learn the fundamentals of neural networks and how they form the foundation of deep learning.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topicId: 5, // AI
      readTime: 35,
      authorName: "Michael Chen",
      authorAvatar: "MC",
      slug: "intro-neural-networks"
    });

    // Sample resources
    this.createResource({
      title: "E-Books",
      description: "Access our collection of computer science textbooks and reference materials.",
      icon: "book",
      link: "/resources/ebooks",
      buttonText: "Browse Library",
      color: "blue"
    });

    this.createResource({
      title: "Code Challenges",
      description: "Practice your skills with interactive coding challenges and exercises.",
      icon: "code",
      link: "/resources/code-challenges",
      buttonText: "Start Coding",
      color: "green"
    });

    this.createResource({
      title: "Video Lectures",
      description: "Watch recorded lectures and presentations from top CS professors and professionals.",
      icon: "video",
      link: "/resources/videos",
      buttonText: "Watch Videos",
      color: "purple"
    });

    this.createResource({
      title: "Study Groups",
      description: "Join virtual study groups to collaborate and learn with peers on specific topics.",
      icon: "users",
      link: "/resources/study-groups",
      buttonText: "Join Groups",
      color: "yellow"
    });
  }
}

export const storage = new MemStorage();
