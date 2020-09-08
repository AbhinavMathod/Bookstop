set -x
chmod -R 755 /var/www/html/
chown -R ubuntu:ubuntu /var/www/html/
cp -R /home/ubuntu/webapp_frontend/* /var/www/html/
chmod -R 755 /var/www/html/
chown -R ubuntu:ubuntu /var/www/html/
service apache2 restart
set +x