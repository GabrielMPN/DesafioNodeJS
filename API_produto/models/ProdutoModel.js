const Sequelize = require('sequelize');
const conexao = require('../conexao');

const Produto = conexao.db.define('tb_produtos', {
    thumbnail: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING(92),
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    ingredientes: {
        type: Sequelize.STRING(92),
        allowNull: false
    },
    disponibilidade: {
        type: Sequelize.INTEGER(20),
        default: null
    },
    volume: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    cnpj_farmacia: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Produto