# 🏥 GSB-DOCTORS

Application de gestion des médecins pour GSB (Gestion Service des Bénéfices). Stack complète Angular 20 + API PHP 8.3 + MariaDB, entièrement containerisée avec Docker.

## 🚀 Démarrage rapide

### Prérequis

- **Docker** 24+ et **Docker Compose** 2+ ([Installer Docker](https://docs.docker.com/get-docker/))
- Ou pour développement local : **Node.js 18+**, **PHP 8.3**, **MySQL/MariaDB**

### Lancer avec Docker (recommandé)

```bash
# 1. Configurer l'environnement
cp .env.example .env

# 2. Démarrer tous les services
docker compose up -d --build

# 3. Accéder à l'application
# Frontend: http://localhost:4200
# API:      http://localhost:3000
# Database: localhost:3306
```

### Développement local (sans Docker)

```bash
# Frontend
npm install
npm start  # → http://localhost:4200

# API + Database
# Utiliser XAMPP/WAMP ou configurer Apache + PHP + MySQL
# Importer gsbrapports.sql dans votre base de données
```

## 🏗️ Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │─────▶│      API     │─────▶│   Database   │
│   Angular    │ HTTP │   PHP 8.3    │ MySQL│   MariaDB    │
│   Port 4200  │◀─────│   Port 3000  │◀─────│   Port 3306  │
└──────────────┘      └──────────────┘      └──────────────┘
```

- **Frontend**: Angular 20 + Nginx
- **Backend**: PHP 8.3 + Apache + PDO
- **Database**: MariaDB 10.11 (initialisée avec `gsbrapports.sql`)

## ⚙️ Configuration

Toutes les variables sont dans `.env` :

```env
# Ports
FRONTEND_PORT=4200
API_PORT=3000
DB_PORT=3306

# Base de données
DB_NAME=gsbrapports
DB_USER=gsb_user
DB_PASSWORD=gsb_password
DB_ROOT_PASSWORD=gsb_root_2026

# API
API_URL=http://localhost:3000/
CORS_ORIGIN=http://localhost:4200
```

## 🐳 Commandes Docker

```bash
# Démarrer tous les services
docker compose up -d

# Démarrer avec rebuild des images
docker compose up -d --build

# Voir les logs (tous les services)
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db

# Vérifier le statut des conteneurs
docker compose ps

# Redémarrer les services
docker compose restart

# Redémarrer un service spécifique
docker compose restart api

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (⚠️ perte des données)
docker compose down -v

# Nettoyer complètement (images + volumes)
docker compose down -v --rmi all
```

## 🧪 Tests et validation

```bash
# Vérifier que les 3 conteneurs sont UP
docker compose ps

# Tester l'API
curl http://localhost:3000/

# Se connecter à la base de données
docker compose exec db mysql -u gsb_user -pgsb_password gsbrapports

# Voir les logs d'un service
docker compose logs -f api
```

## 🐛 Dépannage

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Modifier `*_PORT` dans `.env` |
| API ne démarre pas | Attendre que `db` soit healthy: `docker compose ps` |
| CORS bloqué | Vérifier que `CORS_ORIGIN` correspond au frontend |
| DB non initialisée | `docker compose down -v` puis redémarrer |

## 📁 Structure du projet

```
├── src/                          # Application Angular
│   ├── app/
│   │   ├── pages/               # Pages (login, doctors)
│   │   ├── components/          # Composants réutilisables
│   │   ├── services/            # Services (API, auth)
│   │   ├── guards/              # Guards de navigation
│   │   └── interceptors/        # Intercepteurs HTTP
│   └── environments/            # Configuration environnement
├── restGSB/                     # API PHP REST
│   ├── rest/                    # Classes PDO et REST
│   ├── config.php               # Configuration DB (credentials)
│   └── Dockerfile               # Image PHP 8.3 + Apache
├── docker-compose.yml           # Orchestration 3 services
├── Dockerfile                   # Image Angular + Nginx
├── gsbrapports.sql             # Schéma et données de la base
└── .env                        # Configuration (ports, credentials)
```

## 🔐 Authentification

L'API utilise une authentification simple par login/mot de passe (GET). Pour tester, consultez la table `visiteur` dans `gsbrapports.sql`.

Mode mock disponible : définir `useMockAuth: true` dans `src/environments/environment.ts`
- Email: `test@gsb.fr`
- Password: `test123`

## 🚢 Production

Avant de déployer :

1. **Désactiver le volume de développement** dans `docker-compose.yml` :
   ```yaml
   # volumes:
   #   - ./restGSB:/var/www/html
   ```

2. **Sécuriser les credentials** dans `.env` :
   - Mots de passe forts pour DB
   - Mettre `PHP_DISPLAY_ERRORS=0`

3. **Configurer HTTPS** avec reverse proxy (Nginx/Traefik)

4. **Mettre à jour** `CORS_ORIGIN` et `API_URL` avec votre domaine

## 📝 Développement Angular

```bash
# Générer un composant
ng generate component nom-composant

# Générer un service
ng generate service nom-service

# Lancer les tests
ng test

# Build de production
ng build
```

## 💾 Sauvegarde de la base

```bash
# Backup
docker compose exec db mysqldump -u root -pgsb_root_2026 gsbrapports > backup.sql

# Restore
docker compose exec -T db mysql -u root -pgsb_root_2026 gsbrapports < backup.sql
```

---

**Développé avec Angular 20.3 • PHP 8.3 • MariaDB 10.11**
