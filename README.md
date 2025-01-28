# Relacionamentos

- O **ponto de partida** vai a partir da branch `auth`, já que a autenticação fora do `AuthMod` vai ser aplicada.

## 1. Geração de novos módulos e novas entidades
**Documentação**: https://orkhan.gitbook.io/typeorm/docs/relations   
**commit**: f08969a07172632c63646c9b6506f64e9c26622b

Entidades: 
- User
- Document
- Address
- Profession
- ProfessionUser (Pivô)

Relacionamentos:
- User **N** : **N** Profession
- Address **1** : **N** User
- User **1** : **1** Document

Organização das Entidades:
- Não existe um arranjo pré-estabelecido, tudo dependente do domínio da aplicação.
- Neste projeto:
   - Módulo *User*: **User** e **Document**
   - Módulo *Address*: **Address**
   - Módulo *Profession*: **Profession** e **ProfessionUser**

## 2. Conexão das entidades com o TypeORM.
**commit**: 3f8921f6b8e31d08eae3291f41aa6b6653e477fd  

1) Em cada módulo onde pelo menos uma entidade foi criada, setar o TypeORM com a entidade no arquivo `module`.
2) Declarar cada nova entidade gerada no `app.module`.

## 3. Definição das entidades e seus relacionamentos
**Documentação**: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties   
**commit**: f7ae0dc03a71966b2e35be5b8a618e900b746a12   

- *Importação correta de entidades*:
   - Use o caminho relativo para importar as entidades quando for setar os relacionamentos.
- *Evitar Conflito de Nome em Tabelas*:
   - Garantir que a entidade e a migration têm o mesmo nome de tabela.
   - Em cada entidade, passar o nome da tabela dentro de `@Entity()`. Sendo assim, esse mesmo nome deve ser declarado na criação das migrations.
- *Timestamps*: Sempre adicionar `created_at` e `updated_at`.
- *Colunas em snake_case*:
   - Boa prática de definir o nome das colunas do DB em `snake_case`.
   - Sempre que os campos da entidade estiverem em `camelCase`, use a propriedade `name` de `@column()`.
- *@JoinColumn()*:
   - Sempre deve ser declarado em relacionamentos 1:N e 1:1. Apesar de ser opcional para 1:N.
   - A propriedade `name` é o nome da coluna, portanto ela deve ser em **snake_case**.
   - Só use o  @JoinColumn na entidade que irá carregar a chave estrangeira do relacionamento.
      - Ex: User 1 : 1 Document, onde Document vai receber user_id. Então apenas Document deve usá-lo.
- *A melhor abordagem para Many-to-Many*:
   - O caminho mais fácil é **SEMPRE** criar uma **entidade** para a tabela pivô (*entidade pivô*) e rodar sua **migration**.
   - É mais fácil começar o relacionamento pela tabela pivô, depois é só ir arrumando as duas outras entidades.
   - Nas entidades do relacionamento N:N é feito um 1:N em cada, portanto é preciso setar o `@JoinColumn()` nessas entidades.
- *Eager vs Lazy Loading*:
   - Veja a seção **Eager, Lazy e Explicit Loading**.
   - Os tipos de caregamentos são definidos na entidades. Neste caso:
      - Eager: Users N - N Professions
      - Lazy: Users 1 - 1 Documents
      - Lazy: Users 1 - Address.
   - Como setar os carregamentos:
      - Lazy Loading: colocar o generics `Promise` na propriedade em baixo do decorator de relacionamento.
      - Eager Loading: Setar a propriedade `{eager: true}` em uma dos dois lados do decorator de relacionamento.
   - *Lazy Loading com Many-To-Many*:
      - É preciso setar o Lazy Loading nas 3 entidades, as 2 da relação e mais a da tabela pivô.
      - O resultado da busca é um array apenas com registros da tabela pivô, em cada registro está só os IDs das entidades relacionadas
   - *Eager Loading com Many-To-Many*:
      -  É preciso setar o Eager Loading nas 2 entidades que estão ligadas à entidade pivô. Não é preciso configurar nada na entidade pivô.
      -  O resultado da busca é um array com registros da tabela pivô, em cada registro está um objeto aninhado com os registros de seu respectivo ID, para cada uma das entidades relacionadas.

## 4. Migrations
**commit**: 57c1b75dfa63157cf6075b525b1a25bcb1be6523

- *Importação correta de entidades*:
   - Use o caminho relativo para importar as entidades quando for setar os relacionamentos.
- *Alteração no User*:
   - Correção dos campos de timestamps.
   - Inclusão do campo `address_id`.
