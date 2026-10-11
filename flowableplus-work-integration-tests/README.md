# Flowable Plus Work Integration Tests

Black-box integration and REST contract tests for `flowableplus-work-starter`.

These tests bootstrap a small Spring Boot consumer application, start PostgreSQL and Mailpit with Testcontainers, deploy the test models, and exercise the Flowable services through the public application boundary.

The suite should cover the native REST operations used by the Work UI:

- login;
- process definition listing;
- process start;
- task listing;
- task claim;
- task completion;
- task form data;
- authentication and authorization errors.

Run from the repository root:

```text
./mvnw verify
```

Docker must be running. Tests use the `*IT.java` naming convention and Maven Failsafe.
