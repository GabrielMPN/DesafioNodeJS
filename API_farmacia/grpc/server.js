const path = require('path');
var PROTO_PATH = path.resolve(__dirname, "protos", "farmacia.proto");
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var farmacia_proto = grpc.loadPackageDefinition(packageDefinition);
const Sede = require('../models/SedeModel')
const Filial = require('../models/FilialModel')

async function getFarmacia(call, callback) {
    let find_farmacia;
    let tipo = "";

    if (await Sede.findOne({ where: { cnpj: call.request.cnpj } })) {
        find_farmacia = await Sede.findOne({ where: { cnpj: call.request.cnpj } });
        tipo = "sede";
    } else if (await Filial.findOne({ where: { cnpj: call.request.cnpj } })) {
        find_farmacia = await Filial.findOne({ where: { cnpj: call.request.cnpj } });
        tipo = "filial";
    }
    if (find_farmacia) {
        await callback(null, {
            cnpj: find_farmacia.dataValues.cnpj,
            logo: find_farmacia.dataValues.logo,
            nome: find_farmacia.dataValues.nome,
            endereco: find_farmacia.dataValues.endereco,
            horario_funcionamento: find_farmacia.dataValues.horario_funcionamento,
            responsavel: find_farmacia.dataValues.responsavel,
            telefone: find_farmacia.dataValues.telefone,
            tipo: tipo
        })
    } else {
        await callback(null, {})
    }
}

exports.main = async() => {
    console.log(PROTO_PATH)
    var server = new grpc.Server();
    server.addService(farmacia_proto.Farmacia.service, { getFarmacia });
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("grpc iniciado...")
    });
}