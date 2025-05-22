# Système de Gestion des Utilisateurs

## Description du projet

Ce projet est une **application web full-stack** de gestion des utilisateurs, des rôles et des permissions, avec journalisation des actions (audit).  
- **Backend** : API REST sécurisée (Spring Boot, Spring Security, JWT)  
- **Frontend** : Application monopage en Angular 19 avec Angular Material  
- **Fonctionnalités** :
  - Authentification / inscription / JWT
  - Gestion CRUD des utilisateurs (activation / désactivation)
  - Gestion CRUD des rôles et affectation de permissions
  - Gestion CRUD des permissions
  - Journalisation (audit) de toutes les actions critiques
  - Interface adaptative selon le rôle (`ADMIN` vs `USER`)

## Technologies utilisées

| Côté serveur            | Côté client               | Base de données  | Sécurité / Auth         |
|-------------------------|---------------------------|------------------|-------------------------|
| • Java 17               | • Angular 19              | • H2 (dev)       | • Spring Security      |
| • Spring Boot 3         | • Angular Material        | • MySQL (prod)   | • JWT (io.jsonwebtoken) |
| • Spring Data JPA       | • RxJS                    |                  |                         |
| • Spring Validation     | • TypeScript 5            |                  |                         |
| • Lombok                |                           |                  |                         |
| • Maven                 | • Node.js 18+ / NPM       |                  |                         |

## Prérequis

- **Java 17** (JDK)  
- **Maven 3.6+**  
- **Node.js 18+** & **npm**  
- **Angular CLI 19+** (pour `ng serve`)  
- (Optionnel) **Docker** & **Docker Compose**

---

## Installation et exécution sans Docker

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-organisation/user-management.git
cd user-management
