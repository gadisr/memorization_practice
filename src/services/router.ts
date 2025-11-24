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
      this.handleRouteChange(window.location.pathname);
    });
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
    if (path === this.currentRoute) {
      return; // Already on this route
    }

    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }

    this.handleRouteChange(path);
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
    this.currentRoute = path;

    // Find matching route handler
    const handler = this.routes.get(path);
    if (handler) {
      handler();
    } else {
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
    const initialPath = window.location.pathname;
    this.handleRouteChange(initialPath);
  }
}

// Export singleton instance
export const router = new Router();

