/**
 * Authentication UI components and handlers
 */

import { signInWithGoogle, logOut, subscribeToAuthState, AuthState } from '../services/auth-service.js';
import { migrateLocalDataToAPI } from '../storage/storage-adapter.js';

export function initializeAuthUI(): void {
  // Setup screen elements
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const userProfile = document.getElementById('user-profile');
  const userEmail = document.getElementById('user-email');
  const userAvatar = document.getElementById('user-avatar');
  
  // Dashboard screen elements
  const loginButtonDashboard = document.getElementById('login-button-dashboard');
  const logoutButtonDashboard = document.getElementById('logout-button-dashboard');
  const userProfileDashboard = document.getElementById('user-profile-dashboard');
  const userEmailDashboard = document.getElementById('user-email-dashboard');
  const userAvatarDashboard = document.getElementById('user-avatar-dashboard');
  
  // Subscribe to auth state changes
  subscribeToAuthState(async (state: AuthState) => {
    if (state.isLoading) {
      // Show loading state
      return;
    }
    
    if (state.isAuthenticated && state.user) {
      // User is logged in - update both screens
      updateAuthUI(true, state.user, {
        loginButton, logoutButton, userProfile, userEmail, userAvatar
      });
      updateAuthUI(true, state.user, {
        loginButton: loginButtonDashboard, 
        logoutButton: logoutButtonDashboard, 
        userProfile: userProfileDashboard, 
        userEmail: userEmailDashboard, 
        userAvatar: userAvatarDashboard
      });
      
      // Migrate local data if any exists
      try {
        await migrateLocalDataToAPI();
      } catch (error) {
        console.error('Migration failed:', error);
      }
      
      // Refresh dashboard with API data
      await refreshDashboard();
    } else {
      // User is logged out - update both screens
      updateAuthUI(false, null, {
        loginButton, logoutButton, userProfile, userEmail, userAvatar
      });
      updateAuthUI(false, null, {
        loginButton: loginButtonDashboard, 
        logoutButton: logoutButtonDashboard, 
        userProfile: userProfileDashboard, 
        userEmail: userEmailDashboard, 
        userAvatar: userAvatarDashboard
      });
    }
  });
  
  // Setup screen login button handler
  loginButton?.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  });
  
  // Dashboard screen login button handler
  loginButtonDashboard?.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  });
  
  // Setup screen logout button handler
  logoutButton?.addEventListener('click', async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
  
  // Dashboard screen logout button handler
  logoutButtonDashboard?.addEventListener('click', async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
}

function updateAuthUI(isAuthenticated: boolean, user: any, elements: {
  loginButton: HTMLElement | null;
  logoutButton: HTMLElement | null;
  userProfile: HTMLElement | null;
  userEmail: HTMLElement | null;
  userAvatar: HTMLElement | null;
}): void {
  const { loginButton, logoutButton, userProfile, userEmail, userAvatar } = elements;
  
  if (isAuthenticated && user) {
    // User is logged in - show profile, hide login button
    loginButton?.classList.add('hidden');
    userProfile?.classList.remove('hidden');
    
    // Update user information
    if (userEmail) userEmail.textContent = user.email || '';
    if (userAvatar && user.photoURL) {
      (userAvatar as HTMLImageElement).src = user.photoURL;
      (userAvatar as HTMLImageElement).alt = user.displayName || 'User avatar';
      userAvatar.classList.remove('hidden');
    } else if (userAvatar) {
      userAvatar.classList.add('hidden');
    }
  } else {
    // User is logged out - show login button, hide profile
    loginButton?.classList.remove('hidden');
    userProfile?.classList.add('hidden');
    
    // Clear user information
    if (userEmail) userEmail.textContent = '';
    if (userAvatar) {
      (userAvatar as HTMLImageElement).src = '';
      (userAvatar as HTMLImageElement).alt = '';
      userAvatar.classList.add('hidden');
    }
  }
}

async function refreshDashboard(): Promise<void> {
  // Reload dashboard data from API
  // Dispatch event to notify app.ts to refresh dashboard
  const event = new CustomEvent('auth-state-changed');
  window.dispatchEvent(event);
  
  // Also directly refresh if we can import the function
  // Use dynamic import to avoid circular dependencies
  try {
    // Check if we're on a screen that should show dashboard
    const homeDashboardScreen = document.getElementById('home-dashboard-screen');
    if (homeDashboardScreen && !homeDashboardScreen.classList.contains('hidden')) {
      // Dynamically import and call the refresh function
      const appModule = await import('../app.js');
      if ((appModule as any).loadAndRenderHomeDashboard) {
        await (appModule as any).loadAndRenderHomeDashboard();
      }
    }
  } catch (error) {
    // Function might not be available yet, that's okay
    console.log('Dashboard will refresh via event listener');
  }
}

