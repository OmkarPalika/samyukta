import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must not exceed 100 characters')
  .transform(email => email.toLowerCase().trim());

const phoneSchema = z.string()
  .regex(/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number')
  .transform(phone => phone.replace(/\s+/g, ''));

const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, hyphens, and apostrophes')
  .transform(name => name.trim().replace(/\s+/g, ' '));

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const urlSchema = z.string()
  .url('Please enter a valid URL')
  .max(500, 'URL must not exceed 500 characters')
  .optional()
  .or(z.literal(''));

// User validation schemas
export const userRegistrationSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  college: z.string()
    .min(2, 'College name must be at least 2 characters')
    .max(100, 'College name must not exceed 100 characters')
    .transform(college => college.trim()),
  year: z.enum(['1', '2', '3', '4', 'Graduate', 'Postgraduate'], {
    message: 'Please select a valid year'
  }),
  dept: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must not exceed 50 characters')
    .transform(dept => dept.trim()),
  track: z.enum(['Cloud', 'AI', 'Cybersecurity', 'None'], {
    message: 'Please select a valid track'
  }).optional(),
  linkedin: urlSchema,
  instagram: urlSchema,
  portfolio: urlSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const userUpdateSchema = z.object({
  full_name: nameSchema.optional(),
  college: z.string()
    .min(2, 'College name must be at least 2 characters')
    .max(100, 'College name must not exceed 100 characters')
    .transform(college => college.trim())
    .optional(),
  year: z.enum(['1', '2', '3', '4', 'Graduate', 'Postgraduate']).optional(),
  dept: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must not exceed 50 characters')
    .transform(dept => dept.trim())
    .optional(),
  track: z.enum(['Cloud', 'AI', 'Cybersecurity', 'None']).optional(),
  linkedin: urlSchema,
  instagram: urlSchema,
  portfolio: urlSchema,
});

// Registration validation schemas
export const teamMemberSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  whatsapp: phoneSchema,
  year: z.enum(['1', '2', '3', '4', 'Graduate', 'Postgraduate'], {
    message: 'Please select a valid year'
  }),
  dept: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must not exceed 50 characters')
    .transform(dept => dept.trim()),
  college: z.string()
    .min(2, 'College name must be at least 2 characters')
    .max(100, 'College name must not exceed 100 characters')
    .transform(college => college.trim()),
  dietary_restrictions: z.string()
    .max(200, 'Dietary restrictions must not exceed 200 characters')
    .optional(),
  accommodation_needed: z.boolean().default(false),
  t_shirt_size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'], {
    message: 'Please select a valid t-shirt size'
  }),
});

export const registrationSchema = z.object({
  college: z.string()
    .min(2, 'College name must be at least 2 characters')
    .max(100, 'College name must not exceed 100 characters')
    .transform(college => college.trim()),
  team_size: z.number()
    .int('Team size must be a whole number')
    .min(1, 'Team must have at least 1 member')
    .max(4, 'Team cannot have more than 4 members'),
  ticket_type: z.enum(['Combo', 'Custom', 'startup_only'], {
    message: 'Please select a valid ticket type'
  }),
  workshop_track: z.enum(['Cloud', 'AI', 'Cybersecurity', 'None'], {
    message: 'Please select a valid workshop track'
  }),
  competition_track: z.enum(['Hackathon', 'Pitch', 'None'], {
    message: 'Please select a valid competition track'
  }),
  members: z.array(teamMemberSchema)
    .min(1, 'At least one team member is required')
    .max(4, 'Maximum 4 team members allowed'),
  total_amount: z.number()
    .positive('Total amount must be positive')
    .max(10000, 'Total amount seems too high'),
  transaction_id: z.string()
    .min(5, 'Transaction ID must be at least 5 characters')
    .max(50, 'Transaction ID must not exceed 50 characters')
    .optional(),
  payment_screenshot_url: z.string()
    .url('Please provide a valid payment screenshot URL')
    .optional(),
}).refine(data => data.members.length === data.team_size, {
  message: "Number of team members must match team size",
  path: ["members"],
});

