<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</div>

## Descrição

API desenvolvida em [Nest](https://github.com/nestjs/nest).

## Instalação

```bash
$ npm install
```

## Executando o APP

**Se rodar local**

```bash
# Comentar a variável de ambiente na .env que se refere a rodar com Docker Compose.

DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}

# Cria as tabelas no banco.
$ npx prisma db push

# Executar os seeds.
$ npm run seed

# Comando para rodar em desenvolvimento (já executa o build).
$ npm run start:dev

# Comando para rodar em produção (já executa o build).
$ npm run start:prod
```

**Se rodar via Docker Compose**

```bash
# Comentar a variável de ambiente na .env que se refere a rodar local.

DATABASE_URL=mysql://<user>:<password>@<host>:<db_port>/<db_name>

# Subir os containers.
$ docker-compose up -d

# Acessar o container.
$ docker exec -it backend_application bash

# Cria as tabelas no banco.
$ npx prisma db push

# Executar os seeds.
$ npm run seed

# Comando para rodar em desenvolvimento (já executa o build).
$ npm run start:dev

# Comando para rodar em produção (já executa o build).
$ npm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
