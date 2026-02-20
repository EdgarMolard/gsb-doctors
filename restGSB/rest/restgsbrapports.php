<?php

require_once("rest.php");
require_once("pdogsbrapports.php");
require_once("auth.php");

/**
* @class RestGSB

* Cette classe permet de :
*    + identifier la ressource visée
*    + procéder à l'analyse de la représentation de la ressource
*    + procéder à la résolution de l'action demandée
*    + générer la réponse
*/

class RestGSB extends Rest {
    /**
     * Instance PDO qui représente la connexion à la base de données
     */
    private $pdo;

    /**
     * Représentation de la ressource demandée qui sera incluse dans la réponse
     */
    private $data;

    /**
     * Code HTTP de retour
     */
    private $codeRetour;

    /**
     * Constructeur de la classe.
     *
     * Analyse la ressource demandée et détermine le point de terminanison (endpoint)
     * et l'identifiant éventuel de la ressource
     */
    public function __construct() {
        // Appel du constructeur de la classe mère
        parent :: __construct();
      
        // Vérifie qu'une ressource a bien été demandée
        // Permet notamment de retourner une erreur si l'utilisateur appelle le script
        // wsPersonnel.php sans respecter la norme de nommage des uri
        /*if (!isset($this->request['ressource'])) {
           
            $this->response('', 400);  // Bad request
        }*/

        /* Extrait, de la ressource demandée, le point de terminaison (endpoint) et
           l'identifiant éventuel de la ressource.
           La ressource doit être de type "endpoint" ou "endpoint/{id}".
           Ces informations sont stockées dans le tableau $request. */
        $tab = Array();
        $tab = explode('/', $this->request['ressource']);
        /* La première partie correspond au endpoint  */
        if (array_key_exists(0, $tab))
            $this->request['endpoint'] = array_shift($tab); 
        
        
        /* La seconde partie, si elle existe et est numérique,
           correspond à l'identifiant de la ressource (id) */
        if (array_key_exists(0, $tab) && is_numeric($tab[0]))
            $this->request['id'] = array_shift($tab);

        // Connexion à la base de données
       
        $this->pdo = $this->dbConnect();
     
    }

    /**
     * Connexion à la base de données.
     * Si la connexion ne peut pas être établie, une erreur 503 est retournée
     *
     * @return  instance pdo représentant la connexion à la base de données
     */
    private function dbConnect() {
       
        $pdo = null;

        try {
            $pdo =  PdoGsbRapports::getPdo();
           
        }
        catch (Exception $e) {
            $this->response('', 503);  //Service Unavailable
        }
        return $pdo;
    }

