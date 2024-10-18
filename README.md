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

# Passos de Configuração

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
 
## 5. Migrations e Seeds

__Observações__:
- Configurações realizadas no passo anterior.   
- Definição de scripts (package.json) de gerenciamento.
- Rodar scripts para criação ou execução de arquivos.   

__Documentação__:   
- https://typeorm.io/migrations   
- https://github.com/tada5hi/typeorm-extension   
 
__Commit__: 1ca8fa89f069b6c19df55bd3646eb2e4c76673ff


1. Se for usar seeds, crie a pasta `src/database/seeds`.
- _OBS_: Poderia-se usar um comando, junto com o script de _criação de seed_, para gerar a pasta automaticamente. Mas, para garantir que não haverá erros entre diferentes OS, eu optou-se por esta abordagem.

2. Scripts de migrations (package.json):   
    - `CLI`:   
         - __`Preferencial`__: Seguindo a documentação do TypeORM de 10/2024   
              - `"typeorm-cli": "npx typeorm-ts-node-commonjs"`   
         - `Alternativa`: Esta versão não está na documentação do TypeORM, funciona por conta das dependências instaladas por meio do Nest e do TypeOrm   
              - `"typeorm-cli": "npx ts-node --transpile-only ./node_modules/typeorm/cli.js"`
    - `Criação`:   
        - `"migration:create": "npm run typeorm-cli -- migration:create"`   
    - `Migrations com DataSource`:
        - `prod` (orm-config.prod.ts):
            - `"migration:show:prod": "npm run typeorm-cli -- migration:show -d src/orm-config.prod.ts"`
            - `"migration:up:prod": "npm run typeorm-cli -- migration:run -d src/orm-config.prod.ts"`
        - `dev` (orm-config.dev.ts):
            - `"migration:show:dev": "npm run typeorm-cli -- migration:show -d src/orm-config.dev.ts"`
            - `"migration:up:dev": "npm run typeorm-cli -- migration:run -d src/orm-config.dev.ts"`
            - `"migration:down:dev": "npm run typeorm-cli -- migration:revert -d src/orm-config.dev.ts"`
    
__Execução__ dos scripts:   
- _Script CLI_: Não precisa ser executado   
- _Criação_:
```bash
npm run migration:create ./src/database/migrations/[migration-name]"
```
   
- _Migrations com DataSource_:
```bash
npm run [script-name]
```

3. Scripts de Seeds (package.json):
    - `CLI`:
        - `"typeorm-extended-cli": "npx ts-node ./node_modules/typeorm-extension/bin/cli.cjs"`   
    - `Criação`:
        - `"seed:create": "npm run typeorm-extended-cli -- seed:create --name"`   
    - Execução:   
        - `prod` (orm-config.prod.ts):
            - `"seed:run:prod": "npm run typeorm-extended-cli -- seed:run -d src/orm-config.prod.ts"`
        - `dev` (orm-config.dev.ts):
            - `"seed:run:dev": "npm run typeorm-extended-cli -- seed:run -d src/orm-config.dev.ts"`

__Execução__ dos scripts:   
- _Script CLI_: Não precisa ser executado.   
- _Criação_:
```bash
npm run seed:create ./src/database/seeds/[seed-name]
```

- _Execução_: 
```bash
npm run [script-name]
```

## Dockerização

__Commit__: 46fb0ae95e6eb70e1456cbc367c3a5993812e395   

1 - Escreva o `Dockerfile`.   
2 - Escreva o `.dockerignore`.    


# Passos de Construção de API 
Uma vez que o projeto já está configurado, um percurso interessante para trabalhar com módulos é:
- De uma vez, para cada módulo:
1. Construir as Entidades e Definir seus Relacionamentos.
2. Construir e Executar Migrations e Seeds.
3. Construir e Validar/Sanitizar DTOs.
- Um módulo por vez:
4. Implementar Services e Controllers e Conectá-los.
- Imediatamente após a realização do passo 4.
5. Disponibilizar Endpoints.
  

_OBS __1___: Esta ordem garante maior clareza na construção da aplicação.   
_OBS __2___: Esse passo a passo pode ser reaplicado quantas vezes for necessário durante toda a construção da API, com a adição de novos módulos.   
_OBS __3___:: Apesar de existir uma ordem, pode ser que algum passo não seja necessário, dependendo do propósito do módulo.   
_OBS __4___:: Nos passos 3 e 5 é necessário fazer instalação e configuração na primeira vez.   

## Construção da API a partir de 1 Entidade
- Nesta parte, assume-se que foram feitos os passos de configuração e um módulo com uma entidade User foi criada.
- Neste momento, é interessante ter um projeto base de como é esta entidade, regras de validação, endpoints que se deseja implementar. Veja o projeto-base.txt no diretório root.

