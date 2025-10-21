/**
 * AnimCubeJS Service
 * Wrapper service for AnimCubeJS library integration
 */

export interface AnimCubeJSConfig {
  containerId: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  enableControls?: boolean;
  enableAnimations?: boolean;
  size?: number;
  bgColor?: string;
  scheme?: string;
  edit?: boolean;
  pos?: string;
  alg?: string;
  buttons?: boolean;
  sliders?: boolean;
  colors?: string;
  speed?: number;
  move?: string;
  move2?: string;
  move3?: string;
  move4?: string;
  move5?: string;
  move6?: string;
  move7?: string;
  move8?: string;
  move9?: string;
  move10?: string;
  move11?: string;
  move12?: string;
  move13?: string;
  move14?: string;
  move15?: string;
  move16?: string;
  move17?: string;
  move18?: string;
  move19?: string;
  move20?: string;
  move21?: string;
  move22?: string;
  move23?: string;
  move24?: string;
  move25?: string;
  move26?: string;
  move27?: string;
  move28?: string;
  move29?: string;
  move30?: string;
  move31?: string;
  move32?: string;
  move33?: string;
  move34?: string;
  move35?: string;
  move36?: string;
  move37?: string;
  move38?: string;
  move39?: string;
  move40?: string;
  move41?: string;
  move42?: string;
  move43?: string;
  move44?: string;
  move45?: string;
  move46?: string;
  move47?: string;
  move48?: string;
  move49?: string;
  move50?: string;
  move51?: string;
  move52?: string;
  move53?: string;
  move54?: string;
  move55?: string;
  move56?: string;
  move57?: string;
  move58?: string;
  move59?: string;
  move60?: string;
  move61?: string;
  move62?: string;
  move63?: string;
  move64?: string;
  move65?: string;
  move66?: string;
  move67?: string;
  move68?: string;
  move69?: string;
  move70?: string;
  move71?: string;
  move72?: string;
  move73?: string;
  move74?: string;
  move75?: string;
  move76?: string;
  move77?: string;
  move78?: string;
  move79?: string;
  move80?: string;
  move81?: string;
  move82?: string;
  move83?: string;
  move84?: string;
  move85?: string;
  move86?: string;
  move87?: string;
  move88?: string;
  move89?: string;
  move90?: string;
  move91?: string;
  move92?: string;
  move93?: string;
  move94?: string;
  move95?: string;
  move96?: string;
  move97?: string;
  move98?: string;
  move99?: string;
  move100?: string;
}

