# Registers the news proxy as a scheduled task that starts with Windows (no login needed) and restarts
# on failure. Run once in an elevated PowerShell:  powershell -ExecutionPolicy Bypass -File proxy\install-windows.ps1
$ErrorActionPreference = "Stop"
$taskName = "Lavita News Proxy"
$proxyDir = $PSScriptRoot
$envFile = Join-Path $proxyDir ".env"
$script = Join-Path $proxyDir "news-proxy.mjs"
$node = (Get-Command node -ErrorAction Stop).Source

if (-not (Test-Path $envFile)) { throw "Missing $envFile. Copy proxy\.env.example to proxy\.env and set PROXY_KEY first." }

$action = New-ScheduledTaskAction -Execute $node -Argument "--env-file=`"$envFile`" `"$script`"" -WorkingDirectory $proxyDir
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
Start-ScheduledTask -TaskName $taskName
Start-Sleep -Seconds 2
try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:8787/health" -TimeoutSec 5
  Write-Host "Proxy is running: $($health | ConvertTo-Json -Compress)"
} catch {
  Write-Warning "Task registered but /health did not answer yet. Check Task Scheduler > '$taskName'."
}
