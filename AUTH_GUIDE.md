# 🔐 Authentification - Guide de test

## Identifiants de test

Pour tester l'application en mode développement sans backend, utilisez les identifiants suivants :

### 📧 Compte de test
- **Email** : `test@gsb.fr`
- **Mot de passe** : `test123`

---

## ⚙️ Configuration

### Mode Mock (développement sans backend)

Le mode mock est **activé par défaut** dans [environment.ts](src/environments/environment.ts).

Pour basculer entre le mode mock et les appels API réels :

```typescript
// Dans src/environments/environment.ts
export const environment = {
  useMockAuth: true,  // ✅ Mode mock activé (utilise les identifiants de test)
  // useMockAuth: false, // ❌ Désactivé (appels HTTP réels à l'API)
  
  testCredentials: {
    email: 'test@gsb.fr',
    password: 'test123'
  },
  
  apiUrl: 'http://localhost:3000/',
  // ...
};
```

### Modifier les identifiants de test

Pour changer les identifiants de test, éditez [environment.ts](src/environments/environment.ts) :

```typescript
testCredentials: {
  email: 'votre-email@exemple.com',
  password: 'votre-mot-de-passe'
}
```

---

## 🧪 Test de l'authentification

### 1. Page de login
- Accédez à l'application : `http://localhost:4200`
- Vous serez automatiquement redirigé vers `/login`

### 2. Se connecter
- Entrez les identifiants de test ci-dessus
- Cliquez sur "Se connecter"
- Vous serez redirigé vers `/medecins` si les identifiants sont corrects

### 3. Test de la protection des routes
- Essayez d'accéder directement à `http://localhost:4200/medecins` sans être connecté
- Vous devriez être redirigé vers `/login`

### 4. Déconnexion
- Sur la page des médecins, cliquez sur le bouton "Déconnexion" en haut à droite
- Vous serez redirigé vers `/login`

### 5. Persistance de session
- Connectez-vous avec les identifiants
- Rafraîchissez la page (F5)
- Vous devriez **rester connecté** (tant que l'onglet reste ouvert)
- Fermez et rouvrez le navigateur : vous devrez vous **reconnecter** (sessionStorage)

---

## 🔍 Console de débogage

En mode mock, des messages de debug s'affichent dans la console du navigateur :

```
🔧 Mode MOCK activé - Vérification des identifiants de test
📧 Email test attendu: test@gsb.fr
🔑 Mot de passe test attendu: test123
✅ Identifiants corrects - Connexion réussie
```

Pour voir ces messages :
1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Console"
3. Tentez de vous connecter

---

## 🚀 Passer en mode production (API réelle)

Quand votre backend est prêt :

1. **Configurez l'URL de l'API** dans [environment.ts](src/environments/environment.ts) :
   ```typescript
   apiUrl: 'https://votre-api.exemple.com/',
   ```

2. **Désactivez le mode mock** :
   ```typescript
   useMockAuth: false,
   ```

3. **Format attendu de la réponse API** :
   ```json
   POST /auth/login
   
   Request:
   {
     "email": "user@example.com",
     "password": "password123"
   }
   
   Response (200 OK):
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "email": "user@example.com",
       "name": "Nom Utilisateur",
       "role": "admin"
     }
   }
   ```

4. Le token sera automatiquement ajouté à tous les appels HTTP suivants via l'interceptor :
   ```
   Authorization: Bearer <token>
   ```

---

## 🛡️ Sécurité

⚠️ **IMPORTANT** :
- Les identifiants de test sont **visibles en clair** dans le code
- Le mode mock est **uniquement pour le développement**
- **Avant de déployer en production** :
  - Désactivez `useMockAuth`
  - Configurez une vraie API d'authentification
  - Ne commitez jamais de vrais identifiants dans le code

---

## 📁 Fichiers concernés

| Fichier | Description |
|---------|-------------|
| [authentification.ts](src/app/services/authentification.ts) | Service d'authentification (login, logout, mock) |
| [auth.guard.ts](src/app/guards/auth.guard.ts) | Guard qui protège les routes |
| [auth.interceptor.ts](src/app/interceptors/auth.interceptor.ts) | Interceptor qui ajoute le token aux requêtes |
| [app.routes.ts](src/app/app.routes.ts) | Configuration des routes protégées |
| [environment.ts](src/environments/environment.ts) | Configuration (identifiants, URLs) |
| [login-page.ts](src/app/pages/login-page/login-page.ts) | Composant de la page de login |
