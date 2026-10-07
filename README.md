# Jarvis

Die gelieferte Orb-Oberfläche ist mit einem Node-Backend verbunden. Jarvis nutzt ein entferntes Gemini-Modell, ElevenLabs für Sprachausgabe und optional Playwright- und Buffer-MCP-Server. Agenten, Routinen, Freigaben und Briefing-Einstellungen liegen in `data/state.json`.

## Start

1. Node.js 20 oder neuer installieren.
2. `npm install` ausführen.
3. `.env.example` nach `.env` kopieren und mindestens `JARVIS_PASSWORD` und `GEMINI_API_KEY` setzen. Den Gemini-Key gibt es in Google AI Studio; ob ein kostenloses Kontingent verfügbar ist, hängt vom aktuellen Tarif und Modell ab.
4. `npm start` ausführen und `http://localhost:3000` öffnen.

ElevenLabs benötigt `ELEVENLABS_API_KEY` und `ELEVENLABS_VOICE_ID`. Ohne diese Werte nutzt der Browser seine eingebaute Sprachausgabe. Der Gesprächsmodus (Kreispfeile oben) startet nach einer gesprochenen Antwort wieder das Mikrofon. Spracheingabe nutzt die Web Speech API und benötigt einen kompatiblen Browser sowie Mikrofonzugriff. Für Zugriff über das Internet ist HTTPS erforderlich.

## MCP

`PLAYWRIGHT_MCP_COMMAND` und `PLAYWRIGHT_MCP_ARGS` starten einen Playwright-MCP-Server als Kindprozess. Die Beispielkonfiguration nutzt `npx` und `@playwright/mcp`. Für Buffer sind `BUFFER_MCP_COMMAND` und `BUFFER_MCP_ARGS` auf den tatsächlich verfügbaren Buffer-MCP-Server zu setzen, einschließlich seiner Authentisierung gemäß dessen Anleitung. Jarvis entdeckt die angebotenen MCP-Werkzeuge dynamisch. Buffer-Werkzeugaufrufe und verändernde Browser-Aktionen erscheinen vor Ausführung als Freigabe in der Oberfläche.

## Betrieb im Internet

Auf einem dauerhaft laufenden Node-Host bereitstellen, HTTPS vor den Server schalten und `PUBLIC_ORIGIN=https://deine-domain.example` setzen. `data/` muss als dauerhaftes Volume eingebunden sein. Ohne dauerhaft laufenden Host werden zeitgesteuerte Routinen und Briefings erst nach dem nächsten Start nachgeholt. Ein kostenloser KI-Tarif macht Hosting, ElevenLabs und Buffer nicht automatisch kostenlos. Schlüssel gehören ausschließlich in die Serverumgebung; `.env` und `data/*.json` sind von Git ausgeschlossen.

Das Daily Briefing kann mit Playwright aktuelle Webinformationen recherchieren. Ohne Browser oder andere Datenquelle meldet Jarvis fehlende aktuelle Fakten, statt sie zu erfinden. Es gibt keine garantierten Einnahmen und keine automatische Freigabe für Posts oder andere externe Veröffentlichungen.
