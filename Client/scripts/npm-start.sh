#!/bin/bash
cd /home/ubuntu/webapp
ng build
cd dist/
cd secure-frontend/
tar -czvf frontend.tar.gz *
tar -xzvf frontend.tar.gz -C/var/www/html/
sudo sed -i '21i\        ErrorDocument 404 /index.html' /etc/apache2/sites-available/000-default.conf
cd 
cd /var/www/html
sudo -s
service apache2 stop
service apache2 start
service apache2 restart


