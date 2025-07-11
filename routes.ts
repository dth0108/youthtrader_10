import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertSurveyResponseSchema, SEOUL_LOCATIONS, FOOD_TYPES, DRINK_TYPES, TIME_OPTIONS, ANIMAL_AVATARS } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit survey response
  app.post("/api/survey", async (req, res) => {
    try {
      const validatedData = insertSurveyResponseSchema.parse(req.body);
      
      // Check for duplicate nickname
      const existingResponse = await storage.checkDuplicateNickname(validatedData.nickname);
      
      if (existingResponse) {
        return res.status(409).json({ 
          message: "이미 선택된 캐릭터입니다.", 
          existingResponse 
        });
      }
      
      const response = await storage.createSurveyResponse(validatedData);
      res.json(response);
    } catch (error) {
      console.error("Error creating survey response:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create survey response" });
      }
    }
  });

  // Get used nicknames for duplicate prevention
  app.get("/api/survey/used-nicknames", async (req, res) => {
    try {
      const usedNicknames = await storage.getUsedNicknames();
      res.json({ usedNicknames });
    } catch (error) {
      console.error("Error fetching used nicknames:", error);
      res.status(500).json({ message: "Failed to fetch used nicknames" });
    }
  });

  // Get survey statistics
  app.get("/api/survey/stats", async (req, res) => {
    try {
      const stats = await storage.getSurveyStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch survey stats", error });
    }
  });

  // Get survey statistics with user details
  app.get("/api/survey/stats-with-users", async (req, res) => {
    try {
      const stats = await storage.getSurveyStatsWithUsers();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch survey stats with users", error });
    }
  });

  // Get all survey responses
  app.get("/api/survey/responses", async (req, res) => {
    try {
      const responses = await storage.getAllSurveyResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch survey responses", error });
    }
  });

  // Get restaurants by location
  app.get("/api/restaurants/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const restaurants = await storage.getRestaurantsByLocation(location);
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants", error });
    }
  });

  // Get restaurants by location and food type
  app.get("/api/restaurants/:location/:foodType", async (req, res) => {
    try {
      const { location, foodType } = req.params;
      const restaurants = await storage.getRestaurantsByLocationAndFoodType(location, foodType);
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants", error });
    }
  });

  // Get survey metadata (locations, food types, etc.)
  app.get("/api/survey/metadata", async (req, res) => {
    try {
      res.json({
        locations: SEOUL_LOCATIONS,
        foodTypes: FOOD_TYPES,
        drinkTypes: DRINK_TYPES,
        timeOptions: TIME_OPTIONS,
        animalAvatars: ANIMAL_AVATARS,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metadata", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
