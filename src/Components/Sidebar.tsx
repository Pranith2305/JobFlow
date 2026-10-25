
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumn,
  Settings,
  CircleHelp,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Applications", icon: BriefcaseBusiness },
    { label: "Interviews", icon: CalendarDays },
    { label: "Analytics", icon: ChartNoAxesColumn },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <BriefcaseBusiness size={21} />
        </div>
        <span>jobflow</span>
        <button className="icon-button sidebar-collapse" aria-label="Sidebar">
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="workspace-switcher">
        <div className="workspace-avatar">J</div>
        <div className="workspace-info">
          <strong>Personal Workspace</strong>
          <span>Free plan</span>
        </div>
        <span className="workspace-chevron">⌄</span>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${
              activePage === label ? "active" : ""
            }`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {label === "Applications" && (
              <span className="nav-count">12</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-section-label tools-label">TOOLS</div>

      <button
        className={`nav-item ${
          activePage === "AI Assistant" ? "active" : ""
        }`}
        onClick={() => onNavigate("AI Assistant")}
      >
        <Sparkles size={18} strokeWidth={1.8} />
        <span>AI Assistant</span>
        <span className="new-badge">NEW</span>
      </button>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon">
            <Sparkles size={18} />
          </div>
          <strong>Make your next move</strong>
          <p>Get smarter insights into your job search.</p>
          <button onClick={() => onNavigate("AI Assistant")}>
            Explore AI tools <span>↗</span>
          </button>
        </div>

        <button
          className={`nav-item ${
            activePage === "Settings" ? "active" : ""
          }`}
          onClick={() => onNavigate("Settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className={`nav-item ${
            activePage === "Help & Support" ? "active" : ""
          }`}
          onClick={() => onNavigate("Help & Support")}
        >
          <CircleHelp size={18} />
          <span>Help & Support</span>
        </button>

        <div className="sidebar-profile">
          <div className="profile-avatar">P</div>
          <div className="profile-details">
            <strong>Your Profile</strong>
            <span>Job seeker</span>
          </div>
          <span className="profile-menu">•••</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
