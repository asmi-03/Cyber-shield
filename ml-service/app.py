from fastapi import FastAPI
from pydantic import BaseModel
import urllib.parse
import urllib.request
import json
import re
import socket
import ssl
from datetime import datetime
import threading

app = FastAPI()

class URLItem(BaseModel):
    url: str

# Threat intelligence cache
phish_cache = set()
last_fetch = None
fetch_lock = threading.Lock()

def get_openphish_feed():
    global phish_cache, last_fetch
    now = datetime.now()
    with fetch_lock:
        if last_fetch is None or (now - last_fetch).total_seconds() > 3600:
            try:
                print("Fetching updated OpenPhish feed...")
                req = urllib.request.Request('https://openphish.com/feed.txt', headers={'User-Agent': 'Mozilla/5.0'})
                resp = urllib.request.urlopen(req, timeout=5)
                if resp.status == 200:
                    lines = resp.read().decode('utf-8').splitlines()
                    phish_cache = set(lines)
                    last_fetch = now
                    print(f"Loaded {len(phish_cache)} phishing URLs.")
            except Exception as e:
                print("Could not fetch OpenPhish feed:", e)
    return phish_cache

def check_ssl(hostname):
    if not hostname:
        return False
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE  # Check if port 443 is open and speaks SSL/TLS
    try:
        with socket.create_connection((hostname, 443), timeout=3) as sock:
            with ctx.wrap_socket(sock, server_hostname=hostname) as ssock:
                return True
    except Exception:
        return False

@app.on_event("startup")
def startup_event():
    # pre-fetch the feed in a background thread
    threading.Thread(target=get_openphish_feed).start()

@app.get("/")
def read_root():
    return {"status": "Cyber Shield ML Service Running", "phish_urls_loaded": len(phish_cache)}

@app.post("/predict")
def predict_phishing(item: URLItem):
    url = item.url.strip()
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url

    try:
        parsed = urllib.parse.urlparse(url)
        hostname = parsed.hostname
    except Exception:
        hostname = ""

    url_lower = url.lower()
    
    # Check openphish database
    feed = get_openphish_feed()
    in_openphish = url in feed or url_lower in feed
    
    ssl_valid = check_ssl(hostname)

    if in_openphish:
        return {
            "url": item.url,
            "prediction": "phishing",
            "confidence": 0.99,
            "reason": "URL found in OpenPhish threat intelligence database!",
            "details": {
                "ssl": ssl_valid,
                "has_ip": False,
                "is_suspicious_keywords": False,
                "strange_tld": False,
                "malware": True
            }
        }
        
    # Heuristics
    suspicious_keywords = ['login', 'update', 'free', 'bonus', 'admin', 'secure', 'account', 'verify', 'webscr', 'banking', 'support', 'service']
    is_suspicious = any(keyword in url_lower for keyword in suspicious_keywords)
        
    has_ip = False
    if hostname:
        if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname):
            has_ip = True

    # Scoring
    score = 0
    if is_suspicious:
        score += 30
    if not ssl_valid:
        score += 40
    if has_ip:
        score += 80 # huge red flag
        
    if len(url) > 75:
        score += 20
        
    strange_tlds = ['.xyz', '.cc', '.tk', '.ml', '.ga', '.cf', '.gq', '.top']
    has_strange_tld = any(hostname.endswith(t) for t in strange_tlds) if hostname else False
    if has_strange_tld:
        score += 40

    if score >= 50:
        prediction = "phishing"
        confidence = min(0.99, (score + 20) / 100.0)
    else:
        prediction = "safe"
        confidence = max(0.60, 1.0 - (score / 100.0))

    return {
        "url": item.url,
        "prediction": prediction, 
        "confidence": confidence,
        "details": {
            "ssl": ssl_valid,
            "has_ip": has_ip,
            "is_suspicious_keywords": is_suspicious,
            "strange_tld": has_strange_tld,
            "malware": prediction == "phishing"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
