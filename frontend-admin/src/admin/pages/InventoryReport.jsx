import { useEffect, useState } from "react";
import backendUrl from "../../config";

export default function InventoryReport() {
  const [reports, setReports] = useState([]);
  const [month, setMonth] = useState("");

  // FETCH REPORTS
  const fetchReports = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/products/inventory-reports/all`
      );

      const data = await res.json();

      setReports(data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // MONTH FILTER
  const filteredReports = reports.filter((r) => {
    if (!month) return true;

    const reportMonth = new Date(r.createdAt)
      .toISOString()
      .slice(0, 7);

    return reportMonth === month;
  });

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        📊 Inventory Report
      </h1>

      {/* MONTH FILTER */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={styles.monthInput}
      />

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Added</th>
              <th style={styles.th}>Previous</th>
              <th style={styles.th}>New Stock</th>
              <th style={styles.th}>Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((r) => (
              <tr key={r._id}>
                <td style={styles.td}>
                  {r.productName}
                </td>

                <td style={styles.td}>
                  +{r.quantityAdded}
                </td>

                <td style={styles.td}>
                  {r.previousStock}
                </td>

                <td style={styles.td}>
                  {r.newStock}
                </td>

                <td style={styles.td}>
                  {new Date(r.createdAt).toLocaleString(
                    "en-PH",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#111827",
  },

  monthInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "12px",
    border: "1px solid #ddd",
  },

  td: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
};