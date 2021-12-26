PASSO A PASSO PARA EXECUTAR OS MICROSERVIÇOS

Passo 1-
- instalar servidor mysql
- instalar NodeJs

-----------------------------------------
Passo 2- Nos diretórios API_farmacia e API_produto abrir arquivo .env e alterar as configurações para sua base de dados

-----------------------------------------
Passo 3- criar duas bases de dados
- db_microservices_farmacia
- db_microservices_produto
Obs: as tabelas serão criadas ao iniciar os microserviços (passo 5) caso não existam

-----------------------------------------
Passo 4- Abrir prompt em cada diretório (gateway, API_farmacia, API_produto ) e executar o comando "npm install"(em cada um) para instalar os pacotes necessários

----------------------------------------
Passo 5- Iniciar app.js nos 3 diretórios (os 3 devem estar em execução simultaneamente)
Obs: verifique se as tabelas foram criadas na base de dados

-----------------------------------------
Passo 6- Tudo está pronto, links documentação API Microserviços:
- Farmácia: localhost/farmacia/api-docs 
- Produto: localhost/produto/api-docs