    /**
     * Méhode publique d'accès au web service REST.
     *
     * Cette méthode vérifie la cohérence des uri : cohérence entre endpoint, méthode,
     * identifiant ressource et paramètres attendus.
     * Si la demande n'est pas cohérente, une erreur 400 (Bad request) est retournée.
     * Si la demande est cohérente, appel de la méthode qui réalise le traitement demandé.
     *
     */
    public function process() {
        $this->codeRetour = 200;

        // Stocke les paramètres de la requête et l'identifiant de la ressource dans $args
        // $args contient les paramètres qui seront nécessaires à l'exécution des méthodes
        
        $args = array();
        foreach ($this->request as $k => $v) {
            if ($k != 'ressource' && $k != 'endpoint')
                $args[$k] = $v;
        }

        // Vérification de l'authentification pour tous les endpoints sauf 'connexion', 'health' et 'debug'
        if ($this->request['endpoint'] !== 'connexion' && $this->request['endpoint'] !== 'health' && $this->request['endpoint'] !== 'debug') {
            $token = Auth::getBearerToken();
            $userData = Auth::verifyToken($token);
            
            if (!$userData) {
                $this->response(json_encode(['error' => 'Non autorisé. Token invalide ou absent.']), 401); // Unauthorized
            }
            
            // Stocke les données de l'utilisateur pour utilisation dans les méthodes
            $args['authenticated_user'] = $userData;
        }
    
     
        /*
        * Détermine le traitement à exécuter (méthode) selon l'uri (ressource) et l'action
        * (get, poste put, delete) demandées
        * Si l'uri n'est pas correcte, on retourne le status 'Bad request'
        */
        switch ($this->request['endpoint']) {
        // ce service s'appellera à partir d'une URI de la forme .../restGSB/medecin/nom=tre
        // ou tre est le début du nom du médecin  
            case "medecins" :
                if ( isset($args['id']) ) {  // l'id de la ressource NE DOIT PAS être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLesMedecins";
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
      // ce service s'appellera à partir d'une URI de la forme .../restGSB/medecin/123 
      // où 123 est l'id du médecin      
            case "medecin" :
                if ( !isset($args['id']) ) {  // l'id de la ressource DOIT être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules les méthodes GET et UPDATE sont autorisées
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLeMedecin";
                    } else if ($this->method == 'PUT') {
                        $this->request['fonction'] = "majMedecin";
                    } else {
                        $this->data="Erreur"; // Bad Request
                        $this->codeRetour ="500";
                    }
                }
                break;
     // ce service s'appellera à partir d'une URI de la forme .../restGSB/rapport/789
     // où 789 est l'id du rapport
            case "rapport" :
                if ( !isset($args['id']) ) {  // l'id de la ressource DOIT être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules les méthodes GET et PUT sont autorisées
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLeRapport";
                    } else if ($this->method == 'PUT') {
                        $this->request['fonction'] = "majRapport";
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
         // ce service s'appellera à partir d'une URI de la forme .../restGSB/rapports/540
         // où 540 est l'id du médecin'
            case "rapports" :
                if ( !isset($args['id']) ) {  // l'id de la ressource DOIT être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLesRapports";
                    } 
                    else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
            case "rapports_a_date" :
                 if ( isset($args['id']) ) {  // l'id de la ressource ne DOIT être renseigné
                    $this->response("", 400); // Bad Request
                }
                else{
                      if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLesRapportsUneDate";
                       } 
                        else {
                        $this->response("", 400); // Bad Request
                    }

                }
                break;
            case 'login':
                if ( isset($args['id']) ) {  // l'id de la ressource NE DOIT PAS être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLogin";
     //                      error_log(print_r("Ok dans le bon case",true),3,"log.txt");
                          
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }
              
            break;        
            case 'connexion':
             
            // ce service s'appellera à partir d'une URI de la forme GET.../restGSB/connexion?login=toto&mdp=titi
            //
                if ( isset($args['id']) ) {  // l'id de la ressource NE DOIT PAS être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "connexion";
     //                      error_log(print_r("Ok dans le bon case",true),3,"log.txt");
                          
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
            case 'health':
                // Endpoint de santé pour Docker healthcheck
                // Retourne simplement un status OK sans authentification
                if ( isset($args['id']) ) {
                    $this->response("", 400); // Bad Request
                }
                else {
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "health";
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
            case 'debug':
                // Endpoint de debug pour vérifier les headers (À RETIRER EN PRODUCTION)
                if ( isset($args['id']) ) {
                    $this->response("", 400); // Bad Request
                }
                else {
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "debug";
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
                case 'majmedecin':
//// ce service s'appellera à partir d'une URI de la forme :
//     ../restGSB/majmedecin?id=12&adresse=ville&tel=1234567891&specialite=psy
                if ( isset($args['id']) ) {  // l'id de la ressource NE DOIT PAS être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "majMedecin";
     //                      error_log(print_r("Ok dans le bon case",true),3,"log.txt");
                          
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }

                break;
                case 'majrapport' :
                 if ( isset($args['id']) ) {  // l'id de la ressource NE DOIT PAS être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "majRapport";
     //                      error_log(print_r("Ok dans le bon case",true),3,"log.txt");
                          
                    } else {
                        $this->response("", 400); // Bad Request
                    }
                }

                break;
  // ce service s'appellera à partir d'une URI de la forme :
//     ../restGSB/medicaments?nom=tr              
                case  'medicaments':
                     if ( isset($args['id']) ) {  // l'id de la ressource ne DOIT être renseigné
                    $this->response("", 400); // Bad Request
                }
                else {  // Seules la méthode GET est autorisée
                    if ($this->method == 'GET') {
                        $this->request['fonction'] = "getLesMedicaments";
                    } 
                    else {
                        $this->response("", 400); // Bad Request
                    }
                }
                break;
                case  'nouveaurapport':
                         if ( isset($args['id']) ) {  // l'id de la ressource ne DOIT être renseigné
                            $this->response("", 400); // Bad Request
                        }
                        else {  // Seules la méthode GET est autorisée
                             if ($this->method == 'GET') {
                                 $this->request['fonction'] = "nouveauRapport";
     //                      error_log(print_r("Ok dans le bon case",true),3,"log.txt");
                          
                             } 
                             else {
                                $this->response("", 400); // Bad Request
                            }
                         }

                break;
              default:
         }

        // Exécute la méthode (fonction) correspondant à la ressource demandée
        // Si la méthode n'existe pas, une erreur 400 est retournée
        $func = $this->request['fonction'];

        if ((int) method_exists($this, $func) > 0) {  // Vérifie si la méthode existe
            // Exécute la méthode correspondant au traitement demandé
            $this->$func($args);
            
        }
        else {
            $this->response("", 501);  // Not Implemented
   //           error_log(print_r("passage dans méthod n'existe pas",true),3,"log.txt");
        }
        
        $this->response($this->data, $this->codeRetour);
    }
    
    private function health($args) {
        // Endpoint simple pour le healthcheck Docker
        $this->data = json_encode([
            'status' => 'ok',
            'service' => 'GSB API',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
    private function debug($args) {
        // Endpoint de debug pour vérifier les headers reçus (À RETIRER EN PRODUCTION)
        $debugInfo = [
            'message' => 'Debug info - Headers and environment',
            'authorization_methods' => [
                'SERVER_Authorization' => $_SERVER['Authorization'] ?? 'NOT SET',
                'SERVER_HTTP_AUTHORIZATION' => $_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET',
                'SERVER_REDIRECT_HTTP_AUTHORIZATION' => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 'NOT SET',
                'getenv_HTTP_AUTHORIZATION' => getenv('HTTP_AUTHORIZATION') ?: 'NOT SET',
                'Auth_getBearerToken' => Auth::getBearerToken() ?? 'NOT SET',
            ],
            'all_http_headers' => function_exists('apache_request_headers') ? apache_request_headers() : 'apache_request_headers NOT AVAILABLE',
            'server_keys_with_http' => array_filter(
                array_keys($_SERVER),
                function($key) { return strpos($key, 'HTTP_') === 0 || strpos($key, 'AUTH') !== false; }
            )
        ];
        $this->data = json_encode($debugInfo, JSON_PRETTY_PRINT);
    }
    
    private function connexion($args){
        $login = $args['login'];
        $mdp = $args['mdp'];
        $laLigne = $this->pdo->getLeVisiteur($login, $mdp);
         if(is_array($laLigne)){
             // Génère un token JWT pour l'utilisateur
             $token = Auth::generateToken([
                 'id' => $laLigne['id'],
                 'login' => $laLigne['login'],
                 'nom' => $laLigne['nom'] ?? '',
                 'prenom' => $laLigne['prenom'] ?? ''
             ]);
             
             // Ajoute le token à la réponse
             $laLigne['token'] = $token;
             $this->data = $this->encoderReponse($laLigne);
         }
         else{
             $this->data = json_encode(['error' => 'Identifiants incorrects']);
             $this->codeRetour=401;  // Unauthorized - identifiants incorrects
         }
    }
    private function getLesMedecins($args){
        $nom = $args['nom'];
        $lesLignes = $this->pdo->getLesMedecins($nom);
        $this->data = $this->encoderReponse( $lesLignes);
    }  
    private function getLeMedecin($args){
        $id = $args['id'];
        $laLigne = $this->pdo->getLeMedecin($id);
        if(is_array($laLigne))
             $this->data = $this->encoderReponse( $laLigne);
        else{
            $this->data ="Erreur";
            $this->codeRetour=400;
        }
    }   
     private function getLeRapport($args){
        $id = $args['id'];
        $laLigne = $this->pdo->getLeRapport($id);
        $this->data = $this->encoderReponse( $laLigne);
    } 
    private function getLesRapports($args){
        $idMedecin = $args['id'];
        $lesLignes = $this->pdo->getLesRapports($idMedecin);
        $this->data = $this->encoderReponse( $lesLignes);
    } 
    private function majMedecin($args){
        $idmedecin = $args['id'];
        $adresse = $args['adresse'];
        $tel = $args['tel'];
        $specialite = $args['specialite'];
        $this->pdo->majMedecin($idmedecin ,$adresse ,$tel ,$specialite);

    } 
    private function majRapport($args){
        $idRapport = $args['idRapport'];
        $bilan = $args['bilan'];
        $motif = $args['motif'];
        $this->pdo->majRapport($idRapport,$motif,$bilan);

    } 
    private function getLesRapportsUneDate($args){
        $date = $args['date'];
        $idVisiteur = $args['idVisiteur'];
        $lesLignes = $this->pdo->getLesRapportsUneDate($idVisiteur,$date);
        $this->data = $this->encoderReponse( $lesLignes);
    }
     private function getLesMedicaments($args){
        $nom = $args['nom'];
        $lesLignes = $this->pdo->getLesMedicaments($nom);
        $this->data = $this->encoderReponse( $lesLignes);
    } 
    private function nouveauRapport($args){
        $idVisiteur =  $args['idVisiteur'];
        $idMedecin =  $args['idMedecin'];
        $motif =  $args['motif'];
        $bilan =  $args['bilan'];
        $date =  $args['date'];
        $medicaments = $args['medicaments'];
        $this->pdo->ajouterRapport($idMedecin ,$idVisiteur ,$bilan ,$motif ,$date ,$medicaments);
    }
    private function encoderReponse($data) {
        if(is_array($data)){
				return json_encode($data);
			}
            else
                return json_encode(null);
    }
}
