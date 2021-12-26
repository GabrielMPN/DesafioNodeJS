require('dotenv').config();
const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
});

const syncModels = async () => {
    try {
        //await db.sync() //cria as tabelas caso não existam
        await db.sync({ alter: true }) //altera todas as tabelas de acordo com o modelo
        console.log('Modelos sincronizados')
    } catch (err) {
        console.log(err)
    }
}

module.exports = {db, syncModels}