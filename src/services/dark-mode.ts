/**
 * Dark mode toggle service
 */

/**
 * Initialize dark mode based on user preference or system preference
 * Defaults to dark mode if no preference is saved
 */
export function initializeDarkMode(): void {
  const savedTheme = localStorage.getItem('theme');
  
  // Default to dark mode if no preference is saved
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Dark mode by default (either saved as dark, or no preference saved)
    document.documentElement.classList.add('dark');
    // If no theme saved, save dark as default
    if (!savedTheme) {
      localStorage.setItem('theme', 'dark');
    }
  }
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode(): void {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Check if dark mode is currently enabled
 */
export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

