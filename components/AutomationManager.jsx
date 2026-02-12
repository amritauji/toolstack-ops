"use client";

import { useState, useEffect } from "react";
import { Button, Badge } from "@/components/ui/ModernComponents";
import { getAutomations, createAutomation, toggleAutomation as toggleAuto, deleteAutomation as deleteAuto } from "@/lib/automations";
import toast from 'react-hot-toast';

export default function AutomationManager() {
  const [automations, setAutomations] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    trigger_type: "status_change",
    trigger_config: {},
    action_type: "assign_user",
    action_config: {}
  });

  const triggers = [
    { value: "status_change", label: "Status Changes" },
    { value: "priority_change", label: "Priority Changes" },
    { value: "due_date_approaching", label: "Due Date Approaching" },
    { value: "task_created", label: "Task Created" },
    { value: "overdue", label: "Task Overdue" }
  ];

  const actions = [
    { value: "assign_user", label: "Assign to User" },
    { value: "change_priority", label: "Change Priority" },
    { value: "send_notification", label: "Send Notification" },
    { value: "change_status", label: "Change Status" }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAutomations();
        setAutomations(data);
      } catch {
        // Silent fail
      }
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!newAutomation.name.trim()) return;
    
    try {
      const formData = new FormData();
      formData.set('name', newAutomation.name);
      formData.set('trigger_type', newAutomation.trigger_type);
      formData.set('trigger_config', JSON.stringify(newAutomation.trigger_config));
      formData.set('action_type', newAutomation.action_type);
      formData.set('action_config', JSON.stringify(newAutomation.action_config));
      
      await createAutomation(formData);
      toast.success('Automation created!');
      
      const updated = await getAutomations();
      setAutomations(updated);
      
      setNewAutomation({
        name: "",
        trigger_type: "status_change",
        trigger_config: {},
        action_type: "assign_user",
        action_config: {}
      });
      setShowCreateForm(false);
    } catch {
      toast.error('Failed to create automation');
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await toggleAuto(id, !isActive);
      setAutomations(prev => 
        prev.map(auto => 
          auto.id === id ? { ...auto, is_active: !isActive } : auto
        )
      );
      toast.success(isActive ? 'Automation disabled' : 'Automation enabled');
    } catch {
      toast.error('Failed to toggle automation');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAuto(id);
      setAutomations(prev => prev.filter(auto => auto.id !== id));
      toast.success('Automation deleted');
    } catch {
      toast.error('Failed to delete automation');
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
            Automations
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Automate repetitive tasks and workflows
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          + New Automation
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Create New Automation
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Automation Name
              </label>
              <input
                type="text"
                placeholder="e.g., Auto-assign high priority tasks"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Trigger
                </label>
                <select
                  value={newAutomation.trigger_type}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, trigger_type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  {triggers.map(trigger => (
                    <option key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Action
                </label>
                <select
                  value={newAutomation.action_type}
                  onChange={(e) => setNewAutomation(prev => ({ ...prev, action_type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  {actions.map(action => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="primary" onClick={handleCreate}>
                Create Automation
              </Button>
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Automations List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {automations.map(automation => (
          <div
            key={automation.id}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: automation.is_active ? 'white' : '#f9fafb'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {automation.name}
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge variant={automation.is_active ? "success" : "secondary"} size="sm">
                    {automation.is_active ? 'Active' : 'Disabled'}
                  </Badge>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    Created {new Date(automation.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggle(automation.id, automation.is_active)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {automation.is_active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(automation.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #ef4444',
                    background: '#fef2f2',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  Trigger:
                </span>
                <div style={{ fontSize: '14px', color: '#374151' }}>
                  {triggers.find(t => t.value === automation.trigger_type)?.label}
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  Trigger Config:
                </span>
                <div style={{ fontSize: '14px', color: '#374151' }}>
                  {JSON.stringify(automation.trigger_config)}
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  Action:
                </span>
                <div style={{ fontSize: '14px', color: '#374151' }}>
                  {actions.find(a => a.value === automation.action_type)?.label}
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  Action Config:
                </span>
                <div style={{ fontSize: '14px', color: '#374151' }}>
                  {JSON.stringify(automation.action_config)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {automations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              No automations yet
            </div>
            <div style={{ fontSize: '14px' }}>
              Create your first automation to streamline your workflow
            </div>
          </div>
        )}
      </div>
    </div>
  );
}