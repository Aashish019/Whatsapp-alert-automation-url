const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Use local authentication
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('Scan this QR with your WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    
    // Replace with your number
    const number = '919961308229';  // Use your actual number with country code (without +)
    const chatId = number + '@c.us';

    // Message you want to send
    const message = '⚠️ Odoo server is down! Please check it.';

    // Send message
    client.sendMessage(chatId, message).then(() => {
        console.log('✅ Alert sent via WhatsApp!');
    }).catch(console.error);
});

client.initialize();
