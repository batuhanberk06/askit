param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [string]$PackagePath
)

$ErrorActionPreference = "Stop"
$Root = [IO.Path]::GetFullPath($Root)

function Assert-PathExists {
  param([string]$RelativePath)

  $normalized = $RelativePath.Replace("/", [IO.Path]::DirectorySeparatorChar)
  $fullPath = Join-Path $Root $normalized
  if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
    throw "Required release file is missing: $RelativePath"
  }
}

function Resolve-RelativeReference {
  param(
    [string]$SourcePath,
    [string]$Reference
  )

  $sourceDirectory = Split-Path -Parent $SourcePath
  return [IO.Path]::GetFullPath((Join-Path $sourceDirectory $Reference))
}

$manifestPath = Join-Path $Root "manifest.json"
Assert-PathExists "manifest.json"

try {
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
} catch {
  throw "manifest.json is not valid JSON: $($_.Exception.Message)"
}

if ($manifest.manifest_version -ne 3) {
  throw "manifest_version must be 3."
}

if ($manifest.name -ne "AskIt") {
  throw "Manifest name must be AskIt."
}

if ([string]::IsNullOrWhiteSpace($manifest.version) -or $manifest.version -notmatch '^\d+(\.\d+){0,3}$') {
  throw "Manifest version is missing or invalid."
}

if ([int]$manifest.minimum_chrome_version -lt 127) {
  throw "minimum_chrome_version must remain 127 or newer because AskIt uses chrome.action.openPopup()."
}

if ($manifest.permissions -contains "<all_urls>" -or $manifest.host_permissions -contains "<all_urls>") {
  throw "AskIt must not request <all_urls>."
}

$manifestReferences = @(
  $manifest.background.service_worker
  $manifest.action.default_popup
)

if ($manifest.icons) {
  $manifestReferences += $manifest.icons.PSObject.Properties.Value
}

if ($manifest.action.default_icon) {
  $manifestReferences += $manifest.action.default_icon.PSObject.Properties.Value
}

foreach ($contentScript in $manifest.content_scripts) {
  $manifestReferences += $contentScript.js
  $manifestReferences += $contentScript.css
}

$manifestReferences |
  Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
  Sort-Object -Unique |
  ForEach-Object { Assert-PathExists $_ }

$sourceRoot = Join-Path $Root "src"
$scriptFiles = Get-ChildItem -LiteralPath $sourceRoot -Filter "*.js" -File -Recurse
foreach ($scriptFile in $scriptFiles) {
  $source = Get-Content -LiteralPath $scriptFile.FullName -Raw
  $imports = [regex]::Matches(
    $source,
    '(?:import\s+.+?\s+from\s+|import\s*)["''](?<path>\.{1,2}/[^"'']+)["'']'
  )
  foreach ($match in $imports) {
    $resolved = Resolve-RelativeReference $scriptFile.FullName $match.Groups["path"].Value
    if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
      throw "Broken JavaScript import in $($scriptFile.FullName): $($match.Groups["path"].Value)"
    }
  }
}

$popupPath = Join-Path $Root $manifest.action.default_popup
$popupSource = Get-Content -LiteralPath $popupPath -Raw
$htmlReferences = [regex]::Matches($popupSource, '(?:src|href)="(?<path>[^"]+)"')
foreach ($match in $htmlReferences) {
  $reference = $match.Groups["path"].Value
  if ($reference -match '^(?:https?:|data:|#)') { continue }
  $resolved = Resolve-RelativeReference $popupPath $reference
  if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
    throw "Broken popup asset reference: $reference"
  }
}

$cssFiles = Get-ChildItem -LiteralPath $sourceRoot -Filter "*.css" -File -Recurse
foreach ($cssFile in $cssFiles) {
  $css = Get-Content -LiteralPath $cssFile.FullName -Raw
  $urls = [regex]::Matches($css, 'url\(["'']?(?<path>[^"''\)]+)')
  foreach ($match in $urls) {
    $reference = $match.Groups["path"].Value
    if ($reference -match '^(?:https?:|data:|#)') { continue }
    $resolved = Resolve-RelativeReference $cssFile.FullName $reference
    if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
      throw "Broken CSS asset reference in $($cssFile.FullName): $reference"
    }
  }
}

Assert-PathExists "src/shared/fonts/OFL.txt"

$forbiddenRuntimeFiles = Get-ChildItem -LiteralPath $sourceRoot -File -Recurse |
  Where-Object { $_.Name -match '\.(?:map|log|tmp)$' -or $_.Name -eq ".DS_Store" }
if ($forbiddenRuntimeFiles) {
  throw "Development artifact found in src/: $($forbiddenRuntimeFiles.FullName -join ', ')"
}

@(
  "docs/index.html"
  "docs/privacy.html"
  "docs/support.html"
  "docs/styles.css"
  "docs/.nojekyll"
  "PRIVACY.md"
  "SUPPORT.md"
  "THIRD_PARTY_NOTICES.md"
  "RELEASE.md"
  "store/listing.md"
) | ForEach-Object { Assert-PathExists $_ }

$docsDirectory = Join-Path $Root "docs"
$docsPages = Get-ChildItem -LiteralPath $docsDirectory -Filter "*.html" -File
foreach ($docsPage in $docsPages) {
  $html = Get-Content -LiteralPath $docsPage.FullName -Raw
  $references = [regex]::Matches($html, '(?:src|href)="(?<path>[^"]+)"')
  foreach ($match in $references) {
    $reference = $match.Groups["path"].Value
    if ($reference -match '^(?:https?:|mailto:|#)') { continue }
    $reference = $reference.Split("#")[0].Split("?")[0]
    if ([string]::IsNullOrWhiteSpace($reference) -or $reference -eq "./") {
      $reference = "index.html"
    } elseif ($reference.EndsWith("/")) {
      $reference = "$($reference.TrimEnd('/'))/index.html"
    }
    $resolved = Resolve-RelativeReference $docsPage.FullName $reference
    if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
      throw "Broken GitHub Pages reference in $($docsPage.Name): $reference"
    }
  }
}

if ([string]::IsNullOrWhiteSpace($PackagePath)) {
  $PackagePath = Join-Path $Root "dist\askit-$($manifest.version).zip"
}

if (Test-Path -LiteralPath $PackagePath -PathType Leaf) {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [IO.Compression.ZipFile]::OpenRead($PackagePath)
  try {
    $entries = @($archive.Entries | ForEach-Object { $_.FullName.Replace("\", "/") })
    if ($entries -notcontains "manifest.json") {
      throw "Package must contain manifest.json at the ZIP root."
    }

    $invalidEntries = $entries | Where-Object {
      $_ -and $_ -ne "manifest.json" -and $_ -notmatch '^(?:icons|src)/'
    }
    if ($invalidEntries) {
      throw "Package contains non-runtime files: $($invalidEntries -join ', ')"
    }
  } finally {
    $archive.Dispose()
  }
}

Write-Host "AskIt release verification passed for version $($manifest.version)."
