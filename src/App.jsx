import { useEffect, useState } from "react";
import "./App.css";

const SYSTEMS = [
  { name: "Slack", short: "S", type: "Communication" },
  { name: "GitHub", short: "GH", type: "Development" },
  { name: "AWS", short: "AWS", type: "Cloud" },
  { name: "Salesforce", short: "SF", type: "CRM" },
  { name: "Figma", short: "F", type: "Design" },
  { name: "Jira", short: "J", type: "Project Management" },
];

const FLOW = [
  "Exit Event",
  "Access Discovery",
  "Revocation",
  "Verification",
  "Escalation",
  "Audit Report",
];

function App() {
  const [page, setPage] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [employees, setEmployees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("offboardEmployees")) || [];
    } catch {
      return [];
    }
  });

  const [reports, setReports] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    email: "",
    role: "",
    department: "",
    exitDate: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "offboardEmployees",
      JSON.stringify(employees)
    );
  }, [employees]);

  useEffect(() => {
    if (!showSimulation) return;

    if (step < FLOW.length - 1) {
      const timer = setTimeout(() => {
        setStep((current) => current + 1);
      }, 1300);

      return () => clearTimeout(timer);
    }
  }, [showSimulation, step]);

  const addEmployee = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.employeeId ||
      !form.email ||
      !form.role ||
      !form.department ||
      !form.exitDate
    ) {
      alert("Please fill all employee details.");
      return;
    }

    const employee = {
      id: Date.now(),
      ...form,
      status: "Pending",
      systems: 0,
      revoked: 0,
      exception: false,
      createdAt: new Date().toLocaleString(),
    };

    setEmployees((prev) => [employee, ...prev]);

    setForm({
      name: "",
      employeeId: "",
      email: "",
      role: "",
      department: "",
      exitDate: "",
    });

    setShowAdd(false);
  };

  const startOffboarding = (employee) => {
    setSelectedEmployee(employee);
    setStep(0);
    setShowSimulation(true);

    setEmployees((prev) =>
      prev.map((item) =>
        item.id === employee.id
          ? {
            ...item,
            status: "In Progress",
            systems: 6,
          }
          : item
      )
    );
  };

  const finishOffboarding = () => {
    if (!selectedEmployee) return;

    const updatedEmployee = {
      ...selectedEmployee,
      status: "Completed",
      systems: 6,
      revoked: 5,
      exception: true,
    };

    setEmployees((prev) =>
      prev.map((item) =>
        item.id === selectedEmployee.id
          ? updatedEmployee
          : item
      )
    );

    const report = {
      id: Date.now(),
      employee: updatedEmployee,
      date: new Date().toLocaleString(),
      systems: 6,
      revoked: 5,
      exceptions: 1,
    };

    setReports((prev) => [report, ...prev]);

    setSelectedEmployee(updatedEmployee);
    setStep(FLOW.length - 1);
  };

  const resetDemo = () => {
    if (!window.confirm("Clear all employee data?")) return;

    localStorage.removeItem("offboardEmployees");

    setEmployees([]);
    setReports([]);
    setSelectedEmployee(null);
    setShowSimulation(false);
    setPage("Overview");
    setMobileMenuOpen(false);
  };

  const activeCases = employees.filter(
    (employee) => employee.status === "In Progress"
  ).length;

  const completedCases = employees.filter(
    (employee) => employee.status === "Completed"
  ).length;

  const exceptions = employees.filter(
    (employee) => employee.exception
  ).length;

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">O</div>

          <div>
            <h2>OffboardAI</h2>
            <span>Security Command Center</span>
          </div>
        </div>

        <div className="side-section">

          <p className="side-label">
            MAIN MENU
          </p>

          {[
            ["Overview", "⌂"],
            ["Employees", "♙"],
            ["Agent Activity", "◉"],
            ["Access Control", "▣"],
            ["Audit Reports", "▤"],
          ].map(([name, icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""
                }`}
              onClick={() => {
                setPage(name);
                setMobileMenuOpen(false);
              }}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}

        </div>

        <div className="sidebar-bottom">

          <div className="system-status">
            <div className="status-dot"></div>

            <div>
              <strong>Agent Online</strong>
              <small>All systems operational</small>
            </div>
          </div>

          <button
            className="reset-btn"
            onClick={resetDemo}
          >
            Reset Demo Data
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>

          <div>
            <span className="breadcrumb">
              SECURITY / {page.toUpperCase()}
            </span>
          </div>

          <div className="top-actions">

            <span className="live">
              <span></span> LIVE
            </span>

            <button
              className="add-btn"
              onClick={() => setShowAdd(true)}
            >
              + Add Employee
            </button>

          </div>

        </header>

        {/* OVERVIEW */}
        {page === "Overview" && (
          <>

            <section className="hero">

              <div className="hero-copy">

                <div className="eyebrow">
                  <span></span>
                  AUTONOMOUS SECURITY AGENT
                </div>

                <h1>
                  Employee Offboarding,
                  <br />
                  <strong>Automated.</strong>
                </h1>

                <p>
                  Discover, revoke and verify employee access
                  across enterprise applications with complete
                  audit visibility.
                </p>

                <div className="hero-actions">

                  <button
                    className="primary-btn"
                    onClick={() => setShowAdd(true)}
                  >
                    Start Offboarding
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      setPage("Agent Activity")
                    }
                  >
                    View Agent Activity →
                  </button>

                </div>

              </div>

              <div className="agent-visual">

                <div className="orbit orbit-one"></div>
                <div className="orbit orbit-two"></div>

                <div className="agent-core">

                  <div className="core-symbol">
                    AI
                  </div>

                  <span>AGENT</span>

                </div>

              </div>

            </section>

            {/* STATS */}
            <section className="stats-grid">

              <StatCard
                label="ACTIVE CASES"
                value={activeCases}
                detail="Currently processing"
              />

              <StatCard
                label="COMPLETED"
                value={completedCases}
                detail="Successfully offboarded"
              />

              <StatCard
                label="SYSTEMS MONITORED"
                value="06"
                detail="Connected applications"
              />

              <StatCard
                label="EXCEPTIONS"
                value={exceptions}
                detail="Requires attention"
                warning
              />

            </section>

            {/* CONTENT */}
            <section className="content-grid">

              <div className="panel workflow-panel">

                <PanelHeader
                  title="Offboarding Workflow"
                  subtitle="Autonomous execution pipeline"
                />

                <div className="workflow">

                  {FLOW.map((item, index) => (

                    <div
                      className="workflow-item"
                      key={item}
                    >

                      <div
                        className={`workflow-circle ${index < 5 ? "done" : ""
                          }`}
                      >
                        {index < 5
                          ? "✓"
                          : index + 1}
                      </div>

                      <div>
                        <strong>{item}</strong>

                        <span>
                          {index === 0
                            ? "HR exit event received"
                            : index === 1
                              ? "Scanning connected systems"
                              : index === 2
                                ? "Revoking active sessions"
                                : index === 3
                                  ? "Validating access removal"
                                  : index === 4
                                    ? "Handling unresolved access"
                                    : "Generating evidence"}
                        </span>
                      </div>

                      {index < FLOW.length - 1 && (
                        <div className="workflow-line"></div>
                      )}

                    </div>

                  ))}

                </div>

              </div>

              <div className="panel">

                <PanelHeader
                  title="Recent Employees"
                  subtitle="HR-submitted offboarding cases"
                />

                {employees.length === 0 ? (

                  <EmptyState
                    onClick={() => setShowAdd(true)}
                  />

                ) : (

                  <div className="employee-list">

                    {employees
                      .slice(0, 4)
                      .map((employee) => (

                        <EmployeeRow
                          key={employee.id}
                          employee={employee}
                          onStart={() =>
                            startOffboarding(employee)
                          }
                        />

                      ))}

                  </div>

                )}

              </div>

            </section>

            {/* EXCEPTION */}
            <section className="exception-banner">

              <div className="exception-icon">
                !
              </div>

              <div>

                <strong>
                  Known Demo Exception — AWS
                </strong>

                <p>
                  AWS access intentionally remains ACTIVE
                  after revocation. The agent retries
                  verification and escalates the critical
                  exception for audit visibility.
                </p>

              </div>

              <span className="critical-tag">
                CRITICAL
              </span>

            </section>

          </>
        )}

        {/* EMPLOYEES */}
        {page === "Employees" && (

          <section className="page-section">

            <PageTitle
              title="Employee Directory"
              subtitle="Employees entered by HR for automated offboarding."
            />

            {employees.length === 0 ? (

              <div className="large-empty">

                <div className="empty-icon">
                  +
                </div>

                <h3>No employees added</h3>

                <p>
                  Add an employee to begin an
                  offboarding workflow.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setShowAdd(true)}
                >
                  + Add Employee
                </button>

              </div>

            ) : (

              <div className="employee-cards">

                {employees.map((employee) => (

                  <div
                    className="employee-card"
                    key={employee.id}
                  >

                    <div className="employee-avatar">
                      {employee.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-main">

                      <h3>{employee.name}</h3>

                      <p>
                        {employee.employeeId}
                      </p>

                      <div className="employee-details">

                        <span>
                          {employee.role}
                        </span>

                        <span>
                          {employee.department}
                        </span>

                        <span>
                          {employee.email}
                        </span>

                        <span>
                          Exit: {employee.exitDate}
                        </span>

                      </div>

                    </div>

                    <div className="employee-right">

                      <Status
                        status={employee.status}
                      />

                      <button
                        className="small-action"
                        onClick={() =>
                          startOffboarding(employee)
                        }
                      >
                        Start →
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

        {/* AGENT ACTIVITY */}
        {page === "Agent Activity" && (

          <section className="page-section">

            <PageTitle
              title="Agent Activity"
              subtitle="Real-time autonomous security operations."
            />

            <div className="activity-layout">

              <div className="panel activity-panel">

                <PanelHeader
                  title="Live Agent Telemetry"
                  subtitle="Latest autonomous actions"
                />

                <div className="activity-list">

                  {[
                    [
                      "SYSTEM",
                      "Agent initialized successfully",
                      "NOW",
                    ],
                    [
                      "DISCOVERY",
                      "Scanning connected applications",
                      "1m",
                    ],
                    [
                      "ACCESS",
                      "Active sessions discovered",
                      "2m",
                    ],
                    [
                      "REVOCATION",
                      "Revocation workflow ready",
                      "3m",
                    ],
                    [
                      "VERIFY",
                      "Verification engine standing by",
                      "4m",
                    ],
                    [
                      "AUDIT",
                      "Evidence collection enabled",
                      "5m",
                    ],
                  ].map(([type, text, time]) => (

                    <div
                      className="activity-row"
                      key={text}
                    >

                      <div className="activity-bullet"></div>

                      <div className="activity-content">

                        <span>{type}</span>

                        <strong>{text}</strong>

                      </div>

                      <time>{time}</time>

                    </div>

                  ))}

                </div>

              </div>

              <div className="agent-card">

                <div className="agent-card-icon">
                  AI
                </div>

                <span className="online-label">
                  ● ONLINE
                </span>

                <h2>
                  Offboarding Agent
                </h2>

                <p>
                  Autonomous access de-provisioning engine
                </p>

                <div className="agent-metric">
                  <span>
                    Decision Engine
                  </span>

                  <strong>
                    READY
                  </strong>
                </div>

                <div className="agent-metric">
                  <span>
                    Tool Access
                  </span>

                  <strong>
                    CONTROLLED
                  </strong>
                </div>

                <div className="agent-metric">
                  <span>
                    Audit Logging
                  </span>

                  <strong>
                    ACTIVE
                  </strong>
                </div>

              </div>

            </div>

          </section>

        )}

        {/* ACCESS CONTROL */}
        {page === "Access Control" && (

          <section className="page-section">

            <PageTitle
              title="Access Control"
              subtitle="Connected enterprise systems monitored by the agent."
            />

            <div className="systems-grid">

              {SYSTEMS.map((system) => (

                <div
                  className="system-card"
                  key={system.name}
                >

                  <div className="system-logo">
                    {system.short}
                  </div>

                  <div className="system-info">

                    <h3>{system.name}</h3>

                    <p>{system.type}</p>

                  </div>

                  <div className="connected">
                    <span></span>
                    CONNECTED
                  </div>

                  <div className="system-actions">

                    <button>
                      Get Access Status
                    </button>

                    <button>
                      Revoke Access
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

        {/* AUDIT REPORTS */}
        {page === "Audit Reports" && (

          <section className="page-section">

            <PageTitle
              title="Audit Reports"
              subtitle="Evidence and exception records generated by the agent."
            />

            {reports.length === 0 &&
              employees.length === 0 ? (

              <div className="large-empty">

                <div className="empty-icon">
                  ▤
                </div>

                <h3>
                  No audit reports yet
                </h3>

                <p>
                  Complete an employee offboarding workflow
                  to generate an audit report.
                </p>

              </div>

            ) : (

              <div className="report-layout">

                <div className="panel report-panel">

                  <div className="report-header">

                    <div>

                      <span className="eyebrow">
                        AUDIT RECORD
                      </span>

                      <h2>
                        {reports[0]?.employee?.name ||
                          employees.find(
                            (e) =>
                              e.status ===
                              "Completed"
                          )?.name ||
                          employees[0]?.name}
                      </h2>

                    </div>

                    <button
                      className="secondary-btn"
                      onClick={() =>
                        window.print()
                      }
                    >
                      Print / Save PDF
                    </button>

                  </div>

                  <div className="report-stats">

                    <div>
                      <strong>06</strong>
                      <span>
                        Systems Scanned
                      </span>
                    </div>

                    <div>
                      <strong>05</strong>
                      <span>
                        Access Revoked
                      </span>
                    </div>

                    <div>
                      <strong>01</strong>
                      <span>
                        Exception
                      </span>
                    </div>

                  </div>

                  <div className="report-table">

                    {SYSTEMS.map((system) => (

                      <div
                        className="report-row"
                        key={system.name}
                      >

                        <span>
                          {system.name}
                        </span>

                        {system.name === "AWS" ? (

                          <span className="danger-status">
                            ACTIVE — ESCALATED
                          </span>

                        ) : (

                          <span className="success-status">
                            REVOKED ✓
                          </span>

                        )}

                      </div>

                    ))}

                  </div>

                </div>

                <div className="critical-report">

                  <div className="critical-report-icon">
                    !
                  </div>

                  <span>
                    CRITICAL EXCEPTION
                  </span>

                  <h3>
                    AWS Access Still Active
                  </h3>

                  <p>
                    Initial revocation did not remove
                    AWS access. Verification failed and
                    the agent retried the operation before
                    escalating the exception.
                  </p>

                  <div className="retry-box">

                    <span>
                      Retry Attempt
                    </span>

                    <strong>
                      01
                    </strong>

                  </div>

                  <div className="retry-box">

                    <span>
                      Escalation
                    </span>

                    <strong>
                      REQUIRED
                    </strong>

                  </div>

                </div>

              </div>

            )}

          </section>

        )}

      </main>

      {/* ADD EMPLOYEE MODAL */}
      {showAdd && (

        <div className="modal-backdrop">

          <div className="modal">

            <div className="modal-header">

              <div>

                <span className="eyebrow">
                  HR ACTION
                </span>

                <h2>
                  Add Employee
                </h2>

                <p>
                  Enter employee information to create
                  an offboarding case.
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowAdd(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={addEmployee}>

              <div className="form-grid">

                <Input
                  label="Employee Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                  placeholder="Enter full name"
                />

                <Input
                  label="Employee ID"
                  value={form.employeeId}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      employeeId: value,
                    })
                  }
                  placeholder="EMP-001"
                />

                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      email: value,
                    })
                  }
                  placeholder="employee@company.com"
                />

                <Input
                  label="Role"
                  value={form.role}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      role: value,
                    })
                  }
                  placeholder="Software Engineer"
                />

                <Input
                  label="Department"
                  value={form.department}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      department: value,
                    })
                  }
                  placeholder="Engineering"
                />

                <Input
                  label="Exit Date"
                  type="date"
                  value={form.exitDate}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      exitDate: value,
                    })
                  }
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowAdd(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Create Offboarding Case
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* SIMULATION MODAL */}
      {showSimulation &&
        selectedEmployee && (

          <div className="modal-backdrop">

            <div className="simulation-modal">

              <div className="simulation-top">

                <div>

                  <span className="eyebrow">
                    AUTONOMOUS WORKFLOW
                  </span>

                  <h2>
                    Offboarding{" "}
                    {selectedEmployee.name}
                  </h2>

                  <p>
                    Agent is executing access
                    de-provisioning workflow.
                  </p>

                </div>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowSimulation(false)
                  }
                >
                  ×
                </button>

              </div>

              <div className="simulation-flow">

                {FLOW.map((item, index) => (

                  <div
                    className={`simulation-step ${index < step
                        ? "complete"
                        : index === step
                          ? "current"
                          : ""
                      }`}
                    key={item}
                  >

                    <div className="simulation-number">

                      {index < step
                        ? "✓"
                        : index + 1}

                    </div>

                    <div>

                      <strong>
                        {item}
                      </strong>

                      <span>

                        {index < step
                          ? "Completed"
                          : index === step
                            ? "Agent processing..."
                            : "Waiting"}

                      </span>

                    </div>

                  </div>

                ))}

              </div>

              {step >= 3 && (

                <div className="simulation-warning">

                  <div>!</div>

                  <p>

                    <strong>
                      AWS verification failed.
                    </strong>

                    <br />

                    Access remains ACTIVE. Agent will
                    retry and escalate if the exception
                    persists.

                  </p>

                </div>

              )}

              {step === FLOW.length - 1 ? (

                <button
                  className="primary-btn full-btn"
                  onClick={finishOffboarding}
                >
                  Generate Audit Report
                </button>

              ) : (

                <div className="processing">

                  <span className="loader"></span>

                  Agent processing workflow...

                </div>

              )}

            </div>

          </div>

        )}

    </div>
  );
}

/* STAT CARD */
function StatCard({
  label,
  value,
  detail,
  warning,
}) {
  return (
    <div
      className={`stat-card ${warning ? "warning-card" : ""
        }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

/* PANEL HEADER */
function PanelHeader({
  title,
  subtitle,
}) {
  return (
    <div className="panel-header">

      <div>

        <h2>{title}</h2>

        <p>{subtitle}</p>

      </div>

    </div>
  );
}

/* PAGE TITLE */
function PageTitle({
  title,
  subtitle,
}) {
  return (
    <div className="page-title">

      <span className="eyebrow">
        OFFBOARDING CONTROL
      </span>

      <h1>{title}</h1>

      <p>{subtitle}</p>

    </div>
  );
}

/* EMPTY STATE */
function EmptyState({ onClick }) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        +
      </div>

      <h3>
        No employees yet
      </h3>

      <p>
        HR can add an employee to start
        the workflow.
      </p>

      <button
        className="small-action"
        onClick={onClick}
      >
        Add Employee
      </button>

    </div>
  );
}

/* EMPLOYEE ROW */
function EmployeeRow({
  employee,
  onStart,
}) {
  return (
    <div className="employee-row">

      <div className="employee-avatar">
        {employee.name
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="employee-row-info">

        <strong>
          {employee.name}
        </strong>

        <span>
          {employee.employeeId} ·{" "}
          {employee.department}
        </span>

      </div>

      <Status
        status={employee.status}
      />

      <button
        className="small-action"
        onClick={onStart}
      >
        Start
      </button>

    </div>
  );
}

/* STATUS */
function Status({ status }) {
  return (
    <span
      className={`status status-${status
        .toLowerCase()
        .replace(" ", "-")}`}
    >

      <span></span>

      {status}

    </span>
  );
}

/* INPUT */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="input-group">

      <span>{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </label>
  );
}

export default App;