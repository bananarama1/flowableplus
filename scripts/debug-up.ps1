$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    $env:DEBUG = "true"
    docker compose up --build --watch
}
finally {
    Pop-Location
}
