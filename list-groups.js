const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'groups.txt');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ WhatsApp client is ready!');

  const chats = await client.getChats();
  console.log(`📦 Total chats loaded: ${chats.length}`);

  const groupDetails = [];

  for (const chat of chats) {
    if (chat.isGroup) {
      const entry = `📛 Group Name: ${chat.name}\n🆔 Group ID: ${chat.id._serialized}\n---\n`;
      console.log(entry);
      groupDetails.push(entry);
    }
  }

  if (groupDetails.length === 0) {
    console.log('⚠️ No WhatsApp groups found.');
  } else {
    fs.writeFileSync(OUTPUT_FILE, groupDetails.join(''), 'utf8');
    console.log(`✅ Group info saved to ${OUTPUT_FILE}`);
  }

  process.exit();
});

client.initialize();
