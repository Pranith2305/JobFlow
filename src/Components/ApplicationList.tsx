
import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  SlidersHorizontal,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Saved";

type Application = {
  id: number;
  company: string;
  role: string;
  type: string;
  date: string;
  status: ApplicationStatus;
  initials: string;
  color: string;
};

type ApplicationListProps = {
  searchQuery: string;
};

const initialApplications: Application[] = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Engineer",
    type: "Full-time · Remote",
    date: "Oct 24, 2026",
    status: "Interview",
    initials: "G",
    color: "google",
  },
  {
    id: 2,
    company: "Notion",
    role: "Software Engineer",
    type: "Full-time · Hybrid",
    date: "Oct 22, 2026",
    status: "Applied",
    initials: "N",
    color: "notion",
  },
  {
    id: 3,
    company: "Figma",
    role: "Product Engineer Intern",
    type: "Internship · Remote",
    date: "Oct 20, 2026",
    status: "Offer",
    initials: "F",
    color: "figma",
  },
  {
    id: 4,
    company: "Stripe",
    role: "Full-Stack Developer",
    type: "Full-time · Hybrid",
    date: "Oct 18, 2026",
    status: "Applied",
    initials: "S",
    color: "stripe",
  },
  {
    id: 5,
    company: "Linear",
    role: "Frontend Developer",
    type: "Full-time · Remote",
    date: "Oct 16, 2026",
    status: "Rejected",
    initials: "L",
    color: "linear",
  },
];

const ApplicationList = ({ searchQuery }: ApplicationListProps) => {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  const [filter, setFilter] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] =
    useState<ApplicationStatus>("Applied");

  const filteredApplications = useMemo(() => {
    const globalQuery = searchQuery.toLowerCase().trim();
    const localQuery = localSearch.toLowerCase().trim();

    return applications.filter((application) => {
      const searchableText =
        `${application.company} ${application.role}`.toLowerCase();

      const matchesFilter =
        filter === "All" || application.status === filter;

      const matchesGlobalSearch =
        !globalQuery || searchableText.includes(globalQuery);

      const matchesLocalSearch =
        !localQuery || searchableText.includes(localQuery);

      return (
        matchesFilter &&
        matchesGlobalSearch &&
        matchesLocalSearch
      );
    });
  }, [applications, filter, searchQuery, localSearch]);

  const handleAddApplication = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const company = newCompany.trim();
    const role = newRole.trim();

    if (!company || !role) return;

    const newApplication: Application = {
      id: Date.now(),
      company,
      role,
      type: "Full-time",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: newStatus,
      initials: company.charAt(0).toUpperCase(),
      color: "default",
    };

    setApplications((current) => [newApplication, ...current]);
    setNewCompany("");
    setNewRole("");
    setNewStatus("Applied");
    setShowForm(false);
    setFilter("All");
    setLocalSearch("");
  };

  const handleDeleteApplication = (id: number) => {
    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  };

  return (
    <section className="applications-card">
      <div className="applications-header">
        <div>
          <div className="section-heading">
            <h2>Recent Applications</h2>
            <span className="total-pill">
              {applications.length}
            </span>
          </div>

          <p className="section-description">
            Keep track of your latest job opportunities.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm((current) => !current)}
          aria-expanded={showForm}
        >
          <Plus size={17} />
          Add application
        </button>
      </div>

      {showForm && (
        <form
          className="application-form"
          onSubmit={handleAddApplication}
        >
          <div className="form-field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              value={newCompany}
              onChange={(event) =>
                setNewCompany(event.target.value)
              }
              placeholder="e.g. Microsoft"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="role">Job title</label>
            <input
              id="role"
              value={newRole}
              onChange={(event) =>
                setNewRole(event.target.value)
              }
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={newStatus}
              onChange={(event) =>
                setNewStatus(
                  event.target.value as ApplicationStatus
                )
              }
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              Save application
            </button>
          </div>
        </form>
      )}

      <div className="application-toolbar">
        <div className="filter-tabs">
          {[
            "All",
            "Saved",
            "Applied",
            "Interview",
            "Offer",
            "Rejected",
          ].map((item) => (
            <button
              key={item}
              className={`filter-tab ${
                filter === item ? "selected" : ""
              }`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="table-search">
          <SlidersHorizontal size={15} />

          <input
            value={localSearch}
            onChange={(event) =>
              setLocalSearch(event.target.value)
            }
            placeholder="Filter companies..."
            aria-label="Filter companies"
          />
        </label>
      </div>

      <div className="table-scroll">
        <table className="applications-table">
          <thead>
            <tr>
              <th>COMPANY / ROLE</th>
              <th>DATE APPLIED</th>
              <th>STATUS</th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td>
                  <div className="company-cell">
                    <div
                      className={`company-logo ${application.color}`}
                      aria-hidden="true"
                    >
                      {application.initials}
                    </div>

                    <div className="company-info">
                      <strong>{application.company}</strong>
                      <span>{application.role}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="date-cell">
                    <CalendarDays size={14} />
                    <span>{application.date}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`status-badge ${application.status.toLowerCase()}`}
                  >
                    <span className="status-dot" />
                    {application.status}
                  </span>
                </td>

                <td>
                  <button
                    className="icon-button row-action"
                    aria-label={`Delete ${application.company} application`}
                    title="Delete application"
                    onClick={() =>
                      handleDeleteApplication(application.id)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApplications.length === 0 && (
          <div className="empty-state">
            <BriefcaseBusiness size={25} />
            <strong>No applications found</strong>
            <p>
              Try another search or change your status filter.
            </p>
          </div>
        )}
      </div>

      <div className="applications-footer">
        <span>
          Showing <strong>{filteredApplications.length}</strong> of{" "}
          <strong>{applications.length}</strong> applications
        </span>

        <button
          className="view-all-button"
          onClick={() => {
            setFilter("All");
            setLocalSearch("");
          }}
        >
          Reset filters <ChevronDown size={14} />
        </button>
      </div>
    </section>
  );
};

export default ApplicationList;
