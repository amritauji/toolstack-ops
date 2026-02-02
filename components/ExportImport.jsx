"use client";

import { useState } from "react";

export default function ExportImport({ tasks, onImport }) {
  const [importing, setImporting] = useState(false);

  const exportToCSV = () => {
    const headers = ["Title", "Status", "Priority", "Assigned To", "Due Date", "Created"];
    const rows = tasks.map(task => [
      task.title,
      task.status,
      task.priority,
      task.profiles?.full_name || "Unassigned",
      task.due_date || "",
      new Date(task.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      tasks: tasks.map(task => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        assigned_to: task.assigned_to,
        created_at: task.created_at
      }))
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (file.name.endsWith('.csv')) {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
          const tasks = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, ''));
            return {
              title: values[0],
              status: values[1] || 'todo',
              priority: values[2] || 'medium',
              due_date: values[4] || null
            };
          });
          onImport(tasks);
        } else if (file.name.endsWith('.json')) {
          const backup = JSON.parse(e.target.result);
          onImport(backup.tasks || []);
        }
      } catch (error) {
        alert('Error importing file: ' + error.message);
      } finally {
        setImporting(false);
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  const openPrintView = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tasks Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; }
            .status-todo { color: #6b7280; }
            .status-in-progress { color: #3b82f6; }
            .status-done { color: #10b981; }
            .priority-high { color: #ef4444; font-weight: 600; }
            .priority-medium { color: #f59e0b; }
            .priority-low { color: #6b7280; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Tasks Report - ${new Date().toLocaleDateString()}</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.map(task => `
                <tr>
                  <td>${task.title}</td>
                  <td class="status-${task.status}">${task.status.replace('-', ' ')}</td>
                  <td class="priority-${task.priority}">${task.priority}</td>
                  <td>${task.profiles?.full_name || 'Unassigned'}</td>
                  <td>${task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h4 style={styles.title}>Export</h4>
        <div style={styles.buttons}>
          <button onClick={exportToCSV} style={styles.button}>
            📊 Export CSV
          </button>
          <button onClick={exportBackup} style={styles.button}>
            💾 Backup Data
          </button>
          <button onClick={openPrintView} style={styles.button}>
            🖨️ Print View
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.title}>Import</h4>
        <label style={styles.fileLabel}>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleImport}
            disabled={importing}
            style={styles.fileInput}
          />
          {importing ? "Importing..." : "📁 Import CSV/JSON"}
        </label>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8,
  },
  buttons: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  button: {
    background: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  fileLabel: {
    display: 'inline-block',
    background: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
};