- *Evitar Conflito de Nome em Tabelas*:
   - Garantir que a entidade e a migration têm o mesmo nome de tabela.
   - Em cada entidade, verificar o nome da tabela dentro de `@Entity()` e colocar como o nome da tabela na migration.
- *Timestamps*: Sempre adicionar `created_at` e `updated_at`. 
- *Primary key como uuid*:
   - Na entidade, definir `@PrimaryGeneratedColumn('uuid')`e setar a tipagem da sua propriedade para `string`. Na migration, setar `generationStrategy: 'uuid'` e `type: 'uuid'` no campo `id`.

## 5. Seeds
**commit**: c04140d5f3df6e9e4c1cb046208055c6355ca70d   

Nas seeds é possível inserir mais de um registro de uma vez. É bem simples, basta fornecer um array com os dados e salvar.

## 6. Importação de um módulo A para o módulo B.

1) Mexer nos módulos A e B:
   - **commit**: 12f98dd79c4c6e272edc987bd472da0c035dbf0f
   - A: exportar apenas o que se quer que fique acessível, geralmente é um service.
   - B: importa o módulo A inteiro, mas só tem acesso ao foi exportado por A.
2) Criação do DTO e a rota no controller e método no services:
   - **commit**: 7e2016089327d34b49e12415f274cc03dee5a972
   - Injeção de dependência do módulo importado no service do módulo que importa.

# Notas

## Eager Loading vs Lazy Loading no TypeORM

### **Eager Loading**
- **Descrição**: Relações **eager** são carregadas automaticamente sempre que as entidades principais são carregadas do banco de dados.
- **Configuração**:
  - Use **apenas um** dos decoradores do relacionamento (ex: `@OneToMany`, `@ManyToOne`, etc.).
  - Adicione o terceiro argumento `{ eager: true }`, por exemplo:  
    ```typescript
    @ManyToOne(() => Banana, (banana) => banana.avocados, { eager: true })
    banana: Banana;
    ```
- **Funcionamento**:
  - Funciona automaticamente para métodos como `find` ou `findOne`.
  - Ao usar o QueryBuilder, é necessário explicitamente adicionar a relação com `leftJoinAndSelect`:
    ```typescript
    const avocado = await avocadoRepository
      .createQueryBuilder('avocado')
      .leftJoinAndSelect('avocado.banana', 'banana')
      .getOne();
    ```
- **Vantagem**:
  - Conveniente quando você precisa carregar as relações frequentemente junto com a entidade principal.
- **Desvantagem**:
  - Pode ser ineficiente se o relacionamento não for necessário em todas as operações.

---

### **Lazy Loading**
- **Descrição**: Relações **lazy** não são pré-carregadas. Em vez disso, o ID da entidade relacionada é carregado na resposta inicial, e a entidade completa pode ser carregada sob demanda.
- **Configuração**:
  - **Lazy loading** é o comportamento padrão no TypeORM.
  - Para ativar o carregamento assíncrono, configure a propriedade do relacionamento como `Promise<T>` em ambas as entidades:
    ```typescript
    @OneToMany(() => Avocado, (avocado) => avocado.banana)
    avocados: Promise<Avocado[]>;
    ```
    ```typescript
    @ManyToOne(() => Banana, (banana) => banana.avocados, { eager: true })
    banana: Promise<Banana>;
    ```
- **Funcionamento**:
  - O carregamento da relação ocorre apenas quando explicitamente chamado:
     1. O array de `bananas` dentro de `avocado`.
       ```typescript
       const avocado = await avocadoRepository.findOne(1);
       await avocado.bananas; // ativação do carregamento
       ```
    2. Além do que ocorre no item 1, o array de `bananas` também está em `bananaData`.
       ```typescript
       const avocado = await avocadoRepository.findOne(1);
       const bananaData = await avocado.bananas; // ativação do carregamento
       ```
    
  - Nessa abordagem é possível usar o **explicit loading** (mais recomendado). Leia a subseção de **Cuidados** a seguir:
    ```typescript
    const avocado = await avocadoRepository.findOne(1);
    const banana = await bananaRepository.findOne(avocado.bananaId);
    ```
- **Cuidado**:
  - **Lazy loading** é considerado experimental no TypeORM, use com parcimônia.
  - Recomendado para cenários onde a relação nem sempre é necessária.
- **Vantagem**:
  - Evita o carregamento desnecessário de relações quando não são utilizadas.
- **Desvantagem**:
  - Pode gerar múltiplas consultas ao banco de dados, aumentando a latência.

         
