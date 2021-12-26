const express = require('express')
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

// Controllers
const ProdutoController = require("../controllers/ProdutoController")
router.get('/cadastro', (req, res) => {
    res.render('cadastro')
})

// Swagger para documentar API
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Rotas
//lista todos os produtos
router.get('/listar', ProdutoController.get_all)

//cria um produto
router.post('/criar',ProdutoController.upload_thumbnail, ProdutoController.middleware_create, ProdutoController.post_create)

//atualiza produto
router.put('/atualizar/:id', ProdutoController.upload_thumbnail,ProdutoController.put_update)

//deleta um produto
router.delete('/deletar/:id', ProdutoController.delete)

//Retorna informações de um produto
router.get('/:id', ProdutoController.get_produto)

//clonar um produto
router.post('/clonar/:id', ProdutoController.post_clone)

module.exports = router