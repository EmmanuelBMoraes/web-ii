# Projeto Web II

Este é um projeto full-stack desenvolvido para a disciplina de Desenvolvimento Web II. Ele é estruturado como um monorepo utilizando `npm workspaces`, com o backend e o frontend em pastas separadas.

## Tecnologias Utilizadas

Analisando as dependências, a stack de tecnologias provável é:

- **Backend**: Node.js, Express.js e Mongoose.
- **Frontend**: React com TypeScript, Vite, Tailwind CSS e Shadcn/ui.
- **Banco de Dados**: MongoDB.
- **Monorepo**: Gerenciado com `npm workspaces`.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

- Node.js (versão 18.x ou superior recomendada)
- npm (versão 9.x ou superior)
- Uma instância do MongoDB em execução (localmente ou em um serviço de nuvem como o MongoDB Atlas).

## Instalação

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd projeto-web-ii
    ```

2.  **Instale as dependências:**
    O projeto utiliza `npm workspaces`. Para instalar as dependências tanto do backend quanto do frontend, execute o seguinte comando na raiz do projeto:

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    O projeto requer arquivos de ambiente (`.env`) tanto para o backend quanto para o frontend. Arquivos de exemplo (`.env.example`) são fornecidos em cada pasta para facilitar a configuração.

    ### Backend (`/back`)

    1.  Navegue até a pasta `back`.
    2.  Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
        ```bash
        # No Windows (prompt de comando)
        copy .env.example .env
        # No Linux/macOS
        cp .env.example .env
        ```
    3.  Abra o arquivo `back/.env` e configure as variáveis. A mais importante é a `MONGO_URI`, que deve conter a string de conexão para o seu banco de dados MongoDB.
        ```shell
        # Exemplo de arquivo /back/.env
        PORT=3001
        MONGO_URI=mongodb://localhost:27017/sua-database
        NODE_ENV=development
        JWT_SECRET=seus-segredo-super-secreto
        JWT_EXPIRES_IN=1h
        ```

    ### Frontend (`/front`)

    1.  Navegue até a pasta `front`.
    2.  Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
    3.  Abra o arquivo `front/.env` e certifique-se de que a variável `VITE_API_URL` aponta para o endereço da sua API backend (o mesmo endereço e porta configurados no `.env` do backend).
        ```shell
        # Exemplo de arquivo /front/.env
        VITE_API_URL=http://localhost:3001/api
        ```

## Como Executar o Projeto

Para executar a aplicação, você precisará iniciar o servidor backend e a aplicação frontend.

### Executando o Backend

1.  Abra um terminal e navegue até a pasta do backend:
    ```bash
    cd back
    ```
2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

O servidor backend estará em execução no endereço e porta que você definiu no arquivo `back/.env` (por exemplo, `http://localhost:3001`).

### Executando o Frontend (Desenvolvimento)

Este modo é ideal para desenvolvimento, pois inclui Hot-Module Replacement (HMR), que atualiza a aplicação no navegador instantaneamente após alterações no código.

1.  Abra um **novo** terminal e navegue até a pasta do frontend:
    ```bash
    cd front
    ```
2.  Inicie a aplicação de desenvolvimento:
    ```bash
    npm run dev
    ```

A aplicação frontend estará acessível em seu navegador, geralmente em `http://localhost:5173`.

### Executando o Frontend (Build de Produção)

Para simular como a aplicação se comportaria em um ambiente de produção, você pode gerar os arquivos estáticos otimizados e servi-los localmente.

1.  Na pasta `front`, primeiro compile a aplicação:

    ```bash
    npm run build
    ```

    Este comando cria uma pasta `dist` com os arquivos de produção.

2.  Em seguida, inicie um servidor local para pré-visualizar o build:
    ```bash
    npm run start
    ```
    > O comando `npm start` executa `vite preview`, que serve os arquivos da pasta `dist`.

A pré-visualização da build de produção estará acessível em seu navegador, geralmente em `http://localhost:4173`.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
projeto-web-ii/
├── back/         # Contém a aplicação backend (API)
├── front/        # Contém a aplicação frontend (UI)
└── package.json  # package.json principal com a configuração dos workspaces
```
