# Recoge las imagenes usadas por bloques image-text y las copia a static\images\_resize
$ErrorActionPreference = 'Stop'
$repo    = Split-Path -Parent $PSScriptRoot
$content = Join-Path $repo 'content'
$images  = Join-Path $repo 'static\images'
$dest    = Join-Path $images '_resize'

if (-not (Test-Path $content)) { Write-Host "No encuentro content\ -- lanza el script desde el repo." -f Red; exit 1 }
if (-not (Test-Path $dest))    { New-Item -ItemType Directory -Path $dest | Out-Null }

$rutas = New-Object System.Collections.Generic.HashSet[string]

foreach ($md in Get-ChildItem -Path $content -Filter *.md -Recurse) {
    $lineas = Get-Content -LiteralPath $md.FullName -Encoding UTF8

    # --- 1. shortcodes: {{< image-text ... image="/images/x.webp" ... >}}
    foreach ($m in [regex]::Matches(($lineas -join "`n"), '\{\{<\s*image-text\b[^>]*?image\s*=\s*"([^"]+)"')) {
        [void]$rutas.Add($m.Groups[1].Value)
    }

    # --- 2. front matter: dentro de "- type: image-text" hasta el siguiente "- type:"
    $dentro = $false
    foreach ($l in $lineas) {
        if ($l -match '^\s*-\s*type:\s*(\S+)') {
            $dentro = ($matches[1].Trim('"''') -eq 'image-text')
            continue
        }
        if ($dentro -and $l -match '^\s*image:\s*"?([^"\r\n]+)"?\s*$') {
            [void]$rutas.Add($matches[1].Trim())
        }
    }
}

$copiadas = 0; $faltan = @(); $remotas = 0
foreach ($r in $rutas) {
    # las paginas demo usan placeholders remotos (picsum.photos): no son nuestras
    if ($r -match '^https?://') { $remotas++; continue }
    $rel = $r -replace '^/images/', '' -replace '/', '\'
    $src = Join-Path $images $rel
    if (Test-Path -LiteralPath $src) {
        Copy-Item -LiteralPath $src -Destination $dest -Force
        $copiadas++
        # variante _hd si existe (convencion de responsive-img.html)
        $hd = [IO.Path]::ChangeExtension($src, $null).TrimEnd('.') + '_hd' + [IO.Path]::GetExtension($src)
        if (Test-Path -LiteralPath $hd) { Copy-Item -LiteralPath $hd -Destination $dest -Force; $copiadas++ }
    } else {
        $faltan += $r
    }
}

Write-Host ""
Write-Host "Referencias image-text encontradas: $($rutas.Count)" -f Cyan
Write-Host "Archivos copiados a _resize:        $copiadas" -f Green
if ($remotas) { Write-Host "Omitidas (URL remota, demo):        $remotas" -f DarkGray }
if ($faltan.Count) {
    Write-Host "NO encontrados en static\images ($($faltan.Count)):" -f Yellow
    $faltan | Sort-Object | ForEach-Object { Write-Host "  $_" -f Yellow }
}
Write-Host "Destino: $dest" -f DarkGray
