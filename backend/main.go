package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID         int       `json:"id" db:"id"`
	Email      string    `json:"email" db:"email"`
	Name       string    `json:"name" db:"name"`
	Role       string    `json:"role" db:"role"`
	Avatar     *string   `json:"avatar" db:"avatar"`
	Department *string   `json:"department" db:"department"`
	Company    *string   `json:"company" db:"company"`
	Bio        *string   `json:"bio" db:"bio"`
	Skills     []string  `json:"skills" db:"skills"`
	Experience *int      `json:"experience" db:"experience"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type Internship struct {
	ID               int       `json:"id" db:"id"`
	Title            string    `json:"title" db:"title"`
	Company          string    `json:"company" db:"company"`
	Description      string    `json:"description" db:"description"`
	Requirements     []string  `json:"requirements" db:"requirements"`
	Duration         string    `json:"duration" db:"duration"`
	Location         string    `json:"location" db:"location"`
	Type             string    `json:"type" db:"type"`
	MentorID         int       `json:"mentor_id" db:"mentor_id"`
	MentorName       string    `json:"mentor_name" db:"mentor_name"`
	PostedDate       time.Time `json:"posted_date" db:"posted_date"`
	Deadline         time.Time `json:"deadline" db:"deadline"`
	Status           string    `json:"status" db:"status"`
	MaxStudents      int       `json:"max_students" db:"max_students"`
	Tags             []string  `json:"tags" db:"tags"`
	Salary           *string   `json:"salary" db:"salary"`
	ApplicationCount int       `json:"application_count"`
}

type Application struct {
	ID           int       `json:"id" db:"id"`
	InternshipID int       `json:"internship_id" db:"internship_id"`
	StudentID    int       `json:"student_id" db:"student_id"`
	StudentName  string    `json:"student_name" db:"student_name"`
	AppliedDate  time.Time `json:"applied_date" db:"applied_date"`
	Status       string    `json:"status" db:"status"`
	CoverLetter  string    `json:"cover_letter" db:"cover_letter"`
	Resume       *string   `json:"resume" db:"resume"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email      string  `json:"email" binding:"required"`
	Password   string  `json:"password" binding:"required"`
	Name       string  `json:"name" binding:"required"`
	Role       string  `json:"role" binding:"required"`
	Department *string `json:"department"`
	Company    *string `json:"company"`
}

var db *sql.DB
var jwtSecret = []byte("your-secret-key")

func main() {
	// Initialize database
	initDB()
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	api := r.Group("/api")
	{
		// Auth routes
		api.POST("/login", login)
		api.POST("/register", register)

		// Protected routes
		protected := api.Group("/")
		protected.Use(authMiddleware())
		{
			// User routes
			protected.GET("/users", getUsers)
			protected.GET("/users/:id", getUser)
			protected.PUT("/users/:id", updateUser)

			// Internship routes
			protected.GET("/internships", getInternships)
			protected.POST("/internships", createInternship)
			protected.PUT("/internships/:id", updateInternship)
			protected.DELETE("/internships/:id", deleteInternship)
			protected.GET("/internships/mentor/:id", getInternshipsByMentor)

			// Application routes
			protected.GET("/applications", getApplications)
			protected.POST("/applications", createApplication)
			protected.PUT("/applications/:id", updateApplication)
			protected.GET("/applications/student/:id", getApplicationsByStudent)
			protected.GET("/applications/internship/:id", getApplicationsByInternship)
		}
	}

	log.Println("Server starting on :8080")
	r.Run(":8080")
}

func initDB() {
	var err error
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:password@localhost/lms_db?sslmode=disable"
	}

	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Create tables
	createTables()
	log.Println("Database connected successfully")
}

