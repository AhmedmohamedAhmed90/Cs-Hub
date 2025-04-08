import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCourseSchema, insertTutorialSchema, insertTopicSchema, insertLearningPathSchema, insertResourceSchema } from '@shared/schema';
import { z } from 'zod';

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all routes with /api
  
  // Topics
  app.get("/api/topics", async (_req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:slug", async (req, res) => {
    try {
      const topic = await storage.getTopicBySlug(req.params.slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  // Learning Paths
  app.get("/api/learning-paths", async (_req, res) => {
    try {
      const paths = await storage.getLearningPaths();
      res.json(paths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });

  app.get("/api/learning-paths/:slug", async (req, res) => {
    try {
      const path = await storage.getLearningPathBySlug(req.params.slug);
      if (!path) {
        return res.status(404).json({ message: "Learning path not found" });
      }
      res.json(path);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning path" });
    }
  });

  // Courses
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/featured", async (_req, res) => {
    try {
      const courses = await storage.getFeaturedCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured courses" });
    }
  });

  app.get("/api/courses/topic/:topicId", async (req, res) => {
    try {
      const topicId = parseInt(req.params.topicId);
      if (isNaN(topicId)) {
        return res.status(400).json({ message: "Invalid topic ID" });
      }
      
      const courses = await storage.getCoursesByTopic(topicId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses by topic" });
    }
  });

  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Tutorials
  app.get("/api/tutorials", async (_req, res) => {
    try {
      const tutorials = await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorials" });
    }
  });

  app.get("/api/tutorials/latest", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const tutorials = await storage.getLatestTutorials(limit);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest tutorials" });
    }
  });

  app.get("/api/tutorials/topic/:topicId", async (req, res) => {
    try {
      const topicId = parseInt(req.params.topicId);
      if (isNaN(topicId)) {
        return res.status(400).json({ message: "Invalid topic ID" });
      }
      
      const tutorials = await storage.getTutorialsByTopic(topicId);
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorials by topic" });
    }
  });

  app.get("/api/tutorials/:slug", async (req, res) => {
    try {
      const tutorial = await storage.getTutorialBySlug(req.params.slug);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorial" });
    }
  });

  // Resources
  app.get("/api/resources", async (_req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.search(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
