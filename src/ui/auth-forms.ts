/**
 * Email/Password authentication form components
 */

import { 
  signUpWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmailToUser 
} from '../services/auth-service.js';

export type AuthFormMode = 'login' | 'register' | 'reset';

export interface AuthFormElements {
  container: HTMLElement;
  emailInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  confirmPasswordInput?: HTMLInputElement;
  submitButton: HTMLButtonElement;
  errorMessage: HTMLElement;
  toggleLink: HTMLElement;
  forgotPasswordLink?: HTMLElement;
}

/**
 * Create and render registration form
 */
export function createRegistrationForm(container: HTMLElement): AuthFormElements {
  container.innerHTML = `
    <div class="auth-form">
      <h3>Create Account</h3>
      <form id="register-form">
        <div class="form-group">
          <label for="register-email">Email</label>
          <input 
            type="email" 
            id="register-email" 
            class="input-field" 
            required 
            autocomplete="email"
            placeholder="your@email.com"
          />
        </div>
        <div class="form-group">
          <label for="register-password">Password</label>
          <input 
            type="password" 
            id="register-password" 
            class="input-field" 
            required 
            autocomplete="new-password"
            minlength="6"
            placeholder="At least 6 characters"
          />
        </div>
        <div class="form-group">
          <label for="register-confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="register-confirm-password" 
            class="input-field" 
            required 
            autocomplete="new-password"
            placeholder="Re-enter password"
          />
        </div>
        <div id="register-error" class="error-message hidden"></div>
        <button type="submit" id="register-submit" class="btn btn-primary">Create Account</button>
        <p class="auth-form-footer">
          Already have an account? 
          <a href="#" id="register-to-login-link" class="auth-link">Sign in</a>
        </p>
      </form>
    </div>
  `;

  const emailInput = container.querySelector('#register-email') as HTMLInputElement;
  const passwordInput = container.querySelector('#register-password') as HTMLInputElement;
  const confirmPasswordInput = container.querySelector('#register-confirm-password') as HTMLInputElement;
  const submitButton = container.querySelector('#register-submit') as HTMLButtonElement;
  const errorMessage = container.querySelector('#register-error') as HTMLElement;
  const toggleLink = container.querySelector('#register-to-login-link') as HTMLElement;
  const form = container.querySelector('#register-form') as HTMLFormElement;

  // Form validation and submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleRegistration(emailInput, passwordInput, confirmPasswordInput!, submitButton, errorMessage);
  });

  return {
    container,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    submitButton,
    errorMessage,
    toggleLink
  };
}

/**
 * Create and render login form
 */
export function createLoginForm(container: HTMLElement): AuthFormElements {
  container.innerHTML = `
    <div class="auth-form">
      <h3>Sign In</h3>
      <form id="login-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input 
            type="email" 
            id="login-email" 
            class="input-field" 
            required 
            autocomplete="email"
            placeholder="your@email.com"
          />
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input 
            type="password" 
            id="login-password" 
            class="input-field" 
            required 
            autocomplete="current-password"
            placeholder="Enter your password"
          />
        </div>
        <div id="login-error" class="error-message hidden"></div>
        <button type="submit" id="login-submit" class="btn btn-primary">Sign In</button>
        <p class="auth-form-footer">
          <a href="#" id="login-forgot-password-link" class="auth-link">Forgot password?</a>
        </p>
        <p class="auth-form-footer">
          Don't have an account? 
          <a href="#" id="login-to-register-link" class="auth-link">Create one</a>
        </p>
      </form>
    </div>
  `;

  const emailInput = container.querySelector('#login-email') as HTMLInputElement;
  const passwordInput = container.querySelector('#login-password') as HTMLInputElement;
  const submitButton = container.querySelector('#login-submit') as HTMLButtonElement;
  const errorMessage = container.querySelector('#login-error') as HTMLElement;
  const toggleLink = container.querySelector('#login-to-register-link') as HTMLElement;
  const forgotPasswordLink = container.querySelector('#login-forgot-password-link') as HTMLElement;
  const form = container.querySelector('#login-form') as HTMLFormElement;

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin(emailInput, passwordInput, submitButton, errorMessage);
  });

  return {
    container,
    emailInput,
    passwordInput,
    submitButton,
    errorMessage,
    toggleLink,
    forgotPasswordLink
  };
}

/**
 * Create and render password reset form
 */
