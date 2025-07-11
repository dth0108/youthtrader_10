import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  avatar: text("avatar").notNull(),
  sessionId: text("session_id").notNull(),
  location: text("location").notNull(),
  foodTypes: jsonb("food_types").notNull().$type<string[]>(),
  drinkTypes: jsonb("drink_types").notNull().$type<string[]>(),
  timePreferences: jsonb("time_preferences").notNull().$type<{time: string, priority: number}[]>(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  foodType: text("food_type").notNull(),
  rating: text("rating").notNull(),
  reviewCount: text("review_count").notNull(),
  description: text("description").notNull(),
  distance: text("distance").notNull(),
  placeId: text("place_id"),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  submittedAt: true,
});

// Animal avatar options with MZ-style nicknames (prevents duplicates)
export const ANIMAL_AVATARS = [
  { emoji: "🦊", nickname: "폭스러너", description: "영리하고 빠른" },
  { emoji: "🐨", nickname: "코알라킹", description: "여유롭고 쿨한" },
  { emoji: "🐯", nickname: "호랑이력", description: "열정적이고 강한" },
  { emoji: "🐰", nickname: "토끼점프", description: "귀엽고 활발한" },
  { emoji: "🐺", nickname: "늑대센스", description: "카리스마 있는" },
  { emoji: "🦁", nickname: "라이언킹", description: "리더십 있는" },
  { emoji: "🐼", nickname: "판다러블", description: "사랑스럽고 편안한" },
  { emoji: "🐸", nickname: "개구리맨", description: "유쾌하고 재미있는" },
  { emoji: "🐱", nickname: "냥이파워", description: "자유롭고 독립적인" },
  { emoji: "🐶", nickname: "멍멍이", description: "충성스럽고 친근한" },
  { emoji: "🦄", nickname: "유니콘드림", description: "특별하고 환상적인" }
] as const;

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;

// Location options for Seoul
export const SEOUL_LOCATIONS = [
  { id: "gangnam", name: "강남", description: "역삼/서초 일대", icon: "fas fa-building" },
  { id: "hongdae", name: "홍대", description: "홍익대 주변", icon: "fas fa-music" },
  { id: "jongno", name: "종로", description: "종로3가 일대", icon: "fas fa-landmark" },
  { id: "myeongdong", name: "명동", description: "중구 명동", icon: "fas fa-shopping-bag" },
  { id: "hangang", name: "한강", description: "여의도/반포 한강공원", icon: "fas fa-river" },
  { id: "sinchon", name: "신촌", description: "연세대 주변", icon: "fas fa-graduation-cap" },
] as const;

// Food type options
export const FOOD_TYPES = [
  { id: "korean", name: "한식", description: "삼겹살, 갈비, 김치찌개 등" },
  { id: "chinese", name: "중식", description: "짜장면, 탕수육, 마라탕 등" },
  { id: "japanese", name: "일식", description: "초밥, 라멘, 이자카야 등" },
  { id: "western", name: "양식", description: "파스타, 스테이크, 피자 등" },
  { id: "bbq", name: "고기구이", description: "삼겹살, 갈비, 곱창 등" },
  { id: "other", name: "기타", description: "멕시칸, 인도, 태국 등" },
] as const;

// Drink type options
export const DRINK_TYPES = [
  { id: "beer", name: "맥주", description: "생맥주, 병맥주", icon: "fas fa-beer" },
  { id: "soju", name: "소주", description: "참이슬, 처음처럼 등", icon: "fas fa-glass-whiskey" },
  { id: "somaek", name: "소맥", description: "소주 + 맥주", icon: "fas fa-glass-martini" },
  { id: "highball", name: "하이볼", description: "위스키 + 소다", icon: "fas fa-cocktail" },
  { id: "wine", name: "와인", description: "레드, 화이트, 스파클링", icon: "fas fa-wine-glass" },
  { id: "nonalcoholic", name: "무알코올", description: "음료수, 차, 커피", icon: "fas fa-coffee" },
] as const;

// Time options
export const TIME_OPTIONS = [
  { id: "17:00", name: "17:00", description: "오후 5시", icon: "fas fa-sun" },
  { id: "18:00", name: "18:00", description: "오후 6시", icon: "fas fa-sun" },
  { id: "19:00", name: "19:00", description: "오후 7시", icon: "fas fa-moon" },
  { id: "20:00", name: "20:00", description: "오후 8시", icon: "fas fa-moon" },
] as const;
