
export default class CommunityManager {

  constructor() {
    this.readers = {};
  }

  subscribe(token, ws) {

    console.log(`subscribing reader: ${ token }`);

    let current = this.readers[token];

    if (current && current.online) throw new Error('Reader already registered in community');

    this.readers[token] = { id: token, ws, leader: true || false };

  }

  unsubscribe(readerId) {

    console.log(`un-subscribing reader: ${ readerId }`);

    delete this.readers[readerId];

  }

  send(readerId, payload) {

    console.log(`sending message to ${ readerId } with payload ${ payload }`);

    let { ws } = this.readers[readerId];

    let message = JSON.stringify(payload);

    if (ws) ws.send(message);

  }

  broadcast(readerId, payload) {

    Object.keys(this.readers).forEach(reader => {

      if (readerId === reader) return;

      this.send(reader, payload);

    });

  }

}
