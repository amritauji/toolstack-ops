"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CommandPalette({ tasks = [], users = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);

  const commands = [
    { id: 'create', label: 'Create new task', icon: '➕', action: () => router.push('/dashboard?create=true') },
    { id: 'dashboard', label: 'Go to Dashboard', icon: '📊', action: () => router.push('/dashboard') },
    { id: 'profile', label: 'Go to Profile', icon: '👤', action: () => router.push('/profile') },
    { id: 'analytics', label: 'Go to Analytics', icon: '📈', action: () => router.push('/analytics') },
    { id: 'mytasks', label: 'Show My Tasks', icon: '✓', action: () => router.push('/dashboard?filter=my') },
  ];

  const filteredCommands = search
    ? commands.filter(cmd => cmd.label.toLowerCase().includes(search.toLowerCase()))
    : commands;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch("");
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelected(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelected(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === 'Enter' && filteredCommands[selected]) {
          e.preventDefault();
          filteredCommands[selected].action();
          setIsOpen(false);
          setSearch("");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selected, filteredCommands, router]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        zIndex: 9999
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelected(0);
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              fontSize: '16px',
              outline: 'none',
              background: '#f8fafc',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Commands List */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                  setSearch("");
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: selected === index ? '#f0f4ff' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: '#0f172a',
                  textAlign: 'left',
                  transition: 'background 0.15s'
                }}
              >
                <span style={{ fontSize: '20px' }}>{cmd.icon}</span>
                <span style={{ flex: 1 }}>{cmd.label}</span>
                {selected === index && (
                  <kbd style={{
                    background: '#e2e8f0',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}>
                    ↵
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>↑↓</kbd>
            Navigate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>↵</kbd>
            Select
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
