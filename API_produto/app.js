// Módulos
require('dotenv').config()
const express = require('express')
const app = express()
const produto = require('./routes/produto')
const db = require("./conexao")

//sincronizar todas as tabelas do banco
db.syncModels()

// Porta do servidor
const PORT = 3002

// Analisador de corpo
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

// Usar arquivos públicos dentro da pasta public
app.use(express.static(__dirname + '/public'))

// Rotas
app.use('/produto', produto)

app.listen(PORT, (err) => {
    if (err) return console.log(err)
    console.log("Microserviço produto carregado na porta " + PORT + "!")
})