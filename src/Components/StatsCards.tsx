
import {
  BriefcaseBusiness,
  CalendarCheck,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Applications",
    value: "24",
    change: "+12.5%",
    note: "vs. last month",
    positive: true,
    icon: BriefcaseBusiness,
    color: "violet",
    detail: "Keep your momentum going",
  },
  {
    title: "Interviews",
    value: "08",
    change: "+33.3%",
    note: "vs. last month",
    positive: true,
    icon: CalendarCheck,
    color: "blue",
    detail: "2 coming up this week",
  },
  {
    title: "Offers Received",
    value: "02",
    change: "+1",
    note: "vs. last month",
    positive: true,
    icon: Trophy,
    color: "green",
    detail: "You're making progress",
  },
  {
    title: "Response Rate",
    value: "38%",
    change: "-2.4%",
    note: "vs. last month",
    positive: false,
    icon: TrendingUp,
    color: "orange",
    detail: "Based on tracked applications",
  },
];

const StatsCards = () => {
  return (
    <section className="stats-grid" aria-label="Job search statistics">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const ChangeIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

        return (
          <article className="stat-card" key={stat.title}>
            <div className="stat-card-top">
              <span className="stat-title">{stat.title}</span>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={19} strokeWidth={1.8} />
              </div>
            </div>

            <div className="stat-value">{stat.value}</div>

            <div className="stat-comparison">
              <span
                className={`stat-change ${
                  stat.positive ? "positive" : "negative"
                }`}
              >
                <ChangeIcon size={14} />
                {stat.change}
              </span>
              <span className="stat-note">{stat.note}</span>
            </div>

            <p className="stat-detail">{stat.detail}</p>
          </article>
        );
      })}
    </section>
  );
};

export default StatsCards;
