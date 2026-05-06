import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./components/Sidebar";

const SIDEBAR_WIDTH = 150;

export default function AdminLayout() {
  const [open, setOpen] = useState(() => window.innerWidth > 768);

  // 🔥 GLOBAL SCROLL LOCK WHEN SIDEBAR OPENS
  useEffect(() => {
    const root = document.getElementById("root");

    if (open) {
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");

      if (root) root.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");

      if (root) root.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");

      if (root) root.classList.remove("no-scroll");
    };
  }, [open]);

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* RIGHT SIDE */}
      <div
        className="admin-content"
        style={{
          marginLeft: open ? `${SIDEBAR_WIDTH}px` : "0px",
        }}
      >
        {/* NAVBAR */}
        <AdminNavbar open={open} />

        {/* PAGE CONTENT */}
        <div className="admin-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}