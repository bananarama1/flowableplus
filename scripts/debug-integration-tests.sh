#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"
exec ./mvnw --batch-mode -pl flowableplus-work-integration-tests -am verify -Dmaven.failsafe.debug
