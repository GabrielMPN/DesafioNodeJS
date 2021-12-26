const express = require('express')
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

// Controllers
const SedeController = require("../controllers/SedeController")
const FilialController = require("../controllers/FilialController")
router.get('/cadastro', (req, res) => {
    res.render('cadastro')
})

// Swagger para documentar API
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    // Rotas
//lista todas as sedes
router.get('/sedes', SedeController.get_all)

//cria uma sede nova
router.post('/sede',SedeController.upload_logo, SedeController.middleware_create, SedeController.post_create)

//atualiza uma sede
router.put('/atualizar/sede/:cnpj', SedeController.upload_logo,SedeController.put_update)

//deleta uma sede com suas filiais
router.delete('/deletar/sede/:cnpj', SedeController.delete)

// Retorna informações de uma sede
router.get('/sede/:cnpj', SedeController.get_sede)

//lista filiais de uma sede
router.get('/filiais/:cnpj_sede', FilialController.get_filiais)

//cria uma nova filial
router.post('/filial/:cnpj_sede',FilialController.middleware_create, FilialController.post_create)

//atualiza uma filial
router.put('/atualizar/filial/:id', FilialController.put_update)

//deleta uma filial
router.delete('/deletar/filial/:id', FilialController.delete)

module.exports = router