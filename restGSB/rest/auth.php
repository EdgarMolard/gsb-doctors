<?php
/**
 * Classe de gestion de l'authentification par JWT (JSON Web Tokens)
 * Implémentation simple sans dépendances externes
 */

class Auth {
    /**
     * Clé secrète pour signer les tokens
     * Récupérée depuis la variable d'environnement JWT_SECRET_KEY
     */
    private static function getSecretKey() {
        $key = getenv('JWT_SECRET_KEY');
        if (!$key) {
            // Fallback uniquement pour le développement - NE PAS UTILISER EN PRODUCTION
            error_log('[WARNING] JWT_SECRET_KEY not set! Using default key (INSECURE!)');
            return 'GSB_SECRET_KEY_2026_CHANGE_IN_PRODUCTION';
        }
        return $key;
    }
    
    /**
     * Durée de validité du token en secondes
     * Récupérée depuis la variable d'environnement JWT_TOKEN_VALIDITY (défaut: 24h)
     */
    private static function getTokenValidity() {
        $validity = getenv('JWT_TOKEN_VALIDITY');
        return $validity ? (int)$validity : 86400; // 24 heures par défaut
    }

    /**
     * Génère un token JWT pour un utilisateur
     * 
     * @param array $userData Données de l'utilisateur (id, login, etc.)
     * @return string Token JWT généré
     */
    public static function generateToken($userData) {
        // Header du JWT
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);

        // Payload du JWT
        $payload = json_encode([
            'iat' => time(),  // Issued at
            'exp' => time() + self::getTokenValidity(),  // Expiration
            'data' => $userData
        ]);

        // Encodage en Base64Url
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);

        // Signature
        $signature = hash_hmac(
            'sha256',
            $base64UrlHeader . "." . $base64UrlPayload,
            self::getSecretKey(),
            true
        );
        $base64UrlSignature = self::base64UrlEncode($signature);

        // Token complet
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Vérifie et décode un token JWT
     * 
     * @param string $token Token à vérifier
     * @return array|false Données de l'utilisateur si le token est valide, false sinon
     */
    public static function verifyToken($token) {
        if (empty($token)) {
            return false;
        }

        // Découpe le token en ses trois parties
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $tokenParts;

        // Vérifie la signature
        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac(
            'sha256',
            $base64UrlHeader . "." . $base64UrlPayload,
            self::getSecretKey(),
            true
        );

        if (!hash_equals($signature, $expectedSignature)) {
            return false;
        }

        // Décode le payload
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);

        // Vérifie l'expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload['data'] ?? false;
    }

    /**
     * Récupère le token depuis les en-têtes HTTP
     * 
     * @return string|null Token si présent, null sinon
     */
    public static function getBearerToken() {
        $headers = self::getAuthorizationHeader();
        
        if (!empty($headers)) {
            if (preg_match('/Bearer\s+(.*)$/i', $headers, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }

    /**
     * Récupère l'en-tête Authorization
     * 
     * @return string|null En-tête Authorization si présent, null sinon
     */
    private static function getAuthorizationHeader() {
        $headers = null;
        
        // Méthode 1: Vérifier $_SERVER['Authorization']
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } 
        // Méthode 2: Vérifier $_SERVER['HTTP_AUTHORIZATION']
        else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        }
        // Méthode 3: Variable d'environnement définie par .htaccess
        else if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        }
        // Méthode 4: getenv() pour les variables d'environnement Apache
        else if (getenv('HTTP_AUTHORIZATION')) {
            $headers = trim(getenv('HTTP_AUTHORIZATION'));
        }
        // Méthode 5: apache_request_headers()
        else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)), 
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }

    /**
     * Encode en Base64Url (variante de Base64 pour les URL)
     * 
     * @param string $data Données à encoder
     * @return string Données encodées
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Décode depuis Base64Url
     * 
     * @param string $data Données à décoder
     * @return string Données décodées
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
