# Deploy manual para vocacionalfatima.netlify.app
# Preferência: conectar o repositório GitHub no Netlify (deploy automático a cada push)
# https://github.com/ronaldomelofz/vocacionalfatima
# Requer: netlify login (sessão ativa) — apenas para deploy manual

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Instalando dependências..." -ForegroundColor Cyan
npm install

Write-Host "Gerando build..." -ForegroundColor Cyan
npm run build

$siteName = "vocacionalfatima"
$sites = netlify sites:list --json 2>$null | ConvertFrom-Json
$existing = $sites | Where-Object { $_.name -eq $siteName -or $_.custom_domain -like "*$siteName*" }

if (-not $existing) {
  Write-Host "Criando site $siteName no Netlify..." -ForegroundColor Cyan
  netlify sites:create --name $siteName --account-slug ronaldomelofz 2>$null
  if ($LASTEXITCODE -ne 0) {
    netlify sites:create --name $siteName
  }
}

if (-not (Test-Path ".netlify\state.json")) {
  Write-Host "Vinculando projeto ao site..." -ForegroundColor Cyan
  netlify link --name $siteName
}

Write-Host "Publicando em produção..." -ForegroundColor Cyan
netlify deploy --prod --dir=dist

Write-Host ""
Write-Host "Site: https://$siteName.netlify.app" -ForegroundColor Green
