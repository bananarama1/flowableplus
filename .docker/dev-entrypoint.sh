#!/bin/sh
set -eu

if [ "${DEBUG:-false}" = "true" ]; then
  debug_options="-agentlib:jdwp=transport=dt_socket,server=y,suspend=${DEBUG_SUSPEND:-n},address=*:${DEBUG_PORT:-5005}"
else
  debug_options=""
fi

./mvnw --batch-mode -pl flowableplus-example-app -am install -DskipTests

exec ./mvnw --batch-mode -f flowableplus-example-app/pom.xml spring-boot:run \
  -Dspring-boot.run.profiles="${SPRING_PROFILES_ACTIVE:-docker}" \
  -Dspring-boot.run.jvmArguments="${debug_options}"