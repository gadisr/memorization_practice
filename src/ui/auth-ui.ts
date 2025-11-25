/**
 * Authentication UI components and handlers
 */

import { signInWithGoogle, logOut, subscribeToAuthState, AuthState, getAuthState } from '../services/auth-service.js';
import { migrateLocalDataToAPI } from '../storage/storage-adapter.js';
import { 
  createLoginForm, 
  createRegistrationForm, 
  createPasswordResetForm,
  type AuthFormMode 
} from './auth-forms.js';

export function initializeAuthUI(): void {
  // Setup screen elements
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const userProfile = document.getElementById('user-profile');
  const userEmail = document.getElementById('user-email');
  const userAvatar = document.getElementById('user-avatar');
  
  // Navigation auth elements (moved from dashboard header to nav)
  const loginButtonNav = document.getElementById('login-button-nav');
  const logoutButtonNav = document.getElementById('logout-button-nav');
  const userProfileNav = document.getElementById('user-profile-nav');
  const userEmailNav = document.getElementById('user-email-nav');
  const userAvatarNav = document.getElementById('user-avatar-nav');
  
  // Stats screen elements
  const loginButtonStats = document.getElementById('login-button-stats');
  const logoutButtonStats = document.getElementById('logout-button-stats');
  const userProfileStats = document.getElementById('user-profile-stats');
  const userEmailStats = document.getElementById('user-email-stats');
  const userAvatarStats = document.getElementById('user-avatar-stats');
  
  // Subscribe to auth state changes
  subscribeToAuthState(async (state: AuthState) => {
    if (state.isLoading) {
      // Show loading state
      return;
    }
    
    if (state.isAuthenticated && state.user) {
      // User is logged in - update all auth UI locations
      updateAuthUI(true, state.user, {
        loginButton, logoutButton, userProfile, userEmail, userAvatar
      });
      updateAuthUI(true, state.user, {
        loginButton: loginButtonNav, 
        logoutButton: logoutButtonNav, 
        userProfile: userProfileNav, 
        userEmail: userEmailNav, 
        userAvatar: userAvatarNav
      });
      updateAuthUI(true, state.user, {
        loginButton: loginButtonStats, 
        logoutButton: logoutButtonStats, 
        userProfile: userProfileStats, 
        userEmail: userEmailStats, 
        userAvatar: userAvatarStats
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
      // User is logged out - update all auth UI locations
      updateAuthUI(false, null, {
        loginButton, logoutButton, userProfile, userEmail, userAvatar
      });
      updateAuthUI(false, null, {
        loginButton: loginButtonNav, 
        logoutButton: logoutButtonNav, 
        userProfile: userProfileNav, 
        userEmail: userEmailNav, 
        userAvatar: userAvatarNav
      });
      updateAuthUI(false, null, {
        loginButton: loginButtonStats, 
        logoutButton: logoutButtonStats, 
        userProfile: userProfileStats, 
        userEmail: userEmailStats, 
        userAvatar: userAvatarStats
      });
    }
  });
  
  // Initialize auth modal
  initializeAuthModal();
  setupAuthModalAutoClose();
  
  // Setup screen login button handler
  loginButton?.addEventListener('click', () => {
    showAuthModal('login');
  });
  
  // Navigation login button handler
  loginButtonNav?.addEventListener('click', () => {
    showAuthModal('login');
  });
  
  // Stats screen login button handler
  loginButtonStats?.addEventListener('click', () => {
    showAuthModal('login');
  });
  
  // Setup screen logout button handler
  logoutButton?.addEventListener('click', async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
  
  // Navigation logout button handler
  logoutButtonNav?.addEventListener('click', async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
  
  // Stats screen logout button handler
  logoutButtonStats?.addEventListener('click', async () => {
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
    // User is logged out - show login button
    // For nav button, always show it (it's in the navigation bar)
    if (loginButton?.id === 'login-button-nav') {
      // Always show nav login button
      loginButton?.classList.remove('hidden');
    } else {
      // For other buttons, check if we should hide based on registration prompt
      const registrationPromptContainer = document.getElementById('registration-prompt-container');
      const isHomeDashboard = registrationPromptContainer !== null;
      const isRegistrationPromptVisible = registrationPromptContainer && !registrationPromptContainer.classList.contains('hidden');
      
      if (isHomeDashboard && isRegistrationPromptVisible) {
        // Hide login button when registration prompt is visible
        loginButton?.classList.add('hidden');
      } else {
        // Show login button on other screens or when registration prompt is hidden/dismissed
        loginButton?.classList.remove('hidden');
      }
    }
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

/**
 * Refresh auth UI based on current auth state
 * This should be called when navigating to screens that display auth UI
 */
export function refreshAuthUI(): void {
  const authState = getAuthState();
  
  // Get current visible screen to scope element selection
  const visibleScreen = document.querySelector('.screen:not(.hidden)') as HTMLElement;
  
  // Get current elements (they might have been re-rendered)
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const userProfile = document.getElementById('user-profile');
  const userEmail = document.getElementById('user-email');
  const userAvatar = document.getElementById('user-avatar');
  
  // Navigation auth elements
  const loginButtonNav = document.getElementById('login-button-nav');
  const logoutButtonNav = document.getElementById('logout-button-nav');
  const userProfileNav = document.getElementById('user-profile-nav');
  const userEmailNav = document.getElementById('user-email-nav');
  const userAvatarNav = document.getElementById('user-avatar-nav');
  
  // Stats screen elements - find within visible screen to avoid duplicate ID issues
  let loginButtonStats: HTMLElement | null = null;
  let logoutButtonStats: HTMLElement | null = null;
  let userProfileStats: HTMLElement | null = null;
  let userEmailStats: HTMLElement | null = null;
  let userAvatarStats: HTMLElement | null = null;
  
  if (visibleScreen) {
    loginButtonStats = visibleScreen.querySelector('#login-button-stats') as HTMLElement;
    logoutButtonStats = visibleScreen.querySelector('#logout-button-stats') as HTMLElement;
    userProfileStats = visibleScreen.querySelector('#user-profile-stats') as HTMLElement;
    userEmailStats = visibleScreen.querySelector('#user-email-stats') as HTMLElement;
    userAvatarStats = visibleScreen.querySelector('#user-avatar-stats') as HTMLElement;
  }
  
  // Fallback to getElementById if not found in visible screen
  if (!loginButtonStats) loginButtonStats = document.getElementById('login-button-stats');
  if (!logoutButtonStats) logoutButtonStats = document.getElementById('logout-button-stats');
  if (!userProfileStats) userProfileStats = document.getElementById('user-profile-stats');
  if (!userEmailStats) userEmailStats = document.getElementById('user-email-stats');
  if (!userAvatarStats) userAvatarStats = document.getElementById('user-avatar-stats');
  
  if (authState.isAuthenticated && authState.user) {
    // User is logged in - update all auth UI locations
    updateAuthUI(true, authState.user, {
      loginButton, logoutButton, userProfile, userEmail, userAvatar
    });
    updateAuthUI(true, authState.user, {
      loginButton: loginButtonNav, 
      logoutButton: logoutButtonNav, 
      userProfile: userProfileNav, 
      userEmail: userEmailNav, 
      userAvatar: userAvatarNav
    });
    updateAuthUI(true, authState.user, {
      loginButton: loginButtonStats, 
      logoutButton: logoutButtonStats, 
      userProfile: userProfileStats, 
      userEmail: userEmailStats, 
      userAvatar: userAvatarStats
    });
  } else {
    // User is logged out - update all auth UI locations
    updateAuthUI(false, null, {
      loginButton, logoutButton, userProfile, userEmail, userAvatar
    });
    updateAuthUI(false, null, {
      loginButton: loginButtonNav, 
      logoutButton: logoutButtonNav, 
      userProfile: userProfileNav, 
      userEmail: userEmailNav, 
      userAvatar: userAvatarNav
    });
    updateAuthUI(false, null, {
      loginButton: loginButtonStats, 
      logoutButton: logoutButtonStats, 
      userProfile: userProfileStats, 
      userEmail: userEmailStats, 
      userAvatar: userAvatarStats
    });
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
    const statsScreen = document.getElementById('stats-screen');
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

/**
 * Initialize auth modal with form switching
 */
function initializeAuthModal(): void {
  const authModal = document.getElementById('auth-modal');
  const closeAuthModalBtn = document.getElementById('close-auth-modal-btn');
  const authModalBody = document.getElementById('auth-modal-body');
  const authModalTitle = document.getElementById('auth-modal-title');

  if (!authModal || !authModalBody || !authModalTitle) {
    console.error('Auth modal elements not found');
    return;
  }

  // Close modal handlers
  closeAuthModalBtn?.addEventListener('click', () => {
    hideAuthModal();
  });

  // Close modal when clicking outside
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      hideAuthModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
      hideAuthModal();
    }
  });
}

/**
 * Show auth modal with specified mode
 */
export function showAuthModal(mode: AuthFormMode = 'login'): void {
  const authModal = document.getElementById('auth-modal');
  const authModalBody = document.getElementById('auth-modal-body');
  const authModalTitle = document.getElementById('auth-modal-title');

  if (!authModal || !authModalBody || !authModalTitle) {
    console.error('Auth modal elements not found');
    return;
  }

  // Create container for auth options and forms
  authModalBody.innerHTML = '';
  
  // Create auth options container
  const authOptionsContainer = document.createElement('div');
  authOptionsContainer.className = 'auth-options-container';
  
  // Show auth options (Google sign-in and Email/Password)
  authOptionsContainer.innerHTML = `
    <div class="auth-options">
      <button id="auth-google-btn" class="btn btn-auth btn-full-width">
        <img src="https://www.google.com/favicon.ico" alt="Google sign in icon" width="20" />
        Continue with Google
      </button>
      <div class="auth-divider">
        <span>or</span>
      </div>
    </div>
    <div id="auth-form-container"></div>
  `;
  
  authModalBody.appendChild(authOptionsContainer);
  
  // Set modal title
  const titles: Record<AuthFormMode, string> = {
    login: 'Sign In',
    register: 'Create Account',
    reset: 'Reset Password'
  };
  authModalTitle.textContent = titles[mode] || 'Sign In';
  
  // Get form container
  const formContainer = document.getElementById('auth-form-container');
  if (!formContainer) {
    console.error('Auth form container not found');
    return;
  }
  
  // Render appropriate form
  let formElements;
  if (mode === 'login') {
    formElements = createLoginForm(formContainer);
  } else if (mode === 'register') {
    formElements = createRegistrationForm(formContainer);
  } else {
    formElements = createPasswordResetForm(formContainer);
  }
  
  // Setup Google sign-in button
  const googleBtn = document.getElementById('auth-google-btn');
  googleBtn?.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
      hideAuthModal();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      // Error will be shown by the auth service
    }
  });
  
  // Setup form toggle links
  if (mode === 'login') {
    formElements.toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('register');
    });
    formElements.forgotPasswordLink?.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('reset');
    });
  } else if (mode === 'register') {
    formElements.toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('login');
    });
  } else if (mode === 'reset') {
    formElements.toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('login');
    });
  }
  
  // Show modal
  authModal.classList.remove('hidden');
}

/**
 * Hide auth modal
 */
function hideAuthModal(): void {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.classList.add('hidden');
  }
}

/**
 * Close auth modal when user successfully authenticates
 * This is set up in initializeAuthUI to avoid duplicate subscriptions
 */
function setupAuthModalAutoClose(): void {
  subscribeToAuthState((state: AuthState) => {
    if (state.isAuthenticated) {
      hideAuthModal();
    }
  });
}

