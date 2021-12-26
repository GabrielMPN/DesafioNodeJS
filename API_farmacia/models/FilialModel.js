const Sequelize = require('sequelize');
const conexao = require('../conexao');
const Sede = require('./SedeModel')

const Filial = conexao.db.define('tb_filiais', {
    nome: {
        type: Sequelize.STRING(92),
        allowNull: false
    },
    cnpj: {
        type: Sequelize.STRING(18),
        allowNull: false,
    },
    endereco: {
        type: Sequelize.STRING(92),
        allowNull: false
    },
    horario_funcionamento: {
        type: Sequelize.STRING(80),
        default: null,
        allowNull: false
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

Filial.belongsTo(Sede, {
    foreignKey: {
        name: 'fk_cnpj_sede',
        allowNull: false
    }
});

module.exports = Filial