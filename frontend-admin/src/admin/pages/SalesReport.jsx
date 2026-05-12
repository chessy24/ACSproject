import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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

  /* =========================
     FETCH REPORT
  ========================= */
  const fetchReport = async () => {
    try {
      if (isDisabled) return;

      const res = await fetch(
        `${backendUrl}/api/reports/sales?from=${from}&to=${to}`
      );

      const data = await res.json();

      setReport(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  };

  /* =========================
     CHART DATA
  ========================= */
  const chartData = report
    ? Object.entries(report.dailySales || {}).map(([date, value]) => ({
        date,
        revenue: value,
      }))
    : [];

  /* =========================
     DOWNLOAD PDF
  ========================= */
  const downloadPDF = async () => {
    try {
      const input = document.getElementById("reportContent");

      const canvas = await html2canvas(input, {
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190;
      const pageHeight = 297;

      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(
        imgData,
        "PNG",
        10,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          10,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save(`sales-report-${from}-to-${to}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  /* =========================
     DOWNLOAD EXCEL
  ========================= */
  const downloadExcel = () => {
    try {
      if (!report) return;

      const rows = [];

      report.orders.forEach((order) => {
        order.items.forEach((item) => {
          rows.push({
            Name: order.userId?.name || "N/A",
            Email: order.userId?.email || "N/A",
            Date: new Date(order.createdAt).toLocaleDateString(),
            OrderID: order._id.slice(-6),
            Item: item.name,
            Quantity: item.quantity,
            Price: item.price,
            Subtotal: item.quantity * item.price,
            "Order Total": order.total,
            Status: order.status,
          });
        });
      });

      const ordersSheet = XLSX.utils.json_to_sheet(rows);

      const summarySheet = XLSX.utils.json_to_sheet([
        {
          TotalRevenue: report.totalRevenue,
          TotalOrders: report.totalOrders,
          TotalItemsSold: report.totalItemsSold,
        },
      ]);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        ordersSheet,
        "Orders"
      );

      XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "Summary"
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(
        data,
        `sales-report-${from}-to-${to}.xlsx`
      );
    } catch (error) {
      console.error("Excel download failed:", error);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
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
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          onClick={fetchReport}
          disabled={isDisabled}
        >
          Generate
        </button>
      </div>

      {/* REPORT */}
      {report && (
        <>
          {/* ACTION BUTTONS */}
          <div style={styles.buttonGroup}>
            <button
              style={styles.pdfBtn}
              onClick={downloadPDF}
            >
              Download PDF
            </button>

            <button
              style={styles.excelBtn}
              onClick={downloadExcel}
            >
              Download Excel
            </button>
          </div>

          <div
            id="reportContent"
            style={styles.reportContainer}
          >
            {/* SUMMARY CARDS */}
            <div style={styles.cards}>
              <div style={styles.card}>
                <h4>Revenue</h4>

                <p>
                  ₱
                  {Number(
                    report.totalRevenue || 0
                  ).toLocaleString()}
                </p>
              </div>

              <div style={styles.card}>
                <h4>Orders</h4>

                <p>{report.totalOrders || 0}</p>
              </div>

              <div style={styles.card}>
                <h4>Items Sold</h4>

                <p>{report.totalItemsSold || 0}</p>
              </div>
            </div>

            {/* CHART */}
            <div style={styles.chartBox}>
              <h3>Revenue Analytics</h3>

              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
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
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP PRODUCTS */}
            <div style={styles.section}>
              <h3>🔥 Top Products</h3>

              {report.topProducts?.length > 0 ? (
                report.topProducts.map((p, i) => (
                  <div key={i} style={styles.productItem}>
                    <span>{p.name}</span>

                    <span>{p.qty} sold</span>
                  </div>
                ))
              ) : (
                <p>No top products found.</p>
              )}
            </div>

            {/* ORDERS (FULL FIXED LIKE EXCEL) */}
            <div style={styles.section}>
              <h3>Orders</h3>

              <div style={styles.orderList}>
                {report.orders?.length > 0 ? (
                  report.orders.map((order) => (
                    <div key={order._id} style={styles.orderCard}>

                      <div>
                        <b>{order.userId?.name || "N/A"}</b> |{" "}
                        {order.userId?.email || "N/A"}
                      </div>

                      <div>
                        Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>

                      <div>
                        Order Total: ₱{order.total}
                      </div>

                      <div>Status: {order.status}</div>

                      <div>
                        <b>Items:</b>

                        {order.items.map((item, i) => (
                          <div key={i} style={styles.itemRow}>
                            <span>{item.name}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>₱{item.price}</span>
                            <span>
                              Sub: {item.quantity * item.price}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  page: {
    padding: "15px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#000",
    fontWeight: "bold",
  },

  filterBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    background: "#3b82f6",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
  },

  pdfBtn: {
    width: "100%",
    background: "#111",
    color: "#fff",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
  },

  excelBtn: {
    width: "100%",
    background: "#15803d",
    color: "#fff",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
  },

  reportContainer: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  cards: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  card: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
  },

  chartBox: {
    marginTop: "20px",
  },

  section: {
    marginTop: "25px",
  },

  productItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  orderList: {
    overflowX: "auto",
  },

  orderCard: {
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    paddingLeft: "10px",
  },
};