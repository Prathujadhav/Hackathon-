# OffboardAI

OffboardAI is an employee access de-provisioning workflow. It turns one HR exit event into discovery, revocation, verification, escalation and audit evidence.

## Project layout

```text
offboarding-ai/
  frontend/       React + Vite dashboard for Vercel
    src/data/     Local JSON seed and persistence adapter
  backend/        Express API for Render
    data/         JSON persistence file
```

The frontend currently works standalone with `localStorage`, so the demo is usable without a running API. The backend is ready for hosted JSON persistence and exposes the same core employee, activity, systems and report concepts.

## Workflow: where to start and what to check

1. Open **Employees** and add or select the departing employee. Confirm the employee ID, email, department and exit date.
2. Click **Start**. The workflow modal is the live run view. It records the exit event and shows each phase as it completes.
3. Check **Access Control** to see the six connected simulated adapters: Slack, GitHub, AWS, Salesforce, Figma and Jira.
4. Watch **Agent Activity** for discovery, revocation, verification and escalation events. This is the operational audit trail.
5. During verification, five systems become **Revoked**. AWS intentionally remains active after the revoke request, fails verification twice and becomes **Escalated**.
6. Open **Audit Reports** after the workflow completes. Check the 6 systems checked, 5 revoked, 1 escalated summary and the system-by-system evidence. Use **Print / save PDF** for the report.
7. Use **How it works** at the bottom of the sidebar for the same sequence explained step by step.

## Run locally

Open two terminals from the repository root.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Backend

```bash
cd backend
npm install
npm run dev
```

Health check: `http://localhost:10000/health`

## Deploy frontend to Vercel

1. Import the repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

`frontend/vercel.json` already contains the Vite build settings.

## Deploy backend to Render

1. Create a new **Web Service** from the repository.
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add `FRONTEND_ORIGIN` with the deployed Vercel URL.
6. Deploy and verify `/health`.

The JSON file is suitable for the MVP/demo. Render instances can have ephemeral filesystems, so move `backend/data/store.json` to a managed database or persistent disk before production workloads.

## Important MVP note

The six enterprise systems are simulated adapters. The architecture is intentionally separated so live Slack, GitHub, AWS, Salesforce, Figma and Jira admin integrations can replace them later without changing the operator workflow.
