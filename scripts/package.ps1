param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
$Root = [IO.Path]::GetFullPath($Root)

& (Join-Path $PSScriptRoot "verify-release.ps1") -Root $Root

$manifestPath = Join-Path $Root "manifest.json"
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$distDirectory = Join-Path $Root "dist"
$packagePath = Join-Path $distDirectory "askit-$($manifest.version).zip"
$stagingDirectory = Join-Path ([IO.Path]::GetTempPath()) "askit-package-$([Guid]::NewGuid().ToString('N'))"

New-Item -ItemType Directory -Path $distDirectory -Force | Out-Null
New-Item -ItemType Directory -Path $stagingDirectory | Out-Null

try {
  Copy-Item -LiteralPath $manifestPath -Destination $stagingDirectory
  Copy-Item -LiteralPath (Join-Path $Root "icons") -Destination (Join-Path $stagingDirectory "icons") -Recurse
  Copy-Item -LiteralPath (Join-Path $Root "src") -Destination (Join-Path $stagingDirectory "src") -Recurse

  if (Test-Path -LiteralPath $packagePath) {
    Remove-Item -LiteralPath $packagePath -Force
  }

  Compress-Archive -Path (Join-Path $stagingDirectory "*") -DestinationPath $packagePath -CompressionLevel Optimal
} finally {
  if (Test-Path -LiteralPath $stagingDirectory) {
    Remove-Item -LiteralPath $stagingDirectory -Recurse -Force
  }
}

& (Join-Path $PSScriptRoot "verify-release.ps1") -Root $Root -PackagePath $packagePath

$sizeKb = [Math]::Round((Get-Item -LiteralPath $packagePath).Length / 1KB, 1)
Write-Host "Created $packagePath ($sizeKb KB)"
