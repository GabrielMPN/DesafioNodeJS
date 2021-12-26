const validator = require("validator")
const fs = require('fs')
const grpc = require('../grpc/client')
    // Models
const Produto = require('../models/ProdutoModel')

//  Multer para fazer upload das imagens
const multer = require('multer')
const upload = multer({
    dest: 'public/uploads/',
    fileFilter: (req, file, cb) => {

        const fileSize = parseInt(req.headers['content-length']);
        const maxFileSize = 1000000; //1000000 bytes = 1Megabyte

        if (file.mimetype != 'image/png' &&
            file.mimetype != 'image/jpeg' &&
            file.mimetype != 'image/jpg') {
            req.multerError = `Troque imagem para:\n jpg/jpeg ou png`;
            return cb(null, false);
        } else if (fileSize > maxFileSize) {
            req.multerError = `Imagem muito pesada, tente deixá-la mais leve`;
            return cb(null, false);
        }

        cb(null, true)
    }
}).single('thumbnail');

exports.get_produto = async(req, res) => {
    try {
        let produtos = await Produto.findOne({ where: { id: req.params.id } })

        if (produtos) {
            res.status(200).json(produtos)
        } else {
            res.status(404).send("Produto não existe, tente outro id!")
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
}

exports.get_all = async(req, res) => {
    try {
        let produtos = await Produto.findAll()
        res.status(200).json(produtos)

    } catch (err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
}

exports.post_create = async(req, res) => {

    const fileName = req.file.filename

    const corpo = {
        nome: req.body.nome,
        preco: req.body.preco,
        ingredientes: req.body.ingredientes,
        disponibilidade: req.body.disponibilidade,
        volume: req.body.volume,
        cnpj_farmacia: req.body.cnpj_farmacia
    }

    try {
        await Produto.create({
            thumbnail: fileName,
            nome: corpo.nome,
            preco: corpo.preco,
            ingredientes: corpo.ingredientes,
            disponibilidade: corpo.disponibilidade,
            volume: corpo.volume,
            cnpj_farmacia: corpo.cnpj_farmacia
        })
        res.status(200).json(corpo)
    } catch (err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
}

exports.put_update = async(req, res) => {
    try {
        const produto = await Produto.findOne({ where: { id: req.params.id } })
        if (req.file) {
            try {
                fs.unlinkSync(`public/uploads/${produto.dataValues.thumbnail}`); // deleta thumbnail antigo para adicionar o novo
                produto.thumbnail = req.file.filename
            } catch (err) {
                console.log(err)
            }
        } else if (req.body.nome) {
            produto.nome = req.body.nome
        } else if (req.body.preco) {
            produto.preco = req.body.preco
        } else if (req.body.ingredientes) {
            produto.ingredientes = req.body.ingredientes
        } else if (req.body.disponibilidade) {
            produto.disponibilidade = req.body.disponibilidade
        } else if (req.body.volume) {
            produto.volume = req.body.volume
        }
        produto.save()
        res.status(200).json(produto)
    } catch (err) {
        console.log(err)
        res.status(500).json("Erro inesperado")
    }
}

exports.delete = async(req, res) => {
    try {
        const produto = await Produto.findOne({ where: { id: req.params.id } })
        produto.destroy()
        res.status(200).send("Produto deletado com sucesso")
    } catch (err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
}

exports.post_clone = async(req, res) => {
    const produto = await Produto.findOne({ where: { id: req.params.id } })

    const corpo = {
        thumbnail: produto.dataValues.thumbnail,
        nome: produto.dataValues.nome,
        preco: produto.dataValues.preco,
        ingredientes: produto.dataValues.ingredientes,
        disponibilidade: produto.dataValues.disponibilidade,
        volume: produto.dataValues.volume,
        cnpj_farmacia: produto.dataValues.cnpj_farmacia
    }

    try {
        await Produto.create({
            thumbnail: corpo.thumbnail,
            nome: corpo.nome,
            preco: corpo.preco,
            ingredientes: corpo.ingredientes,
            disponibilidade: corpo.disponibilidade,
            volume: corpo.volume,
            cnpj_farmacia: corpo.cnpj_farmacia
        })
        res.status(200).json(corpo)
    } catch (err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
}

//Middlewares
exports.middleware_create = async(req, res, next) => {
    console.log("procurar cnpj:" + req.body.cnpj_farmacia)
    if (!req.file ||
        (!req.body.nome || validator.isEmpty(req.body.nome, { ignore_whitespace: true })) ||
        (!req.body.preco || validator.isEmpty(req.body.preco, { ignore_whitespace: true })) ||
        (!req.body.ingredientes || validator.isEmpty(req.body.ingredientes, { ignore_whitespace: true })) ||
        (!req.body.disponibilidade || validator.isEmpty(req.body.disponibilidade, { ignore_whitespace: true })) ||
        (!req.body.volume || validator.isEmpty(req.body.volume, { ignore_whitespace: true })) ||
        (!req.body.cnpj_farmacia || validator.isEmpty(req.body.cnpj_farmacia, { ignore_whitespace: true }))) {
        res.status(400).send("Faltando dados ou dados vazios")
    }

    grpc.client.getFarmacia({ cnpj: req.body.cnpj_farmacia },
        function(err, response) {
            console.log(response)
            if (!response || response.tipo == "" || !response.cnpj) {
                res.status(404).send("Cnpj da farmacia não encontrado")
            } else {
                next()
            }
        });


}

exports.upload_thumbnail = async(req, res, next) => {
    await upload(req, res, (err) => {
        if (req.multerError) {
            res.send({
                msg: req.multerError,
                success: false
            })
        } else {
            next();
        }
    })
}