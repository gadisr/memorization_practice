/**
 * Authentication pages entry point
 * Handles login.html and register.html pages
 */

import { initializeAnalytics, trackPageView } from './services/analytics.js';
import { measurementId } from './config/firebase-config.js';
import { 
  signInWithGoogle, 
  signUpWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmailToUser,
  subscribeToAuthState,
  getAuthState,
  waitForAuthInit
} from './services/auth-service.js';
import { 
  createLoginForm, 
  createRegistrationForm, 
  createPasswordResetForm 
} from './ui/auth-forms.js';

// Initialize Google Analytics
if (measurementId) {
  initializeAnalytics(measurementId);
  trackPageView(window.location.pathname, document.title);
}

// Determine which page we're on
const isLoginPage = window.location.pathname.includes('login.html');
const isRegisterPage = window.location.pathname.includes('register.html');
const isResetPage = window.location.pathname.includes('reset-password.html');

// Redirect if already authenticated
async function checkAuthAndRedirect(): Promise<void> {
  await waitForAuthInit();
  const authState = getAuthState();
  
  if (authState.isAuthenticated) {
    // Redirect to home page if already logged in
    const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
    window.location.href = returnUrl;
  }
}

// Initialize the auth page
async function initializeAuthPage(): Promise<void> {
  // Check if user is already authenticated
  await checkAuthAndRedirect();
  
  const authContent = document.getElementById('auth-content');
  if (!authContent) {
    console.error('Auth content container not found');
    return;
  }

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
  
  authContent.appendChild(authOptionsContainer);
  
  // Get form container
  const formContainer = document.getElementById('auth-form-container');
  if (!formContainer) {
    console.error('Auth form container not found');
    return;
  }
  
  // Render appropriate form based on page
  let formElements;
  if (isLoginPage) {
    formElements = createLoginForm(formContainer);
  } else if (isRegisterPage) {
    formElements = createRegistrationForm(formContainer);
  } else if (isResetPage) {
    formElements = createPasswordResetForm(formContainer);
    // Hide Google sign-in for password reset
    authOptionsContainer.querySelector('.auth-options')?.classList.add('hidden');
  } else {
    // Default to login
    formElements = createLoginForm(formContainer);
  }
  
  // Setup Google sign-in button
  const googleBtn = document.getElementById('auth-google-btn') as HTMLButtonElement | null;
  googleBtn?.addEventListener('click', async () => {
    try {
      if (googleBtn) {
        googleBtn.disabled = true;
        googleBtn.textContent = 'Signing in...';
      }
      await signInWithGoogle();
      // Redirect will happen via auth state change
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      if (googleBtn) {
        googleBtn.disabled = false;
        googleBtn.innerHTML = '<img src="https://www.google.com/favicon.ico" alt="Google sign in icon" width="20" /> Continue with Google';
      }
      showError('Failed to sign in with Google. Please try again.');
    }
  });
  
  // Setup form toggle links
  if (isLoginPage) {
    formElements.toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'register.html';
    });
    formElements.forgotPasswordLink?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'reset-password.html';
    });
  } else if (isRegisterPage) {
    formElements.toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  } else if (isResetPage) {
    formElements.toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
  
  // Subscribe to auth state changes to redirect on successful login
  subscribeToAuthState((state) => {
    if (state.isAuthenticated && !state.isLoading) {
      // Redirect to home page or return URL
      const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
      window.location.href = returnUrl;
    }
  });
}

/**
 * Show error message
 */
function showError(message: string): void {
  const authContent = document.getElementById('auth-content');
  if (!authContent) return;
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.marginTop = '1rem';
  
  // Remove existing error messages
  const existingErrors = authContent.querySelectorAll('.error-message');
  existingErrors.forEach(err => err.remove());
  
  authContent.insertBefore(errorDiv, authContent.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuthPage);
} else {
  initializeAuthPage();
}

