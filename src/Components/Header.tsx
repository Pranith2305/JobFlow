
import { Bell, Search, ChevronDown } from "lucide-react";

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activePage: string; 
};

const Header = ({searchQuery, onSearchChange, activePage }: HeaderProps) => {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-separator">/</span>
        <strong>{activePage}</strong>
      </div>

      <div className="topbar-actions">
        <label className="search-box">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search applications"
          />
          <kbd>⌘ K</kbd>
        </label>

        <button className="notification-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="header-profile">
          <div className="profile-avatar header-avatar">P</div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
};

export default Header;
