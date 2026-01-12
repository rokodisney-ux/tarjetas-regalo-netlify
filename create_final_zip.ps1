# Script para crear ZIP definitivo corregido
$projectPath = "c:/Users/USUARIO TS/CascadeProjects/bot creador de vix premium/CascadeProjects/windsurf-project/CascadeProjects/pincodesvirtuales-website"
$zipPath = "c:/Users/USUARIO TS/CascadeProjects/bot creador de vix premium/CascadeProjects/windsurf-project/CascadeProjects/pincodesvirtuales-website-final.zip"

# Primero verificar y corregir HTML
$html = Get-Content "$projectPath/index.html" -Raw

# Asegurar que Colombia NO tenga sold-out-card
$html = $html -replace '(?s)<div class="product-card sold-out-card">(.*?Pines Netflix Colombia.*?)(</div>\s*</div>\s*</div>)', '<div class="product-card">$1$2'

# Quitar overlay AGOTADO de Colombia si existe
$html = $html -replace '(?s)(Pines Netflix Colombia.*?</div>\s*)<div class="sold-out-overlay">AGOTADO</div>', '$1'

# Guardar HTML corregido
$html | Out-File -FilePath "$projectPath/index.html" -Encoding UTF8

# Crear ZIP nuevo
Compress-Archive -Path $projectPath -DestinationPath $zipPath -Force

Write-Host "✅ ZIP corregido creado: $zipPath"
Write-Host "✅ Colombia: DISPONIBLE (sin AGOTADO)"
Write-Host "✅ USA y Turquía: AGOTADO"
Write-Host ""
Write-Host "🚀 Sube este nuevo ZIP a Netlify"