// Help ticket validation schema
export const helpTicketSchema = z.object({
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters')
    .transform(subject => subject.trim()),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .transform(description => description.trim()),
  category: z.enum(['Registration', 'Payment', 'Technical', 'General', 'Accommodation'], {
    message: 'Please select a valid category'
  }),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'], {
    message: 'Please select a valid priority'
  }).default('Medium'),
  contact_email: emailSchema.optional(),
  contact_phone: phoneSchema.optional(),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 attachments allowed').optional(),
});

// Social media validation schema
export const socialItemSchema = z.object({
  caption: z.string()
    .max(500, 'Caption must not exceed 500 characters')
    .transform(caption => caption.trim())
    .optional(),
  file_url: z.string()
    .url('Please provide a valid file URL'),
  file_type: z.enum(['image', 'video'], {
    message: 'File must be an image or video'
  }),
  tags: z.array(z.string().max(30, 'Tag must not exceed 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
});

// Competition validation schemas
export const competitionJoinSchema = z.object({
  competition_id: z.string()
    .min(1, 'Competition ID is required'),
  team_name: z.string()
    .min(2, 'Team name must be at least 2 characters')
    .max(50, 'Team name must not exceed 50 characters')
    .transform(name => name.trim())
    .optional(),
  additional_info: z.string()
    .max(500, 'Additional info must not exceed 500 characters')
    .transform(info => info.trim())
    .optional(),
});

// Pitch rating validation schema
export const pitchRatingSchema = z.object({
  pitch_id: z.string().min(1, 'Pitch ID is required'),
  innovation_score: z.number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(5, 'Score must not exceed 5'),
  feasibility_score: z.number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(5, 'Score must not exceed 5'),
  presentation_score: z.number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(5, 'Score must not exceed 5'),
  market_potential_score: z.number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(5, 'Score must not exceed 5'),
  team_score: z.number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(5, 'Score must not exceed 5'),
  comments: z.string()
    .max(500, 'Comments must not exceed 500 characters')
    .transform(comments => comments.trim())
    .optional(),
});

// Email validation schemas
export const emailSendSchema = z.object({
  to: z.array(emailSchema).min(1, 'At least one recipient is required'),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must not exceed 200 characters')
    .transform(subject => subject.trim()),
  body: z.string()
    .min(1, 'Email body is required')
    .max(10000, 'Email body must not exceed 10000 characters'),
  html: z.boolean().default(false),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(),
    contentType: z.string(),
  })).optional(),
});

// File upload validation schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
}).refine(data => data.file.size <= data.maxSize, {
  message: 'File size exceeds maximum allowed size',
  path: ['file'],
}).refine(data => data.allowedTypes.includes(data.file.type), {
  message: 'File type not allowed',
  path: ['file'],
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Search query must not exceed 100 characters')
    .transform(query => query.trim())
    .optional(),
  filters: z.record(z.string(), z.any()).optional(),
  sort: z.object({
    field: z.string(),
    order: z.enum(['asc', 'desc']),
  }).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Admin schemas
export const adminUserUpdateSchema = z.object({
  role: z.enum(['admin', 'coordinator', 'participant'], {
    message: 'Please select a valid role'
  }).optional(),
  status: z.enum(['active', 'inactive', 'suspended'], {
    message: 'Please select a valid status'
  }).optional(),
  committee: z.string()
    .max(50, 'Committee name must not exceed 50 characters')
    .transform(committee => committee.trim())
    .optional(),
  designation: z.string()
    .max(50, 'Designation must not exceed 50 characters')
    .transform(designation => designation.trim())
    .optional(),
});

// Data sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+\-\s\(\)]/g, '');
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return '';
  }
}

// Validation middleware for API routes
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
      }
      throw error;
    }
  };
}

// Client-side validation hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const validate = (data: unknown): { success: boolean; data?: T; errors?: string[] } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(err => err.message);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  };

  return { validate };
}

// Export all schemas for easy access
export const schemas = {
  userRegistration: userRegistrationSchema,
  userLogin: userLoginSchema,
  userUpdate: userUpdateSchema,
  teamMember: teamMemberSchema,
  registration: registrationSchema,
  helpTicket: helpTicketSchema,
  socialItem: socialItemSchema,
  competitionJoin: competitionJoinSchema,
  pitchRating: pitchRatingSchema,
  emailSend: emailSendSchema,
  fileUpload: fileUploadSchema,
  search: searchSchema,
  adminUserUpdate: adminUserUpdateSchema,
};