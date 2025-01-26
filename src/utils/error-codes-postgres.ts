export const errorCodesPostgres = {
    db: 'POSTGRES',
    errors: {
        '22P02': {
        title: 'Invalid Text Representation',
        situation: 'Operação com dados em formato incorreto. Geralmente quando uma pk era para ser um uuid e veio um inteiro',
        connectionError: false,
        },
        '23503': {
        title: 'Foreign Key Violation',
        situation: 'Tentou inserir um valor sem a chave estrangeira correspondente',
        connectionError: false,
        },
        '23505': {
        title: 'Unique Violation',
        situation: 'Tentativa de inserir um valor que violaria uma restrição de unicidade (como um valor duplicado)',
        connectionError: false,
        },
        '42601': {
        title: 'Syntax Error',
        situation: 'Erro de sintaxe na query SQL',
        connectionError: false,
        },
        '42703': {
        title: 'Undefined Column',
        situation: 'Referência a uma coluna que não existe na tabela',
        connectionError: false,
        },
        '42883': {
        title: 'Undefined Function',
        situation: 'Função não encontrada com os parâmetros fornecidos',
        connectionError: false,
        },
        '23514': {
        title: 'Check Violation',
        situation: 'Violação de uma restrição de CHECK (por exemplo, valor fora do intervalo permitido)',
        connectionError: false,
        },
        '40001': {
        title: 'Serialization Failure',
        situation: 'Falha de serialização devido a um conflito de transações concorrentes',
        connectionError: false,
        },
        '40P01': {
        title: 'Deadlock Detected',
        situation: 'Detectado um deadlock entre transações',
        connectionError: false,
        },
        '53200': {
        title: 'Out of Memory',
        situation: 'O servidor ficou sem memória para processar a query',
        connectionError: false,
        },
        '08003': {
        title: 'Connection Does Not Exist',
        situation: 'A conexão com o banco de dados não existe ou foi fechada',
        connectionError: true,
        },
        '08006': {
        title: 'Connection Failure',
        situation: 'Falha na conexão com o banco de dados (pode ser devido a configuração incorreta, servidor fora do ar, etc.)',
        connectionError: true,
        },
        '57014': {
        title: 'Query Canceled',
        situation: 'Consulta foi cancelada devido a timeout ou outro motivo',
        connectionError: false,
        },
        '22023': {
        title: 'Invalid Parameter Value',
        situation: 'Valor de parâmetro fornecido é inválido ou incompatível',
        connectionError: false,
        },
        '08004': {
        title: 'Server Rejected Establishment of SQL Connection',
        situation: 'O servidor rejeitou a conexão SQL devido a configuração inadequada',
        connectionError: true,
        },
        '54000': {
        title: 'Query Timeout',
        situation: 'Tempo limite excedido para a execução de uma consulta SQL',
        connectionError: false,
        },
    }
};
