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

## 3. Configuração do TypeORM
__Observações__:
- Conexão com banco de dados __Postgres__.   
- Informações necessárias da documentação do passo anterior.   

__Documentação__:   
- https://docs.nestjs.com/techniques/configuration  
- https://docs.nestjs.com/techniques/database
 
__Commit__: a693f25e2a944a6e08cf5da571e487cefb52dcac

1 - Instale:   
```bash
npm install --save @nestjs/typeorm typeorm pg
```

2 - Configuração do ORM no `AppModule`:   
- A configuração do ORM usa variáveis de ambiente.
- Desabilite a opção `synchronize` para evitar reset do banco.
- Na opção `entities` preciso colocar todas as entidades que acessam o DB.

3 - Configuração do ORM em cada Módulo que contém uma Entidade:   
- Se 1 módulo tem N entidades que se conectam ao banco, inserir as N.

## 4. Configuração do DataSource

__Observações__:
- Para saber como o DataSource interage com o TypeORM e Nest, verifique a seção _DataSource/Tipos_.
- Para técnicas de gerenciamento de DataSource, verifique a seção _DataSource/Gerenciamento_.
- Configuração para rodar migrations e seeds

__Documentação__:   
- https://docs.nestjs.com/techniques/database
- https://typeorm.io/data-source
- https://typeorm.io/data-source-options
- https://github.com/tada5hi/typeorm-extension
 
__Commit__: 0f7cdfac97fe855d18c468e644c6a5cbdc4d9384

1 - Instale:   
```bash
npm install typeorm-extension --save
```

2 - Crie o arquivo orm-config.[dev | prod].ts. (verifique a seção _DataSource/Gerenciamento_)
- Setar credenciais do banco.
- Setar localização das entidades, migrations e seeds
    - Por padrão, migrations e seeds são subpastas de `src/database`

# Seções

## DataSource

### Tipos
Em uma aplicação com NestJs com TypeORM, existem 2 tipos de DataSource.

- Datasource Interno (App Module):
    - O TypeORM cria um datasource para uso interno no NestJS. Este datasource é usado para gerenciar repositórios e interações de banco de dados durante a execução da aplicação.
    - As credenciais do banco de dados devem ser gerenciadas através de variáveis de ambiente, garantindo que não estejam expostas no código.

- Datasource para Migrations e Seeds (orm-config.ts):
    - Para operações de migração e seeds, o TypeORM exige um arquivo de configuração separado (orm-config.ts). Este arquivo deve conter as credenciais de acesso ao banco de dados.
    - Neste arquivo não há suporte para variáveis de ambiente, o que pode expor as credenciais. Por isso, é importante tratar isso com cautela.

### Gerenciamento
- Gerenciamento de datasources para diferentes ambientes (branchs):
    - Mantenha arquivos de configuração separados para desenvolvimento e produção (orm-config.dev.ts e orm-config.prod.ts, respectivamente).
    - Mantenha os scripts do package.json separados da mesma forma. Aqueles que usam o datasource orm-config.dev.ts, devem ser marcados com :deve e os que usam orm-config.prod.ts com :prod.
    - Não é permitido dar rollback em produção, então na branch de prod terá um scripts "migration:down:prod".
    - Comite apenas o orm-config.dev.ts preenchido e o orm-config.prod.ts apenas como boilerplate. Isso garante que seja um pouco mais difícil de rodar migrations em prod.
