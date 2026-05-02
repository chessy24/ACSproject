import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import backendUrl from "../../config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function SalesReport() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    const res = await fetch(
      `${backendUrl}/api/reports/sales?from=${from}&to=${to}`
    );
    const data = await res.json();
    setReport(data);
  };

  const chartData = report
    ? Object.entries(report.dailySales).map(([date, value]) => ({
        date,
        revenue: value,
      }))
    : [];

  const downloadPDF = async () => {
    const input = document.getElementById("reportContent");

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("sales-report.pdf");
  };

  return (
    <div style={styles.page}>
      <h1 style={{ color: "#000" }}>📊 Sales Report</h1>

      {/* FILTER BAR */}
      <div style={styles.filterBox}>
        <input
          type="date"
          style={styles.input}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          style={styles.input}
          onChange={(e) => setTo(e.target.value)}
        />

        <button style={styles.button} onClick={fetchReport}>
          Generate Report
        </button>
      </div>

      {report && (
        <>
          <button style={styles.pdfBtn} onClick={downloadPDF}>
            Download PDF
          </button>

          <div id="reportContent" style={styles.reportContainer}>
            {/* SUMMARY CARDS */}
            <div style={styles.cards}>
              <div style={styles.card}>
                <h3>Revenue</h3>
                <p>₱{report.totalRevenue}</p>
              </div>

              <div style={styles.card}>
                <h3>Orders</h3>
                <p>{report.totalOrders}</p>
              </div>

              <div style={styles.card}>
                <h3>Items Sold</h3>
                <p>{report.totalItemsSold}</p>
              </div>
            </div>

            {/* CHART */}
            <div style={styles.chartBox}>
              <h2 style={{ color: "#000" }}>Revenue Analytics</h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* TOP PRODUCTS */}
            <div style={styles.section}>
              <h2 style={{ color: "#000" }}>🔥 Top Products</h2>

              {report.topProducts.map((p, i) => (
                <div key={i} style={styles.productItem}>
                  {p.name} <span>({p.qty} sold)</span>
                </div>
              ))}
            </div>

            {/* ORDERS TABLE */}
            <div style={styles.section}>
              <h2 style={{ color: "#000" }}>📦 Orders</h2>
              {report.orders.map((o) => (
                <div key={o._id} style={styles.orderItem}>
                  <span>#{o._id.slice(-6)}</span>
                  <span>₱{o.total}</span>
                  <span>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   STYLES (CLEAN DASHBOARD UI)
========================= */
const styles = {
  page: {
    padding: "25px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  filterBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  pdfBtn: {
    background: "#111",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "15px",
    border: "none",
    cursor: "pointer",
  },

  reportContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  card: {
    flex: 1,
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  chartBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#fff",
    borderRadius: "10px",
  },

  section: {
    marginTop: "25px",
  },

  productItem: {
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
};