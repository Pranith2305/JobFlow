
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Clock3,
  Download,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import "./Analytics.css";

type Period = "7 days" | "30 days" | "90 days" | "All time";

type Application = {
  id: number;
  company: string;
  role: string;
  date: string;
  status: "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";
};

const demoApplications: Application[] = [
  { id: 1, company: "Nvidi", role: "Backend Developer", date: "2026-10-26", status: "Interview" },
  { id: 2, company: "Figma", role: "Product Engineer Intern", date: "2026-10-20", status: "Offer" },
  { id: 3, company: "Stripe", role: "Full-Stack Developer", date: "2026-10-18", status: "Applied" },
  { id: 4, company: "Linear", role: "Frontend Developer", date: "2026-10-16", status: "Rejected" },
  { id: 5, company: "Google", role: "Software Engineer Intern", date: "2026-10-12", status: "Applied" },
  { id: 6, company: "Notion", role: "Frontend Engineer", date: "2026-10-08", status: "Saved" },
  { id: 7, company: "Adobe", role: "Software Developer Intern", date: "2026-10-05", status: "Interview" },
  { id: 8, company: "Atlassian", role: "Graduate Engineer", date: "2026-09-28", status: "Rejected" },
  { id: 9, company: "Razorpay", role: "Backend Engineer", date: "2026-09-22", status: "Applied" },
  { id: 10, company: "Microsoft", role: "Software Engineer", date: "2026-09-15", status: "Offer" },
];

const statusColors: Record<string, string> = {
  Saved: "#9B8AFB",
  Applied: "#6556E8",
  Interview: "#E9A23B",
  Offer: "#19A879",
  Rejected: "#E4667A",
};

const formatNumber = (value: number) => String(value).padStart(2, "0");

