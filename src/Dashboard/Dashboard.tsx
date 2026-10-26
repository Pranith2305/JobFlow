
import { useState } from "react";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import StatsCards from "../Components/StatsCards";
import ApplicationList from "../Components/ApplicationList";
import Interviews from "../interview/interview";
import Analytics from "../Analytics/Analytics";
import AIAssistant from "../AIAssistant/AIAssistant";
import Settings from "../Settings/Settings";
import HelpSupport from "../HelpSupport/HelpSupport";

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
  
const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  

   const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        applications={applications}
      />

      <main className="main-area">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePage={activePage}
        />

        <div className="dashboard-content">
        {activePage === "Dashboard" && (
              <div className="welcome-row">
            <div>
              <div className="welcome-eyebrow">
                <span className="welcome-dot" />
                YOUR CAREER WORKSPACE
              </div>

              <h1>
                Good evening, <span>there</span> 👋
              </h1>

              <p className="welcome-description">
                Here's what's happening with your job search.
              </p>
            </div>

            <button
              className="date-button"
              type="button"
            >
              <CalendarDays size={16} />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </button>
          </div>
        )}

          {activePage === "Dashboard" ? (
            <>
              <StatsCards />

              <ApplicationList
                searchQuery={searchQuery}
                applications={applications}
                setApplications={setApplications}
              />

              <section className="ai-banner">
                <div className="ai-banner-icon">
                  <Sparkles size={23} />
                </div>

                <div className="ai-banner-copy">
                  <span className="ai-eyebrow">YOUR AI CAREER ASSISTANT</span>
                  <h3>Make every application count.</h3>
                  <p>
                    Get insights to improve your resume and prepare for
                    your next interview.
                  </p>
                </div>

                <button
                  className="ai-banner-button"
                  onClick={() => setActivePage("AI Assistant")}
                >
                  Explore AI tools
                  <ArrowRight size={16} />
                </button>
              </section>
            </>
          ) : activePage === "Applications" ? (
            <>
            <ApplicationList
                searchQuery={searchQuery}
                applications={applications}
                setApplications={setApplications}
              />
            </>
          ) : activePage === "Interviews" ? (
            <Interviews />
          ) : activePage === "Analytics" ? (
            <Analytics/>
          ) : activePage === "AI Assistant" ? (
            <AIAssistant />
          ) : activePage === "Settings" ? (
            <Settings />
          ) : activePage === "Help&Support" ? (
            <HelpSupport />
          ) :(
            <section className="placeholder-page">
              <div className="placeholder-icon">
                <Sparkles size={25} />
              </div>
              <h2>{activePage}</h2>
              <p>
                This section is part of the next stage of JobFlow.
                The dashboard is ready for you to extend it.
              </p>
              <button
                className="primary-button"
                onClick={() => setActivePage("Dashboard")}
              >
                Back to dashboard
              </button>
            </section>
          )}

          <footer className="dashboard-footer">
            <span>© 2026 JobFlow</span>
            <span>Built for your next opportunity.</span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
