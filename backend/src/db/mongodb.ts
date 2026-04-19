import { MongoClient, Db, MongoClientOptions } from "mongodb";

let dbInstance: Db | null = null;

export const connectDB = async (): Promise<Db> => {
  if (dbInstance) {
    console.log("✅ Using existing database connection");
    return dbInstance;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("❌ MONGODB_URI is not set in environment variables");
  }

  try {
    const clientOptions: MongoClientOptions = {
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    const client = new MongoClient(mongoUri, clientOptions);
    await client.connect();

    dbInstance = client.db("ai_research_assistant");
    console.log("✅ Connected to MongoDB Atlas");

    // Create indexes
    await createIndexes(dbInstance);

    return dbInstance;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

const createIndexes = async (db: Db): Promise<void> => {
  try {
    // Users collection indexes
    const usersCollection = db.collection("users");
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ createdAt: 1 });

    // Papers collection indexes
    const papersCollection = db.collection("papers");
    await papersCollection.createIndex({ userId: 1 });
    await papersCollection.createIndex({ createdAt: -1 });
    await papersCollection.createIndex({ fileHash: 1 });

    console.log("✅ Database indexes created");
  } catch (error) {
    console.error("⚠️ Index creation warning:", error);
  }
};

export const getDB = (): Db => {
  if (!dbInstance) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return dbInstance;
};

export const disconnectDB = async (): Promise<void> => {
  // Note: MongoClient connection pooling handles cleanup
  dbInstance = null;
  console.log("✅ Database connection closed");
};
