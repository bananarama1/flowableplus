$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    .\mvnw.cmd --batch-mode verify
}
finally {
    Pop-Location
}
