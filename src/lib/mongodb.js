// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, use a global variable so the connection survives
  // hot reloads instead of creating a new one on every reload.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, no global reuse — just a fresh client per instance.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;