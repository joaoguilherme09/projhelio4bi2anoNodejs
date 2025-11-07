Este projeto foi desenvolvido utilizando Node.js e segue o padrão de arquitetura MVCS (Model, View, Controller e Service).
Seu principal objetivo é demonstrar o funcionamento de uma API RESTful completa, capaz de realizar operações CRUD (Criar, Ler, Atualizar e Deletar) em um banco de dados MySQL.

A aplicação foi pensada para integrar o backend (servidor e API) com um frontend simples, permitindo que o usuário visualize e manipule os dados diretamente no navegador.
Além disso, o projeto implementa boas práticas de organização de código, autenticação com JWT e comunicação estruturada entre as camadas da aplicação.

🚀 Tecnologias Utilizadas

⚙️ Node.js — Ambiente de execução JavaScript

🧠 Express.js — Framework para criação da API RESTful

🗄️ MySQL — Banco de dados relacional

🔐 JWT (JSON Web Token) — Autenticação segura

🧩 MVCS Architecture — Organização do código em camadas

🎨 HTML, CSS e JavaScript — Interface visual do sistema

⚙️ Como Executar o Projeto

Siga o passo a passo abaixo para configurar e executar a aplicação corretamente 👇

🥇 1º Passo — Instalar as dependências

Certifique-se de ter o Node.js instalado na sua máquina.
Em seguida, abra o terminal na pasta principal do projeto e execute:

npm install


Isso fará o download de todos os módulos necessários listados no package.json.

🧱 2º Passo — Configurar o banco de dados

Entre na pasta:

api/database/


Abra o arquivo database.sql (ou Banco.sql dentro de api/docs) e copie o código.
Abra o MySQL Workbench e cole esse script, executando para criar o banco de dados e tabelas.

💡 Certifique-se de estar conectado ao servidor local:

🌐 Host: 127.0.0.1

🔢 Porta: 3306

👤 Usuário: root

🔑 Senha: deixe vazia caso o MySQL não tenha senha configurada

⚡ 3º Passo — Iniciar os serviços

Abra o XAMPP e ative os módulos:

Serviço	Status
⚙️ Apache	🟢 Ligado
🗄️ MySQL	🟢 Ligado

Esses dois precisam estar em execução para o sistema funcionar corretamente.

🧩 4º Passo — Executar o servidor

No terminal, execute o comando abaixo:

node server.js

O terminal mostrará algo como:

Server running on http://localhost:8080


Acesse esse link no navegador para testar a aplicação 🚀
