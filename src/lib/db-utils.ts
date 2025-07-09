import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

export async function getCollection(name: string) {
  const client = await clientPromise
  return client.db('samyukta').collection(name)
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
    created_at: new Date().toISOString()
  })
  return { id: result.insertedId.toString(), ...data }
}

export async function updateById(collection: string, id: string, data: Record<string, unknown>) {
  const coll = await getCollection(collection)
  await coll.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updated_at: new Date().toISOString() } }
  )
  return findById(collection, id)
}