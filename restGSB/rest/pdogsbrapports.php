<?php
/** 
 * Classe d'accès aux données. 
 
 * Utilise les services de la classe PDO
 * pour l'application Gsb Rapport 
 * Les attributs sont tous statiques,
 * les 4 premiers pour la connexion
 * $monPdo de type PDO 
 * $monPdoGsbRapports qui contiendra l'unique instance de la classe
 * @package default
 * @author Cheri Bibi
 * @version    1.0
 * @link       http://www.php.net/manual/fr/book.pdo.php
 */

// Charger la configuration depuis le fichier config.php
require_once(__DIR__ . '/../config.php');

class PdoGsbRapports{   		
      	 /*--------------------Version locale (maintenant depuis config.php)------- */
    
      private static $serveur;
      private static $bdd;   		
      private static $user;    		
      private static $mdp;
      private static $monPdo;
      private static $monPdoGsbRapports = null;
/**
 * Constructeur privé, crée l'instance de PDO qui sera sollicitée
 * pour toutes les méthodes de la classe
 */				
	private function __construct(){
            // Initialiser les paramètres de connexion depuis config.php
            self::$serveur = DB_DSN;
            self::$user = DB_USER;
            self::$mdp = DB_PASSWORD;
            
            self::$monPdo = new PDO(self::$serveur, self::$user, self::$mdp); 
            self::$monPdo->query("SET CHARACTER SET utf8");
	}
        
	public function _destruct(){
            self::$monPdo = null;
	}
/**
 * Fonction statique qui crée l'unique instance de la classe
 
 * Appel : $instancePdoGsbRapports = PdoGsbRapports::getPdo();
 
 * @return l'unique objet de la classe PdoGsbRapports
 */
	public  static function getPdo(){
		if(self::$monPdoGsbRapports == null){
			self::$monPdoGsbRapports = new PdoGsbRapports();
		}
		return self::$monPdoGsbRapports;  
	}
       

/**
 * Retourne les informations du visiteur
 * @param $login 
 * @param $mdp
 * @return le tableau associatif ou NULL
*/

	public function getLeVisiteur($login, $mdp){
		$req = "select id, nom, prenom from visiteur where login = :login and mdp = :mdp";
                $stm = self::$monPdo->prepare($req);
                $stm->bindParam(':login', $login);
                $stm->bindParam(':mdp', $mdp);
                $stm->execute();
        	$laLigne = $stm->fetch();
                if($laLigne !== false && count($laLigne)>1)
                   return $laLigne;
                else              
                    return NULL;
	}
        public function getLesRapportsUneDate($idVisiteur, $date){
                $req = "select rapport.id as idRapport, medecin.nom as nomMedecin, medecin.prenom as prenomMedecin, ";
                $req .= "rapport.motif as motif, rapport.bilan as bilan ";
                $req .= " from visiteur, rapport, medecin where visiteur.id = :idVisiteur";
                $req.= " and rapport.idVisiteur = visiteur.id ";
                $req .=" and rapport.idMedecin = medecin.id and rapport.date = :date ";
                $stm = self::$monPdo->prepare($req);
                $stm->bindParam(':idVisiteur', $idVisiteur);
                $stm->bindParam(':date', $date);
                $stm->execute();
                $lesLignes = $stm->fetchall();
                return $lesLignes;
         }
         public function getLeRapport($idRapport){
                $req = "select * from rapport where id = :idRapport" ; 
                $stm = self::$monPdo->prepare($req);
                $stm->bindParam(':idRapport', $idRapport);
                $stm->execute();
                $laLigne = $stm->fetch();
                return $laLigne;
         }
        public function majRapport($idRapport,$motif,$bilan,$idVisiteur = null){
                 // Si un idVisiteur est fourni, vérifie d'abord que le rapport lui appartient
                 if($idVisiteur !== null){
                     $req = "select id from rapport where id = :idRapport and idVisiteur = :idVisiteur";
                     $stm = self::$monPdo->prepare($req);
                     $stm->bindParam(':idRapport', $idRapport);
                     $stm->bindParam(':idVisiteur', $idVisiteur);
                     $stm->execute();
                     $laLigne = $stm->fetch();
                     
                     if($laLigne === false){
                         return false; // Le rapport n'appartient pas au visiteur
                     }
                 }
                 
                 $req = "update rapport set bilan = :bilan ,motif = :motif where id = :idRapport";
                  $stm = self::$monPdo->prepare($req);
                  $stm->bindParam(':idRapport', $idRapport);
                  $stm->bindParam(':motif', $motif); 
                  $stm->bindParam(':bilan', $bilan); 
                  return $stm->execute();
                 
        } 
        public function getLesMedecins($nom){
            
                $req = "select  * from medecin where nom like '" . $nom ."%' order by nom, prenom";
                $rs = self::$monPdo->query($req);
                $lesLignes = $rs->fetchAll();
                return $lesLignes;
        }
        
