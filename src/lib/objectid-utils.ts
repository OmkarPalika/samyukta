import { ObjectId } from 'mongodb';

/**
 * Utility functions for ObjectId handling to avoid deprecation warnings
 */

/**
 * Creates an ObjectId from a string, ensuring no deprecated patterns are used
 */
export function createObjectId(id: string): ObjectId {
  if (typeof id !== 'string') {
    throw new Error('ObjectId must be created from a string');
  }
  return new ObjectId(id);
}

/**
 * Creates an ObjectId from a timestamp using the recommended createFromTime method
 */
export function createObjectIdFromTime(timestamp: number): ObjectId {
  if (typeof timestamp !== 'number') {
    throw new Error('Timestamp must be a number');
  }
  return ObjectId.createFromTime(timestamp);
}

/**
 * Validates if a string is a valid ObjectId
 */
export function isValidObjectId(id: string): boolean {
  if (typeof id !== 'string') {
    return false;
  }
  return ObjectId.isValid(id);
}

/**
 * Safely converts various types to ObjectId
 */
export function toObjectId(value: string | ObjectId): ObjectId {
  if (value instanceof ObjectId) {
    return value;
  }
  
  if (typeof value === 'string') {
    if (!isValidObjectId(value)) {
      throw new Error(`Invalid ObjectId string: ${value}`);
    }
    return createObjectId(value);
  }
  
  throw new Error('Value must be a string or ObjectId instance');
}

/**
 * Creates a new ObjectId (replacement for new ObjectId() without parameters)
 */
export function newObjectId(): ObjectId {
  return new ObjectId();
}