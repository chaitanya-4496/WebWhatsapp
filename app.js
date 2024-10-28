import express from 'express';
import path from 'path';
import { Client } from 'whatsapp-web.js';

const app = express();
var port = normalizePort(process.env.PORT || '7001');

let client;
let isReady = false;

app.use(express.json({ limit: '100mb' }));

app.use('/', express.static(path.join(path.resolve(), 'public')));

app.get("/k1", (req, res) => {
    res.end("this is k1");
});

app.get('/getCode', async (req, res) => {
    if (client) {
        res.json({ status: 'Client already initialized' });
        return;
    }

    client = new Client();

    client.on('qr', async (qr) => {
        try {
            console.log('QR Code received:', qr);
            res.end(qr);
        } catch (err) {
            console.error('QR Code generation failed:', err);
        }
    });

    client.on('ready', () => {
        isReady = true;
        console.log('Client is ready!');
    });

    await client.initialize();
});

app.get('/sendMulti', async (req, res) => {
    // const { number, message } = req.body;
    const number = "+918143779221";
    const message = "Test from KeshavSoft";

    if (!isReady) {
        res.status(400).json({ error: 'Client not ready' });
        return;
    };

    try {
        const chatId = number.substring(1) + "@c.us";
        await client.sendMessage(chatId, message);
        await client.sendMessage("+919030711344".substring(1) + "@c.us", "this is 2nd");

        res.json({ status: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};

app.listen(port, () => {
    console.log("connected");
});
