/**
 * Keyboard shortcuts handler
 */

export type KeyboardCallback = {
  space?: () => void;
  enter?: () => void;
  escape?: () => void;
  numbers?: (num: number) => void;
  arrowLeft?: () => void;
  arrowRight?: () => void;
};

let currentCallbacks: KeyboardCallback = {};

export function initializeKeyboardHandler(): void {
  document.addEventListener('keydown', handleKeyPress);
}

export function setKeyboardCallbacks(callbacks: KeyboardCallback): void {
  currentCallbacks = callbacks;
}

export function clearKeyboardCallbacks(): void {
  currentCallbacks = {};
}

function handleKeyPress(event: KeyboardEvent): void {
  // Don't trigger shortcuts if user is typing in an input
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
    return;
  }
  
  switch (event.key) {
    case ' ':
      event.preventDefault();
      if (currentCallbacks.space) {
        currentCallbacks.space();
      }
      break;
      
    case 'Enter':
      event.preventDefault();
      if (currentCallbacks.enter) {
        currentCallbacks.enter();
      }
      break;
      
    case 'Escape':
      event.preventDefault();
      if (currentCallbacks.escape) {
        currentCallbacks.escape();
      }
      break;
      
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      if (currentCallbacks.numbers) {
        const num = parseInt(event.key, 10);
        currentCallbacks.numbers(num);
      }
      break;
      
    case 'ArrowLeft':
      event.preventDefault();
      if (currentCallbacks.arrowLeft) {
        currentCallbacks.arrowLeft();
      }
      break;
      
    case 'ArrowRight':
      event.preventDefault();
      if (currentCallbacks.arrowRight) {
        currentCallbacks.arrowRight();
      }
      break;
  }
}

export function removeKeyboardHandler(): void {
  document.removeEventListener('keydown', handleKeyPress);
}


