

export default class InboundProcessor {

  constructor() {
    this._handlers = {};
  }

  registerHandler(type, func) {
    this._handlers[type] = func;
  }

  processInbound(wsMessage, token, communityManager) {

    console.log(`received: ${ wsMessage } from: ${ token }`);

    let wsPayload = JSON.parse(wsMessage);

    let handler = this._handlers[wsPayload.type];

    if (!handler) {
      throw new Error(`No handler found for inbound message of type ${ wsPayload.type }`);
    } else {
      return handler({}, wsPayload, token, communityManager);
    }

  }

}
