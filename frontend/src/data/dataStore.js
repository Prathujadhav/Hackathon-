import seed from "./seed.json";

export const SYSTEMS = [
  { name: "Slack", short: "S", type: "Communication", role: "Member" },
  { name: "GitHub", short: "GH", type: "Development", role: "Developer" },
  { name: "AWS", short: "AWS", type: "Cloud", role: "IAM Developer" },
  { name: "Salesforce", short: "SF", type: "CRM", role: "User" },
  { name: "Figma", short: "F", type: "Design", role: "Editor" },
  { name: "Jira", short: "J", type: "Project Management", role: "User" },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export function loadData(reset = false) {
  if (!reset) {
    try {
      const stored = localStorage.getItem("offboardData");
      if (stored) return JSON.parse(stored);
    } catch {
      // Recover from invalid local JSON by using the bundled fixture.
    }
  }
  return clone(seed);
}

export function saveData(data) {
  localStorage.setItem("offboardData", JSON.stringify(data));
}

export function createEmployee(form) {
  return {
    id: form.employeeId.trim().toUpperCase(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role: form.role.trim(),
    department: form.department.trim(),
    exitDate: form.exitDate,
    status: "Pending",
    systems: [],
    exception: false,
    phase: 0,
    createdAt: new Date().toLocaleString(),
  };
}
