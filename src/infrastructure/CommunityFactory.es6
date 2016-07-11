import CommunityManager from './CommunityManager';

export default class CommunityFactory {

  constructor() {
    this.readers = {};
  }

  ensureLeader(readKey) {

    let cm = this.readers[readKey];

    if (!cm) {

      cm = new CommunityManager(readKey);

      this.readers[readKey] = cm;

    }

    return cm;

  }

}
