/**
 * Playground module for AnimCubeJS cube visualization and manipulation
 */

// Global state
let sequence: string[] = [];
let cubeInitialized = false;
let currentCubeState = ''; // Track moves that have been applied to maintain cube state

// AnimCubeJS global variables (declared as any to avoid type errors)
declare global {
  interface Window {
    AnimCube3?: (params: string) => void;
    acjs_removeListeners?: { [key: string]: () => void };
    acjs_toggleLetters?: { [key: string]: () => void };
    acjs_showLetters?: { [key: string]: boolean };
    acjs_setLetters?: { [key: string]: (letters: string) => void };
    acjs_setShowLetters?: { [key: string]: (show: boolean) => void };
    acjs_letterOrientations?: { [key: string]: { [face: number]: string } };
    acjs_cube_animating?: boolean;
  }
}

// Cube positions data - embedded from cube-positions.json
const cubePositionsData = [
  { "plane": "U", "center": "white", "letters": [["A", "a", "B"], ["d", "*", "b"], ["D", "c", "C"]] },
  { "plane": "L", "center": "orange", "letters": [["E", "e", "F"], ["h", "*", "f"], ["H", "g", "G"]] },
  { "plane": "F", "center": "green", "letters": [["I", "i", "J"], ["l", "*", "j"], ["L", "k", "K"]] },
  { "plane": "R", "center": "red", "letters": [["M", "m", "N"], ["o", "Q", "n"], ["O", "p", "P"]] },
  { "plane": "B", "center": "blue", "letters": [["Q", "q", "R"], ["s", "T", "r"], ["S", "t", "T"]] },
  { "plane": "D", "center": "yellow", "letters": [["U", "u", "V"], ["w", "X", "v"], ["W", "x", "X"]] }
];

// Setup moves data
const edgeSetupMoves: { [key: string]: string } = {
  "a": "Lw2 D' L2",
  "b": "", // Buffer position
  "c": "Lw2 D L2",
  "d": "", // No setup move needed
  "e": "L' Dw L'",
  "f": "Dw' L",
  "g": "L Dw L'",
  "h": "Dw L'",
  "i": "Lw D' L2",
  "j": "Dw2 L",
  "k": "Lw D L2",
  "l": "L'",
  "n": "Dw L",
  "o": "D' Lw D L2",
  "p": "Dw' L'",
  "q": "Lw' D L2",
  "r": "L",
  "s": "Lw' D' L2",
  "t": "Dw2 L'",
  "u": "D' L2",
  "v": "D2 L2",
  "w": "D L2",
  "x": "L2"
};

const cornerSetupMoves: { [key: string]: string } = {
  "B": "R D'",
  "C": "F",
  "D": "F R'",
  "F": "F2",
  "G": "D2 R",
  "H": "D2",
  "I": "F' D",
  "J": "F2 D",
  "K": "D R",
  "L": "D",
  "M": "R'",
  "N": "R2",
  "O": "R",
  "P": "", // Buffer position
  "Q": "R' F",
  "S": "D' R",
  "T": "D'",
  "U": "F'",
  "V": "D' F'",
  "W": "D2 F'",
  "X": "D F'"
};

/**
 * Load AnimCubeJS script dynamically
 */