const Analytics = () => {
  const [period, setPeriod] = useState<Period>("30 days");
  const [applications] = useState(demoApplications);

  const filteredApplications = useMemo(() => {
    if (period === "All time") return applications;

    const days = period === "7 days" ? 7 : period === "30 days" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    return applications.filter(
      (application) => new Date(`${application.date}T12:00:00`) >= cutoff
    );
  }, [applications, period]);

  const total = filteredApplications.length;

  const responded = filteredApplications.filter((application) =>
    ["Interview", "Offer", "Rejected"].includes(application.status)
  ).length;

  const interviews = filteredApplications.filter(
    (application) => application.status === "Interview" || application.status === "Offer"
  ).length;

  const offers = filteredApplications.filter(
    (application) => application.status === "Offer"
  ).length;

  const responseRate = total ? Math.round((responded / total) * 100) : 0;
  const interviewRate = total ? Math.round((interviews / total) * 100) : 0;
  const offerRate = total ? Math.round((offers / total) * 100) : 0;

  const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

  const statusCounts = statuses.map((status) => ({
    name: status,
    count: filteredApplications.filter((item) => item.status === status).length,
    color: statusColors[status],
  }));

  const statusTotal = statusCounts.reduce((sum, item) => sum + item.count, 0);

  const activity = useMemo(() => {
    const days = period === "7 days" ? 7 : period === "90 days" ? 90 : 30;

    if (period === "All time") {
      const months: { label: string; count: number }[] = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - i);

        const year = date.getFullYear();
        const month = date.getMonth();

        months.push({
          label: date.toLocaleDateString("en-IN", { month: "short" }),
          count: applications.filter((item) => {
            const applicationDate = new Date(`${item.date}T12:00:00`);
            return applicationDate.getFullYear() === year &&
              applicationDate.getMonth() === month;
          }).length,
        });
      }

      return months;
    }

    if (days === 7) {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));

        return {
          label: date.toLocaleDateString("en-IN", { weekday: "short" }),
          count: filteredApplications.filter((item) => {
            const itemDate = new Date(`${item.date}T12:00:00`);
            return itemDate.toDateString() === date.toDateString();
          }).length,
        };
      });
    }

    const bucketCount = 6;

    return Array.from({ length: bucketCount }, (_, index) => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      end.setDate(end.getDate() - Math.floor((bucketCount - 1 - index) * days / bucketCount));

      const start = new Date(end);
      start.setDate(start.getDate() - Math.ceil(days / bucketCount) + 1);
      start.setHours(0, 0, 0, 0);

      return {
        label: start.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        count: filteredApplications.filter((item) => {
          const date = new Date(`${item.date}T12:00:00`);
          return date >= start && date <= end;
        }).length,
      };
    });
  }, [applications, filteredApplications, period]);

  const maxActivity = Math.max(...activity.map((item) => item.count), 1);

  const funnel = [
    { label: "Applications", count: total, color: "#6556E8" },
    {
      label: "Company responses",
      count: responded,
      color: "#8979F4",
    },
    {
      label: "Interviews / offers",
      count: interviews,
      color: "#E9A23B",
    },
    { label: "Offers", count: offers, color: "#19A879" },
  ];

  const insights = [
    {
      icon: <Target size={18} />,
      title: "Response rate",
      description:
        total === 0
          ? "Add applications to start measuring your response rate."
          : `Companies have responded to ${responded} of your ${total} tracked applications.`,
    },
    {
      icon: <TrendingUp size={18} />,
      title: "Interview progress",
      description:
        interviews === 0
          ? "Keep tracking applications to understand your interview progress."
          : `${interviews} applications are at the interview or offer stage.`,
    },
    {
      icon: <Lightbulb size={18} />,
      title: "Suggested next step",
      description:
        filteredApplications.some((item) => item.status === "Applied")
          ? "Review pending applications and consider following up where appropriate."
          : "Keep your tracker updated to identify opportunities that need attention.",
    },
  ];

  const downloadCsv = () => {
    const header = ["Company", "Role", "Application Date", "Status"];
    const rows = filteredApplications.map((item) => [
      item.company,
      item.role,
      item.date,
      item.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "jobflow-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-page">
      <div className="analytics-heading">
        <div>
          <span className="analytics-eyebrow">
            YOUR CAREER PERFORMANCE
          </span>
          <h1>Analytics</h1>
          <p>Understand your progress and make smarter career moves.</p>
        </div>

        <div className="analytics-heading-actions">
          <label className="analytics-period-select">
            <CalendarDays size={16} />
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              aria-label="Analytics date range"
            >
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
              <option>All time</option>
            </select>
            <ChevronDown size={15} />
          </label>

          <button className="analytics-export-button" onClick={downloadCsv}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="analytics-demo-notice">
        <span className="analytics-demo-dot" />
        Demo analytics · Replace sample records with your backend data when connected.
      </div>

      <div className="analytics-kpi-grid">
        <KpiCard
          title="Total applications"
          value={total}
          subtitle={`In the selected period`}
          icon={<BriefcaseBusiness size={19} />}
          color="purple"
        />
        <KpiCard
          title="Response rate"
          value={`${responseRate}%`}
          subtitle={`${responded} applications with a response`}
          icon={<Users size={19} />}
          color="green"
        />
        <KpiCard
          title="Interview rate"
          value={`${interviewRate}%`}
          subtitle={`${interviews} at interview or offer stage`}
          icon={<CalendarDays size={19} />}
          color="orange"
        />
        <KpiCard
          title="Offers received"
          value={offers}
          subtitle={`${offerRate}% of tracked applications`}
          icon={<CircleCheck size={19} />}
          color="pink"
        />
      </div>

      <div className="analytics-chart-grid">
        <section className="analytics-panel activity-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Application activity</h2>
              <p>Applications recorded over time</p>
            </div>
            <span className="analytics-chart-legend">
              <span />
              Applications
            </span>
          </div>

          {total === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <div className="activity-chart">
                <div className="activity-y-axis">
                  {[maxActivity, Math.ceil(maxActivity / 2), 0].map((value, index) => (
                    <span key={`${value}-${index}`}>{value}</span>
                  ))}
                </div>

                <div className="activity-plot">
                  <div className="activity-grid-lines">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="activity-bars">
                    {activity.map((item, index) => (
                      <div className="activity-bar-column" key={`${item.label}-${index}`}>
                        <div className="activity-bar-track">
                          <div
                            className="activity-bar"
                            style={{
                              height: `${Math.max((item.count / maxActivity) * 100, item.count ? 5 : 0)}%`,
                            }}
                            title={`${item.count} applications`}
                          />
                        </div>
                        <span className="activity-bar-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="activity-chart-footer">
                <span><BriefcaseBusiness size={14} /> {total} total applications</span>
                <span><Clock3 size={14} /> {period}</span>
              </div>
            </>
          )}
        </section>

        <section className="analytics-panel status-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Application breakdown</h2>
              <p>Current status distribution</p>
            </div>
          </div>

          {total === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <div className="status-chart-layout">
                <div
                  className="status-donut"
                  style={{
                    background: `conic-gradient(${statusCounts
                      .map((item) => item.color)
                      .join(", ")})`,
                  }}
                >
                  <div className="status-donut-hole">
                    <strong>{formatNumber(statusTotal)}</strong>
                    <span>Applications</span>
                  </div>
                </div>

                <div className="status-legend">
                  {statusCounts.map((item) => (
                    <div className="status-legend-item" key={item.name}>
                      <span
                        className="status-legend-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="status-legend-name">{item.name}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="status-total-footer">
                <span>Applications in selected period</span>
                <strong>{total}</strong>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="analytics-bottom-grid">
        <section className="analytics-panel funnel-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Hiring funnel</h2>
              <p>Track progression through your job search</p>
            </div>
          </div>

          {funnel.map((item, index) => {
            const width = total ? (item.count / total) * 100 : 0;
            const previous = funnel[index - 1]?.count;
            const conversion = previous
              ? Math.round((item.count / previous) * 100)
              : null;

            return (
              <div className="funnel-item" key={item.label}>
                <div className="funnel-item-heading">
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="funnel-track">
                  <div
                    className="funnel-bar"
                    style={{
                      width: `${width}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <div className="funnel-item-footer">
                  <span>{total ? Math.round((item.count / total) * 100) : 0}% of applications</span>
                  {conversion !== null && (
                    <span>{conversion}% of previous stage</span>
                  )}
                </div>
              </div>
            );
          })}
          <p className="analytics-method-note">
            Funnel stages are estimated from application statuses. Update your
            tracking rules as your interview workflow becomes more detailed.
          </p>
        </section>

        <section className="analytics-panel insights-panel">
          <div className="analytics-panel-heading">
            <div>
              <h2>Career insights</h2>
              <p>Suggestions based on your tracked data</p>
            </div>
            <span className="insights-sparkle">
              <Lightbulb size={18} />
            </span>
          </div>

          <div className="insights-list">
            {insights.map((insight) => (
              <article className="insight-item" key={insight.title}>
                <div className="insight-icon">{insight.icon}</div>
                <div>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="insights-callout">
            <Target size={19} />
            <div>
              <strong>Stay consistent</strong>
              <p>Keep application statuses updated to get more meaningful insights.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="analytics-panel recent-activity-panel">
        <div className="analytics-panel-heading">
          <div>
            <h2>Recent applications</h2>
            <p>Latest records included in your analysis</p>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="analytics-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Company / Role</th>
                  <th>Date applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredApplications]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 5)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="analytics-company-cell">
                          <span>{item.company.charAt(0)}</span>
                          <div>
                            <strong>{item.company}</strong>
                            <p>{item.role}</p>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</td>
                      <td>
                        <span className={`analytics-status-badge ${item.status.toLowerCase()}`}>
                          <span />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="analytics-footer">
        <span>Metrics are calculated from the selected application records.</span>
        <span>JobFlow Analytics</span>
      </footer>
    </div>
  );
};

type KpiCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
};

const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}: KpiCardProps) => (
  <article className="analytics-kpi-card">
    <div className="analytics-kpi-top">
      <span>{title}</span>
      <span className={`analytics-kpi-icon ${color}`}>{icon}</span>
    </div>
    <strong className="analytics-kpi-value">{value}</strong>
    <p>{subtitle}</p>
  </article>
);

const EmptyChart = () => (
  <div className="analytics-empty-chart">
    <TrendingUp size={28} />
    <strong>No data for this period</strong>
    <span>Try a different date range or add applications.</span>
  </div>
);

export default Analytics;
