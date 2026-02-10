# 🔌 Configuration pour l'API PHP GSB

## ✅ Application configurée pour votre API

L'application Angular est maintenant connectée à votre API PHP GSB locale.

### 📍 Configuration actuelle

**Endpoint d'authentification :**
```
GET http://localhost/restGSB/connexion?login=XXX&mdp=YYY
```

**Réponse attendue (succès) :**
```json
{
  "id": "a131",
  "0": "a131",
  "nom": "Aribi",
  "1": "Aribi",
  "prenom": "Alain",
  "2": "Alain"
}
```

**Réponse attendue (erreur) :**
```
HTTP 500 (Internal Server Error)
```

---

## 🧪 Test de connexion

### 1. Démarrer votre API PHP
Assurez-vous que votre serveur PHP est démarré et accessible à :
```
http://localhost/restGSB/
```

### 2. Tester l'API manuellement (optionnel)
```bash
# Test avec curl
curl "http://localhost/restGSB/connexion?login=aribiA&mdp=votremotdepasse"
```

Ou dans votre navigateur :
```
http://localhost/restGSB/connexion?login=aribiA&mdp=votremotdepasse
```

### 3. Démarrer l'application Angular
```bash
npm start
```

### 4. Se connecter
- Accédez à `http://localhost:4200`
- Entrez votre login (ex: `aribiA`)
- Entrez votre mot de passe
- Cliquez sur "Se connecter"

---

## 🔍 Comment ça fonctionne ?

### 1. Authentification
Quand vous vous connectez :
```typescript
// L'application appelle :
GET http://localhost/restGSB/connexion?login=aribiA&mdp=xxx

// Si succès (HTTP 200), stocke en session :
{
  token: "a131",           // L'ID utilisateur comme token
  user: {
    id: "a131",
    nom: "Aribi",
    prenom: "Alain"
  }
}
```

### 2. Vérification de session
- Le token (ID utilisateur) est stocké dans **sessionStorage**
- La session reste active tant que l'onglet est ouvert
- Si vous fermez le navigateur, vous devrez vous reconnecter

### 3. Gestion des erreurs
- **Erreur 500** = Login ou mot de passe incorrect
- Message affiché : "Login ou mot de passe incorrect"
- Déconnexion automatique si erreur 500 ou 401

---

## ⚙️ Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| [environment.ts](src/environments/environment.ts) | URL API changée vers `http://localhost/restGSB/` |
| [authentification.ts](src/app/services/authentification.ts) | Utilise GET avec query params, stocke l'ID comme token |
| [auth.interceptor.ts](src/app/interceptors/auth.interceptor.ts) | Gère l'erreur 500 au lieu de 401 |
| [login-page.html](src/app/pages/login-page/login-page.html) | Label "Login" au lieu de "Email" |
| [login-page.ts](src/app/pages/login-page/login-page.ts) | Suppression validation email |

---

## 🔧 Modification de l'URL de l'API

Si votre API est sur un autre port ou domaine, modifiez [environment.ts](src/environments/environment.ts) :

```typescript
export const environment = {
  // ...
  apiUrl: 'http://votre-serveur:port/restGSB/',
  // ...
};
```

---

## 🧩 Mode développement (Mock)

Pour revenir au mode mock sans backend :

Dans [environment.ts](src/environments/environment.ts) :
```typescript
useMockAuth: true,  // Activer le mode mock
```

Identifiants mock :
- Login : `test@gsb.fr`
- Mot de passe : `test123`

---

## 🐛 Dépannage

### Erreur CORS
Si vous avez une erreur de type :
```
Access to XMLHttpRequest at 'http://localhost/restGSB/...' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution :** Ajoutez les headers CORS dans votre API PHP :
```php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### L'API ne répond pas
1. Vérifiez que votre serveur PHP est démarré
2. Testez l'URL dans le navigateur : `http://localhost/restGSB/connexion?login=test&mdp=test`
3. Vérifiez les logs PHP pour voir les erreurs

### Erreur 500 systématique
1. Vérifiez vos identifiants (login/mot de passe)
2. Vérifiez les logs de votre API PHP
3. Testez l'endpoint avec curl ou Postman

---

## 📝 Notes importantes

⚠️ **Sécurité** : L'API utilise GET avec mot de passe en query string, ce qui n'est pas sécurisé en production. Les mots de passe apparaissent dans :
- Les logs serveur
- L'historique du navigateur
- Les proxies

💡 **Recommandations futures** :
- Utiliser POST au lieu de GET
- Hasher les mots de passe dans la base de données
- Implémenter de vrais tokens JWT
- Utiliser HTTPS en production
