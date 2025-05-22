# 🛡️ WhatsApp Server Monitor

A Python-based automation tool that monitors client websites and sends real-time alerts to a WhatsApp group if:

- ❌ Nginx is unreachable
- ⚠️ Odoo app returns an internal server error
- ⏱️ Requests time out or DNS fails

Alerts are delivered via WhatsApp using the [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js) Node.js library.

---

## 📦 Features

- 🔍 Monitors multiple client URLs from a `clients.json` file
- 🚨 Detects Nginx failures, HTTP 5xx errors, and Odoo crash pages
- ✅ Retries once before alerting to reduce false positives
- 💬 Sends formatted alerts to a WhatsApp group
- 🕒 Can be scheduled via cron for periodic checks
- 📝 Logs alerts to a local file

---

## 📁 File Structure

```
.
├── monitor.py             # Main Python script
├── whatsapp.js            # WhatsApp messaging script (Node.js)
├── list-group.js          # Lists group IDs from WhatsApp chats
├── clients.json           # Client name → URL map
├── .env                   # Contains WhatsApp group ID and number
├── log/
│   └── monitor.log        # Alert history log
```

---

## 🔧 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/whatsapp-server-monitor.git
cd whatsapp-server-monitor
```

### 2. Install Python requirements
```bash
sudo apt install python3-pip
pip3 install requests
```

### 3. Install Node.js dependencies
```bash
cd path/to/whatsapp-qr
npm install whatsapp-web.js qrcode-terminal dotenv
```

### 4. Set up `.env`

```env
GROUP_ID=1203xxxxxxxxx@g.us
NUMBER=+1234567890
```

> ✅ Use the `list-group.js` script to log your group ID from existing chats.

### 5. Run once manually

```bash
python3 monitor.py
```

---

## ⏱️ Schedule as Cron Job

Edit your crontab:
```bash
crontab -e
```

Add this line to run every 5 minutes:
```cron
*/5 * * * * /usr/bin/python3 /home/username/DevOps/whatsapp-qr/monitor.py >> /home/username/DevOps/whatsapp-qr/log/cron.log 2>&1
```

---

## 🔐 Notes

- Requires a running instance of WhatsApp Web (QR login once)
- `whatsapp-web.js` stores session locally under `.wwebjs_auth/`

---

## 📸 Sample WhatsApp Alert

```
🔴 CLIENT-NAME is DOWN
🌐 URL: https://client-website.com
Reason: Odoo error: HTTP 500
Time: 2025-05-19 03:02:00
```

---

## 🙏 Credits

- Python core logic by [Aashish](https://github.com/Aashish019)
- WhatsApp integration via [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
