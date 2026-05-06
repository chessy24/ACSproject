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

  const isDisabled = !from || !to || from > to;

  const fetchReport = async () => {
    if (isDisabled) return;

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
      <h1 style={{ ...styles.title, color: "#000" }}>
        📊 Sales Report
      </h1>

      {/* FILTER */}
      <div style={styles.filterBox}>
        <div style={styles.inputGroup}>
          <label>From</label>
          <input
            type="date"
            style={styles.input}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>To</label>
          <input
            type="date"
            style={styles.input}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button
          style={{
            ...styles.button,
            opacity: isDisabled ? 0.5 : 1,
          }}
          onClick={fetchReport}
          disabled={isDisabled}
        >
          Generate
        </button>
      </div>

      {report && (
        <>
          <button style={styles.pdfBtn} onClick={downloadPDF}>
            Download PDF
          </button>

          <div id="reportContent" style={styles.reportContainer}>
            {/* CARDS */}
            <div style={styles.cards}>
              <div style={styles.card}>
                <h4>Revenue</h4>
                <p>₱{report.totalRevenue}</p>
              </div>

              <div style={styles.card}>
                <h4>Orders</h4>
                <p>{report.totalOrders}</p>
              </div>

              <div style={styles.card}>
                <h4>Items</h4>
                <p>{report.totalItemsSold}</p>
              </div>
            </div>

            {/* CHART */}
            <div style={styles.chartBox}>
              <h3>Revenue Analytics</h3>

              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP PRODUCTS */}
            <div style={styles.section}>
              <h3>🔥 Top Products</h3>

              {report.topProducts.map((p, i) => (
                <div key={i} style={styles.productItem}>
                  <span>{p.name}</span>
                  <span>{p.qty} sold</span>
                </div>
              ))}
            </div>

            {/* ORDERS */}
            <div style={styles.section}>
              <h3>📦 Orders</h3>

              <div style={styles.orderList}>
                {report.orders.map((o) => (
                  <div key={o._id} style={styles.orderItem}>
                    <div>#{o._id.slice(-6)}</div>
                    <div>₱{o.total}</div>
                    <div>{o.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   MOBILE-FIRST STYLES
========================= */
const styles = {
  page: {
    padding: "15px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: "20px",
    marginBottom: "15px",
  },

  filterBox: {
    display: "flex",
    flexDirection: "column", // ✅ stack on mobile
    gap: "10px",
    marginBottom: "15px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    background: "#3b82f6",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
  },

  pdfBtn: {
    width: "100%",
    background: "#111",
    color: "#fff",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    border: "none",
  },

  reportContainer: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
  },

  cards: {
    display: "flex",
    flexDirection: "column", // ✅ stack on mobile
    gap: "10px",
  },

  card: {
    background: "#f9fafb",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
  },

  chartBox: {
    marginTop: "15px",
  },

  section: {
    marginTop: "20px",
  },

  productItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  orderList: {
    overflowX: "auto", // ✅ scroll if needed
  },

  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    minWidth: "250px", // ✅ prevents squish
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
};