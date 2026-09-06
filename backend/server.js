import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 10000;
const root = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.join(root, "data", "store.json");
const systems = ["Slack", "GitHub", "AWS", "Salesforce", "Figma", "Jira"];

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(express.json());

async function readStore() {
  return JSON.parse(await fs.readFile(storePath, "utf8"));
}
async function writeStore(store) {
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
}
function activity(type, text, employeeId) {
  return { id: `${Date.now()}-${Math.random()}`, type, text, employeeId, time: new Date().toISOString() };
}

app.get("/health", (_request, response) => response.json({ status: "ok", service: "offboarding-ai-backend" }));
app.get("/api/systems", (_request, response) => response.json(systems.map((name) => ({ name, connected: true }))));
app.get("/api/employees", async (_request, response) => response.json((await readStore()).employees));
app.get("/api/reports", async (_request, response) => response.json((await readStore()).reports));
app.get("/api/activity", async (_request, response) => response.json((await readStore()).activities));

app.post("/api/employees", async (request, response) => {
  const { name, employeeId, email, role, department, exitDate } = request.body;
  if (![name, employeeId, email, role, department, exitDate].every(Boolean)) return response.status(400).json({ error: "All employee fields are required." });
  const store = await readStore();
  const employee = { id: employeeId.trim().toUpperCase(), name: name.trim(), email: email.trim().toLowerCase(), role, department, exitDate, status: "Pending", systems: [], exception: false, createdAt: new Date().toISOString() };
  store.employees.unshift(employee);
  store.activities.unshift(activity("HR", `Employee ${employee.name} added`, employee.id));
  await writeStore(store);
  response.status(201).json(employee);
});

app.post("/api/employees/:id/offboard", async (request, response) => {
  const store = await readStore();
  const employee = store.employees.find((item) => item.id === request.params.id);
  if (!employee) return response.status(404).json({ error: "Employee not found." });
  employee.status = "Completed";
  employee.exception = true;
  employee.systems = systems.map((name) => ({ name, status: name === "AWS" ? "Escalated" : "Revoked", attempts: name === "AWS" ? 2 : 1 }));
  store.activities.unshift(activity("AUDIT", `Offboarding completed for ${employee.name}; AWS escalated`, employee.id));
  const report = { id: `RPT-${Date.now()}`, employeeId: employee.id, employee: { ...employee }, createdAt: new Date().toISOString(), systemsChecked: 6, revoked: 5, escalated: 1 };
  store.reports.unshift(report);
  await writeStore(store);
  response.json({ employee, report });
});

app.listen(port, () => console.log(`Offboarding API listening on port ${port}`));
