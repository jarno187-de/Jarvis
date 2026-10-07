# Jarvis zunächst nur auf deinem PC starten

Stand: 7. Oktober 2026. Diese Variante braucht **keinen Server, kein Oracle, kein DuckDNS, kein Buffer und kein Tailscale**. Dein PC startet nur die Jarvis-Webseite und das kleine Node-Backend. Die KI-Antworten kommen online von der Gemini-API; die Stimme kommt bei eingetragenem Key online von ElevenLabs. Dafür ist eine Internetverbindung nötig.

Die Browser-Automation mit Playwright-MCP bleibt in dieser leichten Einrichtung zunächst ausgeschaltet, weil ein automatisierter Chromium-Browser auf deinem PC Arbeitsspeicher und CPU benötigt. Der Orb, Chat, Spracheingabe, Sprachausgabe, Agenten, Routinen, Daily Briefing und Design-Einstellungen bleiben nutzbar. Ohne Browser-MCP kann das Briefing keine Live-Webseiten recherchieren; Routinen laufen nur, während Jarvis auf dem PC gestartet ist.

## 1. Konten und Programme

1. Installiere [Node.js 22 oder neuer](https://nodejs.org/en/download). Eine aktuelle LTS-Version ist sinnvoll. Prüfe danach in einem neuen Terminal `node --version` und `npm --version`.
2. Erzeuge in [Google AI Studio](https://aistudio.google.com/apikey) einen API-Key für den Free Tier. Für diesen Start ist keine bezahlte Abrechnung vorgesehen. Kopiere den Schlüssel, ohne ihn in GitHub hochzuladen.
3. Erstelle bei [ElevenLabs](https://elevenlabs.io/pricing) einen Free-Account und einen API-Key. Unter *My Voices* kannst du über die drei Punkte die Voice-ID kopieren. In der Vorlage steht testweise die tiefe deutsche Stimme **Leon Stern**. Falls sie in deinem Account nicht verfügbar ist, verwende die aus deinem Account kopierte ID.
4. Lade die aktuelle Jarvis-ZIP herunter und entpacke sie. Falls du das private GitHub-Repository bereits lokal geklont hast, kannst du stattdessen diesen Ordner verwenden.

## 2. Windows: Einrichten

Öffne den entpackten `jarvis`-Ordner im Explorer. Klicke in die Adressleiste, tippe `powershell` und drücke Enter. Dann:

```powershell
npm.cmd ci
Copy-Item .env.local.example .env
notepad .env
```

Trage in der geöffneten `.env` mindestens Folgendes ein:

```dotenv
JARVIS_PASSWORD=DEIN_EIGENES_LANGES_PASSWORT
GEMINI_API_KEY=DEIN_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
ELEVENLABS_API_KEY=DEIN_ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID=re2r5d74PqDzicySNW0I
PLAYWRIGHT_MCP_COMMAND=
BUFFER_API_KEY=
BUFFER_MCP_COMMAND=
PORT=3000
HOST=127.0.0.1
PUBLIC_ORIGIN=http://localhost:3000
```

Ersetze die Platzhalter durch eigene Werte und speichere die Datei. Die weiteren Zeilen aus der Vorlage können bleiben. Wenn ElevenLabs zunächst fehlen soll, lasse `ELEVENLABS_API_KEY` und `ELEVENLABS_VOICE_ID` leer; Jarvis nutzt dann die Browser-Stimme. Lasse Playwright und Buffer für den leichten Start leer.

## 3. macOS oder Linux: Einrichten

Öffne ein Terminal im entpackten `jarvis`-Ordner:

```bash
npm ci
cp .env.local.example .env
nano .env
```

Trage dieselben Werte wie im Windows-Beispiel ein, speichere mit `Strg+O`, Enter und verlasse `nano` mit `Strg+X`. Auf macOS kannst du statt `nano` einen Texteditor verwenden. Die `.env` bleibt auf deinem PC und wird durch `.gitignore` nicht hochgeladen.

## 4. Starten und benutzen

Unter Windows:

```powershell
npm.cmd start
```

Unter macOS/Linux:

```bash
npm start
```

Öffne anschließend **http://localhost:3000** auf demselben PC und melde dich mit `JARVIS_PASSWORD` an. Verwende für das Mikrofon am besten Chrome oder Edge und erlaube den Mikrofonzugriff. `localhost` gilt im Browser als sicherer Kontext, sodass der Mikrofonzugriff auch ohne öffentliche HTTPS-Domain möglich ist.

Das Terminal muss geöffnet bleiben. Mit `Strg+C` stoppst du Jarvis. Nach einem PC-Neustart startest du ihn mit demselben `npm start`-Befehl wieder. Tägliche Routinen und Briefings können nur laufen, wenn der PC zu diesem Zeitpunkt eingeschaltet und Jarvis gestartet ist; ein verpasster Lauf wird nur dann nachgeholt, wenn Jarvis noch am selben Tag nach der eingestellten Uhrzeit gestartet wird.

## 5. Was auf deinem PC läuft – und was online läuft

| Teil | Ort |
| --- | --- |
| Jarvis-Webseite, Einstellungen und gespeicherte Daten | Dein PC (`data/state.json`) |
| Gemini-KI | Google-Server |
| ElevenLabs-Stimme, wenn konfiguriert | ElevenLabs-Server |
| Browser-Spracherkennung | Browserfunktion, je nach Browser auch mit Online-Dienst |
| Playwright-Browser-MCP | In dieser Anleitung ausgeschaltet |
| Buffer | In dieser Anleitung ausgeschaltet |

**Kosten:** Gemini und ElevenLabs haben kostenlose Kontingente, aber keine unbegrenzte Gratis-Nutzung. ElevenLabs Free hat derzeit 10.000 Credits pro Monat; danach greift Jarvis auf die Browser-Sprachausgabe zurück, sofern sie verfügbar ist. Für kommerzielle Nutzung der ElevenLabs-Stimme gelten gesonderte Lizenzbedingungen. Strom und Internetzugang deines PCs sind natürlich nicht kostenlos.

**Zugriff:** `http://localhost:3000` funktioniert nur auf diesem PC. Zugriff vom Handy oder von unterwegs kommt später mit einem Server oder einer sicheren Verbindung hinzu. `HOST=127.0.0.1` verhindert, dass Jarvis versehentlich im lokalen Netzwerk öffentlich erreichbar ist.

## 6. Häufige Fehler

- **`node` oder `npm` unbekannt:** Node.js neu installieren und ein neues Terminal öffnen.
- **PowerShell blockiert `npm.ps1`:** Verwende wie oben `npm.cmd`.
- **Jarvis zeigt „Gemini-API-Key fehlt“:** `GEMINI_API_KEY` in `.env` eintragen, Jarvis mit `Strg+C` stoppen und neu starten.
- **Gemini antwortet mit 429:** Das kostenlose Limit ist erreicht. Später erneut versuchen oder die Limits in AI Studio prüfen.
- **ElevenLabs spricht nicht:** API-Key und Voice-ID überprüfen. Jarvis fällt bei einem Fehler auf die Browser-Stimme zurück.
- **Mikrofon funktioniert nicht:** Browserberechtigung prüfen und Chrome/Edge verwenden.
- **Port 3000 belegt:** In `.env` `PORT=3001` und `PUBLIC_ORIGIN=http://localhost:3001` setzen, danach Jarvis neu starten und `http://localhost:3001` öffnen.