        public function getLeMedecin($idMedecin){
                $req = "select * from medecin where id = :idMedecin";
                $stm = self::$monPdo->prepare($req);
                $stm->bindParam(':idMedecin', $idMedecin); 
		$stm->execute();
                $laLigne = $stm->fetch();
                return $laLigne;
                
            
        }
        
        public function majMedecin($id ,$adresse ,$tel ,$specialite){
             $req = "update medecin set tel = :tel ,adresse = :adresse, ";
              $req .= "specialitecomplementaire = :specialite where id = :idMedecin";
                  $stm = self::$monPdo->prepare($req);
                  $stm->bindParam(':idMedecin', $id);
                  $stm->bindParam(':specialite', $specialite);
                  $stm->bindParam(':tel', $tel); 
                  $stm->bindParam(':adresse', $adresse); 
                  return $stm->execute();
        
        }
        public function getLesRapports($idMedecin){
            $req = "select rapport.motif as motif, rapport.date as date, rapport.bilan as bilan, ";
            $req .= " visiteur.nom as nom, visiteur.prenom as prenom from rapport, medecin, ";
            $req .= "visiteur where rapport.idMedecin = medecin.id ";
            $req .= " and rapport.idVisiteur = visiteur.id and medecin.id = :idMedecin order by date";
            $stm = self::$monPdo->prepare($req);
            $stm->bindParam(':idMedecin', $idMedecin); 
            $stm->execute();
            $lesLignes = $stm->fetchall();
            return $lesLignes;
        }
        
        public function getLesRapportsVisiteur($idVisiteur){
            $req = "select rapport.id as idRapport, rapport.motif as motif, rapport.date as date, ";
            $req .= "rapport.bilan as bilan, medecin.nom as nomMedecin, medecin.prenom as prenomMedecin, ";
            $req .= "medecin.id as idMedecin from rapport, medecin ";
            $req .= "where rapport.idMedecin = medecin.id ";
            $req .= "and rapport.idVisiteur = :idVisiteur order by date DESC";
            $stm = self::$monPdo->prepare($req);
            $stm->bindParam(':idVisiteur', $idVisiteur); 
            $stm->execute();
            $lesLignes = $stm->fetchall();
            return $lesLignes;
        }
        
        public function supprimerRapport($idRapport, $idVisiteur){
            // Vérifie d'abord que le rapport appartient bien au visiteur
            $req = "select id from rapport where id = :idRapport and idVisiteur = :idVisiteur";
            $stm = self::$monPdo->prepare($req);
            $stm->bindParam(':idRapport', $idRapport);
            $stm->bindParam(':idVisiteur', $idVisiteur);
            $stm->execute();
            $laLigne = $stm->fetch();
            
            if($laLigne === false){
                return false; // Le rapport n'appartient pas au visiteur
            }
            
            // Supprime d'abord les médicaments associés
            $req = "delete from offrir where idRapport = :idRapport";
            $stm = self::$monPdo->prepare($req);
            $stm->bindParam(':idRapport', $idRapport);
            $stm->execute();
            
            // Supprime ensuite le rapport
            $req = "delete from rapport where id = :idRapport";
            $stm = self::$monPdo->prepare($req);
            $stm->bindParam(':idRapport', $idRapport);
            return $stm->execute();
        }
        public function getLesMedicaments($nom){
            
                $req = "select * from medicament where nomCommercial like '" . $nom ."%' order by nomCommercial";
                $rs = self::$monPdo->query($req);
		$lesLignes = $rs->fetchAll();
                return $lesLignes;
            
        }
        public function ajouterRapport($idMedecin ,$idVisiteur ,$bilan ,$motif ,$date ,$medicaments){
                  $req = "insert into rapport(idMedecin ,idVisiteur ,bilan ,date, motif) " ;
                  $req .= " values (:idMedecin ,:idVisiteur ,:bilan , :date,  :motif )";
                  $stm = self::$monPdo->prepare($req);
                  $stm->bindParam(':idMedecin', $idMedecin);
                  $stm->bindParam(':idVisiteur', $idVisiteur);
                  $stm->bindParam(':motif', $motif); 
                  $stm->bindParam(':bilan', $bilan); 
                  $stm->bindParam(':date', $date); 
                  $retour = $stm->execute();;
                  $idRapport =  self::$monPdo->lastInsertId();   // récupère l'id créé
                  if($medicaments !=0){
                          foreach ($medicaments as $idMedicament =>$qte){
                            //  $idMedicament = $medicament['idMedicament'];
                             // $qte = $medicament['qte'];
                              $req = "insert into offrir(idRapport, idMedicament, quantite) ";
                              $req .= "values( :idRapport, :idMedicament, :qte)  ";
                              $stm = self::$monPdo->prepare($req);
                              $stm->bindParam(':idRapport', $idRapport);
                              $stm->bindParam(':idMedicament', $idMedicament);
                              $stm->bindParam(':qte', $qte);
                              $ret = $stm->execute();
                              if($ret!=1)
                                  $retour = 0;
                          }
                   }
                   return $retour;
                   
        }
        
       
}   // fin classe

