# Proposal

## Why

The repository has OpenSpec workflow skills, but it lacks project-specific Copilot guidance for the Java, Spring Boot, Flowable, frontend, and multi-application boundaries that recur during development. That forces each session to rediscover conventions and risks generating broad instructions or skills that add context without improving decisions.

## What Changes

- Add a concise project-wide Copilot instruction file for stable architecture, security, testing, and OpenSpec facts.
- Add narrowly applied instructions for Java/API work, frontend work, and OpenSpec artifacts only where the repository has repeatable conventions.
- Add a small set of task-oriented skills for publication-contract changes, the end-to-end work vertical slice, and module validation.
- Give every skill explicit trigger terms, bounded scope, and an executable validation outcome.
- Define a source-of-truth policy so behavioral requirements remain in OpenSpec specs while Copilot guidance contains only concise implementation constraints or workflow procedures.
- Make agent impact an explicit decision in every future OpenSpec proposal, including a deliberate no-impact outcome.
- Encode the maintenance rule in OpenSpec project rules and the OpenSpec artifact instructions so future changes assess existing guidance before adding or changing it.
- Preserve the existing OpenSpec skills and do not add a general-purpose custom agent unless a distinct role with different tools is demonstrated.

## Capabilities

### New Capabilities

None. This change improves developer tooling and agent guidance; it does not change application behavior.

### Modified Capabilities

None.

## Impact

The change affects `.github` customization files, OpenSpec project rules, and related planning documentation. It must not alter Java, frontend, database, runtime, API, or deployment behavior. The resulting guidance should reduce repeated repository discovery while avoiding duplicate instructions, vague skills, and always-loaded context that is unrelated to the current task. Future proposals must record whether the change affects agent guidance and identify the affected files when it does. Any repeated behavior in instructions or skills must be a concise implementation or validation projection linked to the authoritative spec, not a second copy of the requirement.
