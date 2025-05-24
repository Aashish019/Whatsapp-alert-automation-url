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
git clone https://github.com/Aashish019/whatsapp-server-monitor.git
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

## 🛠️ Run Automatically with systemd

Instead of using a cron job, you can configure this monitor to run every 10 minutes using an infinite loop inside a systemd service. This ensures the script stays running in the background and survives reboots.

### 1. Add infinite loop to `monitor.py`

Make sure the `monitor.py` ends with:

```python
if __name__ == "__main__":
    while True:
        monitor_sites()
        print("⏱️ Waiting 10 minutes before next check...\n")
        time.sleep(600)  # 600 seconds = 10 minutes
```

---

### 2. Create a shell wrapper script

Create `/home/mcmillan/DevOps/whatsapp-qr/run_monitor.sh` with the following content:

```bash
#!/bin/bash
source /home/mcmillan/.bashrc
cd /home/mcmillan/DevOps/whatsapp-qr
/usr/bin/python3 monitor.py
```

Then make it executable:

```bash
chmod +x /home/mcmillan/DevOps/whatsapp-qr/run_monitor.sh
```

---

### 3. Create a systemd service file

Create the file:

```bash
sudo nano /etc/systemd/system/monitor.service
```

Paste the following configuration:

```ini
[Unit]
Description=Odoo Monitor Script
After=network.target

[Service]
User=mcmillan
WorkingDirectory=/home/mcmillan/DevOps/whatsapp-qr
ExecStart=/home/mcmillan/DevOps/whatsapp-qr/run_monitor.sh
Restart=always
RestartSec=10
Environment=PATH=/usr/bin:/usr/local/bin
StandardOutput=append:/home/mcmillan/DevOps/whatsapp-qr/log/monitor.service.log
StandardError=append:/home/mcmillan/DevOps/whatsapp-qr/log/monitor.service.err

[Install]
WantedBy=multi-user.target
```

---

### 4. Enable and start the service

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable monitor.service
sudo systemctl start monitor.service
```

---

### 5. Monitor the service

Check status:

```bash
sudo systemctl status monitor.service
```

View logs:

```bash
tail -f /home/mcmillan/DevOps/whatsapp-qr/log/monitor.service.log
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
