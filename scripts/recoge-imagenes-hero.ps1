# Recoge las imagenes usadas por los HERO y las copia a static\images\_resize\hero\
# Separa por rol, porque cada uno se reescala distinto:
#   bg        -> fondo CSS apaisado, full-bleed (ancho grande)
#   bgMobile  -> fondo CSS vertical para movil
#   image     -> figura en primer plano dentro del hero (srcset via responsive-img)
$ErrorActionPreference = 'Stop'
$repo    = Split-Path -Parent $PSScriptRoot
$content = Join-Path $repo 'content'
$images  = Join-Path $repo 'static\images'
$destRaiz = Join-Path $images '_resize\hero'

if (-not (Test-Path $content)) { Write-Host "No encuentro content\ -- lanza el script desde el repo." -f Red; exit 1 }

$roles = @{ 'bg' = 'bg'; 'bgMobile' = 'bg-mobile'; 'image' = 'image' }
foreach ($carpeta in $roles.Values) {
    $d = Join-Path $destRaiz $carpeta
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# ruta -> rol (una imagen solo deberia usarse con un rol; si no, gana el primero)
$rutas = @{}

foreach ($md in Get-ChildItem -Path $content -Filter *.md -Recurse) {
    $texto = Get-Content -LiteralPath $md.FullName -Raw -Encoding UTF8
    if ($texto -notmatch '^---') { continue }

    # solo el front matter: entre el primer y el segundo "---" en linea propia
    $partes = $texto -split '(?m)^---\s*$', 3
    if ($partes.Count -lt 3) { continue }
    $fm = $partes[1]

    # dentro del mapa "hero:" hasta la siguiente clave de primer nivel
    $dentro = $false
    foreach ($l in ($fm -split "`r?`n")) {
        if ($l -match '^hero:\s*$')  { $dentro = $true;  continue }
        if ($l -match '^\S')         { $dentro = $false }
        if (-not $dentro)            { continue }
        if ($l -match '^\s+(image|bg|bgMobile)\s*:\s*"?([^"\r\n]+?)"?\s*$') {
            $ruta = $matches[2].Trim()
            $rol  = $matches[1]
            if (-not $rutas.ContainsKey($ruta)) { $rutas[$ruta] = $rol }
        }
    }
}

$copiadas = 0; $conHd = 0; $remotas = 0; $faltan = @(); $resumen = @{}
foreach ($r in $rutas.Keys) {
    if ($r -match '^https?://') { $remotas++; continue }   # picsum en la demo
    $rol  = $rutas[$r]
    $dest = Join-Path $destRaiz $roles[$rol]
    $rel  = $r -replace '^/images/', '' -replace '/', '\'
    $src  = Join-Path $images $rel

    if (Test-Path -LiteralPath $src) {
        Copy-Item -LiteralPath $src -Destination $dest -Force
        $copiadas++
        $resumen[$rol] = 1 + $(if ($resumen.ContainsKey($rol)) { $resumen[$rol] } else { 0 })

        # variante _hd: la usan tanto responsive-img.html como bg-image-style.html
        $dir  = Split-Path -Parent $src
        $base = [IO.Path]::GetFileNameWithoutExtension($src)
        $ext  = [IO.Path]::GetExtension($src)
        $hd   = Join-Path $dir ($base + '_hd' + $ext)
        if (Test-Path -LiteralPath $hd) { Copy-Item -LiteralPath $hd -Destination $dest -Force; $copiadas++; $conHd++ }
    } else {
        $faltan += $r
    }
}

Write-Host ""
Write-Host "Referencias hero encontradas: $($rutas.Count)" -f Cyan
foreach ($rol in $roles.Keys | Sort-Object) {
    $n = $(if ($resumen.ContainsKey($rol)) { $resumen[$rol] } else { 0 })
    Write-Host ("  {0,-9} -> {1,3} imagen(es)  [_resize\hero\{2}]" -f $rol, $n, $roles[$rol]) -f Gray
}
Write-Host "Archivos copiados:            $copiadas  (de los cuales $conHd son variantes _hd)" -f Green
if ($remotas) { Write-Host "Omitidas (URL remota, demo):  $remotas" -f DarkGray }
if ($faltan.Count) {
    Write-Host "NO encontrados en static\images ($($faltan.Count)):" -f Yellow
    $faltan | Sort-Object | ForEach-Object { Write-Host "  $_" -f Yellow }
}

# aviso de _hd mal nombrados (convencion: foto_hd.webp, NO foto._hd.webp)
$malos = Get-ChildItem -Path $images -Filter '*._hd.*' -File -ErrorAction SilentlyContinue
if ($malos) {
    Write-Host ""
    Write-Host "AVISO — variantes _hd mal nombradas (el theme no las encuentra):" -f Red
    $malos | ForEach-Object {
        $ok = $_.Name -replace '\._hd\.', '_hd.'
        Write-Host ("  {0}  ->  deberia ser  {1}" -f $_.Name, $ok) -f Red
    }
}
Write-Host "Destino: $destRaiz" -f DarkGray
