<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en development mode

1. Clone repo
2. Instalar
```
npm i
```
3. Nest CLI (instalado)
```
npm i -g @nestjs/cli
```

4. Levantar DB (cd directorio de proyecto)
Se crea directorio mongo/ dentro de proyecto. Ver docker-compose.yaml
```
docker-compose up -d
```

5. Ejecutar (dev)
```
npm run start:dev
```

## STACK
* NestJS framework
* Mongodb
