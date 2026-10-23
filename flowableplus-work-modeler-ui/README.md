# FlowablePlus Modeler UI

Local development UI for editing Flowable model files from the configured workspace directory.

```powershell
npm install
npm run dev
```

The Vite server runs on `http://localhost:3001` and proxies `/api` to the Spring Boot application. The backend must have `flowableplus.modeler.enabled=true`.