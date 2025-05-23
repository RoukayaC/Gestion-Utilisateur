#!/usr/bin/env python3
"""
Script pour copier le README complet dans votre projet
Usage: python copy-readme.py
"""

import os
import sys
from pathlib import Path

# Contenu du README complet
README_CONTENT = '''# 🏢 Système de Gestion des Utilisateurs

Une application web full-stack moderne pour la gestion des utilisateurs, rôles, permissions et audit, développée avec Spring Boot et Angular.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen)
![Angular](https://img.shields.io/badge/Angular-19-red)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table des Matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies](#️-technologies)
- [⚙️ Prérequis](#️-prérequis)
- [🚀 Installation](#-installation)
- [📊 Utilisation](#-utilisation)
- [🔧 Configuration](#-configuration)
- [📸 Captures d'écran](#-captures-décran)
- [🧪 Tests](#-tests)
- [🤝 Contribution](#-contribution)
- [📄 License](#-license)

## 🎯 Vue d'ensemble

Ce système de gestion des utilisateurs offre une solution complète pour administrer les accès et permissions dans une organisation. Il permet de gérer finement qui peut accéder à quoi, avec un système d'audit complet pour tracer toutes les actions.

### 🎯 Objectifs
- **Sécurité** : Authentification JWT et autorisation basée sur les rôles
- **Flexibilité** : Gestion dynamique des rôles et permissions
- **Traçabilité** : Audit complet de toutes les actions
- **Facilité d'utilisation** : Interface moderne et intuitive

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- ✅ Inscription et connexion sécurisées
- ✅ Authentification JWT avec expiration
- ✅ Hashage des mots de passe avec BCrypt
- ✅ Protection CSRF et CORS configurables

### 👥 Gestion des Utilisateurs
- ✅ CRUD complet des utilisateurs
- ✅ Activation/désactivation de comptes
- ✅ Assignation multiple de rôles
- ✅ Profil utilisateur personnalisable
- ✅ Changement de mot de passe

### 🛡️ Gestion des Rôles & Permissions
- ✅ Création de rôles personnalisés
- ✅ Attribution granulaire de permissions
- ✅ Hiérarchie de permissions
- ✅ Rôles prédéfinis (ADMIN, USER)

### 📊 Audit & Logs
- ✅ Journalisation de toutes les actions
- ✅ Filtrage par utilisateur, date, action
- ✅ Tableau de bord avec statistiques
- ✅ Export des logs (futur)

### 🎨 Interface Utilisateur
- ✅ Design responsive avec Angular Material
- ✅ Interface adaptative selon les rôles
- ✅ Notifications en temps réel
- ✅ Tables avec pagination et tri
- ✅ Formulaires de validation

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │    API Calls    │                 │
│   Frontend      │◄───────────────►│   Backend       │
│   (Angular 19)  │                 │   (Spring Boot) │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
                                             │
                                             │ JPA/Hibernate
                                             ▼
                                    ┌─────────────────┐
                                    │                 │
                                    │   Database      │
                                    │   (H2/MySQL)    │
                                    │                 │
                                    └─────────────────┘
```

### 🔧 Composants principaux

#### Backend (Spring Boot)
- **Controllers** : Endpoints REST API
- **Services** : Logique métier
- **Repositories** : Accès aux données
- **Security** : JWT, CORS, authentification
- **Models** : Entités JPA

#### Frontend (Angular)
- **Components** : Interfaces utilisateurs
- **Services** : Communication avec l'API
- **Guards** : Protection des routes
- **Interceptors** : Gestion des tokens JWT
- **Models** : Types TypeScript

## 🛠️ Technologies

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| **Java** | 17 | Langage de programmation |
| **Spring Boot** | 3.4.5 | Framework principal |
| **Spring Security** | 6.x | Sécurité et authentification |
| **Spring Data JPA** | 3.x | Accès aux données |
| **JWT** | 0.11.5 | Tokens d'authentification |
| **H2 Database** | 2.x | Base de données (dev) |
| **MySQL** | 8.0 | Base de données (prod) |
| **Maven** | 3.9+ | Gestionnaire de dépendances |

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| **Angular** | 19 | Framework frontend |
| **TypeScript** | 5.7+ | Langage de programmation |
| **Angular Material** | 19 | Composants UI |
| **RxJS** | 7.8+ | Programmation réactive |
| **Node.js** | 18+ | Runtime JavaScript |
| **npm** | 9+ | Gestionnaire de packages |

### DevOps
| Technologie | Version | Description |
|-------------|---------|-------------|
| **Docker** | 24+ | Conteneurisation |
| **Docker Compose** | 2+ | Orchestration |
| **Nginx** | Alpine | Serveur web (frontend) |

## ⚙️ Prérequis

### 🐳 Avec Docker (Recommandé)
```bash
# Vérifier Docker
docker --version
docker-compose --version

# Versions minimales requises
Docker version 20.10+
Docker Compose version 2.0+
```

### 💻 Développement local
```bash
# Backend
java -version    # Java 17+
mvn -version     # Maven 3.6+

# Frontend
node --version   # Node.js 18+
npm --version    # npm 9+
ng version       # Angular CLI 19+ (optionnel)
```

## 🚀 Installation

### 🐳 Installation avec Docker (Production-Ready)

#### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/user-management-system.git
cd user-management-system
```

#### 2. Démarrage rapide
```bash
# Rendre le script exécutable
chmod +x start-docker.sh

# Lancer l'application
./start-docker.sh
```

Ou manuellement :
```bash
# Construire et démarrer
docker-compose up --build -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

#### 3. Accéder à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8080
- **Base de données H2** : http://localhost:8080/h2-console

### 💻 Installation locale (Développement)

#### Backend
```bash
cd backend

# Installer les dépendances
mvn clean install

# Démarrer l'application
mvn spring-boot:run

# Ou avec profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm start

# Ou
ng serve
```

L'application sera accessible sur :
- **Frontend** : http://localhost:4200
- **Backend** : http://localhost:8080

## 📊 Utilisation

### 🔑 Comptes par défaut

#### Administrateur
- **Email** : `roukaya@gmail.com`
- **Mot de passe** : `roukaya2000`
- **Rôles** : ADMIN (tous les droits)

### 📱 Fonctionnalités par rôle

#### 👑 Administrateur (ADMIN)
- Gestion complète des utilisateurs
- Gestion des rôles et permissions
- Accès aux logs d'audit
- Tableau de bord avec statistiques
- Toutes les fonctionnalités

#### 👤 Utilisateur (USER)
- Consulter son profil
- Modifier son mot de passe
- Tableau de bord personnel
- Accès limité selon les permissions

### 🎯 Flux d'utilisation typique

1. **Connexion** avec le compte admin
2. **Créer des permissions** spécifiques à votre domaine
3. **Créer des rôles** et assigner les permissions
4. **Créer des utilisateurs** et assigner les rôles
5. **Surveiller l'activité** via les logs d'audit

## 🔧 Configuration

### 🌿 Variables d'environnement

#### Backend (`application.properties`)
```properties
# Base de données
spring.datasource.url=jdbc:h2:file:/data/testdb
spring.datasource.username=sa
spring.datasource.password=password

# JWT
app.jwt.secret=votre-secret-jwt-super-securise-ici
app.jwt.expiration=86400000

# CORS
cors.allowed.origins=http://localhost:3000,http://localhost:4200
```

#### Frontend (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 🐳 Configuration Docker

#### Production
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=jdbc:mysql://db:3306/usermanagement
  
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your-secure-password
```

### 🔐 Sécurité

#### JWT Configuration
```properties
# Durée de vie du token (24h)
app.jwt.expiration=86400000

# Secret JWT (CHANGEZ EN PRODUCTION)
app.jwt.secret=your-super-secret-jwt-key-change-in-production
```

#### CORS Configuration
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "https://votre-domaine.com"
    ));
    // ... autres configurations
}
```

## 📸 Captures d'écran

### 🔐 Page de connexion
```
┌─────────────────────────────────┐
│         LOGIN                   │
│                                 │
│  Email: [________________]      │
│  Password: [____________]       │
│                                 │
│         [  LOGIN  ]             │
│                                 │
│  Don't have an account?         │
│  Register here                  │
└─────────────────────────────────┘
```

### 📊 Tableau de bord Admin
```
┌─────────────────────────────────────────────────────────────┐
│ 👤 Admin Dashboard                                    🔔 ⚙️  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Statistics                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 👥 Users    │ │ 🛡️ Roles    │ │ 🔑 Permissions │        │
│  │    127      │ │     5       │ │      23       │        │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  📈 Recent Activity                                         │
│  • John Doe logged in                             2 min ago │
│  • New user created: Jane Smith                  5 min ago │
│  • Role updated: Manager                         10 min ago │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 👥 Gestion des utilisateurs
```
┌─────────────────────────────────────────────────────────────┐
│ User Management                          [🔍 Search] [+ Add] │
├─────────────────────────────────────────────────────────────┤
│ ID │ Name          │ Email             │ Roles    │ Status  │
├────┼───────────────┼───────────────────┼──────────┼─────────┤
│ 1  │ Admin User    │ admin@email.com   │ ADMIN    │ ✅ Active│
│ 2  │ John Doe      │ john@email.com    │ USER     │ ✅ Active│
│ 3  │ Jane Smith    │ jane@email.com    │ MANAGER  │ ❌ Inactive│
│ 4  │ Bob Wilson    │ bob@email.com     │ USER     │ ✅ Active│
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Tests

### 🧪 Tests Backend
```bash
cd backend

# Exécuter tous les tests
mvn test

# Tests avec rapport de couverture
mvn test jacoco:report

# Tests d'intégration
mvn verify
```

### 🧪 Tests Frontend
```bash
cd frontend

# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests end-to-end
npm run e2e
```

### 🧪 Tests Docker
```bash
# Tester la construction
docker-compose build

# Tester le démarrage
docker-compose up -d
docker-compose ps

# Tests de santé
curl http://localhost:8080/actuator/health
curl http://localhost:3000
```

## 🚀 Déploiement

### 🐳 Déploiement Docker

#### Développement
```bash
docker-compose -f docker-compose.yml up -d
```

#### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### ☁️ Déploiement Cloud

#### AWS ECS
```bash
# Build et push vers ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin YOUR_ECR_URI

docker build -t user-management-backend ./backend
docker tag user-management-backend:latest YOUR_ECR_URI/user-management-backend:latest
docker push YOUR_ECR_URI/user-management-backend:latest
```

#### Heroku
```bash
# Backend
heroku create your-app-backend
git subtree push --prefix backend heroku main

# Frontend
heroku create your-app-frontend
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
```

## 🛠️ Résolution des problèmes

### ❌ Problèmes courants

#### 1. Erreur CORS
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution** : Vérifier la configuration CORS dans `SecurityConfig.java`

#### 2. JWT Token expiré
```
JWT token expired
```
**Solution** : Se reconnecter ou augmenter la durée dans `application.properties`

#### 3. Base de données verrouillée
```
Database may be already in use
```
**Solution** : 
```bash
docker-compose down -v
docker-compose up -d
```

#### 4. Port déjà utilisé
```
Port 8080 is already in use
```
**Solution** :
```bash
# Trouver le processus
lsof -i :8080
kill -9 PID

# Ou changer le port
docker-compose down
docker-compose up -d
```

### 🔍 Debug

#### Logs Backend
```bash
# Docker
docker-compose logs backend

# Local
mvn spring-boot:run -Dlogging.level.root=DEBUG
```

#### Logs Frontend
```bash
# Docker
docker-compose logs frontend

# Browser
F12 -> Console
```

## 📚 Documentation API

### 🔗 Endpoints principaux

#### Authentication
```http
POST /api/auth/login
POST /api/auth/register
```

#### Users
```http
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
PATCH  /api/users/{id}/toggle-active
```

#### Roles
```http
GET    /api/roles
POST   /api/roles
PUT    /api/roles/{id}
DELETE /api/roles/{id}
```

#### Permissions
```http
GET    /api/permissions
POST   /api/permissions
PUT    /api/permissions/{id}
DELETE /api/permissions/{id}
```

#### Audit
```http
GET /api/audit
GET /api/audit/user/{userId}
GET /api/audit/date-range?start={start}&end={end}
```

### 📖 Swagger Documentation
Accéder à : http://localhost:8080/swagger-ui.html (à configurer)

## 🤝 Contribution

### 🔧 Setup développement

1. **Fork** le projet
2. **Clone** votre fork
```bash
git clone https://github.com/your-username/user-management-system.git
```

3. **Créer une branche** pour votre feature
```bash
git checkout -b feature/amazing-feature
```

4. **Développer** et tester
5. **Commit** vos changements
```bash
git commit -m "Add amazing feature"
```

6. **Push** vers votre branche
```bash
git push origin feature/amazing-feature
```

7. **Créer une Pull Request**

### 📋 Guidelines

#### Code Style
- **Backend** : Google Java Style Guide
- **Frontend** : Angular Style Guide
- **Commits** : Convention Conventional Commits




### 📋 Changelog

#### v1.0.0 (2024-01-XX)
- ✅ Authentification JWT
- ✅ CRUD Utilisateurs, Rôles, Permissions
- ✅ Interface Angular Material
- ✅ Audit logging
- ✅ Docker support

#### v0.9.0 (2024-01-XX)
- ✅ Setup initial
- ✅ Backend Spring Boot
- ✅ Frontend Angular
- ✅ Base de données H2


## 📄 License
Copyright (c) 2025 Roukaya Chelly





<div align="center">

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile ! ⭐**

Développé avec ❤️ par [Roukaya Chelly](https://github.com/votre-username)

