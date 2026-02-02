"use client";

import { useState, useEffect } from "react";
import { Button, Badge } from "@/components/ui/ModernComponents";

export default function AdvancedFilters({ 
  users, 
  onFilter, 
  tasks = [] 
}) {
  const [filters, setFilters] = useState({
    search: "",
    assignee: "",
    priority: "",
    status: "",
    dateRange: "",
    customDateStart: "",
    customDateEnd: "",
    tags: [],
    overdue: false,
    unassigned: false
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState("");

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taskFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      // Search filter
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Assignee filter
      if (filters.assignee && task.assigned_to !== filters.assignee) return false;
      if (filters.unassigned && task.assigned_to) return false;
      
      // Priority filter
      if (filters.priority && task.priority !== filters.priority) return false;
      
      // Status filter
      if (filters.status && task.status !== filters.status) return false;
      
      // Date range filter
      if (filters.dateRange || (filters.customDateStart && filters.customDateEnd)) {
        const taskDate = new Date(task.created_at);
        let startDate, endDate;
        
        if (filters.dateRange) {
          const now = new Date();
          switch (filters.dateRange) {
            case 'today':
              startDate = new Date(now.setHours(0, 0, 0, 0));
              endDate = new Date(now.setHours(23, 59, 59, 999));
              break;
            case 'week':
              startDate = new Date(now.setDate(now.getDate() - 7));
              endDate = new Date();
              break;
            case 'month':
              startDate = new Date(now.setMonth(now.getMonth() - 1));
              endDate = new Date();
              break;
            case 'quarter':
              startDate = new Date(now.setMonth(now.getMonth() - 3));
              endDate = new Date();
              break;
          }
        } else {
          startDate = new Date(filters.customDateStart);
          endDate = new Date(filters.customDateEnd);
        }
        
        if (taskDate < startDate || taskDate > endDate) return false;
      }
      
      // Overdue filter
      if (filters.overdue) {
        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
        if (!isOverdue) return false;
      }
      
      return true;
    });
    
    onFilter(filteredTasks);
  }, [filters, tasks, onFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      assignee: "",
      priority: "",
      status: "",
      dateRange: "",
      customDateStart: "",
      customDateEnd: "",
      tags: [],
      overdue: false,
      unassigned: false
    });
  };

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter = {
      id: Date.now(),
      name: filterName,
      filters: { ...filters }
    };
    
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('taskFilters', JSON.stringify(updated));
    setFilterName("");
  };

  const loadSavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
  };

  const deleteSavedFilter = (filterId) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('taskFilters', JSON.stringify(updated));
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => {
      if (typeof value === 'boolean') return value;
      if (Array.isArray(value)) return value.length > 0;
      return value !== "";
    }).length;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Filters
          </h3>
          {getActiveFilterCount() > 0 && (
            <Badge variant="primary" size="sm">
              {getActiveFilterCount()} active
            </Badge>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Basic Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: isExpanded ? '20px' : '0'
      }}>
        {/* Search */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            Search
          </label>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7c6df2'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Status */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            Assignee
          </label>
          <select
            value={filters.assignee}
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Date Range */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
              </select>
            </div>

            {/* Custom Date Start */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                From Date
              </label>
              <input
                type="date"
                value={filters.customDateStart}
                onChange={(e) => handleFilterChange('customDateStart', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Custom Date End */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                To Date
              </label>
              <input
                type="date"
                value={filters.customDateEnd}
                onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Quick Filters
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                background: filters.overdue ? '#fef3c7' : '#f9fafb',
                border: '1px solid',
                borderColor: filters.overdue ? '#f59e0b' : '#e5e7eb',
                fontSize: '14px'
              }}>
                <input
                  type="checkbox"
                  checked={filters.overdue}
                  onChange={(e) => handleFilterChange('overdue', e.target.checked)}
                  style={{ accentColor: '#7c6df2' }}
                />
                Overdue Tasks
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                background: filters.unassigned ? '#fef3c7' : '#f9fafb',
                border: '1px solid',
                borderColor: filters.unassigned ? '#f59e0b' : '#e5e7eb',
                fontSize: '14px'
              }}>
                <input
                  type="checkbox"
                  checked={filters.unassigned}
                  onChange={(e) => handleFilterChange('unassigned', e.target.checked)}
                  style={{ accentColor: '#7c6df2' }}
                />
                Unassigned Tasks
              </label>
            </div>
          </div>

          {/* Save Filter */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <input
              type="text"
              placeholder="Filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                width: '200px'
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={saveCurrentFilter}
              disabled={!filterName.trim()}
            >
              Save Filter
            </Button>
          </div>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Saved Filters
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {savedFilters.map(savedFilter => (
                  <div
                    key={savedFilter.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: '#f0f4ff',
                      border: '1px solid #7c6df2',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <button
                      onClick={() => loadSavedFilter(savedFilter)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#7c6df2',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {savedFilter.name}
                    </button>
                    <button
                      onClick={() => deleteSavedFilter(savedFilter.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '2px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}