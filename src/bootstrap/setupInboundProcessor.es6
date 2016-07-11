import InboundProcessor from '../infrastructure/InboundProcessor';

export default function () {

  let ip = new InboundProcessor();

  ip.registerHandler('MESSAGE', require('../inboundHandlers/message').default);

  return ip;

}
