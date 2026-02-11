"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import EmptyStateIllustration from "@/components/EmptyStateIllustration";
import FloatingQuickCreate from "@/components/FloatingQuickCreate";
import CommandPalette from "@/components/CommandPalette";
import TaskPreview from "@/components/TaskPreview";
import OnboardingTour from "@/components/OnboardingTour";
import { importTasks } from "@/lib/importTasks";
import { useRealtimeTasks } from "@/lib/useRealtime";
import "@/lib/memoryCleanup";

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
  const [showMyTasks, setShowMyTasks] = useState(false);

  const isConnected = useRealtimeTasks(useCallback((payload) => {
    try {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Reload failed:', error);
    }
  }, []));

  const basicFilteredTasks = useMemo(() => {
    try {
      if (useAdvancedFilters) return filteredTasks;
      
      let tasks = initialTasks;
      
      if (showMyTasks) {
        tasks = tasks.filter(task => task.assigned_to === currentUser?.id);
      }
      
      return tasks.filter(task => {
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
    } catch (error) {
      console.error('Filter error:', error);
      return initialTasks;
    }
  }, [initialTasks, filters, filteredTasks, useAdvancedFilters, showMyTasks, currentUser]);

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

  useEffect(() => {
    const handleKeyPress = (e) => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }
      
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (showAdvancedFeatures) setShowAdvancedFeatures(false);
      }
      
      if (!isInputFocused) {
        if (e.key === '1') setViewMode('kanban');
        if (e.key === '2') setViewMode('table');
        if (e.key === '3') setViewMode('calendar');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, showAdvancedFeatures]);

  return (
    <div style={{
      background: '#f5f7fa',
      minHeight: '100vh',
      transition: 'background 0.3s'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        paddingTop: '24px'
      }}>
      <OnboardingTour />
      <CommandPalette tasks={currentTasks} users={users} />
      
      <div 
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: isConnected ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '600',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
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
        {isConnected ? 'Live' : 'Reconnecting...'}
      </div>

      <div data-stats style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
          <StatCard 
            title="Total Tasks" 
            value={stats.total} 
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            )}
            bgColor="#f0f4ff"
            onClick={() => setFilters({ search: '', assignee: '', priority: '', status: '' })}
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            bgColor="#fffbeb"
            onClick={() => setFilters({ ...filters, status: 'in_progress' })}
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            bgColor="#ecfdf5"
            onClick={() => setFilters({ ...filters, status: 'done' })}
          />
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '600'
              }}>
                Completion Rate
              </p>
              <span style={{
                background: '#f0f4ff',
                color: '#667eea',
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
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        alignItems: 'center',
        flexWrap: 'wrap',
        background: 'white',
        padding: '16px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => setShowMyTasks(!showMyTasks)}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: 'none',
            background: showMyTasks ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f7fa',
            color: showMyTasks ? 'white' : '#4b5563',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          My Tasks
          {showMyTasks && <span style={{ background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{currentTasks.length}</span>}
        </button>
        
        <div data-create-task style={{ flex: '0 0 auto' }}>
          <CreateTaskForm users={users} projectId={activeProject?.id} />
        </div>

        <input 
          data-search-input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{
            flex: '1 1 300px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#0f172a',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />

        <div data-view-switcher style={{
          display: 'flex',
          gap: '4px',
          background: '#f5f7fa',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #e5e7eb'
        }}>
          <button 
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'kanban' ? 'white' : 'transparent',
              color: viewMode === 'kanban' ? '#111827' : '#6b7280',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            📋 Board
          </button>
          <button 
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'table' ? 'white' : 'transparent',
              color: viewMode === 'table' ? '#111827' : '#6b7280',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            📊 Table
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'calendar' ? 'white' : 'transparent',
              color: viewMode === 'calendar' ? '#111827' : '#6b7280',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            📅 Calendar
          </button>
        </div>

        <button 
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            background: showAdvancedFeatures ? '#667eea' : 'white',
            color: showAdvancedFeatures ? 'white' : '#475569',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          {showAdvancedFeatures ? '✕ Close' : '••• More'}
        </button>
      </div>

      {showAdvancedFeatures && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#0f172a' }}>Advanced Features</h3>
          
          <ProjectsManager 
            currentUser={currentUser} 
            onProjectChange={setActiveProject}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', marginBottom: '16px' }}>
            <button
              onClick={() => setUseAdvancedFilters(!useAdvancedFilters)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: useAdvancedFilters ? '#667eea' : 'white',
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

          <BulkOperations 
            tasks={currentTasks} 
            users={users} 
            selectedTasks={selectedTasks} 
            onSelectionChange={setSelectedTasks} 
          />

          <div style={{ marginTop: '16px' }}>
            <ExportImport tasks={currentTasks} onImport={handleImport} />
          </div>
        </div>
      )}

      {!showAdvancedFeatures && (
        <div style={{ marginBottom: '24px' }}>
          <TaskFilters users={users} onFilter={setFilters} />
        </div>
      )}

      <div>
        {viewMode === 'kanban' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
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
                  emptyState={
                    grouped[col.key].length === 0 ? (
                      <EmptyStateIllustration type={col.key} />
                    ) : null
                  }
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

      <TaskModalEnhanced 
        task={selectedTask}
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, onClick }) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      style={{
        background: bgColor,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        width: '100%',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '14px',
            color: '#475569',
            marginBottom: '4px',
            fontWeight: '600'
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
    </Component>
  );
}
