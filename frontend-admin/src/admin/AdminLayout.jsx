import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./components/Sidebar";

const SIDEBAR_WIDTH = 150;

export default function AdminLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          marginLeft: open ? `${SIDEBAR_WIDTH}px` : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* NAVBAR */}
        <AdminNavbar open={open} />

        {/* PAGE CONTENT */}
        <div style={{ padding: "20px", marginTop: "60px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}