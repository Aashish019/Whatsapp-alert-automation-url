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
    message = f"🔴 {name.upper()} is DOWN\n🌐URL: {url}\n🛑Reason: {reason}\n🕒Time: {now}"
    print(message)
    send_whatsapp_alert(message)
    with open(LOG_FILE, 'a') as f:
        f.write(message + '\n')

def send_whatsapp_alert(message):
    try:
        subprocess.run(['node', '/home/mcmillan/DevOps/whatsapp-qr/whatsapp.js', message], check=True)
    except subprocess.CalledProcessError as e:
        print("Failed to send WhatsApp alert:", e)

def safe_get(url, retries=1, timeout=10):
    for attempt in range(retries + 1):
        try:
            return requests.get(url, timeout=timeout)
        except requests.exceptions.RequestException as e:
            if attempt < retries:
                time.sleep(2)
            else:
                raise

def monitor_sites():
    clients = load_clients()
    for name, url in clients.items():
        try:
            response = safe_get(url)

            # Nginx is up (no connection error), check response content
            if response.status_code >= 500:
                # 5xx errors like 500, 502, 503 — likely Odoo crash
                log_issue(name, url, f"Odoo error: HTTP {response.status_code}")
            elif "Internal Server Error" in response.text or "Traceback" in response.text:
                # Odoo is up but showing error page
                log_issue(name, url, "Odoo internal error page")
            else:
                print(f"✅ {name.upper()} is UP")
        except requests.exceptions.ConnectionError:
            # Likely Nginx is down or port is closed
            log_issue(name, url, "Nginx unreachable (connection refused)")
        except requests.exceptions.RequestException as e:
            # Any other error, like timeout or DNS failure
            log_issue(name, url, str(e))


if __name__ == "__main__":
    monitor_sites()
