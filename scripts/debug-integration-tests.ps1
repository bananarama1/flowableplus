$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    .\mvnw.cmd --batch-mode -pl flowableplus-work-integration-tests -am verify -Dmaven.failsafe.debug
}
finally {
    Pop-Location
}
