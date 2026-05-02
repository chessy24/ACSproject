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

  // convert dailySales to chart format
  const chartData = report
    ? Object.entries(report.dailySales).map(([date, value]) => ({
        date,
        revenue: value,
      }))
    : [];

  // =========================
  // PDF FUNCTION
  // =========================
  const downloadPDF = async () => {
    const input = document.getElementById("reportContent");

    const canvas = await html2canvas(input, {
      scale: 2,
    });

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
    <div style={{ padding: "20px" }}>
      <h1>Sales Report</h1>

      {/* FILTER */}
      <input type="date" onChange={e => setFrom(e.target.value)} />
      <input type="date" onChange={e => setTo(e.target.value)} />

      <button onClick={fetchReport} style={{ marginLeft: "10px" }}>
        Generate
      </button>

      {report && (
        <>
          {/* PDF BUTTON */}
          <button
            onClick={downloadPDF}
            style={{
              marginTop: "15px",
              background: "#111",
              color: "#fff",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            Download PDF
          </button>

          {/* =========================
              WRAPPED REPORT CONTENT
          ========================= */}
          <div
            id="reportContent"
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#fff",
            }}
          >
            {/* SUMMARY */}
            <h2>Total Revenue: ₱{report.totalRevenue}</h2>
            <h3>Total Orders: {report.totalOrders}</h3>
            <h3>Total Items Sold: {report.totalItemsSold}</h3>

            {/* CHART */}
            <div style={{ marginTop: "20px" }}>
              <LineChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </div>

            {/* TOP PRODUCTS */}
            <h2>Top Products</h2>
            {report.topProducts.map((p, i) => (
              <p key={i}>
                {p.name} - {p.qty} sold
              </p>
            ))}

            {/* TABLE */}
            <h2>Orders</h2>
            {report.orders.map(o => (
              <div key={o._id}>
                #{o._id.slice(-6)} - ₱{o.total} - {o.status}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}