import { useEffect, useState } from "react";
import backendUrl from "../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  // DOWNLOAD EXCEL
  const downloadExcel = () => {
    const excelData = filteredReports.map((r) => ({
      Product: r.productName,
      Added: r.quantityAdded,
      PreviousStock: r.previousStock,
      NewStock: r.newStock,
      Date: new Date(r.createdAt).toLocaleString(
        "en-PH",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Inventory Report"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(
      data,
      `Inventory_Report_${month || "All"}.xlsx`
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          📊 Inventory Report
        </h1>

        <button
          onClick={downloadExcel}
          style={styles.downloadBtn}
        >
          Download Excel
        </button>
      </div>

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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },

  title: {
    fontSize: "32px",
    color: "#111827",
    margin: 0,
  },

  monthInput: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },

  downloadBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
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