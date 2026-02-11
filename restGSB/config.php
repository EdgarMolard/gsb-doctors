<?php
/**
 * Configuration de la base de données pour Docker
 * Utilise les variables d'environnement pour la connexion
 */

// Configuration de l'affichage des erreurs PHP
$displayErrors = getenv('PHP_DISPLAY_ERRORS') ?: '0';
$errorReporting = getenv('PHP_ERROR_REPORTING') ?: 'E_ERROR';

ini_set('display_errors', $displayErrors);
ini_set('display_startup_errors', $displayErrors);

// Convertir E_ERROR en constante si c'est une chaîne
if (is_string($errorReporting)) {
    $errorReporting = defined($errorReporting) ? constant($errorReporting) : E_ERROR;
}
error_reporting($errorReporting);

// Configuration de la base de données depuis les variables d'environnement
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'gsbrapports');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
define('DB_CHARSET', 'utf8');

// Construction de la chaîne DSN
define('DB_DSN', 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET);
