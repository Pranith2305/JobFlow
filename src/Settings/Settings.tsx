
import { useEffect, useState } from "react";
import {
  UserRound,
  Bell,
  Palette,
  BriefcaseBusiness,
  ShieldCheck,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";
import "./Settings.css";

type Preferences = {
  fullName: string;
  email: string;
  headline: string;
  targetRole: string;
  jobType: string;
  location: string;
  theme: string;
  emailNotifications: boolean;
  interviewReminders: boolean;
  applicationUpdates: boolean;
  weeklySummary: boolean;
};

const defaultPreferences: Preferences = {
  fullName: "Job Seeker",
  email: "",
  headline: "",
  targetRole: "",
  jobType: "Full-time",
  location: "",
  theme: "Light",
  emailNotifications: true,
  interviewReminders: true,
  applicationUpdates: true,
  weeklySummary: false,
};

const STORAGE_KEY = "jobflow-settings-v1";

const Settings = () => {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [activeSection, setActiveSection] = useState("Profile");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences({
          ...defaultPreferences,
          ...JSON.parse(stored),
        });
      }
    } catch {
      // Use defaults if stored preferences are unavailable.
    }
  }, []);

  const update = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setSaved(true);
    } catch {
      window.alert("Could not save settings in this browser.");
    }
  };

  const resetSettings = () => {
    if (!window.confirm("Reset all settings to their default values?")) return;

    setPreferences(defaultPreferences);
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  };

  const sections = [
    { name: "Profile", icon: UserRound },
    { name: "Preferences", icon: BriefcaseBusiness },
    { name: "Notifications", icon: Bell },
    { name: "Appearance", icon: Palette },
    { name: "Privacy", icon: ShieldCheck },
  ];

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <span className="settings-eyebrow">PERSONALIZE YOUR WORKSPACE</span>
          <h1>Settings</h1>
          <p>Manage your profile, preferences, and JobFlow experience.</p>
        </div>
        <button className="settings-save-button" onClick={saveSettings}>
          {saved ? <Check size={17} /> : <Save size={17} />}
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>

      <div className="settings-layout">
        <aside className="settings-navigation">
          <span className="settings-nav-label">SETTINGS MENU</span>

          {sections.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`settings-nav-item ${
                activeSection === name ? "active" : ""
              }`}
              onClick={() => setActiveSection(name)}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}

          <div className="settings-nav-help">
            <ShieldCheck size={19} />
            <strong>Your workspace, your rules.</strong>
            <p>Keep your preferences up to date as your job search evolves.</p>
          </div>
        </aside>

        <main className="settings-content">
          {activeSection === "Profile" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-section-icon"><UserRound size={19} /></span>
                <div>
                  <h2>Profile information</h2>
                  <p>Manage the personal details displayed in JobFlow.</p>
                </div>
              </div>

              <div className="settings-avatar-row">
                <div className="settings-avatar">
                  {preferences.fullName.trim().charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <strong>{preferences.fullName || "Your name"}</strong>
                  <p>Your JobFlow profile</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label>
                  Full name
                  <input
                    value={preferences.fullName}
                    onChange={(event) => update("fullName", event.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    value={preferences.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="settings-full-field">
                  Professional headline
                  <input
                    value={preferences.headline}
                    onChange={(event) => update("headline", event.target.value)}
                    placeholder="e.g. Aspiring Software Engineer"
                  />
                </label>
              </div>
            </section>
          )}

          {activeSection === "Preferences" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-section-icon"><BriefcaseBusiness size={19} /></span>
                <div>
                  <h2>Job search preferences</h2>
                  <p>Keep your career goals and opportunity preferences in one place.</p>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="settings-full-field">
                  Target role
                  <input
                    value={preferences.targetRole}
                    onChange={(event) => update("targetRole", event.target.value)}
                    placeholder="e.g. Frontend Developer"
                  />
                </label>
                <label>
                  Preferred job type
                  <select
                    value={preferences.jobType}
                    onChange={(event) => update("jobType", event.target.value)}
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Any</option>
                  </select>
                </label>
                <label>
                  Preferred location
                  <input
                    value={preferences.location}
                    onChange={(event) => update("location", event.target.value)}
                    placeholder="e.g. Bengaluru, Remote"
                  />
                </label>
              </div>
            </section>
          )}

          {activeSection === "Notifications" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-section-icon"><Bell size={19} /></span>
                <div>
                  <h2>Notifications</h2>
                  <p>Choose the updates you want to receive.</p>
                </div>
              </div>

              <div className="settings-toggle-list">
                <ToggleRow
                  title="Email notifications"
                  description="Receive relevant JobFlow updates by email when supported."
                  checked={preferences.emailNotifications}
                  onChange={(value) => update("emailNotifications", value)}
                />
                <ToggleRow
                  title="Interview reminders"
                  description="Keep interview reminders enabled in your preferences."
                  checked={preferences.interviewReminders}
                  onChange={(value) => update("interviewReminders", value)}
                />
                <ToggleRow
                  title="Application updates"
                  description="Keep track of changes to your application pipeline."
                  checked={preferences.applicationUpdates}
                  onChange={(value) => update("applicationUpdates", value)}
                />
                <ToggleRow
                  title="Weekly summary"
                  description="Opt in to a weekly job-search summary preference."
                  checked={preferences.weeklySummary}
                  onChange={(value) => update("weeklySummary", value)}
                />
              </div>
              <p className="settings-inline-note">
                These are saved preferences. Actual emails and reminders require backend notification services.
              </p>
            </section>
          )}

          {activeSection === "Appearance" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-section-icon"><Palette size={19} /></span>
                <div>
                  <h2>Appearance</h2>
                  <p>Choose how you prefer to view your workspace.</p>
                </div>
              </div>

              <div className="settings-theme-grid">
                {[
                  { name: "Light", icon: Sun, description: "Bright workspace" },
                  { name: "Dark", icon: Moon, description: "Low-light workspace" },
                  { name: "System", icon: Monitor, description: "Follow device preference" },
                ].map(({ name, icon: Icon, description }) => (
                  <button
                    key={name}
                    className={`settings-theme-option ${
                      preferences.theme === name ? "selected" : ""
                    }`}
                    onClick={() => update("theme", name)}
                  >
                    <Icon size={22} />
                    <strong>{name}</strong>
                    <span>{description}</span>
                    {preferences.theme === name && (
                      <span className="settings-theme-check"><Check size={14} /></span>
                    )}
                  </button>
                ))}
              </div>

              <p className="settings-inline-note">
                Theme selection is saved here. Applying dark or system themes across the app requires connecting this preference to your global CSS theme.
              </p>
            </section>
          )}

          {activeSection === "Privacy" && (
            <section className="settings-card">
              <div className="settings-card-heading">
                <span className="settings-section-icon"><ShieldCheck size={19} /></span>
                <div>
                  <h2>Privacy & data</h2>
                  <p>Understand where your current preferences are stored.</p>
                </div>
              </div>

              <div className="settings-privacy-item">
                <ShieldCheck size={19} />
                <div>
                  <strong>Local browser preferences</strong>
                  <p>
                    Your settings are stored in this browser using localStorage.
                    They are not currently synced to an account or database.
                  </p>
                </div>
              </div>

              <div className="settings-privacy-item">
                <BriefcaseBusiness size={19} />
                <div>
                  <strong>Application and resume data</strong>
                  <p>
                    This page does not delete application records, uploaded files,
                    or server-side account data.
                  </p>
                </div>
              </div>

              <div className="settings-danger-zone">
                <div>
                  <strong>Reset local settings</strong>
                  <p>Restore this page's preferences to their defaults.</p>
                </div>
                <button className="settings-reset-button" onClick={resetSettings}>
                  <RotateCcw size={15} />
                  Reset settings
                </button>
              </div>
            </section>
          )}

          <div className="settings-bottom-actions">
            <span>Remember to save your changes.</span>
            <button className="settings-save-button" onClick={saveSettings}>
              <Save size={16} />
              Save changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

type ToggleRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ToggleRow = ({
  title,
  description,
  checked,
  onChange,
}: ToggleRowProps) => (
  <div className="settings-toggle-row">
    <div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      className={`settings-switch ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  </div>
);

export default Settings;
