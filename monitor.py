import requests
import json
import os
import time
import subprocess
from datetime import datetime

CLIENTS_FILE = '/home/mcmillan/DevOps/whatsapp-qr/clients.json'
LOG_FILE = '/home/mcmillan/DevOps/whatsapp-qr/log/monitor.log'

def load_clients(file_path=CLIENTS_FILE):
    with open(file_path, 'r') as f:
        return json.load(f)

def log_issue(name, url, reason):
    # Ensure log directory exists
    log_dir = os.path.dirname(LOG_FILE)
    os.makedirs(log_dir, exist_ok=True)

    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message = f"🔴 {name.upper()} is DOWN\n🌐URL: {url}\nReason: {reason}\nTime: {now}"
    print(message)
    send_whatsapp_alert(message)
    with open(LOG_FILE, 'a') as f:
        f.write(message + '\n')

def send_whatsapp_alert(message):
    try:
        subprocess.run(['node', '/home/mcmillan/DevOps/whatsapp-qr/whatsapp.js', message], check=True)
    except subprocess.CalledProcessError as e:
        print("Failed to send WhatsApp alert:", e)

def monitor_sites():
    clients = load_clients()
    for name, url in clients.items():
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                log_issue(name, url, f"HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            log_issue(name, url, str(e))

if __name__ == "__main__":
    monitor_sites()
