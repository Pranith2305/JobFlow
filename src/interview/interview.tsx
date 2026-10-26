
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Plus,
  Search,
  MapPin,
  Video,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  BriefcaseBusiness,
  ClipboardCheck,
  CalendarClock,
} from "lucide-react";
import "./interview.css";

type InterviewStatus = "Scheduled" | "Completed" | "Cancelled";
type InterviewType = "Technical" | "HR" | "Behavioural" | "Managerial";

type Interview = {
  id: number;
  company: string;
  role: string;
  date: string;
  time: string;
  type: InterviewType;
  status: InterviewStatus;
  mode: "Online" | "In-person";
  location: string;
  notes: string;
};

const initialInterviews: Interview[] = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer Intern",
    date: "2026-10-28",
    time: "10:00",
    type: "Technical",
    status: "Scheduled",
    mode: "Online",
    location: "Google Meet",
    notes: "Revise JavaScript, React, and problem-solving fundamentals.",
  },
  {
    id: 2,
    company: "Figma",
    role: "Product Engineer Intern",
    date: "2026-10-30",
    time: "14:30",
    type: "Behavioural",
    status: "Scheduled",
    mode: "Online",
    location: "Video call",
    notes: "Prepare project explanations and teamwork examples.",
  },
  {
    id: 3,
    company: "Stripe",
    role: "Full-Stack Developer",
    date: "2026-10-22",
    time: "11:00",
    type: "HR",
    status: "Completed",
    mode: "In-person",
    location: "Company office",
    notes: "Review the discussion and record feedback.",
  },
];