export function createPasswordResetForm(container: HTMLElement): AuthFormElements {
  container.innerHTML = `
    <div class="auth-form">
      <h3>Reset Password</h3>
      <form id="reset-form">
        <div class="form-group">
          <label for="reset-email">Email</label>
          <input 
            type="email" 
            id="reset-email" 
            class="input-field" 
            required 
            autocomplete="email"
            placeholder="your@email.com"
          />
        </div>
        <div id="reset-error" class="error-message hidden"></div>
        <div id="reset-success" class="success-message hidden"></div>
        <button type="submit" id="reset-submit" class="btn btn-primary">Send Reset Email</button>
        <p class="auth-form-footer">
          Remember your password? 
          <a href="#" id="reset-to-login-link" class="auth-link">Sign in</a>
        </p>
      </form>
    </div>
  `;

  const emailInput = container.querySelector('#reset-email') as HTMLInputElement;
  const submitButton = container.querySelector('#reset-submit') as HTMLButtonElement;
  const errorMessage = container.querySelector('#reset-error') as HTMLElement;
  const successMessage = container.querySelector('#reset-success') as HTMLElement;
  const toggleLink = container.querySelector('#reset-to-login-link') as HTMLElement;
  const form = container.querySelector('#reset-form') as HTMLFormElement;

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handlePasswordReset(emailInput, submitButton, errorMessage, successMessage);
  });

  return {
    container,
    emailInput,
    passwordInput: emailInput, // Placeholder for type compatibility
    submitButton,
    errorMessage,
    toggleLink
  };
}

/**
 * Handle registration form submission
 */
async function handleRegistration(
  emailInput: HTMLInputElement,
  passwordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  submitButton: HTMLButtonElement,
  errorMessage: HTMLElement
): Promise<void> {
  // Clear previous errors
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';

  // Get form values
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Client-side validation
  if (!email) {
    showError(errorMessage, 'Please enter your email address.');
    return;
  }

  if (!isValidEmail(email)) {
    showError(errorMessage, 'Please enter a valid email address.');
    return;
  }

  if (!password) {
    showError(errorMessage, 'Please enter a password.');
    return;
  }

  if (password.length < 6) {
    showError(errorMessage, 'Password must be at least 6 characters long.');
    return;
  }

  if (password !== confirmPassword) {
    showError(errorMessage, 'Passwords do not match.');
    return;
  }

  // Disable submit button
  submitButton.disabled = true;
  submitButton.textContent = 'Creating Account...';

  try {
    await signUpWithEmailAndPassword(email, password);
    // Success - auth state will update automatically
  } catch (error: any) {
    showError(errorMessage, error.message || 'Failed to create account. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = 'Create Account';
  }
}

/**
 * Handle login form submission
 */
async function handleLogin(
  emailInput: HTMLInputElement,
  passwordInput: HTMLInputElement,
  submitButton: HTMLButtonElement,
  errorMessage: HTMLElement
): Promise<void> {
  // Clear previous errors
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';

  // Get form values
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Client-side validation
  if (!email) {
    showError(errorMessage, 'Please enter your email address.');
    return;
  }

  if (!isValidEmail(email)) {
    showError(errorMessage, 'Please enter a valid email address.');
    return;
  }

  if (!password) {
    showError(errorMessage, 'Please enter your password.');
    return;
  }

  // Disable submit button
  submitButton.disabled = true;
  submitButton.textContent = 'Signing In...';

  try {
    await signInWithEmailAndPassword(email, password);
    // Success - auth state will update automatically
  } catch (error: any) {
    showError(errorMessage, error.message || 'Failed to sign in. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = 'Sign In';
  }
}

/**
 * Handle password reset form submission
 */
async function handlePasswordReset(
  emailInput: HTMLInputElement,
  submitButton: HTMLButtonElement,
  errorMessage: HTMLElement,
  successMessage: HTMLElement
): Promise<void> {
  // Clear previous messages
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
  successMessage.classList.add('hidden');
  successMessage.textContent = '';

  // Get form value
  const email = emailInput.value.trim();

  // Client-side validation
  if (!email) {
    showError(errorMessage, 'Please enter your email address.');
    return;
  }

  if (!isValidEmail(email)) {
    showError(errorMessage, 'Please enter a valid email address.');
    return;
  }

  // Disable submit button
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    await sendPasswordResetEmailToUser(email);
    // Show success message
    successMessage.textContent = 'Password reset email sent! Check your inbox for instructions.';
    successMessage.classList.remove('hidden');
    emailInput.value = '';
  } catch (error: any) {
    showError(errorMessage, error.message || 'Failed to send reset email. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = 'Send Reset Email';
  }
}

/**
 * Show error message
 */
function showError(errorElement: HTMLElement, message: string): void {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


