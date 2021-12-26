// Módulos
require('dotenv').config()
const express = require('express')
const app = express()
const farmacia = require('./routes/farmacia')
const db = require("./conexao")
const grpc = require('./grpc/server')

//sincronizar todas as tabelas do banco
db.syncModels()

// Porta do servidor
const PORT = 3001

// Analisador de corpo
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

// Usar arquivos públicos dentro da pasta public
app.use(express.static(__dirname + '/public'))

//grpc start
grpc.main()

// Rotas
app.use('/farmacia', farmacia)

app.listen(PORT, (err) => {
    if (err) return console.log(err)
    console.log("Microserviço farmacia carregado na porta" + PORT + "!")
})