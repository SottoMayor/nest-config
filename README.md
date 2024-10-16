# NestJs CLI

1. Criação dos __arquivos do módulo__ - module, controller, entity, services (com spec), pasta interfaces (n interfaces), pasta dtos (n dtos)
    - Método 1, considere o _nome do módulo_ sendo _users_:
        - ``nest g resource users``, opções REST API e CRUD.
        - Apagar o arquivo `users.controller.spec`
        - `nest g itf users/interfaces/user --flat`
    - Método 2, considere o _nome do módulo_ sendo _users_:
        - `nest g module users`
        - `nest g controller users --no-spec`
        - `nest g service users`
        - `nest g itf users/interfaces/user --flat`
        - `nest g cl /users/dto/[create | update]-user.dto --flat --no-spec`
        - `nest g cl /users/entities/user.entity --flat --no-spec`
        
2. Criação de __arquivos compartilhados__:
    - `nest g f /filters/ErrorHandler --flat --no-spec`
    - `nest g gu /guards/Auth --flat --no-spec`
    - `nest g itc /interceptors/BodyConverter --flat --no-spec`
    - `nest g mi /middlewares/Logger --flat --no-spec`
    - `nest g pi /pipes/ValidationPipe --flat --no-spec`

# Passos 

## 1. Criação de Módulo

Use a CLI para criar os arquivos:
- Rapidez
- Conexão com os módulo é feita pelo próprio framework

## 2. Configuração de Variáveis de Ambiente
__Documentação__: https://docs.nestjs.com/techniques/configuration   
__Commit__: 57f7d5d5e83b35deda9218c8e35bd17c7575c6c7

1 - Instale:   
```bash
npm i --save @nestjs/config
```

2 - Crie um `.env` no root.

3 - Importe o Módulo de Configuração `ConfigModule` no módulo principal `AppModule`.


