# Pulls the latest code and restarts the proxy only when proxy files changed.
# Run manually, or schedule it (e.g. daily) so proxy updates deploy themselves:
#   powershell -ExecutionPolicy Bypass -File proxy\update-windows.ps1
$ErrorActionPreference = "Stop"
$taskName = "Lavita News Proxy"
$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo

$before = git rev-parse HEAD
git pull --ff-only
$after = git rev-parse HEAD
if ($before -eq $after) { Write-Host "Already up to date."; exit 0 }

$changed = git diff --name-only $before $after -- proxy/
if ($changed) {
  Write-Host "Proxy changed:`n$changed`nRestarting '$taskName'..."
  Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
  Start-ScheduledTask -TaskName $taskName
} else {
  Write-Host "Updated, no proxy changes; restart not needed."
}
