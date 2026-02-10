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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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
    
    let tasks = initialTasks;
    
    // My Tasks filter
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      // / = Focus search
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }
      
      // Escape = Close modal/menu
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (showAdvancedFeatures) setShowAdvancedFeatures(false);
      }
      
      // 1, 2, 3 = Switch views (only when not typing)
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
      background: isDark ? '#0f172a' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: '24px',
      transition: 'background 0.3s'
    }}>
      {/* Onboarding Tour */}
      <OnboardingTour />
      
      {/* Command Palette */}
      <CommandPalette tasks={currentTasks} users={users} />
      
      {/* Floating Quick Create */}
      <FloatingQuickCreate onCreateTask={(data) => {
        console.log('Quick create:', data);
        window.location.reload();
      }} />
      {/* Real-time indicator - moved to bottom-right */}
      <div 
        role="status"
        aria-live="polite"
        aria-label={isConnected ? 'Real-time connection active' : 'Reconnecting to server'}
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

      {/* Stats Cards - now clickable to filter */}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "#7c6df2"} strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            )}
            color="#7c6df2"
            bgColor={isDark ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#f0f4ff'}
            onClick={() => setFilters({ search: '', assignee: '', priority: '', status: '' })}
            isDark={isDark}
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "#f59e0b"} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            color="#f59e0b"
            bgColor={isDark ? 'linear-gradient(135deg, #f59e0b, #fb923c)' : '#fffbeb'}
            onClick={() => setFilters({ ...filters, status: 'in_progress' })}
            isDark={isDark}
          />
          <StatCard 
            title="Completed" 
            value={stats.completed} 
            icon={(
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "#10b981"} strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            color="#10b981"
            bgColor={isDark ? 'linear-gradient(135deg, #059669, #10b981)' : '#ecfdf5'}
            onClick={() => setFilters({ ...filters, status: 'done' })}
            isDark={isDark}
          />
          <div style={{
            background: isDark ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: isDark ? '0 8px 24px rgba(236,72,153,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
            border: isDark ? 'none' : '1px solid #e2e8f0',
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{
                fontSize: '14px',
                color: isDark ? 'white' : '#64748b',
                fontWeight: '600'
              }}>
                Completion Rate
              </p>
              <span style={{
                background: isDark ? 'rgba(255,255,255,0.2)' : '#f0f4ff',
                color: isDark ? 'white' : '#7c6df2',
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
              background: isDark ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completionRate}%`,
                height: '100%',
                background: isDark ? 'white' : 'linear-gradient(90deg, #7c6df2, #a855f7)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>

      {/* Quick Actions Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* My Tasks Toggle */}
        <button
          onClick={() => setShowMyTasks(!showMyTasks)}
          title="Show only my tasks"
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: 'none',
            background: showMyTasks ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : (isDark ? '#1e293b' : 'white'),
            color: showMyTasks ? 'white' : (isDark ? '#cbd5e1' : '#475569'),
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: showMyTasks && isDark ? '0 4px 12px rgba(99,102,241,0.4)' : 'none'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          My Tasks
          {showMyTasks && <span style={{ background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{currentTasks.length}</span>}
        </button>
        
        {/* Create Task Button */}
        <div data-create-task style={{ flex: '0 0 auto' }}>
          <CreateTaskForm users={users} projectId={activeProject?.id} />
        </div>

        {/* Search */}
        <input 
          data-search-input
          type="text"
          placeholder="Search tasks..."
          aria-label="Search tasks by title"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{
            flex: '1 1 300px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            background: isDark ? '#1e293b' : 'white',
            color: isDark ? '#f1f5f9' : '#0f172a',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#7c6df2';
            e.target.style.boxShadow = '0 0 0 3px rgba(124,109,242,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* View Switcher */}
        <div data-view-switcher style={{
          display: 'flex',
          gap: '4px',
          background: '#f9fafb',
          padding: '4px',
          borderRadius: '10px'
        }}>
          <button 
            onClick={() => setViewMode('kanban')}
            aria-label="Switch to board view (Press 1)"
            aria-pressed={viewMode === 'kanban'}
            title="Switch to board view (Press 1)"
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
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #7c6df2';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => e.target.style.outline = 'none'}
          >
            📋 Board
          </button>
          <button 
            onClick={() => setViewMode('table')}
            aria-label="Switch to table view (Press 2)"
            aria-pressed={viewMode === 'table'}
            title="Switch to table view (Press 2)"
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
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #7c6df2';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => e.target.style.outline = 'none'}
          >
            📊 Table
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            aria-label="Switch to calendar view (Press 3)"
            aria-pressed={viewMode === 'calendar'}
            title="Switch to calendar view (Press 3)"
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
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #7c6df2';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => e.target.style.outline = 'none'}
          >
            📅 Calendar
          </button>
        </div>

        {/* More Menu */}
        <button 
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          aria-label={showAdvancedFeatures ? 'Close advanced features' : 'Show more options'}
          aria-expanded={showAdvancedFeatures}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            background: showAdvancedFeatures ? '#7c6df2' : 'white',
            color: showAdvancedFeatures ? 'white' : '#475569',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.outline = '2px solid #7c6df2';
            e.target.style.outlineOffset = '2px';
          }}
          onBlur={(e) => e.target.style.outline = 'none'}
        >
          {showAdvancedFeatures ? '✕ Close' : '••• More'}
        </button>
      </div>

      {/* Advanced Features (collapsible) */}
      {showAdvancedFeatures && (
        <div style={{
          background: isDark ? '#1e293b' : 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'all 0.3s'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Advanced Features</h3>
          
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

      {/* Simple Filters (always visible) */}
      {!showAdvancedFeatures && (
        <div style={{ marginBottom: '24px' }}>
          <TaskFilters users={users} onFilter={setFilters} />
        </div>
      )}

      {/* Main Content */}
      <div>
        {viewMode === 'kanban' && (
          <div style={{
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.05)',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            transition: 'all 0.3s'
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

      {/* Task Modal */}
      <TaskModalEnhanced 
        task={selectedTask}
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Keyboard Shortcuts Hint */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#475569',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 40,
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <kbd style={{
            background: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            border: '1px solid #cbd5e1'
          }}>/</kbd>
          <span>Search</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <kbd style={{
            background: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            border: '1px solid #cbd5e1'
          }}>1-3</kbd>
          <span>Views</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <kbd style={{
            background: '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            border: '1px solid #cbd5e1'
          }}>Esc</kbd>
          <span>Close</span>
        </span>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor, onClick, isDark }) {
  const Component = onClick ? 'button' : 'div';
  const isGradient = typeof bgColor === 'string' && bgColor.includes('gradient');
  
  return (
    <Component
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Filter by ${title.toLowerCase()}. Currently showing ${value} tasks` : undefined}
      onClick={onClick}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = isDark && isGradient ? '0 12px 32px rgba(0,0,0,0.5)' : '0 8px 25px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isDark && isGradient ? '0 8px 24px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)';
        }
      }}
      style={{
        background: isGradient ? bgColor : (isDark ? '#1e293b' : 'white'),
        borderRadius: '16px',
        padding: '24px',
        boxShadow: isDark && isGradient ? '0 8px 24px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
        border: isDark && !isGradient ? '1px solid #334155' : (isDark ? 'none' : '1px solid #e2e8f0'),
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        width: '100%',
        outline: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '14px',
            color: isGradient && isDark ? 'rgba(255,255,255,0.9)' : (isDark ? '#94a3b8' : '#475569'),
            marginBottom: '4px',
            fontWeight: '600'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '30px',
            fontWeight: '700',
            color: isGradient && isDark ? 'white' : (isDark ? '#f1f5f9' : '#0f172a')
          }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: isGradient && isDark ? 'rgba(255,255,255,0.2)' : bgColor,
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