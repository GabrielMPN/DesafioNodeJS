const validator = require("validator")
const fs = require('fs')
// Models
const Sede = require('../models/SedeModel')
const Filial = require('../models/FilialModel')

//  Multer para fazer upload das imagens
const multer = require('multer')
const upload = multer({
    dest: 'public/uploads/',
    fileFilter: (req, file, cb) => {
        
        console.log(req.file)
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
}).single('logo');

exports.get_all = async(req,res)=>{
    try {
    let sedes = await Sede.findAll()

    if (sedes.length > 0) {
    res.status(200).json(sedes)
    } else {
    res.status(404).send("Não existe sedes")
    }
} catch(err) {
    console.log(err)
    res.status(500).send("Erro inesperado")
}
    }

exports.post_create = async(req, res)=> {
    const fileName = req.file.filename

    const corpo = {
        nome: req.body.nome,
        cnpj: req.body.cnpj,
        endereco: req.body.endereco,
        horario_funcionamento: req.body.horario_funcionamento,
        responsavel: req.body.responsavel,
        telefone: req.body.telefone
    }

try {
    await Sede.create({
        logo: fileName,
        nome: corpo.nome,
        cnpj: corpo.cnpj,
        endereco: corpo.endereco,
        horario_funcionamento: corpo.horario_funcionamento,
        responsavel: corpo.responsavel,
        telefone: corpo.telefone
    })
    res.status(200).json(corpo)
} catch (err) {
    console.log(err)
    res.status(500).send("Erro inesperado")
}
    }

    exports.put_update = async(req, res) => {
        try{
        const sede = await Sede.findOne({where: {cnpj: req.params.cnpj}})
        if (req.file) {
            try {
                fs.unlinkSync(`public/uploads/${sede.dataValues.logo}`); // deleta logo antigo para adicionar o novo
                sede.logo = req.file.filename
            }catch(err) {
                console.log(err)
            }
        } else if (req.body.nome) {
            sede.nome = req.body.nome
        } else if (req.body.cnpj){
            sede.cnpj = req.body.cnpj
        } else if (req.body.endereco) {
            sede.endereco = req.body.endereco
        }else if (req.body.horario_funcionamento) {
            sede.horario_funcionamento = req.body.horario_funcionamento
        }else if (req.body.responsavel){
            sede.responsavel = req.body.responsavel
        }else if (req.body.telefone) {
            sede.telefone = req.body.telefone
        }
        sede.save()
        res.status(200).json(sede)
    }catch(err) {
        console.log(err)
        res.status(500).json("Erro inesperado")
    }
    }

    exports.delete = async (req, res)=> {
        try {
        const sede = await Sede.findOne({where: {cnpj: req.params.cnpj}})
        
        if (await Filial.count({where: {fk_cnpj_sede: req.params.cnpj}}) >= 0) {
            const filiais = await Filial.findAll({where: {fk_cnpj_sede: req.params.cnpj}})
            filiais.forEach(async(filial)=> {
                await filial.destroy()
            })
        }

        await sede.destroy()
        res.status(200).send("Sede e suas filiais deletadas com sucesso")
        } catch (err) {
            console.log(err)
            res.status(500).send("Erro inesperado")
        }
    }

    exports.get_sede = async(req,res)=>{
        try {
        let sede = await Sede.findOne({where: {cnpj: req.params.cnpj}})
    
        if (sede) {
        res.status(200).json(sede)
        } else {
        res.status(404).send("Sede não existe, tente outro CNPJ!")
        }
    } catch(err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
        }
 
//Middlewares
    exports.middleware_create = async(req,res,next) => {
        if(!req.file ||
        (!req.body.nome || validator.isEmpty(req.body.nome, { ignore_whitespace: true })) ||
        (!req.body.cnpj || validator.isEmpty(req.body.cnpj, { ignore_whitespace: true })) ||
        (!req.body.endereco || validator.isEmpty(req.body.endereco, { ignore_whitespace: true })) ||
        (!req.body.horario_funcionamento || validator.isEmpty(req.body.horario_funcionamento, { ignore_whitespace: true })) ||
        (!req.body.responsavel || validator.isEmpty(req.body.responsavel, { ignore_whitespace: true })) ||
        (!req.body.telefone || validator.isEmpty(req.body.telefone, { ignore_whitespace: true }))) {
        res.status(400).send("Faltando dados ou dados vazios")

        
        } else if (await Sede.findOne({where: {cnpj: req.body.cnpj}})) {
             res.status(422).send("CNPJ já existe")
        } else {
        next()
        }
    }

    exports.upload_logo = async(req, res, next) => {
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