import React from 'react';
import '../styles/Sidebar.css';
import { Home, GamepadIcon, Puzzle, BookOpen, Settings as SettingsIcon } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'analysis', label: 'Analysis', icon: Home },
    { id: 'games', label: 'My Games', icon: GamepadIcon },
    { id: 'puzzles', label: 'Puzzles', icon: Puzzle },
    { id: 'openings', label: 'Openings', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">♞ ChessDaddy</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <p className="version">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;