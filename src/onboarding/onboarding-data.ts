/**
 * Onboarding screen content and configuration
 */

import { OnboardingScreen, DrillDemo, LetterPairDemo } from './onboarding-types.js';
import { DrillType } from '../types.js';

export const ONBOARDING_SCREENS: OnboardingScreen[] = [
  {
    id: 'welcome',
    title: 'Welcome to Blindfold Cubing for Beginners!',
    content: `
      <div class="onboarding-content">
        <div class="welcome-icon">🎉</div>
        <p>Ever thought solving a Rubik's Cube blindfolded was impossible? It's not! 🙌</p>
        <p>We'll guide you step by step -- from learning the basics to training your memory -- until you're confidently solving the cube with your eyes closed. Let's take it one step at a time and have fun along the way!</p>
        <div class="success-stats">
          <p><strong>Join thousands of cubers</strong> who have mastered blindfold solving with our proven training system!</p>
        </div>
      </div>
    `,
    visualComponent: 'progress-indicator',
    interactiveElements: [
      { type: 'button', id: 'start-tutorial', label: "Let's Start", action: 'next' }
    ]
  },
  {
    id: 'big-picture',
    title: 'The Two-Step Blindfolded Solve',
    content: `
      <div class="onboarding-content">
        <div class="process-diagram">
          <div class="step">
            <div class="step-icon">🧠</div>
            <h3>1. Memorize</h3>
            <p>Look at the cube and convert its pieces into a sequence of letters you can remember</p>
          </div>
          <div class="arrow">→</div>
          <div class="step">
            <div class="step-icon">🕶️</div>
            <h3>2. Solve</h3>
            <p>Put on the blindfold and use your memorized sequence to execute moves and solve the cube</p>
          </div>
        </div>
        <p class="focus-text"><strong>Don't worry about the solving algorithms right now</strong> -- our training will focus on teaching you a rock-solid memorization method to get all the pieces in your head.</p>
      </div>
    `,
    visualComponent: 'cube-animation',
    interactiveElements: [
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'letter-scheme',
    title: 'Every Piece Gets a Letter',
    content: `
      <div class="onboarding-content">
        <p>Time to turn colors into letters! We use <strong>Speffz notation</strong> -- a standard system where each sticker on the cube is labeled with a letter A through X.</p>
        <div class="notation-example">
          <p>For example, one particular edge might be "A", the one next to it "B", and so on. This way, instead of remembering colors or positions, you'll memorize letter sequences.</p>
        </div>
        <div class="cube-diagram">
          <div class="speffz-visual">
            <p><strong>A-B-C-D-E-F-G-H</strong><br>
            <strong>I-J-K-L-M-N-O-P</strong><br>
            <strong>Q-R-S-T-U-V-W-X</strong></p>
          </div>
        </div>
        <p class="reassurance"><strong>Don't worry</strong> -- you don't have to learn all the letters right away. You'll practice with fun drills until naming pieces by letter becomes second nature!</p>
      </div>
    `,
    visualComponent: 'speffz-diagram',
    interactiveElements: [
      { type: 'button', id: 'show-more-speffz', label: 'Learn More About Speffz', action: 'modal' },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'edges-corners',
    title: 'Solve in Two Parts: Edges then Corners',
    content: `
      <div class="onboarding-content">
        <p>We'll tackle the cube in chunks. First <strong>edges, then corners</strong> -- treating each group separately.</p>
        <div class="piece-comparison">
          <div class="piece-type">
            <div class="piece-icon edge">📐</div>
            <h3>Edges</h3>
            <p>2 stickers each<br>12 pieces total</p>
          </div>
          <div class="vs">vs</div>
          <div class="piece-type">
            <div class="piece-icon corner">📦</div>
            <h3>Corners</h3>
            <p>3 stickers each<br>8 pieces total</p>
          </div>
        </div>
        <div class="cycle-explanation">
          <h3>How do we know the order to solve them in? We use cycles.</h3>
          <p>A cycle is just a loop of pieces that need to swap places. For example, you might start at one edge piece, then hop to the piece that belongs there, and so on, until you come back to where you started -- that's one cycle done!</p>
          <p>Each cycle gives you a sequence of letters to remember. If there are pieces left over, you start a new cycle.</p>
          <p class="encouragement">It sounds like a lot, but you'll learn to do this step-by-step. Our tracing tool will help you follow these cycles visually, so you'll get the hang of it!</p>
        </div>
      </div>
    `,
    visualComponent: 'piece-comparison',
    interactiveElements: [
      { type: 'button', id: 'what-is-cycle', label: "What's a cycle?", action: 'modal' },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'letter-pairs',
    title: 'Memorize with Letter Pairs & Imagery',
    content: `
      <div class="onboarding-content">
        <p>Here's a pro tip: Turn letters into pictures! Instead of trying to recall a long string of single letters, you'll group them into <strong>letter pairs</strong>. Each pair of letters becomes a visual image or word -- something easy to imagine.</p>
        <div class="example-story">
          <h3>Example Story Building:</h3>
          <div class="story-step">
            <strong>A B</strong> → "Aladdin's lamp" 💡
          </div>
          <div class="story-step">
            <strong>C D</strong> → "Caesar salad" 🥗
          </div>
          <div class="story-step">
            <strong>Story:</strong> Aladdin's lamp falling into a Caesar salad
          </div>
        </div>
        <p>It's silly, but you won't forget it! The crazier and more vivid, the better. This way, a sequence of 10+ letters turns into a handful of memorable scenes.</p>
        <div class="interactive-demo">
          <h3>Try it yourself!</h3>
          <div class="demo-pair">
            <span class="pair-display">QU</span>
            <input type="text" placeholder="What image comes to mind?" class="demo-input" />
          </div>
        </div>
        <p class="reassurance">No worries if this feels new or strange -- we have drills that will help you practice coming up with letter pair images!</p>
      </div>
    `,
    visualComponent: 'story-demo',
    interactiveElements: [
      { type: 'demo', id: 'letter-pair-demo', data: { pairs: ['QU', 'ST', 'NX'] } },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'memorization-drills',
    title: 'Practice Makes Perfect -- Try Some Drills',
    content: `
      <div class="onboarding-content">
        <p>Ready to give it a go? Our training <strong>drills</strong> are here to build your skills step by step.</p>
        <div class="drill-explanation">
          <p>In a drill session, you'll see letters on the screen (like "AB"), and your task is to instantly imagine an image or word for that pair. Then hit <strong>Next</strong> to get a new pair.</p>
          <p>You'll do this for a series of pairs -- for example, 10 in a row -- and that's one exercise.</p>
        </div>
        <div class="drill-types">
          <div class="drill-type">
            <h4>🚀 Quick Flash Drills</h4>
            <p>Build your instant visualization speed</p>
          </div>
          <div class="drill-type">
            <h4>📖 Story Drills</h4>
            <p>Challenge you to link pairs into one creative story</p>
          </div>
          <div class="drill-type">
            <h4>🎯 Full Cube Simulation</h4>
            <p>Simulate a complete cube memorization when you're ready!</p>
          </div>
        </div>
        <p class="encouragement">Don't worry, you can start easy -- even 5 or 10 pairs at a time -- and work your way up. 🌟</p>
        <p>As you practice, you'll notice yourself getting faster and more confident. It's like a game: try to beat your own high score or time. And remember, <strong>every session is progress, no matter how small!</strong></p>
      </div>
    `,
    visualComponent: 'drill-preview',
    interactiveElements: [
      { type: 'button', id: 'preview-drill', label: 'Preview a Drill', action: 'demo' },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'tracing-tools',
    title: 'Know Your Cube: Letter Recognition Practice',
    content: `
      <div class="onboarding-content">
        <p>To memorize effectively, you'll want to know each piece's letter <strong>by heart</strong>. Don't worry -- we've got a fun way to get you there!</p>
        <div class="notation-demo">
          <p>In our <strong>letter recognition drills</strong>, you'll see a cube diagram with one piece highlighted, and you'll type which letter goes on that piece.</p>
          <div class="demo-example">
            <div class="cube-piece-demo">
              <div class="color-squares">
                <div class="square red"></div>
                <div class="square white"></div>
              </div>
              <p>What letter is this?</p>
              <input type="text" placeholder="M" class="notation-input" />
            </div>
          </div>
          <p>If you're not sure, take your best guess -- the app will show the correct answer so you learn as you go. ✅</p>
        </div>
        <div class="training-modes">
          <div class="mode">
            <h4>Edge Training</h4>
            <p>Practice with 2-sticker edge pieces</p>
          </div>
          <div class="mode">
            <h4>Corner Training</h4>
            <p>Practice with 3-sticker corner pieces (more complex!)</p>
          </div>
        </div>
        <p class="encouragement">After a few rounds, you'll be spotting pieces and naming their letters without any hesitation! This will make "tracing" your cycles much faster when you attempt a real solve. Think of it like flashcards for cube letters -- a little practice each session and you'll master the whole alphabet in no time.</p>
      </div>
    `,
    visualComponent: 'notation-demo',
    interactiveElements: [
      { type: 'demo', id: 'notation-demo', data: { type: 'edge', colors: ['red', 'white'] } },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'recall-tests',
    title: 'Test Your Memory & Get Feedback',
    content: `
      <div class="onboarding-content">
        <p>After each practice, you'll get a chance to check how much you remembered. 📝</p>
        <div class="recall-process">
          <h3>Try to recall the letters you memorized and type them in</h3>
          <p>-- this is a great habit to strengthen your memory. Once you're done, the app will show you exactly how you did: which letters you got right and where you made mistakes.</p>
          <div class="example-feedback">
            <p>For example, if you remembered "AB C D ..." but the correct sequence was "AB D D ...", it will highlight that mix-up so you know what to work on.</p>
          </div>
        </div>
        <div class="rating-system">
          <h3>You can also rate how the memorization felt</h3>
          <p>Was it super clear or a bit fuzzy? Give it a quick rating (for instance, how vivid the images were). This is just for you, to track your own improvement.</p>
          <div class="rating-example">
            <div class="rating-scale">
              <span>1 - Fuzzy</span>
              <span>2 - Okay</span>
              <span>3 - Good</span>
              <span>4 - Clear</span>
              <span>5 - Vivid!</span>
            </div>
          </div>
        </div>
        <p class="encouragement">Many users find their <strong>vividness</strong> and <strong>flow</strong> scores improve as they practice -- a nice confidence booster!</p>
        <p>Finally, hit <strong>Save</strong> to record your session. You can even add a note (like "I confused two letters, will focus on those next time"). Each practice is a step forward, and reviewing your feedback will help you get better and better.</p>
      </div>
    `,
    visualComponent: 'feedback-demo',
    interactiveElements: [
      { type: 'demo', id: 'recall-demo', data: { sequence: ['AB', 'CD', 'EF'], userInput: 'AB CD EF' } },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'progress-tracking',
    title: 'See Your Progress -- You\'re Getting Better!',
    content: `
      <div class="onboarding-content">
        <p>Nothing is more motivating than seeing your own improvement. 📈</p>
        <div class="dashboard-preview">
          <p>Your <strong>dashboard</strong> will keep track of all your practice sessions. You'll be able to see stats like how many sessions you've done, your average recall accuracy, and your fastest times.</p>
          <div class="stats-example">
            <div class="stat">
              <strong>15</strong> Total Sessions
            </div>
            <div class="stat">
              <strong>87%</strong> Avg Accuracy
            </div>
            <div class="stat">
              <strong>1.2s</strong> Avg Speed
            </div>
          </div>
          <p>Over time, you might notice your accuracy creeping up and your memo times getting shorter -- that's proof of your hard work paying off!</p>
        </div>
        <div class="achievements">
          <h3>We'll also celebrate milestones with you</h3>
          <p>Did your recall accuracy hit a new high? 🎉 You might earn a badge like <strong>"90% Club: Sharp Memory!"</strong></p>
          <p>Or after you complete 10 sessions, you'll get a fun <strong>"10 Sessions -- Trailblazer"</strong> achievement. Little rewards make practice fun, almost like a game.</p>
        </div>
        <p class="motivation">Make sure to check out your progress page regularly. It feels great to say "Wow, last month memorizing 6 pairs felt hard, and now I can do 12 pairs easily." Whenever you need a boost of confidence, your progress stats and badges will be there to remind you how far you've come. Keep going -- each day you train, you're leveling up your memory skills!</p>
      </div>
    `,
    visualComponent: 'dashboard-preview',
    interactiveElements: [
      { type: 'button', id: 'view-dashboard', label: 'Preview Dashboard', action: 'demo' },
      { type: 'button', id: 'continue', label: 'Continue', action: 'next' }
    ]
  },
  {
    id: 'account-creation',
    title: 'Create a Free Account to Save Your Progress',
    content: `
      <div class="onboarding-content">
        <p>You're all set to start training! 🎉 Before you dive in, let's make sure your progress is safe.</p>
        <div class="account-benefits">
          <p>Create a free account so you can:</p>
          <ul>
            <li>✅ Save your sessions and track your stats over time</li>
            <li>✅ Switch devices without losing anything</li>
            <li>✅ Access your training data from any computer or phone</li>
            <li>✅ Pick up right where you left off</li>
          </ul>
        </div>
        <div class="privacy-note">
          <p><strong>Why sign up?</strong> Your training data (like session history and progress stats) will be securely backed up in the cloud -- no risk of losing it.</p>
          <p>It only takes a few seconds: you can sign in with your Google account (super quick), or use an email. And don't worry, we <strong>only</strong> use this info to give you a better training experience -- no spam, ever.</p>
        </div>
        <div class="skip-option">
          <p><strong>Not ready?</strong> That's okay, you can skip for now and use the trainer anonymously. (Your progress will be saved on this device -- you can always create an account later to back it up.)</p>
        </div>
        <p class="final-encouragement"><strong>Ready to roll?</strong> Let's get your account set up so you can start your blindfold cubing journey!</p>
      </div>
    `,
    visualComponent: 'account-setup',
    interactiveElements: [
      { type: 'button', id: 'sign-in-google', label: 'Sign in with Google', action: 'auth' },
      { type: 'button', id: 'skip-account', label: 'Skip for now', action: 'skip' },
      { type: 'button', id: 'create-account', label: 'Create Account & Begin Training', action: 'complete' }
    ]
  }
];

// Drill demonstrations for Screen 6
export const DRILL_DEMOS: Map<DrillType, DrillDemo> = new Map([
  [DrillType.FLASH_PAIRS, {
    drillType: DrillType.FLASH_PAIRS,
    samplePairs: ['AB', 'CD', 'EF', 'GH'],
    exampleStory: 'Quick flash of individual pairs - build instant image recognition',
    difficultyLevel: 'beginner',
    timeEstimate: '1-2 seconds per pair'
  }],
  [DrillType.TWO_PAIR_FUSION, {
    drillType: DrillType.TWO_PAIR_FUSION,
    samplePairs: ['AB', 'CD'],
    exampleStory: 'Aladdin\'s lamp falls into Caesar salad',
    difficultyLevel: 'beginner',
    timeEstimate: '3-5 seconds per fusion'
  }],
  [DrillType.THREE_PAIR_CHAIN, {
    drillType: DrillType.THREE_PAIR_CHAIN,
    samplePairs: ['AB', 'CD', 'EF'],
    exampleStory: 'Aladdin\'s lamp falls into Caesar salad, then explodes into fireworks',
    difficultyLevel: 'intermediate',
    timeEstimate: '5-8 seconds total'
  }],
  [DrillType.EIGHT_PAIR_CHAIN, {
    drillType: DrillType.EIGHT_PAIR_CHAIN,
    samplePairs: ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP'],
    exampleStory: 'A continuous adventure story with 8 connected scenes',
    difficultyLevel: 'intermediate',
    timeEstimate: '15-25 seconds total'
  }],
  [DrillType.JOURNEY_MODE, {
    drillType: DrillType.JOURNEY_MODE,
    samplePairs: ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WX', 'YZ'],
    exampleStory: 'Multiple locations in your memory palace',
    difficultyLevel: 'advanced',
    timeEstimate: '30-45 seconds total'
  }],
  [DrillType.FULL_CUBE_SIMULATION, {
    drillType: DrillType.FULL_CUBE_SIMULATION,
    samplePairs: ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WX', 'YZ', 'AC', 'BD', 'CE', 'DF', 'EG', 'FH'],
    exampleStory: 'Complete cube memorization with edges and corners',
    difficultyLevel: 'advanced',
    timeEstimate: '60-90 seconds total'
  }]
]);

// Letter pair examples for Screen 5
export const LETTER_PAIR_EXAMPLES: LetterPairDemo[] = [
  {
    pair: 'AB',
    suggestedImage: 'Aladdin\'s lamp',
    userImage: '',
    storyConnection: 'A magical lamp that grants wishes'
  },
  {
    pair: 'CD',
    suggestedImage: 'Caesar salad',
    userImage: '',
    storyConnection: 'A fresh green salad'
  },
  {
    pair: 'QU',
    suggestedImage: 'Quick star',
    userImage: '',
    storyConnection: 'A shooting star moving fast'
  },
  {
    pair: 'ST',
    suggestedImage: 'STar',
    userImage: '',
    storyConnection: 'A bright star in the night sky'
  },
  {
    pair: 'NX',
    suggestedImage: 'NeXus',
    userImage: '',
    storyConnection: 'A connection point or meeting place'
  }
];
