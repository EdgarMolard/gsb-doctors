# 🏥 GSB-DOCTORS

Application de gestion des médecins et rapports de visite pour GSB (Galaxy Swiss Bourdin). Stack moderne Angular 20 + API REST PHP 8.3 + MariaDB avec conteneurisation Docker complète.

## 📋 Fonctionnalités

- 🔐 **Authentification sécurisée** : Connexion par JWT avec gestion de session
- 👨‍⚕️ **Gestion des médecins** : Consultation, recherche et modification des informations
- 📝 **Gestion des rapports** : Création, modification et suppression de rapports de visite
- 🔒 **Sécurité** : Protection des routes, vérification des permissions, isolation des données par visiteur
- 🎨 **Interface moderne** : Design responsive adapté à tous les écrans

## 🚀 Démarrage

### Prérequis

- **Docker** et **Docker Compose** ([Installer Docker](https://docs.docker.com/get-docker/))

### Lancer l'application

```bash
# 1. Configurer l'environnement
linux : cp .env.example .env
windows : copy .env.example .env

# 2. Démarrer l'application
docker compose up -d --build

# 3. Accéder à l'application
# Frontend: http://localhost:4200
# API:      http://localhost:3000
```

## 🏗️ Architecture

```
┌─────────────────────┐
│  Frontend Angular   │  Port 4200
│   (nginx + node)    │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│   API REST PHP 8.3  │  Port 3000
│   (Apache + JWT)    │
└──────────┬──────────┘
           │ PDO
           ▼
┌─────────────────────┐
│  MariaDB 10.11      │  Port 3306
│  (gsbrapports DB)   │
└─────────────────────┘
```

### Technologies

- **Frontend** : Angular 20 (Standalone Components), TypeScript, RxJS
- **Backend** : PHP 8.3, API REST, JWT Authentication
- **Base de données** : MariaDB 10.11
- **Conteneurisation** : Docker, Docker Compose
- **Serveurs** : Apache (API), Nginx (Frontend)

## ⚙️ Configuration (.env)

```env
# Ports
FRONTEND_PORT=4200
API_PORT=3000

# Base de données
DB_NAME=gsbrapports
DB_USER=gsb_user
DB_PASSWORD=gsb_password

# CORS
CORS_ORIGIN=http://localhost:4200

# JWT (⚠️ CHANGER EN PRODUCTION)
JWT_SECRET_KEY=CHANGE_THIS_SECRET_KEY_IN_PRODUCTION
JWT_TOKEN_VALIDITY=86400
```

**⚠️ Production :** Générez une clé JWT forte : `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## 🐳 Commandes

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Voir les logs
docker compose logs -f

# Vérifier le statut
docker compose ps

# Redémarrer
docker compose restart
```

## 🔐 Connexion

**Compte de test :**
- Login : `aribiA`
- Mot de passe : `aaaa`

L'application utilise des **JWT tokens** stockés dans `sessionStorage` pour maintenir la session.

### Pages disponibles

- **/login** : Page de connexion
- **/hub** : Tableau de bord principal (après connexion)
- **/medecins** : Liste et gestion des médecins
- **/rapports** : Gestion des rapports de visite du visiteur connecté

## � Structure du projet

```
GSB-DOCTORS/
├── src/                    # Code source Angular
│   ├── app/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services (API calls)
│   │   ├── guards/         # Guards de protection des routes
│   │   ├── interceptors/   # Intercepteurs HTTP (JWT)
│   │   └── types/          # Interfaces TypeScript
│   └── environments/       # Configuration environnement
├── restGSB/                # API REST PHP
│   ├── rest/
│   │   ├── pdogsbrapports.php    # Accès données (PDO)
│   │   ├── restgsbrapports.php   # Endpoints REST
│   │   ├── auth.php              # Gestion JWT
│   │   └── rest.php              # Classe REST de base
│   └── config.php          # Configuration DB
├── docker-compose.yml      # Orchestration Docker
├── Dockerfile              # Image Docker Frontend
└── gsbrapports.sql         # Script SQL base de données
```

## 🔌 API Endpoints

### Authentification
- `GET /connexion?login=xxx&mdp=yyy` - Connexion et génération JWT

### Médecins
- `GET /medecins?nom=xxx` - Liste des médecins (filtre par nom)
- `GET /medecin/{id}` - Détails d'un médecin
- `PUT /medecin/{id}` - Modifier un médecin

### Rapports
- `GET /rapportsvisiteur` - Liste des rapports du visiteur connecté
- `GET /rapport/{id}` - Détails d'un rapport
- `POST /nouveaurapport` - Créer un rapport
- `PUT /rapport/{id}` - Modifier un rapport (seulement si propriétaire)
- `DELETE /rapport/{id}` - Supprimer un rapport (seulement si propriétaire)

**Note :** Tous les endpoints (sauf `/connexion`) nécessitent un token JWT dans le header `Authorization: Bearer <token>`

## 🛠️ Développement

### Modifier l'API

```bash
# Les modifications PHP sont prises en compte immédiatement
# Vérifier les logs en cas d'erreur
docker compose logs -f api
```

### Modifier le Frontend

```bash
# Le hot-reload est actif en mode développement
# Rebuild si nécessaire
docker compose up -d --build frontend
```

### Accéder à la base de données

```bash
# Via conteneur
docker compose exec db mysql -u gsb_user -p gsbrapports
# Mot de passe : gsb_password

# Via client externe
# Host: localhost:3306
# User: gsb_user
# Password: gsb_password
# Database: gsbrapports
```

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Modifier `*_PORT` dans `.env` puis `docker compose up -d` |
| API ne démarre pas | Attendre que DB soit healthy : `docker compose ps` |
| CORS bloqué | Vérifier `CORS_ORIGIN` dans `.env` correspond à l'URL du frontend |
| Erreur 401 sur l'API | Vérifier que le token JWT est valide et que `JWT_SECRET_KEY` est identique partout |
| Page blanche | Vérifier les logs : `docker compose logs frontend` |
| Erreur SQL | Réinitialiser la DB : `docker compose down -v && docker compose up -d` |

### Logs utiles

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db
```

## 📝 Base de données

La base `gsbrapports` contient les tables :
- **visiteur** : Comptes utilisateurs
- **medecin** : Informations médecins
- **rapport** : Rapports de visite
- **medicament** : Référentiel médicaments
- **offrir** : Relation rapports-médicaments

---

**Angular 20 • PHP 8.3 • MariaDB 10.11 • Docker**

*Projet BTS SIO - Galaxy Swiss Bourdin 2026*
