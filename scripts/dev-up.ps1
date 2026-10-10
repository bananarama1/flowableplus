$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    docker compose up --build --watch
}
finally {
    Pop-Location
}
