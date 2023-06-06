# Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── ....
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── ....
├── nginx
    └── local.conf
```

# frontend/Dockerfile:

```
FROM node:16-alpine

# ? install node
RUN apk add python3 make g++

# ? creat new user (optional)
USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# ? copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# ? ci is exact install ( without upgraded version )
RUN npm i

# ? first . my PC
# ? second . docker working dir
COPY --chown=node:node . ./

# ? give access to 5000 port of docker
EXPOSE 3000

# RUN chmod +x /bin/sh
# RUN ls -a /bin/
RUN npm run build
CMD npx serve -s build -l 3000
```

# frontend/.dockerignore:

```
node_modules
build
```

# backend/Dockerfile:

```
FROM node:16-alpine

# ? install node
RUN apk add python3 make g++

# ? creat new user (optional)
USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# ? copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# ? ci is exact install ( without upgraded version )
RUN npm i

# ? first . my PC
# ? second . docker working dir
COPY --chown=node:node . ./

# ? give access to 5000 port of docker
EXPOSE 5000

# RUN chmod +x /bin/sh
# RUN ls -a /bin/
CMD npm start
```

# backend/.dcokerignore:

same as frontend

# nginx/local.conf:

```
worker_processes  1;


events {
    worker_connections  1024;
}

http {

    upstream backend_server {
        server backend:5000;
    }

    upstream frontend_server {
        server frontend:3000;
    }

    server {
        listen 8080;
        server_name localhost;
        client_max_body_size 8M;

        location /api/ {
            proxy_pass http://backend_server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location / {
            proxy_pass http://frontend_server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /socket.io/ {
            proxy_pass http://backend_server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

# docker-compose.yml:

```yaml
version: "3.1"

services:
  backend:
    build: ./backend
    environment:
      - PORT=5000
    restart: unless-stopped
    networks:
      - web-network

  frontend:
    build: ./frontend
    environment:
      - PORT=3000
    networks:
      - web-network
  nginx:
    image: nginx
    container_name: webserver
    restart: unless-stopped
    depends_on:
      - backend
      - frontend
    ports:
      - 8080:8080
    volumes:
      - ./nginx/local.conf:/etc/nginx/nginx.conf
    networks:
      - web-network

networks:
  web-network:
    driver: bridge
```

# How to run:

to build (have to do whenever you update your files) :

```bash
sudo docker-compose build
```

to start:

```bash
sudo docker-compose up
```

to stop:

```bash
sudo docker-compose down
```
