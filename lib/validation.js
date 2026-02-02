// Input validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  taskTitle: (title) => {
    return typeof title === 'string' && title.trim().length >= 1 && title.length <= 200;
  },

  priority: (priority) => {
    return ['low', 'medium', 'high', 'urgent'].includes(priority);
  },

  status: (status) => {
    return ['todo', 'in_progress', 'review', 'done'].includes(status);
  },

  role: (role) => {
    return ['user', 'admin', 'developer'].includes(role);
  },

  uuid: (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  },

  date: (dateString) => {
    if (!dateString) return true; // Optional field
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date > new Date('1900-01-01');
  }
};

export const sanitize = {
  string: (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  },

  html: (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>&"']/g, (match) => {
      const escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[match];
    });
  }
};

export function validateTaskData(data) {
  const errors = [];

  if (!validators.taskTitle(data.title)) {
    errors.push('Title must be 1-200 characters');
  }

  if (data.priority && !validators.priority(data.priority)) {
    errors.push('Invalid priority value');
  }

  if (data.status && !validators.status(data.status)) {
    errors.push('Invalid status value');
  }

  if (data.assigned_to && !validators.uuid(data.assigned_to)) {
    errors.push('Invalid assigned user ID');
  }

  if (data.due_date && !validators.date(data.due_date)) {
    errors.push('Invalid due date');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      title: sanitize.string(data.title),
      priority: data.priority,
      status: data.status,
      assigned_to: data.assigned_to,
      due_date: data.due_date
    }
  };
}