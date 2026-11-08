
import React from "react";
import {
  Wallet,
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Settings,
  CircleHelp,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <Wallet size={30} />
        <h2>SpendWise</h2>
      </div>

      <p className="menu-heading">MENU</p>

      <nav className="sidebar-menu">

        <a href="/" className="menu-item active">
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a href="/transactions" className="menu-item">
          <ArrowLeftRight size={20} />
          Transactions
        </a>

        <a href="/analytics" className="menu-item">
          <ChartNoAxesCombined size={20} />
          Analytics
        </a>

      </nav>

      <div className="sidebar-bottom">

        <a href="/settings" className="menu-item">
          <Settings size={20} />
          Settings
        </a>

        <a href="/help" className="menu-item">
          <CircleHelp size={20} />
          Help & Support
        </a>

      </div>

    </aside>
  );
}

export default Sidebar;
