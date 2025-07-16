# Database Documentation

## Overview

The Samyukta 2025 project uses MongoDB as its primary database with a comprehensive schema designed for event management, user registration, and social features.

## Database Structure

### Collections

1. **users** - Admin, coordinator, and participant accounts
2. **registrations** - Team registrations for the event
3. **team_members** - Individual participants within teams
4. **competitions** - Competition definitions and details
5. **competition_registrations** - Individual competition entries
6. **help_tickets** - Support ticket system
7. **social_items** - Photo/media sharing with moderation
8. **games** - QR quest and game interactions
9. **pitch_ratings** - Pitch competition voting system
10. **sessions** - User authentication sessions

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/samyukta
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/samyukta
```

### 2. Database Initialization

Initialize the database with collections and indexes:

```bash
npm run init-db
```

### 3. Seed Sample Data

Populate the database with sample data for testing:

```bash
npm run seed-db
```

### 4. Reset Database (Optional)

Clear all data from the database:

```bash
npm run reset-db
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/check-email` - Check if email exists

### Users
- `GET /api/users` - List users (with pagination and filters)
- `POST /api/users` - Create new user
- `GET /api/users/[userId]/profile` - Get user profile
- `PATCH /api/users/[userId]/profile` - Update user profile

### Registrations
- `GET /api/registrations` - List registrations (with filters)
- `POST /api/registrations` - Create new registration
- `GET /api/registrations/[id]` - Get specific registration
- `PUT /api/registrations/[id]` - Update registration
- `DELETE /api/registrations/[id]` - Delete registration
- `GET /api/registrations/stats` - Get registration statistics
- `POST /api/registrations/approve` - Approve registration
- `POST /api/upload-payment` - Upload payment screenshot

### Competitions
- `GET /api/competitions` - List competitions
- `POST /api/competitions` - Create competition
- `POST /api/competitions/join` - Join competition
- `GET /api/competitions/[competitionId]/user/[userId]` - Get user's competition entry

### Social Media
- `GET /api/social` - List social items (with pagination)
- `POST /api/social` - Create social item
- `PATCH /api/social` - Moderate social item (approve/reject)

### Help Tickets
- `GET /api/help-tickets` - List help tickets
- `POST /api/help-tickets` - Create help ticket
- `GET /api/help-tickets/[id]` - Get specific ticket
- `PATCH /api/help-tickets/[id]` - Update ticket
- `POST /api/help-tickets/respond` - Respond to ticket

### Games
- `POST /api/games/qr-scan` - Process QR code scan
- `GET /api/games` - Get game statistics

### Admin
- `GET /api/admin/dashboard-stats` - Admin dashboard statistics
- `GET /api/admin/users` - Admin user management
- `GET /api/admin/events` - Admin event management
- `GET /api/admin/moderation` - Content moderation

## Database Schema Details

### User Schema
```typescript
interface UserSchema {
  _id?: ObjectId;
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'coordinator' | 'participant';
  college?: string;
  track?: string;
  year?: string;
  dept?: string;
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Registration Schema
```typescript
interface RegistrationSchema {
  _id?: ObjectId;
  team_id: string;
  college: string;
  team_size: number;
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status: 'completed' | 'pending_review' | 'confirmed' | 'pending';
  registration_code?: string;
  qr_code_url?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Team Member Schema
```typescript
interface TeamMemberSchema {
  _id?: ObjectId;
  registration_id: string;
  participant_id?: string;
  passkey?: string;
  full_name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  year: string;
  department: string;
  college?: string;
  accommodation: boolean;
  food_preference: 'veg' | 'non-veg';
  is_club_lead?: boolean;
  club_name?: string;
  present?: boolean;
  qr_code_url?: string;
  created_at: Date;
}
```

## Testing

### API Testing
Test all API endpoints:

```bash
npm run test-apis
```

### Manual Testing
1. Start the development server: `npm run dev`
2. Use tools like Postman or curl to test endpoints
3. Check the browser console for any errors

## Maintenance

### Backup
Regular backups should be taken of the MongoDB database:

```bash
mongodump --uri="your-mongodb-uri" --out=backup-folder
```

### Monitoring
Monitor the following metrics:
- Database connection status
- Query performance
- Storage usage
- Index usage

### Optimization
- Regularly review and optimize database queries
- Monitor index usage and add new indexes as needed
- Clean up expired sessions periodically

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check MongoDB URI in environment variables
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **Authentication Errors**
   - Check user credentials in the database
   - Verify session tokens are valid
   - Clear browser cookies if needed

3. **Data Validation Errors**
   - Check schema definitions match API requests
   - Validate required fields are provided
   - Ensure data types match schema

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
NODE_ENV=development
```

## Security Considerations

1. **Password Security**
   - Passwords are hashed using bcryptjs
   - Never store plain text passwords

2. **Session Management**
   - Sessions expire after 7 days
   - Use secure cookies in production

3. **Data Validation**
   - All inputs are validated before database operations
   - Use TypeScript interfaces for type safety

4. **Access Control**
   - Role-based access control implemented
   - API endpoints check user permissions

## Performance Tips

1. **Indexing**
   - All frequently queried fields have indexes
   - Compound indexes for complex queries

2. **Pagination**
   - All list endpoints support pagination
   - Default limit of 20 items per page

3. **Aggregation**
   - Use MongoDB aggregation for complex statistics
   - Cache frequently accessed data when possible

4. **Connection Pooling**
   - MongoDB driver handles connection pooling automatically
   - Reuse database connections across requests