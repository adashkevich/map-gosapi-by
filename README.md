#Server  

##Installation
sudo mkdir /opt/gosapi/
sudo groupadd map-gosapi-admin 
sudo usermod -a -G map-gosapi-admin andrew.daskhevich  
git clone https://github.com/adashkevich/map-gosapi-by.git  
sudo chown -R root:map-gosapi-admin /opt/gosapi/map-gosapi-by  
sudo chmod -R g+rwx /opt/gosapi/map-gosapi-by  
sudo groupadd ruby-admin  
sudo usermod -a -G ruby-admin andrew.daskhevich  
sudo chown -R root:ruby-admin /var/lib/gems  
sudo chmod -R g+rwx /var/lib/gems  
gem install bundler  
sudo vi /etc/profile.d/115-gosapi-by.sh (then press :esc :wq to save and exit)  
sudo chown -R root:115-bel-admin /etc/profile.d/115-gosapi-by.sh  
sudo chmod -R g+rw /etc/profile.d/115-gosapi-by.sh  
sudo dpkg-reconfigure tzdata
sudo chmod -R +x /opt/gosapi/map-gosapi-by/bash/  

3D-Party
[Blueimp Gallery](https://github.com/blueimp/Gallery#controls)
[Yandex maps](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/)