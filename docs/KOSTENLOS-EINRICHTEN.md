# Jarvis kostenlos einrichten

Stand: 7. Oktober 2026. Die Kontingente und Menüs der Anbieter können sich ändern. Diese Anleitung verwendet ausschließlich Free-Pläne und eine Oracle-Cloud-VM vom Typ **Always Free**. Sie setzt einen Oracle-Account und eine verfügbare VM voraus. Oracle verlangt eine Kredit- oder geeignete Debitkarte zur Identitätsprüfung; die Karte wird dadurch nicht automatisch mit einem kostenpflichtigen Abo belastet. Wähle weder kostenpflichtige Ressourcen noch ein Upgrade auf Pay As You Go.

**Wichtige Grenze:** ElevenLabs Free enthält derzeit 10.000 Credits im Monat. Das reicht nur für begrenzte Gespräche; danach nutzt Jarvis die Sprachausgabe des Browsers. Eine kommerzielle Lizenz ist laut ElevenLabs erst in einem bezahlten Tarif enthalten. Wenn du Jarvis oder seine erzeugte Stimme geschäftlich nutzt, prüfe diese Lizenz vorab. „Unbegrenzt, dauerhaft online, ElevenLabs und garantiert 0 €“ ist mit den Free-Plänen nicht zugesichert.

## 1. Kostenlose Konten und Schlüssel

