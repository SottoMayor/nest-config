# Autorização e Autenticação (Auth) com NestJs

- O **ponto de partida** vai ser todo o passo-a-passo da branch `main` deste projeto, lá toda a configuração inicial é estabelecida.
- O `JWT` vai ser utilizado para gerenciamento dos tokens de autenticação e a autentição, de fato, vai ser executada pela middleware `PassportJs`.
- Como estaremos lidando com senhas, utilizaremos o `bcrypt` para realizar o processo de _hashing_, garantindo a segurança dessas informações

## Instalação dos Pacotes
**commit**: 9d2db3a1fb0b287ee76bcf508241bc4e7f1afdf6   

### __JWT e PASSPORT__:   
- `npm install @nestjs/jwt @nestjs/passport passport passport-jwt`
- `npm install --save-dev @types/passport-jwt`

### __BCRYPT__:   
- `npm install bcrypt`
- `npm install --save-dev @types/bcrypt`

## Adaptação do Ponto de Partida

**commit**: e1b445bc5f210d1999e71ebff4a9c4c726d98165   

Antes de explorar o conceito na prática, é necessário ajustar o projeto, adicionando os recursos necessários para habilitar a funcionalidade de  _Auth_.

- Alterações:
   1. Criação de migration que adicione os campos isAdmin(default=false), email e password;
   2. Adicionar esses campos novos na entity User;
   3. Rodar a migration;
   4. Criar uma seed com de USER com isAdmin true com email e password pré-setados;
   5. Rodar Seed;

 ## Módulo de Autenticação - AuthMod
