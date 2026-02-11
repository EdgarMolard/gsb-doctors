/**
 * Configuration de l'environnement
 * Modifiez ces valeurs selon vos besoins (développement, production, etc.)
 * 
 * En mode Docker, l'apiUrl sera chargé depuis window.__env.apiUrl
 */

// Déclaration du type pour window.__env
declare global {
  interface Window {
    __env?: {
      apiUrl?: string;
    };
  }
}

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
  // En mode Docker, utilise window.__env.apiUrl si disponible
  apiUrl: (typeof window !== 'undefined' && window.__env?.apiUrl) 
    ? window.__env.apiUrl 
    : 'http://localhost:3000/',
  
  // Endpoints API
  endpoints: {
    connexion: 'connexion',  // GET /connexion?login=xxx&mdp=yyy
    medecins: 'medecins'     // GET /medecins?nom=
  }
};
