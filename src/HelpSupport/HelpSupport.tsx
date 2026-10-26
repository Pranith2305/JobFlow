
import { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Sparkles,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Mail,
  Send,
  CircleHelp,
  LifeBuoy,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import "./HelpSupport.css";

const faqs = [
  {
    category: "Getting started",
    question: "What is JobFlow?",
    answer:
      "JobFlow helps you organize job applications, track interview stages, prepare for interviews, and review your job-search progress from one workspace.",
  },
  {
    category: "Applications",
    question: "How do I add a job application?",
    answer:
      "Open Applications from the sidebar and choose Add application. Enter the company, role, status, and any other available details. Save the record to add it to your tracker.",
  },
  {
    category: "Applications",
    question: "What do the application statuses mean?",
    answer:
      "Saved means you are keeping an opportunity for later. Applied means you have submitted an application. Interview means you are in an interview stage. Offer means you have received an offer. Rejected means the application did not progress.",
  },
  {
    category: "Interviews",
    question: "How do I schedule an interview?",
    answer:
      "Open Interviews, choose Add interview, and enter the company, role, date, time, interview type, format, and preparation notes.",
  },
  {
    category: "Analytics",
    question: "How is the response rate calculated?",
    answer:
      "In this prototype, the response rate counts applications marked Interview, Offer, or Rejected as responses, divided by the number of tracked applications in the selected period. This is a simplified metric and can be refined as the product evolves.",
  },
  {
    category: "AI Assistant",
    question: "Are AI Assistant results real AI responses?",
    answer:
      "The current prototype uses sample logic and templates for demonstration. Real AI analysis requires a backend endpoint connected to an AI provider. Do not treat demo output as a genuine AI assessment.",
  },
  {
    category: "Account & privacy",
    question: "Are my settings saved?",
    answer:
      "The current Settings page stores preferences in your browser. They are not yet synchronized with an account or database, and may not follow you to another browser or device.",
  },
  {
    category: "Account & privacy",
    question: "Will my applications remain after refreshing?",
    answer:
      "Some prototype features use temporary React state, which resets when the page reloads. Persistent storage requires the backend and database integration.",
  },
];

const categories = [
  {
    title: "Getting started",
    description: "Learn the basics of JobFlow.",
    icon: BookOpen,
    color: "purple",
  },
  {
    title: "Applications",
    description: "Manage your job pipeline.",
    icon: BriefcaseBusiness,
    color: "green",
  },
  {
    title: "Interviews",
    description: "Schedule and prepare for interviews.",
    icon: CalendarDays,
    color: "orange",
  },
  {
    title: "AI Assistant",
    description: "Understand the career tools.",
    icon: Sparkles,
    color: "pink",
  },
];

const HelpSupport = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All topics");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0].question);
  const [showContactForm, setShowContactForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General question");
  const [message, setMessage] = useState("");

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All topics" || faq.category === activeCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const selectCategory = (category: string) => {
    setActiveCategory(category);
    setOpenFaq(null);
    document.getElementById("help-faq-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const submitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError("Please complete your name, email, and message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address.");
      return;
    }

    // Demo only: no ticket or email is sent.
    setSubmitted(true);
  };

  const resetContactForm = () => {
    setShowContactForm(false);
    setSubmitted(false);
    setFormError("");
    setName("");
    setEmail("");
    setTopic("General question");
    setMessage("");
  };

  return (
    <div className="help-page">
      <section className="help-hero">
        <span className="help-eyebrow">
          <LifeBuoy size={15} /> JOBFLOW SUPPORT CENTER
        </span>
        <h1>How can we help?</h1>
        <p>
          Find answers, learn how to use JobFlow, and get help with your job search workspace.
        </p>

        <label className="help-hero-search">
          <Search size={19} />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setActiveCategory("All topics");
            }}
            placeholder="Search help articles and FAQs..."
            aria-label="Search help articles"
          />
          <span>{filteredFaqs.length} results</span>
        </label>
      </section>

      <section className="help-category-section">
        <div className="help-section-heading">
          <div>
            <h2>Browse by topic</h2>
            <p>Jump straight to the help you need.</p>
          </div>
        </div>

        <div className="help-category-grid">
          {categories.map(({ title, description, icon: Icon, color }) => (
            <button
              key={title}
              className="help-category-card"
              onClick={() => selectCategory(title)}
            >
              <span className={`help-category-icon ${color}`}>
                <Icon size={21} />
              </span>
              <strong>{title}</strong>
              <p>{description}</p>
              <ChevronRight size={17} className="help-category-arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="help-faq-panel" id="help-faq-section">
        <div className="help-section-heading help-faq-heading">
          <div>
            <h2>Frequently asked questions</h2>
            <p>Quick answers to common questions.</p>
          </div>

          <select
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
            aria-label="Filter FAQ category"
          >
            <option>All topics</option>
            <option>Getting started</option>
            <option>Applications</option>
            <option>Interviews</option>
            <option>Analytics</option>
            <option>AI Assistant</option>
            <option>Account & privacy</option>
          </select>
        </div>

        <div className="help-faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="help-no-results">
              <CircleHelp size={28} />
              <strong>No matching articles</strong>
              <p>Try a different search phrase or choose All topics.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All topics");
                }}
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.question;

              return (
                <article className="help-faq-item" key={faq.question}>
                  <button
                    className="help-faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={isOpen ? "expanded" : ""}
                    />
                  </button>

                  {isOpen && (
                    <div className="help-faq-answer">
                      <p>{faq.answer}</p>
                      <span>{faq.category}</span>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="help-getting-started">
        <div className="help-started-icon"><Sparkles size={23} /></div>
        <div className="help-started-copy">
          <h2>New to JobFlow?</h2>
          <p>Start by adding your applications, tracking interview dates, and reviewing your progress in Analytics.</p>
        </div>
        <button
          onClick={() => {
            setSearch("add a job application");
            setActiveCategory("All topics");
            setOpenFaq("How do I add a job application?");
            document.getElementById("help-faq-section")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          Get started <ArrowRight size={16} />
        </button>
      </section>

      <section className="help-contact-panel">
        <div className="help-contact-icon"><MessageCircle size={22} /></div>
        <div className="help-contact-copy">
          <h2>Still need a hand?</h2>
          <p>Tell us what you need help with using the support request form.</p>
          <span><Mail size={14} /> Support requests are in demo mode</span>
        </div>
        <button
          className="help-contact-button"
          onClick={() => {
            setShowContactForm(true);
            setSubmitted(false);
            setFormError("");
          }}
        >
          Contact support <ArrowRight size={16} />
        </button>
      </section>

      {showContactForm && (
        <div
          className="help-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) resetContactForm();
          }}
        >
          <section
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-contact-title"
          >
            {submitted ? (
              <div className="help-success-state">
                <span><CheckCircle2 size={30} /></span>
                <h2>Request validated</h2>
                <p>
                  Your form passed validation. This prototype has not sent an email
                  or created a support ticket.
                </p>
                <button className="help-submit-button" onClick={resetContactForm}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="help-modal-heading">
                  <div>
                    <h2 id="help-contact-title">Contact support</h2>
                    <p>Describe the issue so the team can understand it.</p>
                  </div>
                  <button
                    className="help-modal-close"
                    aria-label="Close support form"
                    onClick={resetContactForm}
                  >
                    ×
                  </button>
                </div>

                <form className="help-contact-form" onSubmit={submitRequest}>
                  <label>
                    Your name *
                    <input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                    />
                  </label>

                  <label>
                    Email address *
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                    />
                  </label>

                  <label>
                    Topic
                    <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                      <option>General question</option>
                      <option>Applications</option>
                      <option>Interviews</option>
                      <option>Analytics</option>
                      <option>AI Assistant</option>
                      <option>Account & privacy</option>
                      <option>Report a bug</option>
                    </select>
                  </label>

                  <label>
                    How can we help? *
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Describe your question or issue..."
                    />
                  </label>

                  {formError && <p className="help-form-error">{formError}</p>}

                  <div className="help-form-actions">
                    <button
                      type="button"
                      className="help-cancel-button"
                      onClick={resetContactForm}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="help-submit-button">
                      <Send size={15} /> Validate request
                    </button>
                  </div>

                  <p className="help-demo-disclaimer">
                    Demo only: details are not sent or saved to a server.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      )}

      <footer className="help-footer">
        <span>JobFlow Help Center</span>
        <span>Built for your next opportunity.</span>
      </footer>
    </div>
  );
};

export default HelpSupport;
