# Flowable Plus Work Starter

Reusable Spring Boot starter for embedding Flowable Plus capabilities in an application.

## Responsibility

The starter assembles the Flowable Plus autoconfiguration and Flowable OSS engine dependencies. Applications consume this module instead of wiring the engine modules individually.

## Configuration boundary

- Native Flowable engine settings use `flowable.*` properties.
- Flowable Plus settings use `flowableplus.*` properties.
- The first application version uses PostgreSQL and classpath-deployed process models.

## Validation

The starter is tested as a black-box consumer by [flowableplus-work-integration-tests](../flowableplus-work-integration-tests/README.md). Do not rely only on tests inside this module to validate the published starter behavior.