const emptyForm = {
  company: "",
  role: "",
  date: "",
  time: "10:00",
  type: "Technical" as InterviewType,
  mode: "Online" as "Online" | "In-person",
  location: "",
  notes: "",
};

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Interviews = () => {
  const [interviews, setInterviews] =
    useState<Interview[]>(initialInterviews);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedInterview, setSelectedInterview] =
    useState<Interview | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const upcoming = interviews.filter(
    (item) =>
      item.status === "Scheduled" &&
      new Date(`${item.date}T${item.time}:00`) >= now
  ).length;

  const thisWeek = interviews.filter((item) => {
    if (item.status !== "Scheduled") return false;

    const date = new Date(`${item.date}T${item.time}:00`);
    const daysAway = Math.floor(
      (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
        today.getTime()) /
        86400000
    );

    return daysAway >= 0 && daysAway < 7;
  }).length;

  const completed = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const needsPreparation = interviews.filter(
    (item) =>
      item.status === "Scheduled" &&
      item.notes.trim().length === 0 &&
      new Date(`${item.date}T${item.time}:00`) >= now
  ).length;

  const filteredInterviews = useMemo(() => {
    return interviews
      .filter((item) => {
        const matchesSearch =
          item.company.toLowerCase().includes(search.toLowerCase()) ||
          item.role.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
          filter === "All" || item.status === filter;

        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}:00`).getTime() -
          new Date(`${b.date}T${b.time}:00`).getTime()
      );
  }, [interviews, search, filter]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (item: Interview) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      role: item.role,
      date: item.date,
      time: item.time,
      type: item.type,
      mode: item.mode,
      location: item.location,
      notes: item.notes,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!form.company.trim() || !form.role.trim() || !form.date || !form.time) {
      setFormError("Please complete the company, role, date, and time.");
      return;
    }

    if (editingId === null) {
      const newInterview: Interview = {
        ...form,
        company: form.company.trim(),
        role: form.role.trim(),
        id: Date.now(),
        status: "Scheduled",
      };

      setInterviews((current) => [...current, newInterview]);
    } else {
      setInterviews((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                company: form.company.trim(),
                role: form.role.trim(),
              }
            : item
        )
      );
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const updateStatus = (
    id: number,
    status: InterviewStatus
  ) => {
    setInterviews((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedInterview((current) =>
      current?.id === id ? { ...current, status } : current
    );
  };

  const deleteInterview = (id: number) => {
    if (!window.confirm("Delete this interview?")) return;

    setInterviews((current) =>
      current.filter((item) => item.id !== id)
    );

    setSelectedInterview((current) =>
      current?.id === id ? null : current
    );
  };

  return (
    <div className="interviews-page">
      <div className="interviews-heading">
        <div>
          <span className="interviews-eyebrow">
            YOUR INTERVIEW WORKSPACE
          </span>
          <h1>Interviews</h1>
          <p>Stay prepared and keep every interview on track.</p>
        </div>

        <button className="interview-primary-button" onClick={openAddForm}>
          <Plus size={18} />
          Add interview
        </button>
      </div>

      <div className="interview-stats">
        <StatCard
          title="Upcoming"
          value={upcoming}
          description="Scheduled in the future"
          icon={<CalendarClock size={20} />}
          color="purple"
        />
        <StatCard
          title="This week"
          value={thisWeek}
          description="Interviews in the next 7 days"
          icon={<CalendarDays size={20} />}
          color="orange"
        />
        <StatCard
          title="Completed"
          value={completed}
          description="Interviews marked completed"
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Needs preparation"
          value={needsPreparation}
          description="No preparation notes added"
          icon={<ClipboardCheck size={20} />}
          color="pink"
        />
      </div>

      <section className="interviews-card">
        <div className="interviews-card-header">
          <div>
            <h2>Interview schedule</h2>
            <p>Manage your interviews and preparation.</p>
          </div>

          <span className="interview-count">
            {filteredInterviews.length} interviews
          </span>
        </div>

        <div className="interviews-toolbar">
          <div className="interview-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search company or role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="interview-filters">
            {["All", "Scheduled", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                className={`interview-filter ${
                  filter === status ? "selected" : ""
                }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="interview-empty-state">
            <CalendarDays size={32} />
            <h3>No interviews found</h3>
            <p>Add an interview or try changing your search or filters.</p>
            <button
              className="interview-primary-button"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Schedule interview
            </button>
          </div>
        ) : (
          <div className="interview-list">
            {filteredInterviews.map((item) => (
              <article className="interview-row" key={item.id}>
                <div className="interview-company-avatar">
                  {item.company.charAt(0).toUpperCase()}
                </div>

                <div className="interview-main-info">
                  <button
                    className="interview-company-name"
                    onClick={() => setSelectedInterview(item)}
                  >
                    {item.company}
                  </button>
                  <p>{item.role}</p>

                  <div className="interview-meta">
                    <span>
                      <CalendarDays size={14} />
                      {formatDate(item.date)}
                    </span>
                    <span>
                      <Clock3 size={14} />
                      {item.time}
                    </span>
                    <span>
                      {item.mode === "Online" ? (
                        <Video size={14} />
                      ) : (
                        <MapPin size={14} />
                      )}
                      {item.mode}
                    </span>
                  </div>
                </div>

                <div className="interview-type">
                  <span>{item.type}</span>
                  <span className={`interview-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>

                <div className="interview-row-actions">
                  {item.status === "Scheduled" && (
                    <button
                      className="interview-icon-button"
                      title="Mark completed"
                      aria-label={`Mark ${item.company} interview completed`}
                      onClick={() => updateStatus(item.id, "Completed")}
                    >
                      <CheckCircle2 size={17} />
                    </button>
                  )}

                  <button
                    className="interview-icon-button"
                    title="Edit interview"
                    aria-label={`Edit ${item.company} interview`}
                    onClick={() => openEditForm(item)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="interview-icon-button delete"
                    title="Delete interview"
                    aria-label={`Delete ${item.company} interview`}
                    onClick={() => deleteInterview(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    className="interview-icon-button"
                    title="View details"
                    aria-label={`View ${item.company} interview details`}
                    onClick={() => setSelectedInterview(item)}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="interviews-footer">
          Showing {filteredInterviews.length} of {interviews.length} interviews
          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            Reset filters
          </button>
        </div>
      </section>

      {showForm && (
        <div
          className="interview-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="interview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-form-title"
          >
            <div className="interview-modal-header">
              <div>
                <h2 id="interview-form-title">
                  {editingId === null ? "Schedule an interview" : "Edit interview"}
                </h2>
                <p>Add the details you need to stay prepared.</p>
              </div>

              <button
                className="interview-icon-button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="interview-form-grid">
                <label>
                  Company *
                  <input
                    required
                    value={form.company}
                    onChange={(event) =>
                      setForm({ ...form, company: event.target.value })
                    }
                    placeholder="e.g. Google"
                  />
                </label>

                <label>
                  Job role *
                  <input
                    required
                    value={form.role}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value })
                    }
                    placeholder="e.g. Frontend Developer"
                  />
                </label>

                <label>
                  Interview date *
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm({ ...form, date: event.target.value })
                    }
                  />
                </label>

                <label>
                  Time *
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={(event) =>
                      setForm({ ...form, time: event.target.value })
                    }
                  />
                </label>

                <label>
                  Interview round
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        type: event.target.value as InterviewType,
                      })
                    }
                  >
                    <option>Technical</option>
                    <option>HR</option>
                    <option>Behavioural</option>
                    <option>Managerial</option>
                  </select>
                </label>

                <label>
                  Format
                  <select
                    value={form.mode}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        mode: event.target.value as "Online" | "In-person",
                      })
                    }
                  >
                    <option>Online</option>
                    <option>In-person</option>
                  </select>
                </label>

                <label className="interview-full-field">
                  Meeting link or location
                  <input
                    value={form.location}
                    onChange={(event) =>
                      setForm({ ...form, location: event.target.value })
                    }
                    placeholder="Meeting URL or office address"
                  />
                </label>

                <label className="interview-full-field">
                  Preparation notes
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(event) =>
                      setForm({ ...form, notes: event.target.value })
                    }
                    placeholder="Topics to revise, questions to practise..."
                  />
                </label>
              </div>

              {formError && (
                <p className="interview-form-error">{formError}</p>
              )}

              <div className="interview-form-actions">
                <button
                  type="button"
                  className="interview-secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="interview-primary-button"
                >
                  {editingId === null ? "Schedule interview" : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedInterview && (
        <div
          className="interview-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInterview(null);
            }
          }}
        >
          <section
            className="interview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-detail-title"
          >
            <div className="interview-modal-header">
              <div>
                <span className="interviews-eyebrow">INTERVIEW DETAILS</span>
                <h2 id="interview-detail-title">
                  {selectedInterview.company}
                </h2>
                <p>{selectedInterview.role}</p>
              </div>

              <button
                className="interview-icon-button"
                aria-label="Close details"
                onClick={() => setSelectedInterview(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="interview-detail-list">
              <p><CalendarDays size={17} /> {formatDate(selectedInterview.date)}</p>
              <p><Clock3 size={17} /> {selectedInterview.time}</p>
              <p><BriefcaseBusiness size={17} /> {selectedInterview.type}</p>
              <p>
                {selectedInterview.mode === "Online" ? (
                  <Video size={17} />
                ) : (
                  <MapPin size={17} />
                )}
                {selectedInterview.location || selectedInterview.mode}
              </p>
            </div>

            <h3>Preparation notes</h3>
            <p className="interview-detail-notes">
              {selectedInterview.notes || "No preparation notes added yet."}
            </p>

            <div className="interview-form-actions">
              {selectedInterview.status === "Scheduled" && (
                <button
                  className="interview-primary-button"
                  onClick={() =>
                    updateStatus(selectedInterview.id, "Completed")
                  }
                >
                  <CheckCircle2 size={17} />
                  Mark completed
                </button>
              )}

              <button
                className="interview-secondary-button"
                onClick={() => {
                  openEditForm(selectedInterview);
                  setSelectedInterview(null);
                }}
              >
                <Pencil size={16} />
                Edit details
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const StatCard = ({
  title,
  value,
  description,
  icon,
  color,
}: StatCardProps) => (
  <article className="interview-stat-card">
    <div className="interview-stat-top">
      <span>{title}</span>
      <span className={`interview-stat-icon ${color}`}>{icon}</span>
    </div>
    <strong>{String(value).padStart(2, "0")}</strong>
    <p>{description}</p>
  </article>
);

export default Interviews;
