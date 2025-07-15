import { getDbPromise, getCollections } from './mongodb'
import { ObjectId } from 'mongodb'

export async function getCollection(name: string) {
  const db = await getDbPromise()
  return db.collection(name)
}

export async function getDb() {
  return await getDbPromise()
}

export async function getTypedCollections() {
  const db = await getDbPromise()
  return getCollections(db)
}

export async function findById(collection: string, id: string) {
  const coll = await getCollection(collection)
  const doc = await coll.findOne({ _id: new ObjectId(id) })
  return doc ? { id: doc._id.toString(), ...doc } : null
}

export async function insertOne(collection: string, data: Record<string, unknown>) {
  const coll = await getCollection(collection)
  const result = await coll.insertOne({
    ...data,
    created_at: new Date(),
    updated_at: new Date()
  })
  return { id: result.insertedId.toString(), ...data }
}

export async function updateById(collection: string, id: string, data: Record<string, unknown>) {
  const coll = await getCollection(collection)
  await coll.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updated_at: new Date() } }
  )
  return findById(collection, id)
}

export async function deleteById(collection: string, id: string) {
  const coll = await getCollection(collection)
  const result = await coll.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function findMany(collection: string, filter: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  const coll = await getCollection(collection)
  const docs = await coll.find(filter, options).toArray()
  return docs.map(doc => ({ id: doc._id.toString(), ...doc }))
}