export class AnimCubeJSService {
  private config: AnimCubeJSConfig;
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;
  private animCubeInstance: any = null;

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
  }

  /**
   * Initialize AnimCubeJS
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('AnimCubeJS already initialized');
      return;
    }

    try {
      // Get container element
      this.container = document.getElementById(this.config.containerId);
      if (!this.container) {
        throw new Error(`Container with id '${this.config.containerId}' not found`);
      }

      // Set container size
      this.container.style.width = `${this.config.width}px`;
      this.container.style.height = `${this.config.height}px`;
      this.container.style.position = 'relative';
      this.container.style.overflow = 'hidden';
      this.container.style.backgroundColor = this.config.backgroundColor || '#f5f5f5';

      // Load AnimCubeJS script if not already loaded
      await this.loadAnimCubeJSScript();

      // Initialize AnimCubeJS
      await this.initializeAnimCubeJS();

      this.isInitialized = true;
      console.log('AnimCubeJS initialized successfully');

    } catch (error) {
      console.error('Failed to initialize AnimCubeJS:', error);
      throw error;
    }
  }

  /**
   * Load AnimCubeJS script dynamically
   */
  private async loadAnimCubeJSScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if AnimCubeJS is already loaded
      if (typeof (window as any).AnimCube3 !== 'undefined') {
        console.log('AnimCubeJS already loaded');
        resolve();
        return;
      }

      console.log('Loading AnimCubeJS script...');
      const script = document.createElement('script');
      script.src = 'https://animcubejs.cubing.net/AnimCube3.js';
      script.async = true;
      script.onload = () => {
        console.log('AnimCubeJS script loaded successfully');
        // Wait a bit for the script to initialize
        setTimeout(() => {
          console.log('AnimCube3 available:', typeof (window as any).AnimCube3);
          resolve();
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load AnimCubeJS script');
        reject(new Error('Failed to load AnimCubeJS script'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Initialize AnimCubeJS with configuration
   */
  private async initializeAnimCubeJS(): Promise<void> {
    if (!this.container) {
      throw new Error('Container not found');
    }

    // Build AnimCubeJS parameters
    const params = this.buildAnimCubeJSParams();
    console.log('Initializing AnimCubeJS with params:', params);
    
    // Wait a moment for AnimCube3 to be fully available
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Initialize AnimCubeJS by calling it directly (not storing as instance)
    const animCube3 = (window as any).AnimCube3;
    if (animCube3) {
      console.log('Calling AnimCube3 with params:', params);
      animCube3(params);
      console.log('AnimCubeJS initialized successfully');
    } else {
      throw new Error('AnimCube3 function not available');
    }
    
    console.log('AnimCubeJS initialization completed');
  }

  /**
   * Check if AnimCubeJS is ready and functions are available
   */
  private checkAnimCubeJSReady(retryCount: number = 0): boolean {
    const maxRetries = 50; // Maximum 10 seconds of retries (50 * 200ms)
    
    // Check for AnimCube3 constructor first
    const animCube3 = (window as any).AnimCube3;
    if (!animCube3) {
      if (retryCount >= maxRetries) {
        console.error('AnimCube3 constructor not available after maximum retries');
        console.log('Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('anim') || key.toLowerCase().includes('cube')));
        return false;
      } else {
        console.warn(`AnimCube3 constructor not yet available, retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => this.checkAnimCubeJSReady(retryCount + 1), 200);
        return false;
      }
    }
    
    // Check if we have an instance and it's working
    if (this.animCubeInstance) {
      console.log('AnimCubeJS is ready with instance');
      return true;
    } else {
      console.log('AnimCube3 constructor available, but no instance created yet');
      return true; // Constructor is available, we can proceed
    }
  }

  /**
   * Wait for AnimCubeJS to be ready
   */
  private async waitForAnimCubeJSReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 100; // Maximum 10 seconds of retries (100 * 100ms)
      
      const checkReady = () => {
        const animCube3 = (window as any).AnimCube3;
        
        if (animCube3) {
          console.log('AnimCubeJS is ready for operations');
          resolve();
        } else if (retryCount >= maxRetries) {
          console.error('AnimCubeJS not ready after maximum retries');
          console.log('Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('anim') || key.toLowerCase().includes('cube')));
          reject(new Error('AnimCubeJS not ready after timeout'));
        } else {
          retryCount++;
          console.log(`Waiting for AnimCubeJS to be ready... (${retryCount}/${maxRetries})`);
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  /**
   * Build AnimCubeJS parameters from config
   */
  private buildAnimCubeJSParams(): string {
    const params: string[] = [];
    
    params.push(`id=${this.config.containerId}`);
    params.push(`size=${this.config.size}`);
    params.push(`bgColor=${this.config.bgColor}`);
    params.push(`scheme=${this.config.scheme}`);
    params.push(`edit=${this.config.edit ? '1' : '0'}`);
    params.push(`buttons=${this.config.buttons ? '1' : '0'}`);
    params.push(`sliders=${this.config.sliders ? '1' : '0'}`);
    params.push(`colors=${this.config.colors}`);
    params.push(`speed=${this.config.speed}`);
    
    // Set standard orientation: white on top, green in front
    // Use explicit facelets to ensure correct orientation
    params.push(`facelets=wwwwwwwwwyyyyyyyyygggggggggbbbbbbbbbooooooooorrrrrrrrr`);
    params.push(`initmove=`); // No initial moves, start solved

    return params.join('&');
  }

  /**
   * Execute a single move
   */
  public async executeMove(move: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      // Wait for AnimCubeJS to be ready
      await this.waitForAnimCubeJSReady();
      
      console.log('Executing move:', move);
      
      // Use AnimCube3 directly with the move
      const animCube3 = (window as any).AnimCube3;
      if (animCube3) {
        const params = this.buildAnimCubeJSParams() + `&move=${move}`;
        console.log('Calling AnimCube3 with move params:', params);
        animCube3(params);
        console.log('Move applied to AnimCubeJS');
      } else {
        console.warn('AnimCube3 function not available for move execution');
      }
    } catch (error) {
      console.error('Error executing move:', error);
    }
  }

  /**
   * Execute a sequence of moves
   */
  public async executeSequence(sequence: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      console.log('AnimCubeJS: Executing sequence:', sequence);
      
      // Wait for AnimCubeJS to be ready
      await this.waitForAnimCubeJSReady();
      
      // Use AnimCube3 directly with the sequence
      const animCube3 = (window as any).AnimCube3;
      if (animCube3) {
        const params = this.buildAnimCubeJSParams() + `&move=${sequence}`;
        console.log('Calling AnimCube3 with sequence params:', params);
        animCube3(params);
        
        // Wait for the sequence to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('AnimCubeJS: Sequence executed successfully');
      } else {
        console.warn('AnimCube3 function not available, using individual moves');
        
        // Alternative: execute moves one by one with proper timing
        const moves = sequence.trim().split(/\s+/).filter(move => move.length > 0);
        console.log('Executing moves individually:', moves);
        
        for (let i = 0; i < moves.length; i++) {
          const move = moves[i];
          console.log(`Executing move ${i + 1}/${moves.length}: ${move}`);
          
          await this.executeMove(move);
          
          // Wait between moves for proper visualization
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log('AnimCubeJS: All individual moves completed');
      }
    } catch (error) {
      console.error('Error executing sequence:', error);
    }
  }

  /**
   * Reset cube to solved state
   */
  public async resetCube(): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      // Wait for AnimCubeJS to be ready
      await this.waitForAnimCubeJSReady();
      
      console.log('Resetting cube to solved state');
      
      // Use AnimCube3 directly to reset
      const animCube3 = (window as any).AnimCube3;
      if (animCube3) {
        const params = this.buildAnimCubeJSParams();
        console.log('Calling AnimCube3 to reset with params:', params);
        animCube3(params);
        console.log('Cube reset to solved state with standard orientation');
      } else {
        console.warn('AnimCube3 function not available for reset');
      }
    } catch (error) {
      console.error('Error resetting cube:', error);
    }
  }

  /**
   * Scramble cube with given sequence
   */
  public async scrambleCube(scramble: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      console.log('AnimCubeJS: Scrambling cube with sequence:', scramble);
      
      // Wait for AnimCubeJS to be ready
      await this.waitForAnimCubeJSReady();
      
      // Reset cube first to ensure clean state
      await this.resetCube();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Apply the scramble
      await this.executeSequence(scramble);
      console.log('AnimCubeJS: Scramble completed successfully');
    } catch (error) {
      console.error('Error scrambling cube:', error);
      
      // If AnimCubeJS functions are not available, try alternative approach
      if (error instanceof Error && error.message.includes('AnimCubeJS functions not available')) {
        console.log('Attempting alternative scramble method...');
        await this.alternativeScrambleMethod(scramble);
      }
    }
  }

  /**
   * Apply scramble using initmove parameter
   */
  public async applyScrambleAsInitMove(scramble: string): Promise<void> {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      console.log('AnimCubeJS: Applying scramble as initmove:', scramble);
      
      // Wait for AnimCubeJS to be ready
      await this.waitForAnimCubeJSReady();
      
      // Use AnimCube3 directly with initmove parameter
      const animCube3 = (window as any).AnimCube3;
      if (animCube3) {
        const params = this.buildAnimCubeJSParams() + `&initmove=${scramble}`;
        console.log('Calling AnimCube3 with initmove params:', params);
        animCube3(params);
        console.log('AnimCubeJS: Scramble applied as initmove successfully');
      } else {
        console.warn('AnimCube3 function not available for initmove');
      }
    } catch (error) {
      console.error('Error applying scramble as initmove:', error);
    }
  }

  /**
   * Alternative scramble method when AnimCubeJS functions are not available
   */
  private async alternativeScrambleMethod(scramble: string): Promise<void> {
    try {
      console.log('Using alternative scramble method for:', scramble);
      
      // Try to use the AnimCubeJS instance directly
      if (this.animCubeInstance && typeof this.animCubeInstance === 'function') {
        // If the instance is a function, try calling it with the scramble
        this.animCubeInstance(`alg=${scramble}`);
      } else {
        console.warn('Alternative scramble method not available');
      }
    } catch (error) {
      console.error('Alternative scramble method failed:', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Set cube state (position)
   */
  public setCubeState(state: string): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      // Use AnimCubeJS setPos function
      const setPosFunction = (window as any).acjs_setPos;
      if (setPosFunction && setPosFunction[this.config.containerId]) {
        setPosFunction[this.config.containerId](state);
      } else {
        console.warn('AnimCubeJS setPos function not available');
      }
    } catch (error) {
      console.error('Error setting cube state:', error);
    }
  }

  /**
   * Get current cube state
   */
  public getCubeState(): string {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return '';
    }

    try {
      // Use AnimCubeJS getPos function
      const getPosFunction = (window as any).acjs_getPos;
      if (getPosFunction && getPosFunction[this.config.containerId]) {
        return getPosFunction[this.config.containerId]();
      } else {
        console.warn('AnimCubeJS getPos function not available');
        return '';
      }
    } catch (error) {
      console.error('Error getting cube state:', error);
      return '';
    }
  }

  /**
   * Set cube colors
   */
  public setCubeColors(colors: string): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    try {
      // Use AnimCubeJS setColors function
      const setColorsFunction = (window as any).acjs_setColors;
      if (setColorsFunction && setColorsFunction[this.config.containerId]) {
        setColorsFunction[this.config.containerId](colors);
      } else {
        console.warn('AnimCubeJS setColors function not available');
      }
    } catch (error) {
      console.error('Error setting cube colors:', error);
    }
  }

  /**
   * Get cube colors
   */
  public getCubeColors(): string {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return '';
    }

    try {
      // Use AnimCubeJS getColors function
      const getColorsFunction = (window as any).acjs_getColors;
      if (getColorsFunction && getColorsFunction[this.config.containerId]) {
        return getColorsFunction[this.config.containerId]();
      } else {
        console.warn('AnimCubeJS getColors function not available');
        return '';
      }
    } catch (error) {
      console.error('Error getting cube colors:', error);
      return '';
    }
  }

  /**
   * Set animation speed
   */
  public setSpeed(speed: number): void {
    if (!this.isInitialized) {
      console.error('AnimCubeJS not initialized');
      return;
    }

    this.config.speed = speed;
    
    try {
      // Use AnimCubeJS setSpeed function
      const setSpeedFunction = (window as any).acjs_setSpeed;
      if (setSpeedFunction && setSpeedFunction[this.config.containerId]) {
        setSpeedFunction[this.config.containerId](speed);
      } else {
        console.warn('AnimCubeJS setSpeed function not available');
      }
    } catch (error) {
      console.error('Error setting speed:', error);
    }
  }

  /**
   * Check if cube is solved
   */
  public isSolved(): boolean {
    if (!this.isInitialized) {
      return false;
    }

    try {
      const state = this.getCubeState();
      // Check if state represents a solved cube
      // This is a simplified check - you might need to implement more sophisticated logic
      return state === '' || state === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
    } catch (error) {
      console.error('Error checking if cube is solved:', error);
      return false;
    }
  }

  /**
   * Handle window resize
   */
  public handleResize(): void {
    if (!this.isInitialized || !this.container) {
      return;
    }

    // AnimCubeJS handles resize automatically
    // This method is kept for compatibility
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    if (this.isInitialized) {
      // Clear container
      if (this.container) {
        this.container.innerHTML = '';
      }
      
      this.isInitialized = false;
      this.animCubeInstance = null;
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): AnimCubeJSConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<AnimCubeJSConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isInitialized) {
      // Reinitialize with new config
      this.dispose();
      this.initialize();
    }
  }
}
