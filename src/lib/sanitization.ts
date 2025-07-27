// Data sanitization utilities for Samyukta 2025

/* eslint-disable @typescript-eslint/no-explicit-any */
import DOMPurify from 'isomorphic-dompurify';

// HTML sanitization options
const HTML_SANITIZE_OPTIONS = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'target'],
  ALLOW_DATA_ATTR: false,
  FORBID_SCRIPT: true,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

// Basic string sanitization
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .substring(0, 1000); // Limit length
}

// Email sanitization
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., -
    .substring(0, 254); // RFC 5321 limit
}

// Phone number sanitization
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return '';
  
  return phone
    .replace(/[^\d+\-\s\(\)]/g, '') // Only allow digits, +, -, space, parentheses
    .trim()
    .substring(0, 20);
}

// URL sanitization
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  
  try {
    // Remove any potential XSS attempts
    const cleanUrl = url.trim().replace(/[<>"']/g, '');
    
    // Validate URL format
    const parsed = new URL(cleanUrl);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString().substring(0, 500);
  } catch {
    return '';
  }
}

// HTML content sanitization
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, HTML_SANITIZE_OPTIONS);
}

// Rich text sanitization (for descriptions, comments)
export function sanitizeRichText(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  
  // First sanitize HTML
  const cleanHtml = DOMPurify.sanitize(text, {
    ...HTML_SANITIZE_OPTIONS,
    ALLOWED_TAGS: [...HTML_SANITIZE_OPTIONS.ALLOWED_TAGS, 'h1', 'h2', 'h3', 'blockquote'],
  });
  
  // Limit length
  return cleanHtml.substring(0, 5000);
}

// File name sanitization
export function sanitizeFileName(fileName: string | null | undefined): string {
  if (!fileName || typeof fileName !== 'string') return '';
  
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 255); // Limit length
}

// SQL injection prevention (for dynamic queries)
export function sanitizeSqlString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/['";\\]/g, '') // Remove SQL special characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .trim()
    .substring(0, 1000);
}

// NoSQL injection prevention
export function sanitizeNoSqlInput(input: any): any {
  if (input === null || input === undefined) return input;
  
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  
  if (typeof input === 'number' || typeof input === 'boolean') {
    return input;
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeNoSqlInput).slice(0, 100); // Limit array size
  }
  
  if (typeof input === 'object') {
    const sanitized: any = {};
    const keys = Object.keys(input).slice(0, 50); // Limit object keys
    
    for (const key of keys) {
      // Skip potentially dangerous keys
      if (key.startsWith('$') || key.includes('.')) continue;
      
      const sanitizedKey = sanitizeString(key);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeNoSqlInput(input[key]);
      }
    }
    
    return sanitized;
  }
  
  return null;
}

// Search query sanitization
export function sanitizeSearchQuery(query: string | null | undefined): string {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[<>'"]/g, '') // Remove potential XSS chars
    .replace(/[{}[\]]/g, '') // Remove regex special chars
    .replace(/\\/g, '') // Remove backslashes
    .substring(0, 100);
}

// User input sanitization for forms
export function sanitizeUserInput(input: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(input)) {
    const sanitizedKey = sanitizeString(key);
    if (!sanitizedKey) continue;
    
    if (typeof value === 'string') {
      // Special handling for different field types
      if (key.toLowerCase().includes('email')) {
        sanitized[sanitizedKey] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('whatsapp')) {
        sanitized[sanitizedKey] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
        sanitized[sanitizedKey] = sanitizeUrl(value);
      } else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('comment')) {
        sanitized[sanitizedKey] = sanitizeRichText(value);
      } else {
        sanitized[sanitizedKey] = sanitizeString(value);
      }
    } else if (typeof value === 'number') {
      // Validate number ranges
      if (Number.isFinite(value) && value >= -1000000 && value <= 1000000) {
        sanitized[sanitizedKey] = value;
      }
    } else if (typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value
        .slice(0, 50) // Limit array size
        .map(item => typeof item === 'string' ? sanitizeString(item) : item)
        .filter(item => item !== null && item !== undefined);
    } else if (value && typeof value === 'object') {
      sanitized[sanitizedKey] = sanitizeUserInput(value);
    }
  }
  
  return sanitized;
}

// File upload sanitization
export function sanitizeFileUpload(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check file name
  const sanitizedName = sanitizeFileName(file.name);
  if (!sanitizedName) {
    errors.push('Invalid file name');
  }
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    errors.push('File size exceeds 5MB limit');
  }
  
  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Database query sanitization
export function sanitizeDbQuery(query: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(query)) {
    // Skip MongoDB operators that could be dangerous
    if (key.startsWith('$') && !['$eq', '$ne', '$in', '$nin', '$gt', '$gte', '$lt', '$lte'].includes(key)) {
      continue;
    }
    
    const sanitizedKey = sanitizeString(key);
    if (!sanitizedKey) continue;
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value
        .slice(0, 100)
        .map(item => typeof item === 'string' ? sanitizeString(item) : item);
    } else if (value && typeof value === 'object') {
      sanitized[sanitizedKey] = sanitizeDbQuery(value);
    }
  }
  
  return sanitized;
}

// Content Security Policy helpers
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Rate limiting key sanitization
export function sanitizeRateLimitKey(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9:-]/g, '_')
    .substring(0, 100);
}

// Export all sanitization functions
export const sanitizers = {
  string: sanitizeString,
  email: sanitizeEmail,
  phone: sanitizePhone,
  url: sanitizeUrl,
  html: sanitizeHtml,
  richText: sanitizeRichText,
  fileName: sanitizeFileName,
  sqlString: sanitizeSqlString,
  noSqlInput: sanitizeNoSqlInput,
  searchQuery: sanitizeSearchQuery,
  userInput: sanitizeUserInput,
  fileUpload: sanitizeFileUpload,
  dbQuery: sanitizeDbQuery,
  rateLimitKey: sanitizeRateLimitKey,
};

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function isValidFileName(fileName: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(fileName) && fileName.length <= 255;
}

// Content filtering
export function containsProfanity(text: string): boolean {
  // Basic profanity filter - in production, use a more comprehensive solution
  const profanityWords = ['spam', 'scam', 'fake', 'fraud'];
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
}

export function containsSuspiciousContent(text: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(text));
}