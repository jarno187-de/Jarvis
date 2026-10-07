# Jarvis

## KI-Modell im Chat wechseln

Der Modellwähler sitzt links im unteren Eingabefeld. Er zeigt nur Anbieter mit einem serverseitig eingetragenen API-Key. Für Groq können `GROQ_API_KEY` und `GROQ_MODEL` in `.env` gesetzt werden; Gemini verwendet `GEMINI_API_KEY` und `GEMINI_MODEL`. Danach Jarvis neu starten. Im Menü wählst du ein KI-Modell und unabhängig davon einen Agenten, „Automatisch“ oder „Kein Agent“. So sind zum Beispiel „Gemini + Albert Einstein“ und „Gemini ohne Agent“ möglich. Bei automatischer Modellwahl bevorzugt Jarvis Groq für kurze Alltagsfragen und Gemini für Analyse oder Recherche, sofern beide konfiguriert sind. Die automatische Agentenwahl vergleicht Wörter aus der Anfrage mit Namen und Beschreibungen deiner Agenten; ohne klare Übereinstimmung antwortet die KI direkt. Die konkrete Auswahl steht über der Antwort im Chatverlauf. Routinen und Briefings verwenden weiterhin das erste konfigurierte Modell.

Das Info-Symbol nennt die genaue Modell-ID und das **gesamte** Tageskontingent. Trage dafür, falls bekannt, `GEMINI_RPD_LIMIT` beziehungsweise `GROQ_RPD_LIMIT` als vereinbarte Anfragen pro Tag in `.env` ein. Ohne Eintrag steht dort „Nicht hinterlegt“; es werden keine verbleibenden Anfragen oder geratenen Kontolimits angezeigt. Die tatsächlichen Limits können sich beim Anbieter ändern.

Die gelieferte Orb-Oberfläche ist mit einem Node-Backend verbunden. Jarvis nutzt ein entferntes Gemini-Modell, ElevenLabs für Sprachausgabe und optional Playwright- und Buffer-MCP-Server. Agenten, Routinen, Freigaben und Briefing-Einstellungen liegen in `data/state.json`.

## Start

1. Node.js 20 oder neuer installieren.
2. `npm install` ausführen.
3. `.env.example` nach `.env` kopieren und mindestens `JARVIS_PASSWORD` und `GEMINI_API_KEY` setzen. Den Gemini-Key gibt es in Google AI Studio; ob ein kostenloses Kontingent verfügbar ist, hängt vom aktuellen Tarif und Modell ab.
4. `npm start` ausführen und `http://localhost:3000` öffnen.

Unter Windows startet `start_local.bat` Jarvis im minimierten CMD-Fenster und öffnet den Standardbrowser, sobald der Server erreichbar ist. Wenn du Chrome nutzen möchtest, stelle Chrome als Standardbrowser ein. Falls der Start fehlschlägt, bleibt eine Meldung offen; die genaue Ursache steht im Fenster „Jarvis Server“.

ElevenLabs benötigt `ELEVENLABS_API_KEY` und `ELEVENLABS_VOICE_ID`. Ohne diese Werte nutzt der Browser seine eingebaute Sprachausgabe. Die Kreispfeile oben öffnen die Ergebnisse ausgeführter Routinen. Links wählst du eine Routine, rechts kannst du deren Nachrichten ausklappen und einzeln löschen. Frühere Nachrichten ohne eindeutige Zuordnung erscheinen in einer eigenen Gruppe. Spracheingabe nutzt die Web Speech API und benötigt einen kompatiblen Browser sowie Mikrofonzugriff. Für Zugriff über das Internet ist HTTPS erforderlich.

## MCP

`PLAYWRIGHT_MCP_COMMAND` und `PLAYWRIGHT_MCP_ARGS` starten einen Playwright-MCP-Server als Kindprozess. Die Beispielkonfiguration nutzt `npx` und `@playwright/mcp`. Für Buffer reicht jetzt `BUFFER_API_KEY`: Jarvis verbindet sich direkt mit Buffers offiziellem MCP-Server unter `https://mcp.buffer.com/mcp`. `BUFFER_MCP_COMMAND` und `BUFFER_MCP_ARGS` sind weiterhin als Alternative für einen lokalen Server verfügbar. Jarvis entdeckt die angebotenen MCP-Werkzeuge dynamisch. Buffer-Werkzeugaufrufe und verändernde Browser-Aktionen erscheinen vor Ausführung als Freigabe in der Oberfläche.

## Betrieb im Internet

Auf einem dauerhaft laufenden Node-Host bereitstellen, HTTPS vor den Server schalten und `PUBLIC_ORIGIN=https://deine-domain.example` setzen. `data/` muss als dauerhaftes Volume eingebunden sein. Ohne dauerhaft laufenden Host werden zeitgesteuerte Routinen und Briefings erst nach dem nächsten Start nachgeholt. Ein kostenloser KI-Tarif macht Hosting, ElevenLabs und Buffer nicht automatisch kostenlos. Schlüssel gehören ausschließlich in die Serverumgebung; `.env` und `data/*.json` sind von Git ausgeschlossen.

Das Daily Briefing kann mit Playwright aktuelle Webinformationen recherchieren. Ohne Browser oder andere Datenquelle meldet Jarvis fehlende aktuelle Fakten, statt sie zu erfinden. Es gibt keine garantierten Einnahmen und keine automatische Freigabe für Posts oder andere externe Veröffentlichungen.

## Darstellung

Der mit „Einstellungen“ beschriftete Zahnrad-Button oben rechts öffnet Darstellung, KI & Automatik, Sprache, Daily Briefing, Agenten, Routinen, Daten & Verlauf sowie Konto. Unter **Einstellungen → Darstellung** kannst du Dark Mode oder Light Mode auswählen. Die Hauptfarbe lässt sich mit einer Farbfläche, einem Farbtonregler, RGB-Reglern, dem System-Farbdialog oder einem Hex-Code wählen. Die Vorschau erscheint sofort; **Darstellung speichern** legt die Auswahl auf dem Server ab, damit sie nach einer Anmeldung auf anderen Geräten wieder verfügbar ist.

Unter **KI & Automatik** lassen sich die beiden Automatiken getrennt einschalten. Unter **Sprache** kannst du das Vorlesen ein- oder ausschalten, das Tempo ändern und die Stimme testen. **Daten & Verlauf** steuert die Anzeige unter dem Orb und bietet Export und Löschen des lokal gespeicherten Chatverlaufs. Die Vollbild-Animation beim Modellwechsel lässt sich unter Darstellung ausschalten. KI-Antworten werden für die Sprachausgabe ohne Markdown-Zeichen und Listenmarker ausgegeben.

## Vollständige Einrichtung ohne bezahlte Tarife

Die ausführliche Schritt-für-Schritt-Anleitung steht in [docs/KOSTENLOS-EINRICHTEN.md](docs/KOSTENLOS-EINRICHTEN.md). Sie nennt die Grenzen der kostenlosen Kontingente ausdrücklich.

Für den vereinfachten Start **ohne Buffer und DuckDNS** siehe [docs/START-OHNE-BUFFER-UND-DUCKDNS.md](docs/START-OHNE-BUFFER-UND-DUCKDNS.md).

Für den **lokalen Start auf einem schwächeren PC mit externer KI**, zunächst ohne Oracle, Buffer und DuckDNS: [docs/LOKAL-STARTEN.md](docs/LOKAL-STARTEN.md).
