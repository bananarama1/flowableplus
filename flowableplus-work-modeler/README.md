# FlowablePlus Modeler Backend

Opt-in local modeler support for filesystem-backed Flowable model files. Configure `flowableplus.modeler.root` and enable it with `flowableplus.modeler.enabled=true`.

The backend exposes unauthenticated local development endpoints under `/plus/modeler/*`, does not deploy models, and does not persist model definitions in a database.