func createTables() {
	queries := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
		
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255) NOT NULL,
			role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'mentor', 'admin')),
			avatar TEXT,
			department VARCHAR(255),
			company VARCHAR(255),
			bio TEXT,
			skills TEXT[],
			experience INTEGER,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,

		`CREATE TABLE IF NOT EXISTS internships (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			company VARCHAR(255) NOT NULL,
			description TEXT NOT NULL,
			requirements TEXT[] NOT NULL,
			duration VARCHAR(100) NOT NULL,
			location VARCHAR(255) NOT NULL,
			type VARCHAR(50) NOT NULL CHECK (type IN ('remote', 'onsite', 'hybrid')),
			mentor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			mentor_name VARCHAR(255) NOT NULL,
			posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			deadline TIMESTAMP NOT NULL,
			status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
			max_students INTEGER DEFAULT 1,
			tags TEXT[],
			salary VARCHAR(100)
		);`,

		`CREATE TABLE IF NOT EXISTS applications (
			id SERIAL PRIMARY KEY,
			internship_id INTEGER REFERENCES internships(id) ON DELETE CASCADE,
			student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			student_name VARCHAR(255) NOT NULL,
			applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'interview')),
			cover_letter TEXT NOT NULL,
			resume TEXT,
			UNIQUE(internship_id, student_id)
		);`,

		// Insert sample data
		`INSERT INTO users (email, password_hash, name, role, avatar, department, company, bio, skills, experience) 
		VALUES 
			('admin@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin', 'admin', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, NULL, NULL, '{}', NULL),
			('mentor@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'mentor', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400', 'Software Engineering', 'Tech Solutions Inc.', 'Senior Software Engineer with 8+ years of experience in full-stack development.', '{"React","Node.js","Python","Machine Learning"}', 8),
			('student@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alex Chen', 'student', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', 'Computer Science', NULL, 'Computer Science student passionate about web development and AI.', '{"JavaScript","React","Python"}', NULL)
		ON CONFLICT (email) DO NOTHING;`,

		`INSERT INTO internships (title, company, description, requirements, duration, location, type, mentor_id, mentor_name, deadline, max_students, tags, salary)
		VALUES 
			('Frontend Developer Intern', 'Tech Solutions Inc.', 'Join our dynamic team to work on cutting-edge web applications using React, TypeScript, and modern CSS frameworks.', '{"React","TypeScript","HTML/CSS","Git"}', '3 months', 'San Francisco, CA', 'hybrid', 2, 'Sarah Johnson', '2024-02-15', 2, '{"Frontend","React","JavaScript"}', '$2000/month'),
			('Data Science Intern', 'Analytics Corp', 'Work with our data science team on machine learning projects and data analysis using Python and modern ML frameworks.', '{"Python","Machine Learning","Statistics","SQL"}', '4 months', 'New York, NY', 'onsite', 2, 'Sarah Johnson', '2024-02-20', 1, '{"Data Science","Python","ML"}', '$2500/month')
		ON CONFLICT DO NOTHING;`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			log.Printf("Error executing query: %v", err)
		}
	}
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("user_id", int(claims["user_id"].(float64)))
			c.Set("user_role", claims["role"].(string))
		}

		c.Next()
	}
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	var passwordHash string
	err := db.QueryRow("SELECT id, email, password_hash, name, role, avatar, department, company, bio, skills, experience, created_at FROM users WHERE email = $1", req.Email).
		Scan(&user.ID, &user.Email, &passwordHash, &user.Name, &user.Role, &user.Avatar, &user.Department, &user.Company, &user.Bio, &user.Skills, &user.Experience, &user.CreatedAt)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user":  user,
	})
}

func register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	// Insert user
	var userID int
	err = db.QueryRow(
		"INSERT INTO users (email, password_hash, name, role, department, company) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		req.Email, string(hashedPassword), req.Name, req.Role, req.Department, req.Company,
	).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user_id": userID,
	})
}

