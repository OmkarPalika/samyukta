import { MongoClient, Db } from 'mongodb'
import { initializeDatabase, getCollections } from './mongodb-schemas'

// Only check for MONGODB_URI in runtime, not during build
function getMongoUri() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  return process.env.MONGODB_URI
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>
let dbPromise: Promise<Db>

function initializeConnection() {
  const uri = getMongoUri()
  
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
      _mongoDbPromise?: Promise<Db>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
      globalWithMongo._mongoDbPromise = globalWithMongo._mongoClientPromise.then(async (client) => {
        const db = client.db('samyukta')
        await initializeDatabase(db)
        return db
      })
    }
    clientPromise = globalWithMongo._mongoClientPromise
    dbPromise = globalWithMongo._mongoDbPromise!
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
    dbPromise = clientPromise.then(async (client) => {
      const db = client.db('samyukta')
      await initializeDatabase(db)
      return db
    })
  }
}

// Initialize only when needed
if (typeof window === 'undefined' && process.env.MONGODB_URI) {
  initializeConnection()
}

export default function getClientPromise() {
  if (!clientPromise) {
    initializeConnection()
  }
  return clientPromise
}

export function getDbPromise() {
  if (!dbPromise) {
    initializeConnection()
  }
  return dbPromise
}

export { getCollections }