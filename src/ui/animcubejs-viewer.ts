/**
 * AnimCubeJS Viewer UI Component
 * Provides UI interface for the AnimCubeJS cube viewer
 */

import { AnimCubeJSService, AnimCubeJSConfig } from '../services/animcubejs-service.js';

export class AnimCubeJSViewer {
  private animCubeService: AnimCubeJSService;
  private config: AnimCubeJSConfig;
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;

  constructor(config: AnimCubeJSConfig) {
    this.config = {
      width: 300,
      height: 300,
      backgroundColor: '#f5f5f5',
      enableControls: true,
      enableAnimations: true,
      size: 200,
      bgColor: '#f5f5f5',
      scheme: 'WOBGRY',
      edit: false,
      buttons: true,
      sliders: true,
      colors: 'WOBGRY',
      speed: 1,
      ...config
    };
    
    this.animCubeService = new AnimCubeJSService(this.config);
  }

  /**
   * Initialize the AnimCubeJS viewer
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('AnimCubeJSViewer already initialized');
      return;
    }

    try {
      // Get container element
      this.container = document.getElementById(this.config.containerId);
      if (!this.container) {
        throw new Error(`Container with id '${this.config.containerId}' not found`);
      }

      // Initialize AnimCubeJS service
      await this.animCubeService.initialize();

      // Setup event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      console.log('AnimCubeJSViewer initialized successfully');

    } catch (error) {
      console.error('Failed to initialize AnimCubeJSViewer:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners for UI interactions
   */
  private setupEventListeners(): void {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Setup move input handling
    this.setupMoveInputHandlers();
  }

