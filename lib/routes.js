// Route constants to prevent string bugs
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  DEVELOPER: '/developer',
  PROFILE: '/profile',
  
  // API routes
  API: {
    HEALTH: '/api/health',
    TASKS: '/api/tasks',
    PROFILE: '/api/profile',
    ADMIN_PERFORMANCE: '/api/admin/performance'
  }
};

// Navigation helpers
export function getRoute(routeName, params = {}) {
  const route = ROUTES[routeName];
  if (!route) {
    throw new Error(`Route ${routeName} not found`);
  }
  
  // Simple parameter replacement
  let finalRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`[${key}]`, value);
  });
  
  return finalRoute;
}

// Role-based route access
export const ROLE_ROUTES = {
  admin: [ROUTES.DASHBOARD, ROUTES.ADMIN, ROUTES.PROFILE],
  developer: [ROUTES.DASHBOARD, ROUTES.DEVELOPER, ROUTES.PROFILE],
  user: [ROUTES.DASHBOARD, ROUTES.PROFILE]
};

export function canAccessRoute(userRole, route) {
  const allowedRoutes = ROLE_ROUTES[userRole] || [];
  return allowedRoutes.includes(route);
}