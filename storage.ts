import { surveyResponses, restaurants, type SurveyResponse, type InsertSurveyResponse, type Restaurant, type InsertRestaurant } from "@shared/schema";

export interface IStorage {
  // Survey responses
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
  checkDuplicateNickname(nickname: string): Promise<SurveyResponse | null>;
  getUsedNicknames(): Promise<string[]>;
  getSurveyStats(): Promise<{
    totalResponses: number;
    locationStats: Record<string, number>;
    foodStats: Record<string, number>;
    drinkStats: Record<string, number>;
    timeStats: Record<string, { count: number; priority: number }>;
  }>;
  getSurveyStatsWithUsers(): Promise<{
    totalResponses: number;
    locationStats: Record<string, { count: number; users: Array<{ nickname: string; avatar: string }> }>;
    foodStats: Record<string, { count: number; users: Array<{ nickname: string; avatar: string }> }>;
    drinkStats: Record<string, { count: number; users: Array<{ nickname: string; avatar: string }> }>;
    timeStats: Record<string, { count: number; priority: number; users: Array<{ nickname: string; avatar: string }> }>;
  }>;
  
  // Restaurants
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  getRestaurantsByLocation(location: string): Promise<Restaurant[]>;
  getRestaurantsByFoodType(foodType: string): Promise<Restaurant[]>;
  getRestaurantsByLocationAndFoodType(location: string, foodType: string): Promise<Restaurant[]>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {

  constructor() {
    this.initializeRestaurants();
  }

  private async initializeRestaurants() {
    // Check if restaurants already exist
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    if (existingRestaurants.length > 0) return;

    const sampleRestaurants: InsertRestaurant[] = [
      {
        name: "마녀김밥 강남점",
        location: "gangnam",
        foodType: "korean",
        rating: "4.5",
        reviewCount: "127",
        description: "신선한 재료와 정성스러운 조리로 만든 김밥이 일품입니다. 단체석도 준비되어 있어요.",
        distance: "도보 5분",
        placeId: "gangnam_restaurant_1",
      },
      {
        name: "삼겹살 맛집",
        location: "gangnam",
        foodType: "bbq",
        rating: "4.3",
        reviewCount: "89",
        description: "두꺼운 삼겹살과 신선한 야채가 어우러진 맛이 환상적입니다. 넓은 룸도 있어요.",
        distance: "도보 8분",
        placeId: "gangnam_restaurant_2",
      },
      {
        name: "홍대 족발보쌈",
        location: "hongdae",
        foodType: "korean",
        rating: "4.4",
        reviewCount: "156",
        description: "부드러운 족발과 신선한 보쌈이 일품입니다. 젊은 분위기에 단체 모임에 좋아요.",
        distance: "도보 3분",
        placeId: "hongdae_restaurant_1",
      },
      {
        name: "한강 치킨 맛집",
        location: "hangang",
        foodType: "korean",
        rating: "4.1",
        reviewCount: "78",
        description: "한강을 보며 먹는 치킨이 일품입니다. 야외 테라스에서 시원한 바람을 맞으며 즐기세요.",
        distance: "도보 10분",
        placeId: "hangang_restaurant_1",
      },
      {
        name: "신촌 파스타 하우스",
        location: "sinchon",
        foodType: "western",
        rating: "4.3",
        reviewCount: "112",
        description: "수제 파스타와 리조또가 맛있습니다. 대학가 분위기에 가격도 합리적이에요.",
        distance: "도보 4분",
        placeId: "sinchon_restaurant_1",
      },
    ];

    // Insert sample restaurants
    await db.insert(restaurants).values(sampleRestaurants);
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const [response] = await db
      .insert(surveyResponses)
      .values({
        ...insertResponse,
        submittedAt: new Date(),
      })
      .returning();
    return response;
  }

  async checkDuplicateNickname(nickname: string): Promise<SurveyResponse | null> {
    const [response] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.nickname, nickname))
      .limit(1);
    return response || null;
  }

  async getUsedNicknames(): Promise<string[]> {
    const responses = await db.select({ nickname: surveyResponses.nickname }).from(surveyResponses);
    return responses.map(r => r.nickname);
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return await db.select().from(surveyResponses);
  }

  async getSurveyStats() {
    const responses = await db.select().from(surveyResponses);
    const totalResponses = responses.length;

    const locationStats: Record<string, number> = {};
    const foodStats: Record<string, number> = {};
    const drinkStats: Record<string, number> = {};
    const timeStats: Record<string, { count: number; priority: number }> = {};

    responses.forEach(response => {
      // Location stats
      locationStats[response.location] = (locationStats[response.location] || 0) + 1;

      // Food stats
      response.foodTypes.forEach(food => {
        foodStats[food] = (foodStats[food] || 0) + 1;
      });

      // Drink stats
      response.drinkTypes.forEach(drink => {
        drinkStats[drink] = (drinkStats[drink] || 0) + 1;
      });

      // Time stats
      response.timePreferences.forEach(timePreference => {
        if (!timeStats[timePreference.time]) {
          timeStats[timePreference.time] = { count: 0, priority: 0 };
        }
        timeStats[timePreference.time].count += 1;
        timeStats[timePreference.time].priority += (5 - timePreference.priority);
      });
    });

    return {
      totalResponses,
      locationStats,
      foodStats,
      drinkStats,
      timeStats,
    };
  }

  async getSurveyStatsWithUsers() {
    const responses = await db.select().from(surveyResponses);
    const totalResponses = responses.length;

    const locationStats: Record<string, { count: number; users: Array<{ nickname: string; avatar: string }> }> = {};
    const foodStats: Record<string, { count: number; users: Array<{ nickname: string; avatar: string }> }> = {};
    const drinkStats: Record<string, { count: number; users: Array<{ nickname: string; avatar: string }> }> = {};
    const timeStats: Record<string, { count: number; priority: number; users: Array<{ nickname: string; avatar: string }> }> = {};

    responses.forEach(response => {
      const user = { nickname: response.nickname, avatar: response.avatar };

      // Location stats
      if (!locationStats[response.location]) {
        locationStats[response.location] = { count: 0, users: [] };
      }
      locationStats[response.location].count += 1;
      locationStats[response.location].users.push(user);

      // Food stats
      response.foodTypes.forEach(food => {
        if (!foodStats[food]) {
          foodStats[food] = { count: 0, users: [] };
        }
        foodStats[food].count += 1;
        foodStats[food].users.push(user);
      });

      // Drink stats
      response.drinkTypes.forEach(drink => {
        if (!drinkStats[drink]) {
          drinkStats[drink] = { count: 0, users: [] };
        }
        drinkStats[drink].count += 1;
        drinkStats[drink].users.push(user);
      });

      // Time stats
      response.timePreferences.forEach(timePreference => {
        if (!timeStats[timePreference.time]) {
          timeStats[timePreference.time] = { count: 0, priority: 0, users: [] };
        }
        timeStats[timePreference.time].count += 1;
        timeStats[timePreference.time].priority += (5 - timePreference.priority);
        timeStats[timePreference.time].users.push(user);
      });
    });

    return {
      totalResponses,
      locationStats,
      foodStats,
      drinkStats,
      timeStats,
    };
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db
      .insert(restaurants)
      .values(insertRestaurant)
      .returning();
    return restaurant;
  }

  async getRestaurantsByLocation(location: string): Promise<Restaurant[]> {
    return await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.location, location));
  }

  async getRestaurantsByFoodType(foodType: string): Promise<Restaurant[]> {
    return await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.foodType, foodType));
  }

  async getRestaurantsByLocationAndFoodType(location: string, foodType: string): Promise<Restaurant[]> {
    return await db
      .select()
      .from(restaurants)
      .where(and(eq(restaurants.location, location), eq(restaurants.foodType, foodType)));
  }
}

export const storage = new DatabaseStorage();