  /**
   * Setup move input handlers
   */
  private setupMoveInputHandlers(): void {
    if (!this.container) return;

    // Look for move input elements in the container
    const moveInput = this.container.querySelector('#move-input') as HTMLInputElement;
    const sequenceInput = this.container.querySelector('#sequence-input') as HTMLTextAreaElement;
    const executeButton = this.container.querySelector('#execute-move') as HTMLButtonElement;
    const executeSequenceButton = this.container.querySelector('#execute-sequence') as HTMLButtonElement;
    const resetButton = this.container.querySelector('#reset-cube') as HTMLButtonElement;
    const scrambleButton = this.container.querySelector('#scramble-cube') as HTMLButtonElement;

    // Single move execution
    if (executeButton && moveInput) {
      executeButton.addEventListener('click', async () => {
        const move = moveInput.value.trim();
        if (move) {
          await this.executeMove(move);
          moveInput.value = '';
        }
      });

      moveInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
          const move = moveInput.value.trim();
          if (move) {
            await this.executeMove(move);
            moveInput.value = '';
          }
        }
      });
    }

    // Sequence execution
    if (executeSequenceButton && sequenceInput) {
      executeSequenceButton.addEventListener('click', async () => {
        const sequence = sequenceInput.value.trim();
        if (sequence) {
          await this.executeSequence(sequence);
        }
      });
    }

    // Reset cube
    if (resetButton) {
      resetButton.addEventListener('click', async () => {
        await this.resetCube();
      });
    }

    // Scramble cube
    if (scrambleButton) {
      scrambleButton.addEventListener('click', async () => {
        const scramble = this.generateRandomScramble();
        await this.scrambleCube(scramble);
      });
    }
  }

  /**
   * Execute a single move
   */
  public async executeMove(move: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    try {
      await this.animCubeService.executeMove(move);
    } catch (error) {
      console.error('Error executing move:', error);
    }
  }

  /**
   * Execute a sequence of moves
   */
  public async executeSequence(sequence: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    try {
      await this.animCubeService.executeSequence(sequence);
    } catch (error) {
      console.error('Error executing sequence:', error);
    }
  }

  /**
   * Reset cube to solved state
   */
  public async resetCube(): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    try {
      await this.animCubeService.resetCube();
    } catch (error) {
      console.error('Error resetting cube:', error);
    }
  }

  /**
   * Scramble cube with given sequence
   */
  public async scrambleCube(scramble: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    try {
      await this.animCubeService.scrambleCube(scramble);
    } catch (error) {
      console.error('Error scrambling cube:', error);
    }
  }

  /**
   * Generate random scramble
   */
  private generateRandomScramble(): string {
    const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
    const variants = ['', "'", '2'];
    const scramble: string[] = [];

    for (let i = 0; i < 20; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      const variant = variants[Math.floor(Math.random() * variants.length)];
      scramble.push(move + variant);
    }

    return scramble.join(' ');
  }

  /**
   * Get current cube state
   */
  public getCurrentCubeState(): string {
    if (!this.isInitialized) {
      throw new Error('AnimCubeJSViewer not initialized');
    }
    return this.animCubeService.getCubeState();
  }

  /**
   * Apply scramble using initmove parameter
   */
  public async applyScrambleAsInitMove(scramble: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('AnimCubeJSViewer not initialized');
    }
    await this.animCubeService.applyScrambleAsInitMove(scramble);
  }

  /**
   * Set cube state
   */
  public setCubeState(cubeState: string): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    this.animCubeService.setCubeState(cubeState);
  }

  /**
   * Check if cube is solved
   */
  public isSolved(): boolean {
    if (!this.isInitialized) {
      return false;
    }
    return this.animCubeService.isSolved();
  }

  /**
   * Enable/disable controls
   */
  public setControlsEnabled(enabled: boolean): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    // AnimCubeJS controls are always enabled when the cube is visible
    // This method is kept for compatibility
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    if (this.isInitialized) {
      this.animCubeService.handleResize();
    }
  }

  /**
   * Create UI controls for the cube viewer
   */
  public createControls(): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    if (!this.container) return;

    const controlsHTML = `
      <div class="animcubejs-controls" style="
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 5px;
        color: white;
        font-family: monospace;
        font-size: 12px;
        z-index: 1000;
      ">
        <div style="margin-bottom: 10px;">
          <label for="move-input" style="display: block; margin-bottom: 5px;">Single Move:</label>
          <input type="text" id="move-input" placeholder="R, U', F2..." style="
            width: 100px;
            padding: 2px 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
          ">
          <button id="execute-move" style="
            margin-left: 5px;
            padding: 2px 8px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          ">Execute</button>
        </div>
        
        <div style="margin-bottom: 10px;">
          <label for="sequence-input" style="display: block; margin-bottom: 5px;">Sequence:</label>
          <textarea id="sequence-input" placeholder="R U R' U'" style="
            width: 150px;
            height: 40px;
            padding: 2px 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            resize: none;
          "></textarea>
          <button id="execute-sequence" style="
            display: block;
            margin-top: 5px;
            padding: 2px 8px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          ">Execute Sequence</button>
        </div>
        
        <div style="display: flex; gap: 5px;">
          <button id="reset-cube" style="
            padding: 2px 8px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          ">Reset</button>
          <button id="scramble-cube" style="
            padding: 2px 8px;
            background: #ffc107;
            color: black;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          ">Scramble</button>
        </div>
        
        <div style="margin-top: 10px; font-size: 10px;">
          <div>Mouse: Drag to rotate</div>
          <div>Wheel: Zoom</div>
          <div>Keys: R, L, U, D, F, B</div>
        </div>
      </div>
    `;

    this.container.insertAdjacentHTML('beforeend', controlsHTML);
    this.setupMoveInputHandlers();
  }

  /**
   * Set animation speed
   */
  public setSpeed(speed: number): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    this.animCubeService.setSpeed(speed);
  }

  /**
   * Set cube colors
   */
  public setCubeColors(colors: string): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return;
    }

    this.animCubeService.setCubeColors(colors);
  }

  /**
   * Get cube colors
   */
  public getCubeColors(): string {
    if (!this.isInitialized) {
      console.error('AnimCubeJSViewer not initialized');
      return '';
    }

    return this.animCubeService.getCubeColors();
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    if (this.isInitialized) {
      this.animCubeService.dispose();
      this.isInitialized = false;
    }
  }

  /**
   * Get service instance (for advanced usage)
   */
  public getService(): AnimCubeJSService {
    if (!this.isInitialized) {
      throw new Error('AnimCubeJSViewer not initialized');
    }
    return this.animCubeService;
  }
}