1. **Gemini:** Öffne [Google AI Studio](https://aistudio.google.com/apikey), melde dich an, lege einen API-Schlüssel für ein Projekt im Free Tier an und kopiere ihn. Verknüpfe keine kostenpflichtige Abrechnung. Das Projekt verwendet `gemini-2.5-flash`. Prüfe dessen aktuelle Free-Tier-Limits in [Googles Preisliste](https://ai.google.dev/gemini-api/docs/pricing) und in AI Studio.
2. **ElevenLabs:** Erstelle einen [Free-Account](https://elevenlabs.io/pricing). Erzeuge in den Account-Einstellungen einen API-Key. Wähle unter *My Voices* eine Stimme und kopiere über die drei Punkte deren **Voice ID**. Beide Werte brauchst du für Jarvis.
3. **Buffer:** Erstelle einen [Free-Account](https://buffer.com/pricing), verbinde höchstens drei Social-Media-Kanäle und erzeuge unter **Settings → API** einen API-Key. Der Free-Plan erlaubt derzeit maximal zehn gleichzeitig geplante Posts je Kanal und 3.000 API-Anfragen pro Monat. Jarvis verbindet sich mit [Buffers offiziellem MCP-Server](https://developers.buffer.com/guides/integrations/mcp.html). Der Key kann auf alle Organisationen und Kanäle deines Buffer-Accounts zugreifen; behandle ihn wie ein Passwort.
4. **DuckDNS:** Lege unter [duckdns.org](https://www.duckdns.org/) einen kostenlosen Namen an, zum Beispiel `mein-jarvis.duckdns.org`. Die IP trägst du nach dem Erstellen der VM ein.

Trage API-Schlüssel **niemals** in GitHub, in Chatnachrichten oder in Dateien unter `public/` ein.

## 2. Dauerhaft laufende VM bei Oracle

1. Registriere dich bei [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/). Wähle im Dashboard **Compute → Instances → Create instance**.
2. Wähle ein Ubuntu-Image und ausdrücklich eine **Always Free Eligible**-Form, zum Beispiel `VM.Standard.A1.Flex` mit **1 OCPU und 6 GB RAM**. Wähle ein Boot-Volume innerhalb des Always-Free-Kontingents, ein öffentliches Subnetz und eine öffentliche IPv4-Adresse. Falls die A1-Form als *Out of capacity* angezeigt wird, musst du eine andere Region oder später einen neuen Versuch wählen. Lege stattdessen keine kostenpflichtige VM an.
3. Lade den angebotenen privaten SSH-Schlüssel herunter und notiere die öffentliche IPv4-Adresse.
4. Öffne in der Security List oder Network Security Group deiner VM eingehend **TCP 80 und 443** für `0.0.0.0/0`. **TCP 22** sollte nur von deiner eigenen IP erlaubt sein. Öffne **Port 3000 nicht** öffentlich.
5. Trage die VM-IP bei DuckDNS für deinen Namen ein. Prüfe, ob `mein-jarvis.duckdns.org` auf die VM-IP zeigt. Wenn die IP später wechselt, aktualisiere sie dort erneut.

Oracle beschreibt die [Always-Free-Ressourcen](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) und die [VM-Erstellung](https://docs.oracle.com/en-us/iaas/Content/Compute/tutorials/first-linux-instance/overview.htm) ausführlich. Die Anmeldung und freie Kapazität sind keine Garantie.

## 3. Auf der VM anmelden und Software installieren

Auf deinem eigenen Rechner, im Terminal oder in PowerShell:

```bash
ssh -i /PFAD/ZUM/SSH-SCHLUESSEL ubuntu@DEINE_VM_IP
```

Auf macOS/Linux vorher `chmod 600 /PFAD/ZUM/SSH-SCHLUESSEL` ausführen. Auf der VM:

```bash
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource.sh
sudo bash /tmp/nodesource.sh
sudo apt install -y nodejs
node --version
```

Node muss mindestens Version 20 anzeigen. Die folgenden Befehle benutzen dein Home-Verzeichnis als `ubuntu`-Nutzer:

```bash
cd /home/ubuntu
git clone https://github.com/jarno187-de/Jarvis.git
cd Jarvis
npm ci
```

**Falls das GitHub-Repository noch privat ist:** Der öffentliche `git clone` funktioniert dann nicht. Lade stattdessen das aktuelle Projekt-ZIP herunter, kopiere es per `scp` auf die VM und entpacke es dort; oder stelle das Repository zuerst in GitHub unter **Settings → General → Danger Zone → Change repository visibility** auf Public. Verwende kein GitHub-Passwort im Terminal-Befehl.

## 4. Playwright-Browser installieren

Installiere den kostenlosen Chromium-Browser und die benötigten Systembibliotheken:

```bash
cd /home/ubuntu/Jarvis
npx -y playwright@latest install --with-deps chromium
```

Der Download kann einige Minuten dauern. In `.env` bleibt `PLAYWRIGHT_MCP_COMMAND=npx` mit den vorgegebenen Playwright-Argumenten. Wenn Playwright-MCP später eine fehlende Browser-Version meldet, führe diesen Installationsbefehl erneut als `ubuntu`-Nutzer aus. Der Browser läuft auf der VM; dein PC berechnet dafür nichts.

## 5. Server-Konfiguration schreiben

Im Projektverzeichnis:

```bash
cp .env.example .env
nano .env
```

Trage deine **eigenen** Werte ein. Das folgende Muster zeigt nur Platzhalter:

```dotenv
JARVIS_PASSWORD=EIN_EIGENES_LANGES_PASSWORT
GEMINI_API_KEY=DEIN_GEMINI_KEY
GEMINI_MODEL=gemini-2.5-flash
ELEVENLABS_API_KEY=DEIN_ELEVENLABS_KEY
ELEVENLABS_VOICE_ID=DEINE_VOICE_ID
PLAYWRIGHT_MCP_COMMAND=npx
PLAYWRIGHT_MCP_ARGS=["-y","@playwright/mcp@latest","--headless"]
BUFFER_API_KEY=DEIN_BUFFER_KEY
BUFFER_MCP_URL=https://mcp.buffer.com/mcp
BUFFER_MCP_COMMAND=
BUFFER_MCP_ARGS=[]
PORT=3000
HOST=127.0.0.1
PUBLIC_ORIGIN=https://mein-jarvis.duckdns.org
```

Ersetze `mein-jarvis.duckdns.org` durch deinen DuckDNS-Namen. `PUBLIC_ORIGIN` darf am Ende **keinen Schrägstrich** haben. Leerzeichen und Sonderzeichen in Werten können bei `.env` Anführungszeichen erfordern. Gib dem Passwort idealerweise mindestens 20 zufällige Zeichen. Danach:

```bash
chmod 600 .env
npm run check
npm start
```

Läuft Jarvis, beende den Probestart mit `Strg+C`. Schlüssel nur hier auf dem Server speichern; `.env` ist per `.gitignore` von Git ausgeschlossen.

## 6. Jarvis automatisch starten

Erstelle den Systemdienst:

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

Aktivieren:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now jarvis
sudo systemctl status jarvis --no-pager
```

Der Dienst muss `active (running)` anzeigen. Der Datenstand liegt in `/home/ubuntu/Jarvis/data/state.json`; diese Datei bei Updates nicht löschen.

## 7. HTTPS und Zugriff von überall

Installiere [Caddy](https://caddyserver.com/docs/install) aus dem offiziellen Ubuntu/Debian-Repository:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

Dann `sudo nano /etc/caddy/Caddyfile` öffnen und den Inhalt auf Folgendes setzen:

```caddyfile
mein-jarvis.duckdns.org {
    reverse_proxy 127.0.0.1:3000
}
```

Wieder deinen eigenen DuckDNS-Namen einsetzen. Caddy neu laden:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Wenn auf Ubuntu `ufw` aktiviert ist, erlaube dort TCP 80 und 443. Zusätzlich müssen diese Ports in Oracle offen sein. Öffne im Browser `https://mein-jarvis.duckdns.org`. Caddy stellt ein kostenloses HTTPS-Zertifikat aus, sobald DNS und Ports stimmen. Ein Telefon benötigt für das Mikrofon HTTPS und einen kompatiblen Browser. Chrome/Edge sind für die Spracheingabe die einfachsten Optionen.

## 8. Funktionen testen

1. Mit `JARVIS_PASSWORD` anmelden.
2. Eine Textfrage stellen. Ohne Gemini-Antwort: `sudo journalctl -u jarvis -n 80 --no-pager` prüfen und in AI Studio Free-Tier-Limit/Key kontrollieren.
3. Sprachausgabe aktivieren und eine Antwort sprechen lassen. Bei ausgeschöpften ElevenLabs-Credits sollte die eingebaute Browser-Stimme einspringen.
4. Über den Orb oder das Mikrofon sprechen. Den Gesprächsmodus über die Kreispfeile oben aktivieren. Browser-Mikrofonberechtigung zulassen.
5. Nach einer aktuellen Webseite fragen. Playwright-MCP muss auf der VM einen Browser starten können.
6. Nach deinen Buffer-Kanälen fragen. Bei geplanten Posts die Freigabe in Jarvis bewusst prüfen; veröffentlichende Buffer-Aktionen laufen erst nach deiner Bestätigung.
7. Unter **Einstellungen** Agenten, Routinen, Briefing, Dark/Light Mode und Hauptfarbe einrichten. Für das Briefing ist `Europe/Berlin` bereits voreingestellt.

## 9. Aktualisieren und Fehler finden

```bash
cd /home/ubuntu/Jarvis
git pull --ff-only
npm ci
sudo systemctl restart jarvis
sudo journalctl -u jarvis -n 80 --no-pager
```

Bei einem privaten Repository statt `git pull` die neue ZIP-Version übertragen und **nur Programmdateien** ersetzen; `.env` und `data/` behalten. `journalctl` kann Fehlermeldungen aus verbundenen Diensten enthalten und sollte nicht öffentlich geteilt werden.

**Kosten-Check:** Oracle nur mit Always-Free-Ressourcen nutzen; Gemini Free Tier ohne bezahlte Abrechnung; ElevenLabs Free; Buffer Free mit den oben genannten Limits; DuckDNS und Caddy kostenlos. Keine dieser Freigrenzen garantiert unbegrenzte Nutzung oder unbegrenzte Verfügbarkeit. Das Projekt gibt außerdem keine Einnahmen oder Ads-Gewinne vor.
