# Système de Gestion des Utilisateurs

## 🔍 Description

Ce projet est une application web full-stack de gestion des utilisateurs, des rôles et des permissions, avec journalisation (audit) de toutes les actions.  
Elle permet à un administrateur de contrôler finement l’accès et les droits, et offre à chaque utilisateur une interface personnalisée selon son rôle.

---

## 🚀 Fonctionnalités

- **Authentification & JWT**  
  Inscription, connexion, stockage sécurisé du token JWT.
- **Gestion des utilisateurs**  
  ● Création, modification, activation/désactivation, suppression  
  ● Affectation dynamique de rôles  
- **Gestion des rôles & permissions**  
  ● Création / édition / suppression de rôles  
  ● Assignation et retrait de permissions  
- **Audit & Logs**  
  Suivi et filtrage des actions (API calls, création/modification, etc.)
- **Interface adaptative**  
  ● Vue **Admin** : accès complet  
  ● Vue **User** : accès restreint (profil, tableau de bord)

---

## 🛠️ Technologies

| Côté serveur                  | Côté client               | Base de données       |
| ----------------------------- | ------------------------- | --------------------- |
| Java 17, Spring Boot 3        | Angular 19, TypeScript 5  | H2 (dev) / MySQL (prod) |
| Spring Security & JWT         | Angular Material          |                       |
| Spring Data JPA, Hibernate    | RxJS                      |                       |
| Maven                         | Node 18+, npm             |                       |

---

## ⚙️ Prérequis

- Java 17 JDK  
- Maven 3.6+  
- Node.js 18+ & npm  
- Angular CLI 19 (optionnel)  
- (Optionnel) Docker & Docker Compose  

---

## 📥 Installation & Lancement

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-orga/user-management.git
cd user-management


---

## 🐳 Dockerisation

### 1. Lancer l'application avec Docker

```bash
chmod +x start-docker.sh
./start-docker.sh

### 2. Arrêter les services

```bash
docker-compose down
```

### 3. Voir les logs

```bash
docker-compose logs -f
```
