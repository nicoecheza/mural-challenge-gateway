export default function (ws, cf, ip) {

    let token = ws.upgradeReq.url.split("token=")[1];

    // Parse jwt token...

    let cm = cf.ensureManager(token);

    console.log('Subscribe in: ', token);

    cm.subscribe(token, ws);

    ws.on('close', () => cm.unsubscribe(token));

    ws.on('message', (message, flag) => {

        try {
          ip.processInbound(message, token, cm);
        } catch (err) {
          console.error(err);
        }

    });

}
