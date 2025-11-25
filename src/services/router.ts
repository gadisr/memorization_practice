/**
 * Client-side router for URL-based navigation
 * Supports routes: /, /stats, /drill
 */

type RouteHandler = () => void | Promise<void>;

interface RouteConfig {
  path: string;
  handler: RouteHandler;
}

class Router {
  private routes: Map<string, RouteHandler> = new Map();
  private currentRoute: string = '/';

  constructor() {
    // Listen for browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRouteChange(this.normalizePath(window.location.pathname));
    });
  }

  /**
   * Normalize pathname to route format
   * Converts /index.html to /, handles trailing slashes, etc.
   */
  private normalizePath(path: string): string {
    // Normalize /index.html to /
    if (path === '/index.html' || path === '/index' || path.endsWith('/index.html')) {
      return '/';
    }
    // Remove trailing slash except for root
    if (path !== '/' && path.endsWith('/')) {
      return path.slice(0, -1);
    }
    return path;
  }

  /**
   * Register a route with its handler
   */
  register(path: string, handler: RouteHandler): void {
    this.routes.set(path, handler);
  }

  /**
   * Navigate to a new route
   */
  navigate(path: string, replace: boolean = false): void {
    // Normalize the path
    const normalizedPath = this.normalizePath(path);
    
    console.log('Navigate called - from', this.currentRoute, 'to', normalizedPath);
    
    // Always update history and handle route change, even if already on the route
    // This ensures navigation works correctly when clicking links
    if (normalizedPath !== this.currentRoute) {
      if (replace) {
        window.history.replaceState({}, '', normalizedPath);
      } else {
        window.history.pushState({}, '', normalizedPath);
      }
    }

    // Always call handleRouteChange to ensure the screen is shown correctly
    this.handleRouteChange(normalizedPath);
  }

  /**
   * Get the current route
   */
  getCurrentRoute(): string {
    return this.currentRoute;
  }

  /**
   * Handle route change
   */
  private handleRouteChange(path: string): void {
    const normalizedPath = this.normalizePath(path);
    const previousRoute = this.currentRoute;
    this.currentRoute = normalizedPath;

    console.log('Handling route change to:', normalizedPath, 'from:', previousRoute);
    console.log('Registered routes:', Array.from(this.routes.keys()));

    // Find matching route handler
    const handler = this.routes.get(normalizedPath);
    if (handler) {
      console.log('Found handler for route:', normalizedPath);
      // Always call handler, even if route appears the same (e.g., page reload)
      // This ensures data is refreshed when navigating back from static pages
      handler();
    } else {
      console.warn('No handler found for route:', normalizedPath, '- defaulting to home');
      // Default to home if route not found
      const homeHandler = this.routes.get('/');
      if (homeHandler) {
        homeHandler();
      }
    }
  }

  /**
   * Initialize router with current path
   */
  init(): void {
    // Check for route query parameter (for navigation from static pages)
    const urlParams = new URLSearchParams(window.location.search);
    const routeParam = urlParams.get('route');
    
    if (routeParam) {
      // Use route from query parameter
      this.handleRouteChange(this.normalizePath(routeParam));
      // Clean up URL by removing query parameter
      const normalizedPath = this.normalizePath(window.location.pathname);
      window.history.replaceState({}, '', normalizedPath);
    } else {
      // Use pathname as before, normalized
      const initialPath = this.normalizePath(window.location.pathname);
      this.handleRouteChange(initialPath);
    }
  }
}

// Export singleton instance
export const router = new Router();

