require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment');

// Replace with your group ID
const GROUP_ID = process.env.GROUP_ID;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on('qr', (qr) => {
  console.log('📱 Scan the QR code below to authenticate:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ WhatsApp client is ready!');

  // Customize the message
  const alertMessage = 
`🔴 *DEMO-BROKEN is DOWN*
🌐 *URL:* https://this.is.not.a.real.site/
🛑 *Reason:* Connection Error
🕒 *Time:* ${moment().format('YYYY-MM-DD HH:mm:ss')}`;

  try {
    await client.sendMessage(GROUP_ID, alertMessage);
    console.log('✅ Alert message sent to group.');
  } catch (err) {
    console.error('❌ Failed to send message:', err);
  }
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.error('❌ Client was disconnected:', reason);
});

client.initialize();