function loadAnimCubeJS(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window.AnimCube3 !== 'undefined') {
      console.log('AnimCubeJS already loaded');
      resolve();
      return;
    }

    console.log('Loading AnimCubeJS script from local file...');
    const script = document.createElement('script');
    script.src = 'public/AnimCube3.js';
    script.async = true;
    script.onload = () => {
      console.log('AnimCubeJS script loaded successfully');
      // Wait a bit for AnimCube3 to be fully available
      setTimeout(() => {
        if (typeof window.AnimCube3 !== 'undefined') {
          console.log('AnimCube3 is available');
          resolve();
        } else {
          console.error('AnimCube3 not available after load');
          reject(new Error('AnimCube3 not available'));
        }
      }, 200);
    };
    script.onerror = () => {
      console.error('Failed to load local AnimCubeJS script. Make sure public/AnimCube3.js exists.');
      reject(new Error('Failed to load AnimCubeJS script'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Initialize the cube
 */
function initializeCube(): void {
  const container = document.getElementById('cube');
  if (!container) {
    console.error('Cube container not found');
    return;
  }

  // Ensure container is ready
  if (typeof window.AnimCube3 === 'undefined') {
    console.error('AnimCube3 not available');
    setTimeout(initializeCube, 100);
    return;
  }

  try {
    const params = [
      'id=cube',
      'size=350',
      'bgColor=white',
      'scheme=WOBGRY',
      'edit=0',
      'buttons=1',
      'sliders=1',
      'colors=WOBGRY',
      'speed=1',
      'wca=1',
      'facelets=wwwwwwwwwyyyyyyyyygggggggggbbbbbbbbbooooooooorrrrrrrrr',
      'initmove='
    ].join('&');
    
    console.log('Initializing cube with params:', params);
    window.AnimCube3!(params);
    
    // Wait a bit and check if cube was created
    setTimeout(() => {
      const cubeElement = document.getElementById('cube');
      if (cubeElement && cubeElement.children.length > 0) {
        cubeInitialized = true;
        console.log('Cube initialized successfully');
        // Load and apply letters from JSON after a delay to ensure AnimCube3 is fully initialized
        setTimeout(() => {
          // Retry a few times if setLetters isn't available yet
          let retries = 0;
          const maxRetries = 10;
          const tryApply = () => {
            if (window.acjs_setLetters && window.acjs_setLetters['cube'] && typeof window.acjs_setLetters['cube'] === 'function') {
              applyLettersFromJSON();
            } else if (retries < maxRetries) {
              retries++;
              setTimeout(tryApply, 200);
            } else {
              console.error('Failed to apply letters: setLetters function not available after retries');
            }
          };
          tryApply();
        }, 800);
      } else {
        console.warn('Cube container appears empty, retrying...');
        setTimeout(initializeCube, 200);
      }
    }, 300);
  } catch (error) {
    console.error('Error initializing cube:', error);
  }
}

/**
 * Add a move to the sequence
 */
function addMove(): void {
  const input = document.getElementById('moveInput') as HTMLInputElement;
  const move = input.value.trim();
  
  if (move) {
    sequence.push(move);
    updateSequenceDisplay();
    input.value = '';
    input.focus();
  }
}

/**
 * Quick add a move (from button click)
 */
function quickAddMove(move: string): void {
  const input = document.getElementById('moveInput') as HTMLInputElement;
  input.value = move;
  addMove();
}

/**
 * Update the sequence display
 */
function updateSequenceDisplay(): void {
  const display = document.getElementById('sequenceDisplay');
  if (!display) return;
  
  if (sequence.length === 0) {
    display.innerHTML = '<span class="empty">No moves added yet</span>';
    display.classList.add('empty');
  } else {
    display.textContent = sequence.join(' ');
    display.classList.remove('empty');
  }
}

/**
 * Execute the full sequence
 */
function executeSequence(): void {
  if (sequence.length === 0) {
    alert('No moves to execute!');
    return;
  }

  if (!cubeInitialized) {
    alert('Cube is still loading. Please wait...');
    return;
  }

  const sequenceString = sequence.join(' ');
  console.log('Executing sequence:', sequenceString);
  console.log('Current cube state (initmove):', currentCubeState);
  
  // Clean up event listeners before reinitializing (if cube was already initialized)
  if (window.acjs_removeListeners && window.acjs_removeListeners['cube']) {
    window.acjs_removeListeners['cube']();
  }
  
  // Use initmove to preserve current cube state, then apply new moves
  const params = [
    'id=cube',
    'size=350',
    'bgColor=white',
    'scheme=WOBGRY',
    'edit=0',
    'buttons=1',
    'sliders=1',
    'colors=WOBGRY',
    'speed=1',
    'wca=1',
    'facelets=wwwwwwwwwyyyyyyyyygggggggggbbbbbbbbbooooooooorrrrrrrrr',
    `initmove=${currentCubeState}`,
    `move=${sequenceString}`
  ].join('&');
  
  window.AnimCube3!(params);
  
  // Update current cube state to include the executed sequence
  if (currentCubeState) {
    currentCubeState = currentCubeState + ' ' + sequenceString;
  } else {
    currentCubeState = sequenceString;
  }
  
  // Auto-trigger the play button after a short delay to ensure cube is ready
  setTimeout(() => {
    triggerPlayButton();
  }, 200);
}

/**
 * Trigger the play button on the cube
 */
function triggerPlayButton(): void {
  const cubeContainer = document.getElementById('cube');
  if (!cubeContainer) return;
  
  // Strategy 1: Try using AnimCubeJS direct access API
  try {
    const directAccessVars = Object.keys(window).filter(key => key.startsWith('acjs_cube_'));
    if (directAccessVars.length > 0) {
      if (window.acjs_cube_animating !== undefined) {
        window.acjs_cube_animating = true;
        console.log('Animation started via direct access API');
        return;
      }
    }
  } catch (e) {
    console.log('Direct access API not available, trying button click');
  }
  
  // Strategy 2: Find and click the play button
  const buttons = Array.from(cubeContainer.querySelectorAll('input[type="button"], button'));
  for (const btn of buttons) {
    const value = (btn as HTMLInputElement).value || btn.textContent || '';
    const title = (btn as HTMLElement).title || '';
    const className = btn.className || '';
    
    if (value.toLowerCase().includes('play') || 
        value === '▶' || 
        value === '>' ||
        value === '\u25B6' ||
        title.toLowerCase().includes('play') ||
        className.toLowerCase().includes('play')) {
      (btn as HTMLElement).click();
      console.log('Play button clicked automatically');
      return;
    }
  }
  
  // Strategy 3: Click first button in form
  const forms = Array.from(cubeContainer.querySelectorAll('form'));
  for (const form of forms) {
    const inputs = form.querySelectorAll('input[type="button"]');
    if (inputs.length > 0) {
      (inputs[0] as HTMLElement).click();
      console.log('First button clicked (assuming play)');
      return;
    }
  }
  
  console.log('Could not find play button automatically');
}

/**
 * Execute only the last move
 */
function executeLastMove(): void {
  if (sequence.length === 0) {
    alert('No moves to execute!');
    return;
  }

  if (!cubeInitialized) {
    alert('Cube is still loading. Please wait...');
    return;
  }

  const lastMove = sequence[sequence.length - 1];
  console.log('Executing last move:', lastMove);
  console.log('Current cube state (initmove):', currentCubeState);
  
  // Clean up event listeners before reinitializing
  if (window.acjs_removeListeners && window.acjs_removeListeners['cube']) {
    window.acjs_removeListeners['cube']();
  }
  
  // Use initmove to preserve current cube state, then apply the last move
  const params = [
    'id=cube',
    'size=350',
    'bgColor=#ffffff',
    'scheme=WOBGRY',
    'edit=0',
    'buttons=1',
    'sliders=1',
    'colors=WOBGRY',
    'speed=1',
    'wca=1',
    'facelets=wwwwwwwwwyyyyyyyyygggggggggbbbbbbbbbooooooooorrrrrrrrr',
    `initmove=${currentCubeState}`,
    `move=${lastMove}`
  ].join('&');
  
  window.AnimCube3!(params);
  
  // Update current cube state to include the executed move
  if (currentCubeState) {
    currentCubeState = currentCubeState + ' ' + lastMove;
  } else {
    currentCubeState = lastMove;
  }
  
  // Auto-trigger the play button after a short delay
  setTimeout(() => {
    triggerPlayButton();
  }, 200);
}

/**
 * Clear the sequence
 */
function clearSequence(): void {
  sequence = [];
  updateSequenceDisplay();
}

/**
 * Load letters from JSON data and convert to AnimCube3 format
 */
function loadLettersFromJSON(): string | null {
  try {
    const lettersArray = new Array(54).fill('');
    const orientationSettings: { [face: number]: string } = {
      0: 'flip-vertical',  // U face (white)
      1: 'flip-vertical',  // D face (yellow)
      2: 'rotate-180',     // F face (green)
      3: 'flip-vertical',  // B face (blue)
      4: 'flip-vertical',  // L face (orange)
      5: 'flip-vertical'   // R face (red)
    };
    
    // U face (white) - AnimCube3 index 0
    lettersArray[0*9 + 6] = 'A';
    lettersArray[0*9 + 7] = 'a';
    lettersArray[0*9 + 8] = 'B';
    lettersArray[0*9 + 3] = 'd';
    lettersArray[0*9 + 4] = '*';
    lettersArray[0*9 + 5] = 'b';
    lettersArray[0*9 + 0] = 'D';
    lettersArray[0*9 + 1] = 'c';
    lettersArray[0*9 + 2] = 'C';
    
    // D face (yellow) - AnimCube3 index 1
    lettersArray[1*9 + 0] = 'U';
    lettersArray[1*9 + 1] = 'x';
    lettersArray[1*9 + 2] = 'X';
    lettersArray[1*9 + 3] = 'u';
    lettersArray[1*9 + 4] = '*';
    lettersArray[1*9 + 5] = 'w';
    lettersArray[1*9 + 6] = 'V';
    lettersArray[1*9 + 7] = 'v';
    lettersArray[1*9 + 8] = 'W';
    
    // F face (green) - AnimCube3 index 2
    lettersArray[2*9 + 0] = 'I';
    lettersArray[2*9 + 3] = 'i';
    lettersArray[2*9 + 6] = 'J';
    lettersArray[2*9 + 1] = 'l';
    lettersArray[2*9 + 4] = '*';
    lettersArray[2*9 + 7] = 'j';
    lettersArray[2*9 + 2] = 'L';
    lettersArray[2*9 + 5] = 'k';
    lettersArray[2*9 + 8] = 'K';
    
    // B face (blue) - AnimCube3 index 3
    lettersArray[3*9 + 0] = 'Q';
    lettersArray[3*9 + 1] = 't';
    lettersArray[3*9 + 2] = 'T';
    lettersArray[3*9 + 3] = 'q';
    lettersArray[3*9 + 4] = '*';
    lettersArray[3*9 + 5] = 's';
    lettersArray[3*9 + 6] = 'R';
    lettersArray[3*9 + 7] = 'r';
    lettersArray[3*9 + 8] = 'S';
    
    // L face (orange) - AnimCube3 index 4
    lettersArray[4*9 + 0] = 'F';
    lettersArray[4*9 + 1] = 'e';
    lettersArray[4*9 + 2] = 'E';
    lettersArray[4*9 + 3] = 'f';
    lettersArray[4*9 + 4] = '*';
    lettersArray[4*9 + 5] = 'h';
    lettersArray[4*9 + 6] = 'G';
    lettersArray[4*9 + 7] = 'g';
    lettersArray[4*9 + 8] = 'H';
    
    // R face (red) - AnimCube3 index 5
    lettersArray[5*9 + 0] = 'M';
    lettersArray[5*9 + 1] = 'p';
    lettersArray[5*9 + 2] = 'P';
    lettersArray[5*9 + 3] = 'm';
    lettersArray[5*9 + 4] = '*';
    lettersArray[5*9 + 5] = 'o';
    lettersArray[5*9 + 6] = 'N';
    lettersArray[5*9 + 7] = 'n';
    lettersArray[5*9 + 8] = 'O';
    
    // Store orientation settings globally
    if (!window.acjs_letterOrientations) {
      window.acjs_letterOrientations = {};
    }
    if (!window.acjs_letterOrientations['cube']) {
      window.acjs_letterOrientations['cube'] = {};
    }
    Object.assign(window.acjs_letterOrientations['cube'], orientationSettings);
    
    // Convert to 54-character string
    let lettersString = '';
    for (let i = 0; i < 54; i++) {
      lettersString += lettersArray[i] || ' ';
    }
    
    if (lettersString.length !== 54) {
      console.error(`Invalid letters string length: ${lettersString.length}, expected 54`);
      return null;
    }
    
    return lettersString;
  } catch (error) {
    console.error('Error loading letters from JSON:', error);
    return null;
  }
}

/**
 * Apply letters from JSON to the cube
 */
function applyLettersFromJSON(): boolean {
  const lettersString = loadLettersFromJSON();
  if (lettersString) {
    if (window.acjs_setLetters && window.acjs_setLetters['cube'] && typeof window.acjs_setLetters['cube'] === 'function') {
      window.acjs_setLetters['cube'](lettersString);
      console.log('✓ Letters applied from cube-positions.json');
      return true;
    } else {
      console.warn('setLetters function not available yet');
      return false;
    }
  } else {
    console.error('Failed to load letters from embedded JSON data');
    return false;
  }
}

/**
 * Toggle letter visibility
 */
function toggleLetters(): void {
  if (!cubeInitialized) {
    alert('Cube is still loading. Please wait...');
    return;
  }
  if (window.acjs_toggleLetters && window.acjs_toggleLetters['cube'] && typeof window.acjs_toggleLetters['cube'] === 'function') {
    window.acjs_toggleLetters['cube']();
    const btn = document.getElementById('toggle-letters-btn');
    if (btn && window.acjs_showLetters && window.acjs_showLetters['cube'] !== undefined) {
      btn.textContent = window.acjs_showLetters['cube'] ? 'Hide Letters' : 'Show Letters';
    } else if (btn) {
      btn.textContent = btn.textContent === 'Show Letters' ? 'Hide Letters' : 'Show Letters';
    }
  }
}

/**
 * Reset the cube to solved state
 */
function resetCube(): void {
  if (!cubeInitialized) {
    alert('Cube is still loading. Please wait...');
    return;
  }

  // Clean up event listeners before reinitializing
  if (window.acjs_removeListeners && window.acjs_removeListeners['cube']) {
    window.acjs_removeListeners['cube']();
  }
  
  // Reinitialize cube to solved state
  const params = [
    'id=cube',
    'size=350',
    'bgColor=white',
    'scheme=WOBGRY',
    'edit=0',
    'buttons=1',
    'sliders=1',
    'colors=WOBGRY',
    'speed=1',
    'wca=1',
    'facelets=wwwwwwwwwyyyyyyyyygggggggggbbbbbbbbbooooooooorrrrrrrrr',
    'initmove='
  ].join('&');
  
  window.AnimCube3!(params);
  currentCubeState = '';
  clearSequence();
  
  // Reload letters after reset
  setTimeout(() => {
    cubeInitialized = true;
    applyLettersFromJSON();
  }, 500);
}

/**
 * Get inverse of a single move
 */
function getInverseSingleMove(move: string): string {
  if (move.endsWith("'")) {
    return move.slice(0, -1);
  } else if (move.endsWith("2")) {
    return move;
  } else {
    return move + "'";
  }
}

/**
 * Get inverse of a move sequence
 */
function getInverseMove(moveSequence: string): string {
  if (!moveSequence || moveSequence.trim() === '') {
    return '';
  }
  const moves = moveSequence.trim().split(/\s+/);
  const inverseMoves: string[] = [];
  
  for (let i = moves.length - 1; i >= 0; i--) {
    const move = moves[i];
    const inverseMove = getInverseSingleMove(move);
    inverseMoves.push(inverseMove);
  }
  
  return inverseMoves.join(' ');
}

/**
 * Set sequence from a move string
 */
function setSequenceFromMoves(moveString: string): void {
  if (!moveString || moveString.trim() === '') {
    return;
  }
  
  const moves = moveString.trim().split(/\s+/).filter(m => m.length > 0);
  sequence = moves;
  updateSequenceDisplay();
  
  // Scroll to the sequence display
  const display = document.getElementById('sequenceDisplay');
  if (display) {
    display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Highlight the sequence display briefly
    display.style.transition = 'background-color 0.3s';
    display.style.backgroundColor = '#d4edda';
    setTimeout(() => {
      display.style.backgroundColor = '';
    }, 1000);
  }
}

/**
 * Populate setup moves tables
 */
function populateSetupTables(): void {
  const edgeTable = document.getElementById('edgeSetupTable');
  const cornerTable = document.getElementById('cornerSetupTable');
  
  if (!edgeTable || !cornerTable) return;

  // Populate edge setup moves
  for (const [letter, setupMove] of Object.entries(edgeSetupMoves).sort()) {
    const row = document.createElement('tr');
    const unsetupMove = getInverseMove(setupMove);
    
    if (setupMove === '') {
      row.innerHTML = `
        <td class="buffer-cell">${letter}</td>
        <td class="buffer-cell">(Buffer - no setup)</td>
        <td class="buffer-cell">-</td>
      `;
    } else {
      const letterCell = document.createElement('td');
      letterCell.innerHTML = `<strong>${letter}</strong>`;
      
      const setupCell = document.createElement('td');
      const setupSpan = document.createElement('span');
      setupSpan.className = 'clickable-move';
      setupSpan.textContent = setupMove;
      setupSpan.title = 'Click to set as current sequence';
      setupSpan.onclick = () => setSequenceFromMoves(setupMove);
      setupCell.appendChild(setupSpan);
      
      const unsetupCell = document.createElement('td');
      const unsetupSpan = document.createElement('span');
      unsetupSpan.className = 'clickable-move';
      unsetupSpan.textContent = unsetupMove;
      unsetupSpan.title = 'Click to set as current sequence';
      unsetupSpan.onclick = () => setSequenceFromMoves(unsetupMove);
      unsetupCell.appendChild(unsetupSpan);
      
      row.appendChild(letterCell);
      row.appendChild(setupCell);
      row.appendChild(unsetupCell);
    }
    edgeTable.appendChild(row);
  }

  // Populate corner setup moves
  for (const [letter, setupMove] of Object.entries(cornerSetupMoves).sort()) {
    const row = document.createElement('tr');
    const unsetupMove = getInverseMove(setupMove);
    
    if (setupMove === '') {
      row.innerHTML = `
        <td class="buffer-cell">${letter}</td>
        <td class="buffer-cell">(Buffer - no setup)</td>
        <td class="buffer-cell">-</td>
      `;
    } else {
      const letterCell = document.createElement('td');
      letterCell.innerHTML = `<strong>${letter}</strong>`;
      
      const setupCell = document.createElement('td');
      const setupSpan = document.createElement('span');
      setupSpan.className = 'clickable-move';
      setupSpan.textContent = setupMove;
      setupSpan.title = 'Click to set as current sequence';
      setupSpan.onclick = () => setSequenceFromMoves(setupMove);
      setupCell.appendChild(setupSpan);
      
      const unsetupCell = document.createElement('td');
      const unsetupSpan = document.createElement('span');
      unsetupSpan.className = 'clickable-move';
      unsetupSpan.textContent = unsetupMove;
      unsetupSpan.title = 'Click to set as current sequence';
      unsetupSpan.onclick = () => setSequenceFromMoves(unsetupMove);
      unsetupCell.appendChild(unsetupSpan);
      
      row.appendChild(letterCell);
      row.appendChild(setupCell);
      row.appendChild(unsetupCell);
    }
    cornerTable.appendChild(row);
  }
}

/**
 * Toggle reference section visibility
 */
function toggleReference(): void {
  const content = document.getElementById('referenceContent');
  const icon = document.getElementById('toggleIcon');
  if (content && icon) {
    content.classList.toggle('expanded');
    icon.textContent = content.classList.contains('expanded') ? '▲' : '▼';
  }
}

/**
 * Initialize playground functionality
 */
export async function initializePlayground(): Promise<void> {
  // Populate setup moves tables
  populateSetupTables();
  
  // Add click handlers for swap algorithms
  const edgeSwapAlg = document.getElementById('edgeSwapAlg');
  const cornerSwapAlg = document.getElementById('cornerSwapAlg');
  if (edgeSwapAlg) {
    edgeSwapAlg.onclick = () => setSequenceFromMoves("R U R' U' R' F R2 U' R' U' R U R' F'");
  }
  if (cornerSwapAlg) {
    cornerSwapAlg.onclick = () => setSequenceFromMoves("R U' R' U' R U R' F' R U R' U' R' F R");
  }
  
  // Add event listeners
  const moveInput = document.getElementById('moveInput');
  if (moveInput) {
    moveInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        addMove();
      }
    });
  }
  
  const addMoveBtn = document.getElementById('add-move-btn');
  if (addMoveBtn) {
    addMoveBtn.addEventListener('click', addMove);
  }
  
  const executeSequenceBtn = document.getElementById('execute-sequence-btn');
  if (executeSequenceBtn) {
    executeSequenceBtn.addEventListener('click', executeSequence);
  }
  
  const executeLastMoveBtn = document.getElementById('execute-last-move-btn');
  if (executeLastMoveBtn) {
    executeLastMoveBtn.addEventListener('click', executeLastMove);
  }
  
  const clearSequenceBtn = document.getElementById('clear-sequence-btn');
  if (clearSequenceBtn) {
    clearSequenceBtn.addEventListener('click', clearSequence);
  }
  
  const resetCubeBtn = document.getElementById('reset-cube-btn');
  if (resetCubeBtn) {
    resetCubeBtn.addEventListener('click', resetCube);
  }
  
  const toggleLettersBtn = document.getElementById('toggle-letters-btn');
  if (toggleLettersBtn) {
    toggleLettersBtn.addEventListener('click', toggleLetters);
  }
  
  // Quick move buttons
  const quickMoveButtons = document.querySelectorAll('[data-quick-move]');
  quickMoveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const move = (btn as HTMLElement).getAttribute('data-quick-move');
      if (move) {
        quickAddMove(move);
      }
    });
  });
  
  // Reference toggle
  const referenceToggle = document.getElementById('reference-toggle');
  if (referenceToggle) {
    referenceToggle.addEventListener('click', toggleReference);
  }
  
  // Load and initialize cube
  try {
    await loadAnimCubeJS();
    initializeCube();
  } catch (error) {
    console.error('Failed to load AnimCubeJS:', error);
    const cubeContainer = document.getElementById('cube');
    if (cubeContainer) {
      cubeContainer.innerHTML = '<p style="color: red; padding: 20px;">Failed to load cube. Please refresh the page.</p>';
    }
  }
}

