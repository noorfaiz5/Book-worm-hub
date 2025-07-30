import { users, books, readingChallenges, type User, type InsertUser, type Book, type InsertBook, type ReadingChallenge, type InsertReadingChallenge } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getBooks(userId: string): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: string, updates: Partial<Book>): Promise<Book>;
  deleteBook(id: string): Promise<void>;
  getReadingChallenge(userId: string, year: number): Promise<ReadingChallenge | undefined>;
  createReadingChallenge(challenge: InsertReadingChallenge): Promise<ReadingChallenge>;
  updateReadingChallenge(id: string, updates: Partial<ReadingChallenge>): Promise<ReadingChallenge>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, firebaseId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getBooks(userId: string): Promise<Book[]> {
    return await db.select().from(books).where(eq(books.userId, userId));
  }

  async getBook(id: string): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book || undefined;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db
      .insert(books)
      .values(insertBook)
      .returning();
    return book;
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const [book] = await db
      .update(books)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return book;
  }

  async deleteBook(id: string): Promise<void> {
    await db.delete(books).where(eq(books.id, id));
  }

  async getReadingChallenge(userId: string, year: number): Promise<ReadingChallenge | undefined> {
    const [challenge] = await db
      .select()
      .from(readingChallenges)
      .where(eq(readingChallenges.userId, userId))
      .where(eq(readingChallenges.year, year));
    return challenge || undefined;
  }

  async createReadingChallenge(insertChallenge: InsertReadingChallenge): Promise<ReadingChallenge> {
    const [challenge] = await db
      .insert(readingChallenges)
      .values(insertChallenge)
      .returning();
    return challenge;
  }

  async updateReadingChallenge(id: string, updates: Partial<ReadingChallenge>): Promise<ReadingChallenge> {
    const [challenge] = await db
      .update(readingChallenges)
      .set(updates)
      .where(eq(readingChallenges.id, id))
      .returning();
    return challenge;
  }
}

export const storage = new DatabaseStorage();
