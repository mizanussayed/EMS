param(
    [string]$DatabasePath = "d:\CoderWindows\EMS\backend\EMS.Api\ems.db",
    [string]$BackupDir = "d:\CoderWindows\EMS\backups"
)

if (-not (Test-Path $DatabasePath)) {
    Write-Error "Database file not found at $DatabasePath"
    exit 1
}

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = Join-Path $BackupDir "ems-backup-$timestamp.db"
Copy-Item -Path $DatabasePath -Destination $backupFile -Force

Write-Output "Backup created: $backupFile"
