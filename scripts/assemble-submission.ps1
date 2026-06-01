# Gom bộ nộp module phần mềm — chạy từ thư mục CosMate_FE
# Usage: .\scripts\assemble-submission.ps1 [-SkipBackendBuild] [-SkipFrontendBuild]

param(
    [switch]$SkipBackendBuild,
    [switch]$SkipFrontendBuild,
    [string]$BackendRoot = "$PSScriptRoot\..\..\CosMate_BE\KLTN_CosMate_Backend\cosmate-backend"
)

$ErrorActionPreference = "Stop"
$FeRoot = Resolve-Path "$PSScriptRoot\.."
$OutRoot = Join-Path $FeRoot "submission"

Write-Host "==> CosMate submission assembler"
Write-Host "    FE root: $FeRoot"
Write-Host "    Output:  $OutRoot"

# --- Frontend build (production → localhost for Docker demo) ---
if (-not $SkipFrontendBuild) {
    $prodEnv = Join-Path $FeRoot ".env.production"
    @"
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_BASE_URL=http://localhost
VITE_GOOGLE_CLIENT_ID=
"@ | Set-Content $prodEnv -Encoding utf8

    Push-Location $FeRoot
    try {
        if (-not (Test-Path "node_modules")) { npm ci }
        npm run build
    } finally {
        Pop-Location
    }
}

$feDistSrc = Join-Path $FeRoot "dist"
if (-not (Test-Path (Join-Path $feDistSrc "index.html"))) {
    throw "Missing FE dist. Run npm run build first."
}

# --- Backend JAR ---
$jarName = "cosplay-rental-api.jar"
$jarOutDir = Join-Path $OutRoot "backend-build"
$jarOut = Join-Path $jarOutDir $jarName

if (-not $SkipBackendBuild) {
    $beRoot = Resolve-Path $BackendRoot -ErrorAction SilentlyContinue
    if (-not $beRoot) {
        Write-Warning "Backend not found at: $BackendRoot — skip Maven; place $jarName manually in submission/backend-build/"
    } else {
        Push-Location $beRoot
        try {
            mvn -DskipTests clean package
            $built = Get-ChildItem "target\*.jar" -Exclude "*-sources.jar","*-javadoc.jar" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if (-not $built) { throw "No JAR in target/" }
            New-Item -ItemType Directory -Force -Path $jarOutDir | Out-Null
            Copy-Item $built.FullName $jarOut -Force
            Write-Host "    BE JAR: $($built.Name) -> $jarName"
        } finally {
            Pop-Location
        }
    }
}

# --- Assemble tree ---
$null = New-Item -ItemType Directory -Force -Path (Join-Path $OutRoot "frontend-build\dist")
$null = New-Item -ItemType Directory -Force -Path $jarOutDir

# FE dist
$feDistDest = Join-Path $OutRoot "frontend-build\dist"
if (Test-Path $feDistDest) { Remove-Item $feDistDest -Recurse -Force }
Copy-Item $feDistSrc $feDistDest -Recurse -Force

# Root files
Copy-Item (Join-Path $FeRoot "deploy\docker-compose.yml") (Join-Path $OutRoot "docker-compose.yml") -Force
Copy-Item (Join-Path $FeRoot "deploy\.env.example") (Join-Path $OutRoot ".env.example") -Force
Copy-Item (Join-Path $FeRoot "deploy\README_Deploy.md") (Join-Path $OutRoot "README_Deploy.md") -Force
Copy-Item (Join-Path $FeRoot "deploy\Accounts.txt") (Join-Path $OutRoot "Accounts.txt") -Force

# deploy/nginx for compose volume path
$deployNginx = Join-Path $OutRoot "deploy\nginx"
New-Item -ItemType Directory -Force -Path $deployNginx | Out-Null
Copy-Item (Join-Path $FeRoot "deploy\nginx\default.conf") (Join-Path $deployNginx "default.conf") -Force

# JAR if built earlier but robocopy path
if ((Test-Path $jarOut) -eq $false) {
    $manualJar = Join-Path $jarOutDir $jarName
    if (-not (Test-Path $manualJar)) {
        Write-Warning "Missing $jarName — copy from BE target/ and rename, then re-run with -SkipFrontendBuild -SkipBackendBuild"
    }
}

Write-Host ""
Write-Host "Done. Zip folder:"
Write-Host "  $OutRoot"
Write-Host ""
Write-Host "Next:"
Write-Host "  1. Edit submission/Accounts.txt with real demo users"
Write-Host "  2. copy submission/.env.example -> submission/.env (for local test only; do not commit secrets)"
Write-Host "  3. Compress 'submission' folder to ZIP and submit"
