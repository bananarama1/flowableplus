$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    .\mvnw.cmd --batch-mode -pl flowableplus-example-app -am test -Dmaven.surefire.debug
}
finally {
    Pop-Location
}
