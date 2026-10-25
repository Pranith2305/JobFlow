
import { useState } from "react";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import StatsCards from "../Components/StatsCards";
import ApplicationList from "../Components/ApplicationList";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-area">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="dashboard-content">
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

          {activePage === "Dashboard" ||
          activePage === "Applications" ? (
            <>
              <StatsCards />

              <ApplicationList
                searchQuery={searchQuery}
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
          ) : (
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
