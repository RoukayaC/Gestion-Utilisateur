User Management System Backend

A Spring Boot REST API for managing users, roles, and permissions with audit logging functionality.

Technologies Used

Java 17
Spring Boot 3.4.5
Spring Security with JWT
Spring Data JPA
H2 Database (development)
MySQL (production)
Maven

Project Structure
backend/
├── src/
│ ├── main/
│ │ ├── java/roukaya/chelly/user_management/
│ │ │ ├── aspect/ # AOP for audit logging
│ │ │ ├── config/ # Security and app configuration
│ │ │ ├── controller/ # REST API endpoints
│ │ │ ├── dto/ # Data transfer objects
│ │ │ ├── exception/ # Custom exceptions
│ │ │ ├── model/ # Entity models
│ │ │ ├── repository/ # Data access layer
│ │ │ ├── security/ # JWT implementation
│ │ │ ├── service/ # Business logic
│ │ ├── resources/
│ │ │ ├── application.properties # Application config
└── pom.xml # Maven dependencies
Features

User authentication with JWT
Role-based access control
Permission management
Audit logging of user actions
CRUD operations for all entities

Setup and Running
Prerequisites

JDK 17
Maven

Development Mode

Clone the repository
Navigate to the backend directory
Run the application:

bashmvn spring-boot:run

The API will be available at http://localhost:8080

Environment Configuration
The application uses H2 in-memory database for development and MySQL for production.
Development (default)
spring.profiles.active=dev
Production
spring.profiles.active=prod
spring.datasource.url=jdbc:mysql://localhost:3306/usermanagement
spring.datasource.username=root
spring.datasource.password=root
API Endpoints
Authentication

POST /api/auth/login - Authenticate user
POST /api/auth/register - Register new user

Users

GET /api/users - Get all users
GET /api/users/{id} - Get user by ID
POST /api/users - Create new user
PUT /api/users/{id} - Update user
DELETE /api/users/{id} - Delete user
PATCH /api/users/{id}/toggle-active - Toggle user active status

Roles

GET /api/roles - Get all roles
GET /api/roles/{id} - Get role by ID
POST /api/roles - Create new role
PUT /api/roles/{id} - Update role
DELETE /api/roles/{id} - Delete role
POST /api/roles/{roleId}/permissions - Add permissions to role
DELETE /api/roles/{roleId}/permissions - Remove permissions from role

Permissions

GET /api/permissions - Get all permissions
GET /api/permissions/{id} - Get permission by ID
POST /api/permissions - Create new permission
PUT /api/permissions/{id} - Update permission
DELETE /api/permissions/{id} - Delete permission

Audit Logs

GET /api/audit - Get all action logs
GET /api/audit/user/{userId} - Get logs by user
GET /api/audit/date-range - Get logs by date range

Default Credentials
On first startup, the system creates a default admin user:

Email: roukaya@gmail.com
Password: roukaya2000

Security Notes

JWT tokens expire after 24 hours by default
Make sure to set a strong JWT secret key in production
Passwords are encrypted using BCrypt
