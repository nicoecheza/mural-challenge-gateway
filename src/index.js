import dotenv from 'dotenv';
import restify from 'restify';
import { Server } from 'ws';
// import CommunityFactory from './infrastructure/CommunityFactory';
// import setupInboundProcessor from './bootstrap/setupInboundProcessor';
// import hookNewSocket from './utils/hookNewSocket';
import hookNewSocket from './temp_hookNewSocket';

dotenv.load({ silent: true });

async function start() {

    let server = restify.createServer({ name: 'challenge-gateway', version: '1.0.0' });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.listen(8080, () => console.log(`${ server.name } listening at ${ server.url }`));

    let wss = new Server({ port: process.env.WS_PORT });
    // let cf = new CommunityFactory();
    // let ip = setupInboundProcessor();

    // wss.on('connection', ws => hookNewSocket(ws, cf, ip));

    wss.on('connection', ws => hookNewSocket(ws));

    console.log('wss listening');

}

try {
    start();
} catch(err) {
    console.log(`Error starting server ${ err }`);
}
