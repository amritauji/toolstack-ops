"use client";

import { useState, useEffect } from "react";
import { Button, Badge } from "@/components/ui/ModernComponents";
import { supabase } from "@/lib/supabaseClient";

export default function ProjectsManager({ currentUser, onProjectChange }) {
  const [projects, setProjects] = useState([{
    id: 'default',
    name: 'Default Project',
    description: 'Default workspace',
    color: '#7c6df2'
  }]);
  const [activeProject, setActiveProject] = useState({
    id: 'default',
    name: 'Default Project',
    description: 'Default workspace',
    color: '#7c6df2'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", color: "#7c6df2" });

  useEffect(() => {
    onProjectChange?.(activeProject);
  }, []);


  const createProject = async () => {
    if (!newProject.name.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: newProject.name,
          description: newProject.description,
          color: newProject.color,
          created_by: currentUser.id
        }])
        .select()
        .single();
      
      if (error) {
        console.log('Cannot create project, using local storage');
        const localProject = {
          id: Date.now().toString(),
          name: newProject.name,
          description: newProject.description,
          color: newProject.color,
          created_by: currentUser.id,
          created_at: new Date().toISOString()
        };
        setProjects(prev => [localProject, ...prev]);
        setNewProject({ name: "", description: "", color: "#7c6df2" });
        setShowCreateForm(false);
        return;
      }
      
      setProjects(prev => [data, ...prev]);
      setNewProject({ name: "", description: "", color: "#7c6df2" });
      setShowCreateForm(false);
    } catch (error) {
      console.log('Error creating project, using local fallback:', error);
      const localProject = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        color: newProject.color,
        created_by: currentUser.id,
        created_at: new Date().toISOString()
      };
      setProjects(prev => [localProject, ...prev]);
      setNewProject({ name: "", description: "", color: "#7c6df2" });
      setShowCreateForm(false);
    }
  };

  const switchProject = (project) => {
    setActiveProject(project);
    onProjectChange?.(project);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
          Projects
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          + New Project
        </Button>
      </div>

      {/* Active Project */}
      {activeProject && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: `${activeProject.color}10`,
          border: `2px solid ${activeProject.color}`,
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: activeProject.color
            }} />
            <span style={{ fontWeight: '600', color: '#0f172a' }}>
              {activeProject.name}
            </span>
            <Badge variant="secondary" size="sm">Active</Badge>
          </div>
          {activeProject.description && (
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {activeProject.description}
            </p>
          )}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#0f172a',
                background: 'white'
              }}
            />
            <textarea
              placeholder="Description (optional)"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                minHeight: '60px',
                resize: 'vertical',
                color: '#0f172a',
                background: 'white'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>Color:</label>
              <input
                type="color"
                value={newProject.color}
                onChange={(e) => setNewProject(prev => ({ ...prev, color: e.target.value }))}
                style={{ width: '40px', height: '32px', border: 'none', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="primary" size="sm" onClick={createProject}>
                Create
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => switchProject(project)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: activeProject?.id === project.id ? `2px solid ${project.color}` : '1px solid #e2e8f0',
              background: activeProject?.id === project.id ? `${project.color}10` : 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              color: '#0f172a'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: project.color
            }} />
            {project.name}
          </button>
        ))}
      </div>
    </div>
  );
}