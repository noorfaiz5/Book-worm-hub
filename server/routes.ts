import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertUserSchema, insertReadingChallengeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "BookNest API is running" });
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseId(userData.id);
      if (existingUser) {
        console.log('User already exists:', existingUser.email);
        return res.json(existingUser);
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      console.log('New user created:', user.email);
      res.json(user);
    } catch (error) {
      console.error('User creation error:', error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Book routes
  app.get("/api/books", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const books = await storage.getBooks(userId);
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Failed to get books" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      console.log('Received book data:', JSON.stringify(req.body, null, 2));
      
      // Convert date strings to Date objects
      const processedData = { ...req.body };
      if (processedData.dateStarted && typeof processedData.dateStarted === 'string') {
        processedData.dateStarted = new Date(processedData.dateStarted);
      }
      if (processedData.dateFinished && typeof processedData.dateFinished === 'string') {
        processedData.dateFinished = new Date(processedData.dateFinished);
      }
      
      const bookData = insertBookSchema.parse(processedData);
      console.log('Parsed book data:', JSON.stringify(bookData, null, 2));
      const book = await storage.createBook(bookData);
      res.json(book);
    } catch (error) {
      console.error('Book creation error:', error);
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        res.status(400).json({ error: "Invalid book data", details: error.errors });
      } else {
        res.status(400).json({ error: "Invalid book data" });
      }
    }
  });

  app.put("/api/books/:id", async (req, res) => {
    try {
      // Convert date strings to Date objects
      const processedData = { ...req.body };
      if (processedData.dateStarted && typeof processedData.dateStarted === 'string') {
        processedData.dateStarted = new Date(processedData.dateStarted);
      }
      if (processedData.dateFinished && typeof processedData.dateFinished === 'string') {
        processedData.dateFinished = new Date(processedData.dateFinished);
      }
      
      const book = await storage.updateBook(req.params.id, processedData);
      res.json(book);
    } catch (error) {
      console.error('Book update error:', error);
      res.status(500).json({ error: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      await storage.deleteBook(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete book" });
    }
  });

  // Reading challenge routes
  app.get("/api/challenges/:userId/:year", async (req, res) => {
    try {
      const { userId, year } = req.params;
      const challenge = await storage.getReadingChallenge(userId, parseInt(year));
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reading challenge" });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      const challengeData = insertReadingChallengeSchema.parse(req.body);
      const challenge = await storage.createReadingChallenge(challengeData);
      res.json(challenge);
    } catch (error) {
      res.status(400).json({ error: "Invalid challenge data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
