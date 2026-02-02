"use client";

import { useState, useMemo, useCallback } from "react";
import { TASK_COLUMNS } from "@/lib/constants";
import CreateTaskForm from "./CreateTaskForm";
import KanbanColumn from "./KanbanColumn";
import TableView from "@/components/TableView";
import CalendarView from "@/components/CalendarView";
import ProjectsManager from "@/components/ProjectsManager";
import ActivityFeed from "@/components/ActivityFeed";
import TaskFilters from "@/components/TaskFilters";
import AdvancedFilters from "@/components/AdvancedFilters";
import BulkOperations from "@/components/BulkOperations";
import TaskModalEnhanced from "@/components/TaskModalEnhanced";
import ExportImport from "@/components/ExportImport";
import TimeTracker from "@/components/TimeTracker";
import AutomationManager from "@/components/AutomationManager";
import ReportsManager from "@/components/ReportsManager";
import { importTasks } from "@/lib/importTasks";
import { useRealtimeTasks } from "@/lib/useRealtime";
import "@/lib/memoryCleanup"; // Import memory cleanup

export default function DashboardClient({ initialTasks, users, activities, currentUser }) {
  const [filters, setFilters] = useState({
    search: "",
    assignee: "",
    priority: "",
    status: ""
  });
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('kanban');
  const [useAdvancedFilters, setUseAdvancedFilters] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  // Real-time updates
  const isConnected = useRealtimeTasks(useCallback((payload) => {
    console.log('Real-time task update:', payload);
    // Don't reload entire page, just invalidate cache
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []));

  // Filter tasks (for basic filters)
  const basicFilteredTasks = useMemo(() => {
    if (useAdvancedFilters) return filteredTasks;
    
    return initialTasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.assignee) {
        if (filters.assignee === "unassigned" && task.assigned_to) return false;
        if (filters.assignee !== "unassigned" && task.assigned_to !== filters.assignee) return false;
      }
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.status && task.status !== filters.status) return false;
      return true;
    });
  }, [initialTasks, filters, filteredTasks, useAdvancedFilters]);

  const currentTasks = useAdvancedFilters ? filteredTasks : basicFilteredTasks;

  const grouped = {
    todo: [],
    in_progress: [],
    done: [],
  };

  currentTasks.forEach(task => {
    grouped[task.status]?.push(task);
  });

  const stats = {
    total: currentTasks.length,
    inProgress: grouped.in_progress.length,
    completed: grouped.done.length,
    overdue: currentTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const handleTaskClick = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleImport = useCallback(async (tasks) => {
    try {
      await importTasks(tasks);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      alert('Import failed: ' + error.message);
    }
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Real-time indicator */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        background: isConnected ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        zIndex: 40,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'currentColor'
        }} />
        {isConnected ? 'Live' : 'Offline'}
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '8px',
              letterSpacing: '-0.025em'
            }}>
              Project Dashboard
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '18px',
              fontWeight: '400'
            }}>
              Track progress and manage team workflow
            </p>
          </div>

          {/* View Toggle */}
          <div style={{
            display: 'flex',
            background: 'white',
            borderRadius: '12px',
            padding: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {['kanban', 'table', 'calendar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: viewMode === mode ? '#7c6df2' : 'transparent',
                  color: viewMode === mode ? 'white' : '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
              >
                {mode === 'kanban' && '📋'}
                {mode === 'table' && '📊'}
                {mode === 'calendar' && '📅'}
                <span style={{ marginLeft: '6px' }}>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard 
            title="Total Tasks" 
            value={stats.total} 
            icon="📋" 
            color="#7c6df2"
            bgColor="#f0f4ff"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon="⚡" 
            color="#f59e0b"
            bgColor="#fffbeb"
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon="✅" 
            color="#10b981"
            bgColor="#ecfdf5"
          />
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Completion Rate
              </p>
              <span style={{
                background: '#f0f4ff',
                color: '#7c6df2',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {Math.round(completionRate)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#f1f5f9',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completionRate}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #7c6df2, #a855f7)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

        <CreateTaskForm users={users} projectId={activeProject?.id} />
      </div>

      {/* Projects Manager */}
      <ProjectsManager 
        currentUser={currentUser} 
        onProjectChange={setActiveProject}
      />

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setUseAdvancedFilters(!useAdvancedFilters)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            background: useAdvancedFilters ? '#7c6df2' : 'white',
            color: useAdvancedFilters ? 'white' : '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {useAdvancedFilters ? '🔍 Advanced' : '⚡ Basic'} Filters
        </button>
      </div>

      {useAdvancedFilters ? (
        <AdvancedFilters 
          users={users} 
          onFilter={setFilteredTasks}
          tasks={initialTasks}
        />
      ) : (
        <TaskFilters users={users} onFilter={setFilters} />
      )}

      {/* Bulk Operations */}
      <BulkOperations 
        tasks={currentTasks} 
        users={users} 
        selectedTasks={selectedTasks} 
        onSelectionChange={setSelectedTasks} 
      />

      {/* Main Content */}
      <div>
        {/* Content Area */}
        <div>
          {viewMode === 'kanban' && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                minHeight: '600px'
              }}>
                {TASK_COLUMNS.map(col => (
                  <KanbanColumn
                    key={col.key}
                    title={col.label}
                    tasks={grouped[col.key]}
                    users={users}
                    status={col.key}
                    selectedTasks={selectedTasks}
                    onSelectionChange={setSelectedTasks}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </div>
            </div>
          )}
          {viewMode === 'table' && (
            <TableView
              tasks={currentTasks}
              users={users}
              selectedTasks={selectedTasks}
              onSelectionChange={setSelectedTasks}
              onTaskClick={handleTaskClick}
            />
          )}
          
          {viewMode === 'calendar' && (
            <CalendarView
              tasks={currentTasks}
              users={users}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </div>

      {/* Export/Import */}
      <div style={{ marginTop: '32px' }}>
        <ExportImport tasks={currentTasks} onImport={handleImport} />
      </div>

      {/* Task Modal */}
      <TaskModalEnhanced 
        task={selectedTask}
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '4px',
            fontWeight: '500'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}