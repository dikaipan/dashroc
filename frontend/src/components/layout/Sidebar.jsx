import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { BarChart, Cpu, Users, TrendingUp, Info, Package, GitBranch, Tool, Menu, X } from "react-feather";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";

const Sidebar = () => {
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: "dashboard", path: "/dashboard", icon: BarChart, label: "Dashboard" },
    { id: "engineers", path: "/engineers", icon: Users, label: "Engineer" },
    { id: "machines", path: "/machines", icon: Cpu, label: "Mesin" },
    { id: "stockpart", path: "/stockpart", icon: Package, label: "Stock Part" },
    { id: "toolbox", path: "/toolbox", icon: Tool, label: "Toolbox" },
    { id: "structure", path: "/structure", icon: GitBranch, label: "Structure" },
    { id: "decision", path: "/decision", icon: TrendingUp, label: "Decision", badge: "BETA" },
    { id: "about", path: "/about", icon: Info, label: "About" }
  ];

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Header Bar */}
        <div className="mobile-header">
          <div className="mobile-logo">ROC DASH</div>
          {!isMobileMenuOpen && (
            <button 
              className="mobile-menu-toggle" 
              onClick={handleToggle}
              aria-label="Toggle mobile menu"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="mobile-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="sidebar mobile-sidebar mobile-open">
              <div className="sidebar-header">
                <div className="logo">ROC DASH</div>
                <button 
                  className="sidebar-toggle-btn" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <X size={18} />
                </button>
              </div>
              
              <nav className="sidebar-nav" aria-label="Main navigation">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => {
                        if (isMobile) setIsMobileMenuOpen(false);
                      }}
                      className={({ isActive }) => `
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                            : isDark
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active indicator */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
                          )}
                          
                          <div className="relative z-10 flex items-center gap-3 flex-1">
                            <Icon 
                              size={20} 
                              className={`${
                                isActive 
                                  ? 'text-white' 
                                  : isDark 
                                    ? 'text-slate-400 group-hover:text-blue-400'
                                    : 'text-gray-600 group-hover:text-blue-600'
                              } transition-colors`}
                            />
                            {!isCollapsed && (
                              <span className={`font-medium ${
                                isActive 
                                  ? 'text-white' 
                                  : isDark 
                                    ? 'text-slate-300'
                                    : 'text-gray-700'
                              }`}>
                                {item.label}
                              </span>
                            )}
                          </div>
                          
                          {/* Badge */}
                          {!isCollapsed && item.badge && (
                            <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500 text-black">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
              
              <div className="sidebar-theme-toggle">
                <ThemeToggle className="w-full" />
              </div>
            </aside>
          </>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed ? (
          <>
            <div className="logo">ROC DASH</div>
            <div 
              className="sidebar-toggle-btn" 
              onClick={handleToggle}
              aria-label="Toggle sidebar"
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle();
                }
              }}
            >
              <X size={18} />
            </div>
          </>
        ) : (
          <>
            <div className="logo-icon">RD</div>
            <div 
              className="sidebar-toggle-btn" 
              onClick={handleToggle}
              aria-label="Toggle sidebar"
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle();
                }
              }}
            >
              <Menu size={18} />
            </div>
          </>
        )}
      </div>
      
      <nav className="sidebar-nav" aria-label="Main navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
              title={item.label}
            >
              <span className="icon"><Icon size={20} strokeWidth={2}/></span>
              {!isCollapsed && (
                <span className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">
                      {item.badge}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);