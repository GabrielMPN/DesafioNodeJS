// Models
const Filial = require('../models/FilialModel')
const Sede = require('../models/SedeModel')
const validator = require("validator")

exports.post_create = async(req, res) => {
    const corpo = {
        nome: req.body.nome,
        cnpj: req.body.cnpj,
        endereco: req.body.endereco,
        horario_funcionamento: req.body.horario_funcionamento,
        responsavel: req.body.responsavel,
        telefone: req.body.telefone
    }
try {
    await Filial.create({
        nome: corpo.nome,
        cnpj: corpo.cnpj,
        endereco: corpo.endereco,
        horario_funcionamento: corpo.horario_funcionamento,
        responsavel: corpo.responsavel,
        telefone: corpo.telefone,
        fk_cnpj_sede: req.params.cnpj_sede
    })
    res.status(200).json(corpo)
} catch (err) {
    console.log(err)
    res.status(500).send("Erro inesperado")
}
}

exports.get_filiais = async(req,res)=>{
    try {
    let filiais = await Filial.findAll({where: {fk_cnpj_sede: req.params.cnpj_sede}})

    if (filiais.length > 0) {
    res.status(200).json(filiais)
    } else {
    res.status(404).send("Não existe filiais nessa sede")
    }
} catch(err) {
    console.log(err)
    res.status(500).send("Erro inesperado")
}
    }

exports.put_update = async(req, res) => {
    try {
    const filial = await Filial.findOne({where: {id: req.params.id}})
        if (req.body.nome) {
            filial.nome = req.body.nome
        } else if (req.body.cnpj){
            filial.cnpj = req.body.cnpj
        } else if (req.body.endereco) {
            filial.endereco = req.body.endereco
        }else if (req.body.horario_funcionamento) {
            filial.horario_funcionamento = req.body.horario_funcionamento
        }else if (req.body.responsavel){
            filial.responsavel = req.body.responsavel
        }else if (req.body.telefone) {
            filial.telefone = req.body.telefone
        }
        filial.save()
        res.status(200).json(filial)
    }catch(err) {
        console.log(err)
        res.status(500).send("Erro inesperado")
    }
}

exports.delete = async(req, res) => {
    try {
        const filial = await Filial.findOne({where: {id: req.params.id}})
        filial.destroy()
        res.status(200).send("Filial deletada :)")
        } catch (err) {
            console.log(err)
            res.status(500).send("Erro inesperado")
        }
}

// Middlewares
exports.middleware_create = async(req,res,next) => {

    if((!req.body.nome || validator.isEmpty(req.body.nome, { ignore_whitespace: true })) ||
    (!req.body.cnpj || validator.isEmpty(req.body.cnpj, { ignore_whitespace: true })) ||
    (!req.body.endereco || validator.isEmpty(req.body.endereco, { ignore_whitespace: true })) ||
    (!req.body.horario_funcionamento || validator.isEmpty(req.body.horario_funcionamento, { ignore_whitespace: true })) ||
    (!req.body.responsavel || validator.isEmpty(req.body.responsavel, { ignore_whitespace: true })) ||
    (!req.body.telefone || validator.isEmpty(req.body.telefone, { ignore_whitespace: true }))) {
    res.status(400).send("Faltando dados ou dados vazios")

    
    } else if (await Sede.findOne({where: {cnpj: req.params.cnpj_sede}}) == null) {
         res.status(404).send("CNPJ da sede não encontrado")
    } else if (await Filial.count({where: {fk_cnpj_sede: req.params.cnpj_sede}}) > 2) {
         res.status(422).send("Número de filiais já atingido (3)")
    } else if (await Sede.findOne({where: {cnpj: req.body.cnpj}}) || await Filial.findOne({where: {cnpj: req.body.cnpj}})) {
         res.status(422).send("Esse CNPJ já existe em nossa base de dados!")
    } else {
    next()
    }
}

