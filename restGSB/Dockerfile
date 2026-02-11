# Use official PHP 8.3 with Apache
FROM php:8.3-apache

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite for .htaccess
RUN a2enmod rewrite

# Enable Apache headers module for CORS
RUN a2enmod headers

# Copy Apache configuration for CORS
COPY apache-cors.conf /etc/apache2/conf-available/cors.conf
RUN a2enconf cors

# Set working directory
WORKDIR /var/www/html

# Copy API source code
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache to allow .htaccess overrides
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Expose port 80
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
