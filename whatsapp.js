require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const message = process.argv.slice(2).join(" ");
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("📲 Scan the QR code above with your WhatsApp");
});


client.on('ready', async () => {
    console.log('✅ WhatsApp client is ready! Sending message...');

    const number = process.env.NUMBER;  // Loaded from .env
    const chatId = number + '@c.us'; 
    const GROUP_ID = process.env.GROUP_ID;

    const sentMessage = await client.sendMessage(GROUP_ID, message);
    console.log("✅ Message ID:", sentMessage.id.id);
    setTimeout(() => process.exit(0), 2000);
});

client.initialize();