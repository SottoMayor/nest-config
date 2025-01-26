# Autorização e Autenticação (Auth) com NestJs

- O **ponto de partida** vai ser todo o passo-a-passo da branch `main` deste projeto, lá toda a configuração inicial é estabelecida.
- O `JWT` vai ser utilizado para gerenciamento dos tokens de autenticação e a autentição, de fato, vai ser executada pela middleware `PassportJs`.
- Como estaremos lidando com senhas, utilizaremos o `bcrypt` para realizar o processo de _hashing_, garantindo a segurança dessas informações

## 1. Instalação dos Pacotes
**commit**: 9d2db3a1fb0b287ee76bcf508241bc4e7f1afdf6   

### __JWT e PASSPORT__:   
- `npm install @nestjs/jwt @nestjs/passport passport passport-jwt`
- `npm install --save-dev @types/passport-jwt`

### __BCRYPT__:   
- `npm install bcrypt`
- `npm install --save-dev @types/bcrypt`

## 2. Adaptação do Ponto de Partida

**commit**:   
- Config: e1b445bc5f210d1999e71ebff4a9c4c726d98165
- Fix: 6782cc975085e8b9ffac40649e90ab5d1c9f7c24 (_seed - Admin password_)

Antes de explorar o conceito na prática, é necessário ajustar o projeto, adicionando os recursos necessários para habilitar a funcionalidade de  _Auth_.

- Alterações:
   1. Criação de migration que adicione os campos isAdmin(default=false), email e password;
   2. Adicionar esses campos novos na entity User;
   3. Rodar a migration;
   4. Criar uma seed com de USER com isAdmin true com email e password pré-setados;
     - _Obs_: Olhar o commit de Fix `6782cc` para consertar a geração da senha do User Admin.
   6. Rodar Seed;

## 3. Módulo de Autenticação - AuthMod

**commit**: 86037f2bb835504825759e413bdeb7d6e55eb654  

 - O **ModAuth** é o módulo responsável por gerenciar a autenticação no sistema.  
- Ele pode ser qualquer módulo, inclusive um criado do zero, desde que contenha uma entidade capaz de controlar a autenticação.  
- Neste projeto, a entidade `User` será responsável por gerenciar a autenticação. Como já existe um módulo `User`, o **AuthMod** será representado por esse mesmo módulo.  
- Esse módulo será responsável por operar diretamente com o **JWT** e o **PassportJS**.

1. Definir uma chave `JWT_SECRET` para assinar o JWT, no `.env`.
   - Pode-se usar a `HASH_KEY` se o cryptography.interceptor estiver no projeto.
2. Faça a importação dos módulos JWT e PassportJs para o AuthMod passando a chave `JWT_SECRET`.

## 4. Implementação da Validação com JWT (JWT-Strategy)

**commit**: 153991476888f25173ebdeb89c0e5e5f3abb276e   

1. Crie a pasta `auth-config` com os arquivos `jwt.strategy.ts` e `jwt.interface.ts`.
2. Defina na interface `jwt.interface.ts` os dados que o payload do JWT deve conter. Evite incluir informações sensíveis, como senhas ou dados críticos no token.
3. Escreva a lógica de validação do token em `jwt.strategy.ts`.
4. No módulo de autenticação (AuthMod), exporte os arquivos necessários que possibilitem integração a outros módulos do projeto.

## 5. Autenticação

### 5.1 Signup

**commit**: 82c24c634d39a754cf02fac0b8edef94486500ab   

Adaptaçao no endpoint de criação de usuários `[POST]/user/create`: 

1. Alteração no `create-user.dto`, agora tem email e senha.
2. O hash da senha vai no `user.entity` no hook `@BeforeInsert()`.
3. No método `create` do `user.service`, garantia da unicidade do email cadastrado.

_OBS_: O class-validator tem um validador nativo de _senhas fortes_, `@IsStrongPassword`.

### 5.2 Login

**commit**: b784b8a0607de798a9927f6e9e0997c36c6e0a46   

1. Criar os dtos `auth-credentials.dto` e `auth-token.dto`.
2. Criar o método `login` no `user.service`.
3. Criar o método `login` no `user.controller`.

### 5.3 Logout

- __Não implementado__.
- Nesse contexto, é __revogação__ do authToken. Como JWT é stateless, seria necessário implementar uma estratégia para não aceitação do token.
- Estratégia de revogação:
   1. Salvar o token e sua duração no banco.
   2. Reutilização do token se ele ainda não for expirado.
   3. Exclusão do token no banco se o token for expirado ou se ele acionou o logout, teria que se logar novamente.
   4. Utilização do próprio AuthGuard do passportJs como uma middleware de verificação a autenticidade do authToken.
 
## 6. Autenticação e Autorização

**commit**: 0436efaffb0ab738849b783299a03ab70de06bc6  

1. Criação do custom decotator `get-user.decorator`.
2. Aplicação de autenticação e autorização nos métodos `findAll` e `updated` do `user.controller`.
3. Adaptação das regras dos métodos `findAll` e `update` no `user.service`:  

   - **findAll**:  
     - Se o usuário for um administrador, ele poderá visualizar todos os usuários.  
     - Caso contrário, o usuário só poderá visualizar suas próprias informações.  

   - **update**:  
     - Apenas o administrador tem permissão para atualizar informações de outros usuários.  

### Custom Decorator

O decorator `GetUser` foi criado para extrair o `user` da request de forma reutilizável e legível.

### Estratégia
Para saber se o usuário está autenticado e autorizado, basta utilizar a __combinação do AuthGuard e GetUser__ no controller. 
   - Funcionamento: A utilização do AuthGuard para verificar a autenticação e do GetUser para extrair o usuário da request.
   - Flexibilidade: As regras que envolvem autorização são feitas dentro dos services.

### Utilização em outros módulos
- Caso seja preciso utilizar em outros módulo é simples, basta: importar `AuthMod`, usar o `AuthGuard` e o `GetUser` (se necessário) no Controller.
- É possível também setar o `AuthMod` como global, assim não teria que ficar importando-o para todo módulo.



## Notas:

### JWT Strategy
- O token de autenticação usado é o `JWT`, por outro lado, `PassportJS` é uma middleware de autenticação responsável por verificar os token JWT enviados, a regras regras de verificação ficam dentro do arquivo `passpart.strategy.ts` (JWT Strategy).
1. __Autenticação__: O `construtor` é responsável por extrair e o `PassportJS` verifica a validade do token. Se for inválido, uma excessão é lançada.
2. __Autorização__: O método `validate` só entra em cena se o token estiver correto. Aqui quer-se verificar se os dados que o token carrega são válidos no sistema.
   - _válido_: a instância da entidade encontrada entra na request (`request.user`).
   - _inválido_: Uma excessão 401 é lançada.

### Funcionamento
- `PassportJs` oferece o guard `AuthGuard` onde é possível verificar a autenticação, sua configuração é feita no `passpart.strategy.ts`.
   - Para cada rota protegida é preciso passar o header `Authorization` com o `Bearer {auth_token}`
- Se há autorização o decorator `GetUser` extrai o `user` da request, a partir desse ponto sabe-se quem é usuário autenticado.
- É interessante fazer a autorização dentro do service, pois lá é onde ficam as regras de negócio.

