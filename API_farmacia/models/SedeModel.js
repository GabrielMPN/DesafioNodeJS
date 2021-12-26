const Sequelize = require('sequelize');
const conexao = require('../conexao');

const Farmacia = conexao.db.define('tb_sede', {
    logo: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING(92),
        allowNull: false
    },
    cnpj: {
        type: Sequelize.STRING(18),
        allowNull: false,
        primaryKey: true
    },
    endereco: {
        type: Sequelize.STRING(92),
        allowNull: false
    },
    horario_funcionamento: {
        type: Sequelize.STRING(80),
        default: null
    },
    responsavel: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING(40),
        allowNull: false
    }
}, {
    indexes: [
        // Create a unique index
        {
            unique: true,
            fields: ['cnpj'],
        }
    ]
})

module.exports = Farmacia