### 1. Construir as Entidades e Definir seus Relacionamentos.

__Observações__:   
- Observe que neste caso não se tem relacionamentos.
- Basta construir a Entidade.

__Documentação__: 
- https://typeorm.io/entities
- https://orkhan.gitbook.io/typeorm/docs/listeners-and-subscribers#afterload   
 
__Commit__: 18dc07713eafeea4a2a594d51103600b8b84d757

1 - Construa a entidade User

### 2. Construir e Executar Migrations e Seeds.

__Observações__: Observe que neste caso não se tem seeds.

__Documentação__:   
- https://orkhan.gitbook.io/typeorm/docs/migrations
- https://typeorm.io/migrations   
 
__Commit__: d5ddefeaa48d2edcf857059e1483c5591d0d0082

1 - Construa a migration User.   
2 - Execute a migrations pelo comando do package.json.

### 3. Construir e Validar/Sanitizar DTOs.

__Observações__:
- O 1° e 2° passo só são necessários no primeiro uso, caso contrário pode ir direto para o 3°

__Documentação__:   
- https://docs.nestjs.com/pipes
- https://github.com/typestack/class-validator
- https://github.com/typestack/class-transformer
 
__Commit__: c796e6204ea1065fe83ccb66fd2ab5877c1d269a

1 - Instale:   
```bash
npm install class-validator class-transformer
```

2 - Configure o Pipe de validação no `main.ts`.   

3 - Aplique a validação/sanitização nos DTOs.   

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
 
## CapRover - Dockerização e Variáveis de Ambiente
- A dockerização é feita para fazer deploy, como em cloud ou servidores de homologação, como o _CapRover_.
- A os valores das variáveis de ambiente mudam, dependendo se o o arquivo de variáveis de ambiente entra ou não na imagem docker.
- Verifiou-se como o CapRover acessa o arquivo de variáveis de ambiente, independente de como esteja nomeado (ex: .env, .env.dev, .env.local ... etc).

1. Sobre este projeto:
- Há apenas um arquivo de variáveis de ambiente, nomeado como `.env`.   
- O arquivo de variáveis de ambiente `.env` no `AppModule`.   
- Há apenas com um arquivo .env (não há .env.local ou .env.prod, por exemplo).   
- O projeto pode ou não funcionar sem `.env`:   
      - `Comportamento de Quebra`: Algumas são essenciais, como as de conexão com o DB.   
      - `Comportamento de Indeterminação`: com estas ele pode até funcionar sem, mas quando requisitadas ele vai receber o valor `undefined`.

2. Deploy no CapRover:
   - O CapRover possui um local para alocar as variáveis de ambiente do projeto, o `repositório de env vars`.   
   - O CapRover permite que o projeto funcione sem e com o arquivo `.env` na imagem docker, denota-se por `.env docker`.   
         - 1) `.env fora da imagem docker`: Utilização das env vars definidas no `repositório de env vars`, se alguma tiver faltando ocorre o `Comportamento de Indeterminação`.   
         - 2) `.env dentro da imagem docker`: Ocorre uma `mescla` entre o `repositório de env vars` e `.env docker`, onde o `repositório de env vars` é prioridade.   
             - a) As variáveis de ambiente do `repositório de env vars` sobrescrevem as do `.env docker`.   
             - b) Se no `repositório de env vars` não tiver alguma variável que está definido no `.env docker`, ele utiliza a variável do `.env docker`.   
             - c) Se alguma env var não estiver nem no `repositório de env vars` nem no `.env docker`, ocorre o `Comportamento de Indeterminação`.
     
3. Mas, e se o arquivo de variáveis de ambiente tivesse outro nome que não fosse `.env`?  
   - No passo 2 de configuração, Configuração das Variáveis de Ambiente, foi setada na propriedade `envFilePath` qual seria o arquivo de variáveis de ambiente.   
       - Desta forma, o framework tem acesso ao caminho e o nome deste arquivo, possibilitando a extração as variáveis de ambiente.     
   - O CapRover adota o mesmo nome e caminho do arquivo de variáveis de ambiente setado em `envFilePath`, bastando saber se este arquivo está ou não presente na imagem docker.   
        - a) Se não está presente, o comportamento é o mesmo que em 2.a (`.env fora da imagem docker`).   
        - b) Se está presente, o comportamento é o mesmo que em 2.b (`.env dentro da imagem docker`)

4. Remoção do `.env`da construção da imagem docker:   
- Incluir `.env` no `.dockerignore` não é suficiente para que ele não seja incluído na construção da imagem docker.
- Foi possível tirar apagando o arquivo `.env` manualmente antes da construção da imagem.
- Isso não é obrigatório,  apenas se quiser evitar o comportamento de `mescla`.   
     
