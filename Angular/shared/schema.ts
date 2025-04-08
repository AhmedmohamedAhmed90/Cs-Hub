import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Topic model (categories for courses and tutorials)
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  name: true,
  icon: true,
  slug: true,
});

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topics.$inferSelect;

// Learning Path model
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).pick({
  name: true,
  description: true,
  color: true,
  slug: true,
});

export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;

// Course model
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  difficulty: text("difficulty").notNull(),
  topicId: integer("topic_id").notNull(),
  durationWeeks: integer("duration_weeks").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  slug: text("slug").notNull().unique(),
  featured: boolean("featured").default(false),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  image: true,
  difficulty: true,
  topicId: true,
  durationWeeks: true,
  rating: true,
  reviewCount: true,
  slug: true,
  featured: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// Tutorial model
export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  topicId: integer("topic_id").notNull(),
  readTime: integer("read_time").notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertTutorialSchema = createInsertSchema(tutorials).pick({
  title: true,
  description: true,
  image: true,
  topicId: true,
  readTime: true,
  authorName: true,
  authorAvatar: true,
  slug: true,
});

export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;

// Resource model
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  link: text("link").notNull(),
  buttonText: text("button_text").notNull(),
  color: text("color").notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  icon: true,
  link: true,
  buttonText: true,
  color: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
