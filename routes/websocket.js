const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 3001 });
const authenticationService = require('../services/authenticationService');
const chatRoomService = require('../services/chatRoomService');
const clients = new Map();
const {go} = require("fxjs/Strict");

wss.on("connection", function(ws) {
    ws.on("message", async function(msgString) {
        try {
            const msg = JSON.parse(msgString);
            if(msg.type === 'TOKEN') {
                authenticationService.verifyJwt(msg.token)
                    .then(res => {
                        clients.set(res.userNo, ws);
                        ws.user = res;
                    })
                    .catch(_ => ws.send(JSON.stringify({type: 'ERROR', msg: 'invalid token'})));
            }  else if(msg.type == 'MESSAGE') {
                if(ws.user === undefined) {
                   return;
                }
                go(
                    [ws.user.userNo, msg.targetUserNo],
                    chatRoomService.joinChatRoom,
                    map(s =)
                )



            } else {
                throw new Error('unknown type');
            }
        } catch (e) {
            ws.send('error type');
        }
        console.log("Received: %s", msgString);
    });
    ws.on('error', (error) => {
       console.error(error);
    });
    ws.on('close', (message) => {
        clients.delete(ws.user.userNo);
    });
});


module.exports = wss;