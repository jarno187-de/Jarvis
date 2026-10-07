@echo off
setlocal
cd /d "%~dp0"
set "JARVIS_PORT=3000"
if exist ".env" for /f "usebackq tokens=1,* delims==" %%A in (".env") do if /I "%%A"=="PORT" set "JARVIS_PORT=%%B"
set "JARVIS_URL=http://localhost:%JARVIS_PORT%/"

if not exist "server.js" (
  echo server.js fehlt in diesem Ordner: %CD%
  pause
  exit /b 1
)
if not exist "reply-format.js" (
  echo reply-format.js fehlt. Kopiere das vollstaendige Jarvis-Update in diesen Ordner.
  pause
  exit /b 1
)

powershell.exe -NoProfile -Command "try {$r=Invoke-RestMethod -Uri 'http://127.0.0.1:%JARVIS_PORT%/api/session' -TimeoutSec 2; if($null -eq $r.configured){exit 1}} catch {exit 1}" >nul 2>&1
if errorlevel 1 (
  start "Jarvis Server" /min cmd.exe /k "npm.cmd start"
  powershell.exe -NoProfile -Command "$ready=$false; for($i=0;$i -lt 30;$i++){try{$r=Invoke-RestMethod -Uri 'http://127.0.0.1:%JARVIS_PORT%/api/session' -TimeoutSec 2; if($null -ne $r.configured){$ready=$true;break}}catch{}; Start-Sleep -Seconds 1}; if(-not $ready){exit 1}" >nul 2>&1
  if errorlevel 1 (
    echo Jarvis konnte nicht gestartet werden.
    echo Oeffne das minimierte CMD-Fenster "Jarvis Server" in der Taskleiste und lies den Fehler.
    echo Ordner: %CD%
    pause
    exit /b 1
  )
)

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%JARVIS_URL%"
  exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%JARVIS_URL%"
  exit /b 0
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
  start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "%JARVIS_URL%"
  exit /b 0
)
start "" "%JARVIS_URL%"
