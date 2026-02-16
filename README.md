# 🏥 GSB-DOCTORS

Application de gestion des médecins pour GSB. Stack Angular 20 + API PHP 8.3 + MariaDB avec Docker.

## 🚀 Démarrage

### Prérequis

- **Docker** et **Docker Compose** ([Installer Docker](https://docs.docker.com/get-docker/))

### Lancer l'application

```bash
# 1. Configurer l'environnement
cp .env.example .env

# 2. Démarrer l'application
docker compose up -d --build

# 3. Accéder à l'application
# Frontend: http://localhost:4200
# API:      http://localhost:3000
```

## 🏗️ Architecture

```
Frontend (Angular:4200) → API (PHP:3000) → Database (MariaDB:3306)
```

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

**⚠️ Production :** Générez une clé JWT forte : `openssl rand -base64 32`

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

L'application utilise des **JWT tokens** stockés dans `sessionStorage`.

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Modifier `*_PORT` dans `.env` |
| API ne démarre pas | Attendre que DB soit healthy : `docker compose ps` |
| CORS bloqué | Vérifier `CORS_ORIGIN` dans `.env` |

---

**Angular 20 • PHP 8.3 • MariaDB 10.11**
