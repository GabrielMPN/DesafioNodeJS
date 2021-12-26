const path = require('path');
var PROTO_PATH = path.resolve(__dirname, "protos", "farmacia.proto");

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var farmacia_proto = grpc.loadPackageDefinition(packageDefinition);

exports.client = new farmacia_proto.Farmacia('localhost:50051',
    grpc.credentials.createInsecure());