"use client";

import { useState } from "react";

export default function AdminExportImport({ stats, distribution, teamActivity, allTasks }) {
  const [exporting, setExporting] = useState(false);

  const exportAnalytics = () => {
    const data = {
      exportDate: new Date().toISOString(),
      kpis: stats,
      taskDistribution: distribution,
      teamActivity: teamActivity,
      summary: {
        totalUsers: teamActivity.length,
        activeUsers: stats.activeUsers,
        taskCompletionRate: stats.totalTasks > 0 ? (stats.completedLast7 / stats.totalTasks * 100).toFixed(1) : 0,
        overdueRate: stats.totalTasks > 0 ? (stats.overdue / stats.totalTasks * 100).toFixed(1) : 0
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-analytics-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportUserReport = () => {
    const headers = ["Name", "Role", "Status", "Last Login", "Task Count"];
    const rows = teamActivity.map(user => [
      user.full_name,
      user.role,
      user.last_login ? "Active" : "Inactive",
      user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never",
      distribution.find(d => d.name === user.full_name)?.count || 0
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSystemReport = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>System Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .kpi-card { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; text-align: center; }
            .kpi-value { font-size: 24px; font-weight: 600; color: #1f2937; }
            .kpi-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background-color: #f9fafb; font-weight: 600; }
            .danger { color: #ef4444; font-weight: 600; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>System Analytics Report - ${new Date().toLocaleDateString()}</h1>
          
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">${stats.totalTasks}</div>
              <div class="kpi-label">Total Tasks</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${stats.inProgress}</div>
              <div class="kpi-label">In Progress</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value ${stats.overdue > 0 ? 'danger' : ''}">${stats.overdue}</div>
              <div class="kpi-label">Overdue</div>
            </div>
          </div>

          <h2>Task Distribution</h2>
          <table>
            <thead>
              <tr><th>User</th><th>Task Count</th><th>Load Status</th></tr>
            </thead>
            <tbody>
              ${distribution.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.count}</td>
                  <td class="${item.count > 5 ? 'danger' : ''}">${item.count > 5 ? 'High' : item.count > 3 ? 'Medium' : 'Normal'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Team Status</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Status</th><th>Last Active</th></tr>
            </thead>
            <tbody>
              ${teamActivity.map(user => `
                <tr>
                  <td>${user.full_name}</td>
                  <td>${user.role}</td>
                  <td>${user.last_login ? 'Active' : 'Inactive'}</td>
                  <td>${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
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

  const exportAllTasks = () => {
    const headers = ["ID", "Title", "Status", "Priority", "Assigned To", "Due Date", "Created"];
    const rows = allTasks.map(task => [
      task.id,
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
    a.download = `all-tasks-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Admin Reports & Export</h3>
      
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>System Reports</h4>
        <div style={styles.buttons}>
          <button onClick={exportAnalytics} style={styles.button}>
            📈 Analytics Data
          </button>
          <button onClick={exportSystemReport} style={styles.button}>
            🖨️ System Report
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Data Exports</h4>
        <div style={styles.buttons}>
          <button onClick={exportUserReport} style={styles.button}>
            👥 User Report
          </button>
          <button onClick={exportAllTasks} style={styles.button}>
            📋 All Tasks CSV
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
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
};