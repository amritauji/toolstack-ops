"use client";

import { useState, useEffect } from 'react';
import { generateApiKey, revokeApiKey, getApiKeys } from '@/lib/apiKeys';

export default function ApiDocsClient({ profile }) {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadKey = async () => {
      try {
        const keys = await getApiKeys();
        if (keys && keys.length > 0) {
          setApiKey(keys[0].key_prefix + '...');
        }
      } catch (error) {
        console.error('Load API key error:', error);
      }
    };
    loadKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const keys = await getApiKeys();
      if (keys && keys.length > 0) {
        setApiKey(keys[0].key_prefix + '...');
      }
    } catch (error) {
      console.error('Load API key error:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateApiKey('API Key');
      setApiKey(result.key);
    } catch (error) {
      console.error('Generate API key error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Are you sure? This will invalidate your current API key.')) return;
    setLoading(true);
    try {
      const keys = await getApiKeys();
      if (keys && keys.length > 0) {
        await revokeApiKey(keys[0].id);
      }
      setApiKey(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasApiAccess = profile?.plan === 'professional' || profile?.plan === 'enterprise';

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>API Documentation</h1>

      {/* API Key Management */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔑 API Key</h2>
        {!hasApiAccess ? (
          <div style={styles.upgradeBox}>
            <p style={styles.upgradeText}>
              API access requires Professional or Enterprise plan
            </p>
            <button style={styles.upgradeButton}>Upgrade Plan</button>
          </div>
        ) : (
          <div>
            {apiKey ? (
              <div>
                <div style={styles.keyBox}>
                  <code style={styles.keyText}>{apiKey}</code>
                  <button onClick={handleCopy} style={styles.copyButton}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <button onClick={handleRevoke} disabled={loading} style={styles.revokeButton}>
                  {loading ? 'Revoking...' : 'Revoke Key'}
                </button>
              </div>
            ) : (
              <button onClick={handleGenerate} disabled={loading} style={styles.generateButton}>
                {loading ? 'Generating...' : '🔑 Generate API Key'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('overview')}
          style={activeTab === 'overview' ? styles.tabActive : styles.tab}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          style={activeTab === 'tasks' ? styles.tabActive : styles.tab}
        >
          Tasks API
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          style={activeTab === 'examples' ? styles.tabActive : styles.tab}
        >
          Examples
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Getting Started</h2>
          <p style={styles.text}>
            The ToolStack Ops API is a REST API that allows you to programmatically manage tasks, users, and projects.
          </p>
          
          <h3 style={styles.sectionTitle}>Base URL</h3>
          <code style={styles.codeBlock}>https://your-domain.com/api/v1</code>
          
          <h3 style={styles.sectionTitle}>Authentication</h3>
          <p style={styles.text}>Include your API key in the request header:</p>
          <pre style={styles.codeBlock}>
{`x-api-key: your-api-key-here`}
          </pre>
          
          <h3 style={styles.sectionTitle}>Rate Limits</h3>
          <ul style={styles.list}>
            <li>100 requests per hour per API key</li>
            <li>Rate limit headers included in every response</li>
            <li>429 status code when limit exceeded</li>
          </ul>
        </div>
      )}

      {/* Tasks API Tab */}
      {activeTab === 'tasks' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Tasks API</h2>
          
          <div style={styles.endpoint}>
            <div style={styles.endpointHeader}>
              <span style={styles.methodGet}>GET</span>
              <code>/api/v1/tasks</code>
            </div>
            <p style={styles.text}>Get all tasks with optional filters</p>
            <h4 style={styles.paramTitle}>Query Parameters:</h4>
            <ul style={styles.list}>
              <li><code>status</code> - Filter by status (todo, in_progress, done)</li>
              <li><code>priority</code> - Filter by priority (low, medium, high)</li>
              <li><code>assigned_to</code> - Filter by user ID</li>
              <li><code>limit</code> - Number of results (default: 100)</li>
              <li><code>offset</code> - Pagination offset (default: 0)</li>
            </ul>
          </div>

          <div style={styles.endpoint}>
            <div style={styles.endpointHeader}>
              <span style={styles.methodPost}>POST</span>
              <code>/api/v1/tasks</code>
            </div>
            <p style={styles.text}>Create a new task</p>
            <h4 style={styles.paramTitle}>Request Body:</h4>
            <pre style={styles.codeBlock}>
{`{
  "title": "Task title (required)",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "assigned_to": "user-id",
  "due_date": "2025-01-31"
}`}
            </pre>
          </div>

          <div style={styles.endpoint}>
            <div style={styles.endpointHeader}>
              <span style={styles.methodGet}>GET</span>
              <code>/api/v1/tasks/:id</code>
            </div>
            <p style={styles.text}>Get a single task by ID</p>
          </div>

          <div style={styles.endpoint}>
            <div style={styles.endpointHeader}>
              <span style={styles.methodPatch}>PATCH</span>
              <code>/api/v1/tasks/:id</code>
            </div>
            <p style={styles.text}>Update a task</p>
          </div>

          <div style={styles.endpoint}>
            <div style={styles.endpointHeader}>
              <span style={styles.methodDelete}>DELETE</span>
              <code>/api/v1/tasks/:id</code>
            </div>
            <p style={styles.text}>Delete a task</p>
          </div>
        </div>
      )}

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Code Examples</h2>
          
          <h3 style={styles.sectionTitle}>cURL</h3>
          <pre style={styles.codeBlock}>
{`# Get all tasks
curl -X GET https://your-domain.com/api/v1/tasks \\
  -H "x-api-key: your-api-key"

# Create a task
curl -X POST https://your-domain.com/api/v1/tasks \\
  -H "x-api-key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New Task", "priority": "high"}'`}
          </pre>

          <h3 style={styles.sectionTitle}>JavaScript</h3>
          <pre style={styles.codeBlock}>
{`const API_KEY = 'your-api-key';
const BASE_URL = 'https://your-domain.com/api/v1';

// Get all tasks
const response = await fetch(\`\${BASE_URL}/tasks\`, {
  headers: { 'x-api-key': API_KEY }
});
const data = await response.json();

// Create a task
const newTask = await fetch(\`\${BASE_URL}/tasks\`, {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Task',
    priority: 'high'
  })
});`}
          </pre>

          <h3 style={styles.sectionTitle}>Python</h3>
          <pre style={styles.codeBlock}>
{`import requests

API_KEY = 'your-api-key'
BASE_URL = 'https://your-domain.com/api/v1'

# Get all tasks
response = requests.get(
    f'{BASE_URL}/tasks',
    headers={'x-api-key': API_KEY}
)
tasks = response.json()

# Create a task
new_task = requests.post(
    f'{BASE_URL}/tasks',
    headers={'x-api-key': API_KEY},
    json={'title': 'New Task', 'priority': 'high'}
)`}
          </pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '32px'
  },
  card: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '20px'
  },
  upgradeBox: {
    background: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center'
  },
  upgradeText: {
    fontSize: '16px',
    color: '#92400e',
    marginBottom: '16px'
  },
  upgradeButton: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  keyBox: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px'
  },
  keyText: {
    flex: 1,
    background: '#f1f5f9',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    wordBreak: 'break-all'
  },
  copyButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  generateButton: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  revokeButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: '#f9fafb',
    padding: '4px',
    borderRadius: '8px',
    width: 'fit-content'
  },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#6b7280',
    cursor: 'pointer'
  },
  tabActive: {
    padding: '12px 24px',
    background: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  text: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginTop: '24px',
    marginBottom: '12px'
  },
  codeBlock: {
    background: '#1e293b',
    color: '#e2e8f0',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'monospace',
    overflow: 'auto',
    marginBottom: '16px'
  },
  list: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.8',
    paddingLeft: '24px'
  },
  endpoint: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #e2e8f0'
  },
  endpointHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  methodGet: {
    background: '#10b981',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700
  },
  methodPost: {
    background: '#3b82f6',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700
  },
  methodPatch: {
    background: '#f59e0b',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700
  },
  methodDelete: {
    background: '#ef4444',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700
  },
  paramTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    marginTop: '12px',
    marginBottom: '8px'
  }
};
