# Jarvis zuerst ohne Buffer und DuckDNS starten

Stand: 7. Oktober 2026. Diese Variante nutzt Gemini, ElevenLabs, Playwright und eine Oracle-Always-Free-VM. **Buffer bleibt deaktiviert.** Für Zugriff von unterwegs nutzt du optional **Tailscale Serve** statt DuckDNS und Caddy. Die Tailscale-Adresse funktioniert nur auf Geräten, die mit deinem Tailscale-Konto verbunden sind. Der kostenlose Personal-Plan ist laut Tailscale für nichtkommerzielle Nutzung gedacht.

## 1. Benötigte Konten

- [Google AI Studio](https://aistudio.google.com/apikey): kostenlosen API-Key für `gemini-2.5-flash` erstellen. Keine bezahlte Abrechnung aktivieren.
- [ElevenLabs](https://elevenlabs.io/pricing): Free-Account, API-Key und Voice-ID erstellen. Der Free-Plan hat derzeit 10.000 Credits pro Monat. Für eine tiefe deutschsprachige Jarvis-Stimme kannst du **Leon Stern** testen (`re2r5d74PqDzicySNW0I`); kopiere die ID am besten in deinem ElevenLabs-Account nochmals direkt aus *My Voices*.
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/): Account erstellen. Oracle verlangt eine Karte zur Verifizierung. Nur **Always Free Eligible**-Ressourcen verwenden; freie VM-Kapazität ist nicht garantiert.
- Optional [Tailscale Personal](https://tailscale.com/pricing): kostenlos für private Nutzung und Zugriff von deinen eigenen Geräten.

## 2. Oracle-VM erstellen

Erstelle unter **Compute → Instances → Create instance** eine Ubuntu-VM mit einer *Always Free Eligible*-Form, zum Beispiel `VM.Standard.A1.Flex` mit 1 OCPU und 6 GB RAM. Verwende ein Boot-Volume innerhalb des Always-Free-Kontingents und eine öffentliche IPv4-Adresse. Lade den SSH-Schlüssel herunter.

Für diese Tailscale-Variante müssen **Port 80 und 443 nicht öffentlich geöffnet** werden. Port 22 für SSH nach Möglichkeit auf deine IP begrenzen. Port 3000 nicht öffentlich öffnen.

## 3. Anmelden und Jarvis installieren

Auf deinem Rechner:

```bash
ssh -i /PFAD/ZUM/SSH-SCHLUESSEL ubuntu@DEINE_VM_IP
```

Auf der VM:

```bash
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource.sh
sudo bash /tmp/nodesource.sh
sudo apt install -y nodejs
node --version
cd /home/ubuntu
git clone https://github.com/jarno187-de/Jarvis.git
cd Jarvis
npm ci
npx -y playwright@latest install --with-deps chromium
```

**Das GitHub-Repository ist derzeit privat.** Ein öffentlicher `git clone` klappt erst, wenn du es in GitHub selbst auf Public stellst. Du kannst stattdessen die aktuelle Projekt-ZIP per `scp` auf den Server übertragen und dort entpacken. Wenn du das tust, führe `npm ci` im entpackten Ordner aus.

## 4. Tailscale auf Server und Geräten

Auf der VM:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
sudo tailscale serve --bg 3000
sudo tailscale serve status
```

`tailscale up` zeigt einen Link zur Anmeldung. Öffne ihn und melde dich mit deinem Tailscale-Konto an. Wenn Serve beim ersten Start nach der Aktivierung von HTTPS-Zertifikaten fragt, bestätige dies im Tailscale-Adminbereich. `tailscale serve status` zeigt danach eine HTTPS-Adresse ähnlich `https://jarvis.dein-tailnet.ts.net`.

Installiere die Tailscale-App auf deinem Handy und Laptop und melde dich dort mit **demselben Konto** an. Nur so erreichen diese Geräte die private Jarvis-Adresse. Dafür brauchst du weder DuckDNS noch Caddy.

## 5. `.env` ohne Buffer ausfüllen

Im Jarvis-Ordner:

```bash
cp .env.example .env
nano .env
```

Setze diese Werte mit deinen eigenen Schlüsseln und der **exakten** Tailscale-HTTPS-Adresse:

```dotenv
JARVIS_PASSWORD=EIN_LANGES_EIGENES_PASSWORT
GEMINI_API_KEY=DEIN_GEMINI_KEY
GEMINI_MODEL=gemini-2.5-flash
ELEVENLABS_API_KEY=DEIN_ELEVENLABS_KEY
ELEVENLABS_VOICE_ID=DEINE_VOICE_ID
PLAYWRIGHT_MCP_COMMAND=npx
PLAYWRIGHT_MCP_ARGS=["-y","@playwright/mcp@latest","--headless"]
BUFFER_API_KEY=
BUFFER_MCP_COMMAND=
PORT=3000
HOST=127.0.0.1
PUBLIC_ORIGIN=https://jarvis.dein-tailnet.ts.net
```

`BUFFER_API_KEY` und `BUFFER_MCP_COMMAND` bleiben leer; Jarvis versucht dann keine Buffer-Verbindung. Kein Schrägstrich am Ende von `PUBLIC_ORIGIN`. Schlüssel nie in GitHub oder `public/` speichern.

```bash
chmod 600 .env
npm run check
npm start
```

Öffne die Tailscale-Adresse auf Handy oder Laptop und melde dich mit `JARVIS_PASSWORD` an. Beende den Test auf der VM mit `Strg+C`.

## 6. Jarvis nach Neustarts automatisch starten

```bash
sudo nano /etc/systemd/system/jarvis.service
```

Inhalt:

```ini
[Unit]
Description=Jarvis Assistant
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Jarvis
Environment=NODE_ENV=production
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/bin/node /home/ubuntu/Jarvis/server.js
Restart=always
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

Dann:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now jarvis
sudo systemctl status jarvis --no-pager
```

Falls der Status nicht `active (running)` lautet:

```bash
sudo journalctl -u jarvis -n 80 --no-pager
```

## 7. Testen

1. Auf einem Gerät mit aktiver Tailscale-App die HTTPS-Adresse öffnen.
2. Mit dem Jarvis-Passwort anmelden und eine Textfrage stellen.
3. ElevenLabs-Ausgabe und Mikrofon aktivieren; die Mikrofonberechtigung im Browser zulassen.
4. Für Browser-MCP Jarvis bitten, eine öffentliche Webseite zu prüfen.
5. Unter *Einstellungen* Agenten, Routinen, Briefing und Design einrichten. Buffer ist noch nicht verbunden; das ist für diese erste Version beabsichtigt.

Gemini-, ElevenLabs-, Oracle- und Tailscale-Free-Tarife haben Bedingungen und Grenzen. Insbesondere ist ElevenLabs Free nur ein begrenztes Sprachkontingent und Tailscale Personal für nichtkommerzielle Nutzung vorgesehen. Die Anleitung garantiert keine unbegrenzte oder geschäftliche Nutzung für 0 €.