func getUsers(c *gin.Context) {
	rows, err := db.Query("SELECT id, email, name, role, avatar, department, company, bio, skills, experience, created_at FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.Avatar, &user.Department, &user.Company, &user.Bio, &user.Skills, &user.Experience, &user.CreatedAt)
		if err != nil {
			continue
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}

func getUser(c *gin.Context) {
	id := c.Param("id")
	var user User
	err := db.QueryRow("SELECT id, email, name, role, avatar, department, company, bio, skills, experience, created_at FROM users WHERE id = $1", id).
		Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.Avatar, &user.Department, &user.Company, &user.Bio, &user.Skills, &user.Experience, &user.CreatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func updateUser(c *gin.Context) {
	id := c.Param("id")
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec(
		"UPDATE users SET name = $1, department = $2, company = $3, bio = $4, skills = $5, experience = $6 WHERE id = $7",
		user.Name, user.Department, user.Company, user.Bio, user.Skills, user.Experience, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func getInternships(c *gin.Context) {
	query := `
		SELECT i.id, i.title, i.company, i.description, i.requirements, i.duration, i.location, 
		       i.type, i.mentor_id, i.mentor_name, i.posted_date, i.deadline, i.status, 
		       i.max_students, i.tags, i.salary, COUNT(a.id) as application_count
		FROM internships i
		LEFT JOIN applications a ON i.id = a.internship_id
		GROUP BY i.id
		ORDER BY i.posted_date DESC
	`

	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var internships []Internship
	for rows.Next() {
		var internship Internship
		err := rows.Scan(
			&internship.ID, &internship.Title, &internship.Company, &internship.Description,
			&internship.Requirements, &internship.Duration, &internship.Location, &internship.Type,
			&internship.MentorID, &internship.MentorName, &internship.PostedDate, &internship.Deadline,
			&internship.Status, &internship.MaxStudents, &internship.Tags, &internship.Salary,
			&internship.ApplicationCount,
		)
		if err != nil {
			continue
		}
		internships = append(internships, internship)
	}

	c.JSON(http.StatusOK, internships)
}

func createInternship(c *gin.Context) {
	var internship Internship
	if err := c.ShouldBindJSON(&internship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id int
	err := db.QueryRow(
		`INSERT INTO internships (title, company, description, requirements, duration, location, type, mentor_id, mentor_name, deadline, max_students, tags, salary)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
		internship.Title, internship.Company, internship.Description, internship.Requirements,
		internship.Duration, internship.Location, internship.Type, internship.MentorID,
		internship.MentorName, internship.Deadline, internship.MaxStudents, internship.Tags, internship.Salary,
	).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Internship created successfully"})
}

func updateInternship(c *gin.Context) {
	id := c.Param("id")
	var internship Internship
	if err := c.ShouldBindJSON(&internship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec(
		`UPDATE internships SET title = $1, company = $2, description = $3, requirements = $4, 
		 duration = $5, location = $6, type = $7, deadline = $8, status = $9, max_students = $10, 
		 tags = $11, salary = $12 WHERE id = $13`,
		internship.Title, internship.Company, internship.Description, internship.Requirements,
		internship.Duration, internship.Location, internship.Type, internship.Deadline,
		internship.Status, internship.MaxStudents, internship.Tags, internship.Salary, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Internship updated successfully"})
}

func deleteInternship(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM internships WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Internship deleted successfully"})
}

func getInternshipsByMentor(c *gin.Context) {
	mentorID := c.Param("id")
	query := `
		SELECT i.id, i.title, i.company, i.description, i.requirements, i.duration, i.location, 
		       i.type, i.mentor_id, i.mentor_name, i.posted_date, i.deadline, i.status, 
		       i.max_students, i.tags, i.salary, COUNT(a.id) as application_count
		FROM internships i
		LEFT JOIN applications a ON i.id = a.internship_id
		WHERE i.mentor_id = $1
		GROUP BY i.id
		ORDER BY i.posted_date DESC
	`

	rows, err := db.Query(query, mentorID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var internships []Internship
	for rows.Next() {
		var internship Internship
		err := rows.Scan(
			&internship.ID, &internship.Title, &internship.Company, &internship.Description,
			&internship.Requirements, &internship.Duration, &internship.Location, &internship.Type,
			&internship.MentorID, &internship.MentorName, &internship.PostedDate, &internship.Deadline,
			&internship.Status, &internship.MaxStudents, &internship.Tags, &internship.Salary,
			&internship.ApplicationCount,
		)
		if err != nil {
			continue
		}
		internships = append(internships, internship)
	}

	c.JSON(http.StatusOK, internships)
}

func getApplications(c *gin.Context) {
	rows, err := db.Query("SELECT id, internship_id, student_id, student_name, applied_date, status, cover_letter, resume FROM applications ORDER BY applied_date DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var applications []Application
	for rows.Next() {
		var app Application
		err := rows.Scan(&app.ID, &app.InternshipID, &app.StudentID, &app.StudentName, &app.AppliedDate, &app.Status, &app.CoverLetter, &app.Resume)
		if err != nil {
			continue
		}
		applications = append(applications, app)
	}

	c.JSON(http.StatusOK, applications)
}

func createApplication(c *gin.Context) {
	var app Application
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id int
	err := db.QueryRow(
		"INSERT INTO applications (internship_id, student_id, student_name, cover_letter, resume) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		app.InternshipID, app.StudentID, app.StudentName, app.CoverLetter, app.Resume,
	).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Application submitted successfully"})
}

func updateApplication(c *gin.Context) {
	id := c.Param("id")
	var app Application
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.Exec("UPDATE applications SET status = $1 WHERE id = $2", app.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application updated successfully"})
}

func getApplicationsByStudent(c *gin.Context) {
	studentID := c.Param("id")
	rows, err := db.Query("SELECT id, internship_id, student_id, student_name, applied_date, status, cover_letter, resume FROM applications WHERE student_id = $1 ORDER BY applied_date DESC", studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var applications []Application
	for rows.Next() {
		var app Application
		err := rows.Scan(&app.ID, &app.InternshipID, &app.StudentID, &app.StudentName, &app.AppliedDate, &app.Status, &app.CoverLetter, &app.Resume)
		if err != nil {
			continue
		}
		applications = append(applications, app)
	}

	c.JSON(http.StatusOK, applications)
}

func getApplicationsByInternship(c *gin.Context) {
	internshipID := c.Param("id")
	rows, err := db.Query("SELECT id, internship_id, student_id, student_name, applied_date, status, cover_letter, resume FROM applications WHERE internship_id = $1 ORDER BY applied_date DESC", internshipID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var applications []Application
	for rows.Next() {
		var app Application
		err := rows.Scan(&app.ID, &app.InternshipID, &app.StudentID, &app.StudentName, &app.AppliedDate, &app.Status, &app.CoverLetter, &app.Resume)
		if err != nil {
			continue
		}
		applications = append(applications, app)
	}

	c.JSON(http.StatusOK, applications)
}