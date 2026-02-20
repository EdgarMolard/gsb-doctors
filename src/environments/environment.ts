/**
 * Configuration de l'environnement
 * Modifiez ces valeurs selon vos besoins (développement, production, etc.)
 */

export const environment = {
  production: false,
  
  // URL de base de votre API PHP GSB
  apiUrl: 'http://localhost:3000/',
  
  // Endpoints API
  endpoints: {
    connexion: 'connexion',  // GET /connexion?login=xxx&mdp=yyy
    medecins: 'medecins',    // GET /medecins?nom=
    rapportsvisiteur: 'rapportsvisiteur',  // GET /rapportsvisiteur
    rapport: 'rapport',      // GET/PUT/DELETE /rapport/{id}
    nouveaurapport: 'nouveaurapport'  // POST /nouveaurapport
  }
};
