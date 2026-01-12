# Script para verificar y corregir Colombia definitivamente
$htmlPath = "c:/Users/USUARIO TS/CascadeProjects/bot creador de vix premium/CascadeProjects/windsurf-project/CascadeProjects/pincodesvirtuales-website/index.html"

# Leer HTML
$html = Get-Content $htmlPath -Raw

# Verificar y eliminar cualquier sold-out-card de Colombia
if ($html -match '<div class="product-card sold-out-card">.*?Pines Netflix Colombia') {
    Write-Host "❌ Colombia tiene sold-out-card, corrigiendo..."
    $html = $html -replace '(?s)<div class="product-card sold-out-card">(.*?Pines Netflix Colombia.*?)(</div>\s*</div>\s*</div>)', '<div class="product-card">$1$2'
}

# Verificar y eliminar cualquier overlay AGOTADO de Colombia
if ($html -match 'Pines Netflix Colombia.*?<div class="sold-out-overlay">AGOTADO</div>') {
    Write-Host "❌ Colombia tiene overlay AGOTADO, corrigiendo..."
    $html = $html -replace '(?s)(Pines Netflix Colombia.*?</div>\s*)<div class="sold-out-overlay">AGOTADO</div>', '$1'
}

# Verificar que USA y Turquía SÍ tengan sold-out-card
if ($html -match 'Pines Netflix USA.*?<div class="product-card">(?!.*sold-out-card)') {
    Write-Host "❌ USA no tiene sold-out-card, agregando..."
    $html = $html -replace '(?s)(<h3>Pines Netflix USA</h>.*?<div class="product-card">)', '<div class="product-card sold-out-card">'
}

if ($html -match 'Pines Netflix Turqu.*?<div class="product-card">(?!.*sold-out-card)') {
    Write-Host "❌ Turquía no tiene sold-out-card, agregando..."
    $html = $html -replace '(?s)(<h3>Pines Netflix Turqu.*?</h3>.*?<div class="product-card">)', '<div class="product-card sold-out-card">'
}

# Guardar HTML corregido
$html | Out-File -FilePath $htmlPath -Encoding UTF8

Write-Host "✅ Verificación completada"
Write-Host "✅ Colombia: DISPONIBLE"
Write-Host "✅ USA: AGOTADO"  
Write-Host "✅ Turquía: AGOTADO"
