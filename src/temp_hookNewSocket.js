
// This will be replaced by the CommunityFactory
let currPosition = 0, viewportHeight = 0, readers = [];

export default function (ws) {

    // Get reader ID (this should be replaced by a JWT, which should be verified resolving to { token, communityId })
    const id = ws.upgradeReq.url.split('reader=')[1];

    console.log(`New reader: ${ id }`);

    // Set up new reader
    let reader = { id, ws, leader: (readers.length) ? false : true };

    /*
    ** In case there is no readers, the first one connected should get the leader role.
    ** In case there are some readers (then there is a current leader), we send the new reader
    ** the current's leader viewport height and position
    */
    if (!readers.length) {
        console.log("New leader!");
        reader.ws.send(JSON.stringify({ type: 'UPDATE_LEADER', leader: true }));
    } else {
        reader.ws.send(JSON.stringify({ type: 'UPDATE_SCROLL', position: currPosition, viewportHeight }));
    }

    // Update readers array...(again, this is a temporal approach)
    readers.push(reader);

    ws.on('message', payload => processNewMessage(payload));

    ws.on('close', () => processDisconnection(reader));

}

function processNewMessage(payload) {

    console.log(`New message: ${ payload }`);

    let parsedPayload = JSON.parse(payload),
        leader        = readers.find(reader => reader.leader);

    // If the new message received doesn't come from the leader, ignore it
    if (parseInt(leader.id) !== parseInt(parsedPayload.id)) return;

    /*
    ** Iterate over the readers list, in case:
    ** 1: The reader is not the leader, send an UPDATE_SCROLL message type
    ** 2:  The reader is the current leader, update currPosition & viewportHeight global variables...
    */
    readers.forEach(reader => {
        if (!reader.leader) {
            reader.ws.send(JSON.stringify({
                type: 'UPDATE_SCROLL',
                position: parsedPayload.position,
                viewportHeight: parsedPayload.viewportHeight
            }));
        } else {
            currPosition = parsedPayload.position;
            viewportHeight = parsedPayload.viewportHeight;
        }
    });

}

function processDisconnection(disconnectedReader) {

    console.log(`Disconnected: ${ disconnectedReader.id }`);

    // Remove disconnected reader from readers list
    readers = readers.filter(reader => reader.id !== disconnectedReader.id);

    /*
    ** In case the disconnected reader was the current leader, assign new leader role to
    ** the next one in the readers list in connection order and send an UPDATE_LEADER message type...
    */
    if (disconnectedReader.leader && readers.length) {
        console.log("New leader!");
        let first = readers[0];
        first.leader = true;
        first.ws.send(JSON.stringify({ type: 'UPDATE_LEADER', leader: true }));
    }

}
