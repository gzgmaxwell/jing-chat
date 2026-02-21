cd /home/data/otc_h5_front
docker stop otc_h5_front
docker rm -f otc_h5_front
docker rmi $(docker images -f "dangling=true" -q)
docker rmi -f $(docker images -f "label=otc_h5_front" -q)
docker build -t otc_h5_front . 
docker run --name otc_h5_front -v /home/data/otc_h5_front/dist:/usr/share/nginx/html -p 26458:80 --restart=always -d otc_h5_front