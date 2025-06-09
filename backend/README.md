# LMS Backend API

A Golang backend API for the Learning Management System with Internship Portal.

## Features

- RESTful API with Gin framework
- PostgreSQL database integration
- JWT authentication
- CORS support
- User management (Students, Mentors, Admins)
- Internship management
- Application tracking

## Setup

### Prerequisites

- Go 1.21+
- PostgreSQL 15+
- Docker (optional)

### Local Development

1. Install dependencies:
```bash
go mod download
```

2. Set up PostgreSQL database:
```bash
createdb lms_db
```

3. Set environment variables:
```bash
export DATABASE_URL="postgres://postgres:password@localhost/lms_db?sslmode=disable"
```

4. Run the server:
```bash
go run main.go
```

### Docker Development

1. Start services:
```bash
docker-compose up -d
```

2. The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Internships
- `GET /api/internships` - Get all internships
- `POST /api/internships` - Create internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship
- `GET /api/internships/mentor/:id` - Get internships by mentor

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `GET /api/applications/student/:id` - Get applications by student
- `GET /api/applications/internship/:id` - Get applications by internship

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password
- `name` - Full name
- `role` - User role (student, mentor, admin)
- `avatar` - Profile picture URL
- `department` - Department/field of study
- `company` - Company name (for mentors)
- `bio` - User biography
- `skills` - Array of skills
- `experience` - Years of experience
- `created_at` - Account creation timestamp

### Internships Table
- `id` - Primary key
- `title` - Internship title
- `company` - Company name
- `description` - Detailed description
- `requirements` - Array of required skills
- `duration` - Internship duration
- `location` - Location
- `type` - Work type (remote, onsite, hybrid)
- `mentor_id` - Foreign key to users table
- `mentor_name` - Mentor's name
- `posted_date` - Post creation timestamp
- `deadline` - Application deadline
- `status` - Status (active, closed, draft)
- `max_students` - Maximum number of students
- `tags` - Array of tags
- `salary` - Salary information

### Applications Table
- `id` - Primary key
- `internship_id` - Foreign key to internships table
- `student_id` - Foreign key to users table
- `student_name` - Student's name
- `applied_date` - Application timestamp
- `status` - Application status (pending, accepted, rejected, interview)
- `cover_letter` - Cover letter text
- `resume` - Resume file path/URL

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (optional, defaults to "your-secret-key")

## Default Users

The system comes with pre-configured demo users:

1. **Admin**: admin@lms.com / admin123
2. **Mentor**: mentor@company.com / mentor123  
3. **Student**: student@university.edu / student123

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS configured for frontend integration
- SQL injection protection with parameterized queries