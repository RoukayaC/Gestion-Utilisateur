# User Management System Backend

<div align="center">
 <img src="https://img.shields.io/badge/spring%20boot-3.4.5-green.svg" alt="Spring Boot 3.4.5">
 <img src="https://img.shields.io/badge/java-17-orange.svg" alt="Java 17">
 <img src="https://img.shields.io/badge/JWT-security-blue.svg" alt="JWT Security">
</div>

<p align="center">
 A Spring Boot REST API for managing users, roles, and permissions with audit logging functionality.
</p>

## 🛠️ Technologies Used

- **Java 17**
- **Spring Boot 3.4.5**
- **Spring Security** with JWT
- **Spring Data JPA**
- **H2 Database** (development)
- **MySQL** (production)
- **Maven**

## 📂 Project Structure
backend/
├── src/
│   ├── main/
│   │   ├── java/roukaya/chelly/user_management/
│   │   │   ├── aspect/        # AOP for audit logging
│   │   │   ├── config/        # Security and app configuration
│   │   │   ├── controller/    # REST API endpoints
│   │   │   ├── dto/           # Data transfer objects
│   │   │   ├── exception/     # Custom exceptions
│   │   │   ├── model/         # Entity models
│   │   │   ├── repository/    # Data access layer
│   │   │   ├── security/      # JWT implementation
│   │   │   ├── service/       # Business logic
│   │   ├── resources/
│   │   │   ├── application.properties  # Application config
└── pom.xml                    # Maven dependencies

## ✨ Features

- **User authentication** with JWT
- **Role-based access control**
- **Permission management**
- **Audit logging** of user actions
- **CRUD operations** for all entities

## 🚀 Setup and Running

### Prerequisites
- JDK 17
- Maven

### Development Mode

1. Clone the repository
2. Navigate to the backend directory
3. Run the application:
```bash
mvn spring-boot:run

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

📖 API Endpoints
