# User Management System

<div align="center">
 <img src="https://img.shields.io/badge/spring%20boot-3.4.5-green.svg" alt="Spring Boot 3.4.5">
 <img src="https://img.shields.io/badge/angular-17-red.svg" alt="Angular 17">
 <img src="https://img.shields.io/badge/java-17-orange.svg" alt="Java 17">
 <img src="https://img.shields.io/badge/docker-ready-blue.svg" alt="Docker Ready">
 <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" alt="License MIT">
</div>

<p align="center">
 A comprehensive web application for managing users, roles, and permissions with audit logging capabilities.
</p>

## 📋 Project Description

This application provides a complete user management solution with role-based access control (RBAC) and action auditing. It allows administrators to:

- **Manage users** (create, view, update, delete, activate/deactivate)
- **Define roles** with specific permissions
- **Assign roles** to users
- **Monitor user actions** through a detailed audit log

The system implements secure authentication with JWT tokens and provides a responsive user interface for all management operations.

## 🛠️ Technologies Used

### Backend
- **Java 17**
- **Spring Boot 3.4.5**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database access
- **H2 Database** (development)
- **MySQL** (production)
- **Maven** for dependency management
- **AOP** for audit logging

### Frontend
- **Angular 17**
- **Angular Material** for UI components
- **RxJS** for reactive programming
- **TypeScript**
- **HTML/SCSS**

### DevOps & Deployment
- **Docker** and **Docker Compose**
- **Nginx** for frontend serving
- **Git** for version control

## 📂 Project Structure
