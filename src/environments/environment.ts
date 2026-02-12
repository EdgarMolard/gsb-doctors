/**
 * Configuration de l'environnement
 * Modifiez ces valeurs selon vos besoins (développement, production, etc.)
 */

export const environment = {
  production: false,
  
  // Mode mock : true = utilise testCredentials, false = appelle l'API PHP réelle
  useMockAuth: false,
  
  // Identifiants de test (mode mock uniquement)
  testCredentials: {
    email: 'test@gsb.fr',
    password: 'test123'
  },
  
  // URL de base de votre API PHP GSB
  apiUrl: 'http://localhost:3000/',
  
  // Endpoints API
  endpoints: {
    connexion: 'connexion',  // GET /connexion?login=xxx&mdp=yyy
    medecins: 'medecins'     // GET /medecins?nom=
  }
};
