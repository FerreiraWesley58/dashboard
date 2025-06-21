# CyberFinance - Seu Dashboard Financeiro Pessoal 🚀

Olá! Bem-vindo ao CyberFinance, um projeto pensado para te dar controle total sobre suas finanças com uma interface moderna e intuitiva.

Aqui você vai encontrar tudo o que precisa para organizar suas receitas, despesas, criar metas e acompanhar seu progresso de perto.

![Tela de Login](dashboard/public/login-background.jpg)

## ✨ Funcionalidades Principais

*   **Dashboard Completo:** Visão geral com saldo, receitas, despesas e economias.
*   **Gestão de Transações:** Adicione, edite e remova suas movimentações financeiras.
*   **Calendário de Contas:** Marque transações futuras e nunca mais perca um vencimento.
*   **Metas Financeiras:** Crie metas e acompanhe o progresso com um visual incrível.
*   **Gráficos Inteligentes:** Gráfico de pizza para gastos por categoria e gráficos de barras para comparações.
*   **Autenticação Segura:** Sistema de login e registro com proteção para seus dados.
*   **Personalização:** Altere sua foto de perfil!

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com ferramentas modernas e eficientes:

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts
*   **Backend:** Node.js, Express, Sequelize, SQLite
*   **Autenticação:** JWT (JSON Web Tokens) e Bcrypt

---

## 🚀 Como Executar o Projeto

Para mergulhar no código e ver tudo funcionando na sua máquina, siga estes passos. É mais simples do que parece!

### Pré-requisitos

Antes de começar, garanta que você tenha o **Node.js** instalado. Ele já vem com o `npm`, que vamos usar para gerenciar os pacotes.

*   Você pode baixar o Node.js [aqui](https://nodejs.org/). (Recomendamos a versão LTS)

### Passo 1: Preparando o Backend

O backend é o cérebro do nosso sistema. Ele cuida dos dados e da segurança.

1.  **Abra seu terminal** e navegue até a pasta do backend:
    ```bash
    cd dashboard/backend
    ```

2.  **Instale as dependências.** Este comando vai baixar tudo o que o backend precisa para funcionar:
    ```bash
    npm install
    ```

3.  **Inicie o servidor.** Agora a mágica acontece!
    ```bash
    npm run dev
    ```

    Você deverá ver uma mensagem como `Servidor rodando na porta 5000`. Deixe este terminal aberto, pois o backend precisa ficar rodando.

### Passo 2: Preparando o Frontend

O frontend é a parte visual, com a qual você interage.

1.  **Abra um novo terminal** (mantenha o do backend rodando!) e navegue até a pasta do frontend:
    ```bash
    cd dashboard
    ```

2.  **Instale as dependências** do frontend:
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  Pronto! Seu terminal vai te mostrar um endereço local. Geralmente é algo como `http://localhost:5173/`. Copie e cole no seu navegador.

Agora você já pode criar sua conta, fazer login e explorar todas as funcionalidades do CyberFinance!

---

## 🤔 Possíveis Problemas

*   **Porta em uso:** Se a porta `5000` (backend) ou `5173` (frontend) já estiverem em uso, os scripts podem falhar. Verifique se não há outro processo rodando nessas portas.
*   **Erro no `npm install`:** Se encontrar algum erro, tente apagar a pasta `node_modules` e o arquivo `package-lock.json` e rode `npm install` novamente.

---

Feito por **Wesley Ferreira**. Sinta-se à vontade para explorar, modificar e aprender com este projeto! 