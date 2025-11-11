/**
 * Onboarding screen content and configuration
 */

import {
  OnboardingScreen,
  DrillDemo,
  LetterPairDemo,
  QuizDefinition,
  MediaAsset,
  CalloutCard
} from './onboarding-types.js';
import { DrillType } from '../types.js';

export const MEDIA_ASSETS: Record<string, MediaAsset> = {
  'phases-overview': {
    id: 'phases-overview',
    type: 'image',
    src: 'media/tutorial/phases-overview.svg',
    alt: 'Diagram showing tracing, memorization, and execution phases',
    caption: 'Your blindfold solve follows three repeatable phases.'
  },
  'orientation-basics': {
    id: 'orientation-basics',
    type: 'image',
    src: 'media/tutorial/orientation-buffers.svg',
    alt: 'Cube orientation with white on top and green on front, highlighting UR and UBL buffers',
    caption: 'Hold the cube white-up, green-front; start every swap from the fixed buffers.'
  },
  'edge-letter-net': {
    id: 'edge-letter-net',
    type: 'image',
    src: 'media/tutorial/edge-letter-net.svg',
    alt: '2D net showing Speffz edge letters with buffer highlighted',
    caption: 'Edges use lowercase letters with UR as the buffer (b*).'
  },
  'corner-letter-net': {
    id: 'corner-letter-net',
    type: 'image',
    src: 'media/tutorial/corner-letter-net.svg',
    alt: '2D net showing Speffz corner letters with buffer highlighted',
    caption: 'Corners use uppercase letters with UBL as the buffer (A*).'
  },
  'edge-cycle-animation': {
    id: 'edge-cycle-animation',
    type: 'image',
    src: 'media/tutorial/edge-cycle.svg',
    alt: 'Diagram following an edge cycle from buffer through letters and back',
    caption: 'Follow the piece path to build your memo without touching the cube.'
  },
  'corner-cycle-animation': {
    id: 'corner-cycle-animation',
    type: 'image',
    src: 'media/tutorial/corner-cycle.svg',
    alt: 'Diagram of a corner cycle using the A buffer',
    caption: 'Corner cycles stop when you return to any letter in the starting triplet.'
  },
  'memo-chunking': {
    id: 'memo-chunking',
    type: 'image',
    src: 'media/tutorial/memo-chunking.svg',
    alt: 'Example showing letters grouped into pairs with color highlights',
    caption: 'Split the memo into two-letter chunks to lower cognitive load.'
  },
  'story-building': {
    id: 'story-building',
    type: 'image',
    src: 'media/tutorial/story-building.svg',
    alt: 'Illustration of letter pairs mapped to person-object images forming a story',
    caption: 'Attach vivid imagery to each pair and link them into a story.'
  },
  'parity-counter': {
    id: 'parity-counter',
    type: 'image',
    src: 'media/tutorial/parity-counter.svg',
    alt: 'Counter highlighting odd letter count triggering parity fix',
    caption: 'An odd number of edge letters means you must run the parity algorithm.'
  },
  'tperm-sequence': {
    id: 'tperm-sequence',
    type: 'image',
    src: 'media/tutorial/tperm-sequence.svg',
    alt: 'Setup → T-perm → undo sequence for target letter j',
    caption: 'Each memo letter becomes setup, algorithm, undo — in that order.'
  },
  'rperm-parity': {
    id: 'rperm-parity',
    type: 'image',
    src: 'media/tutorial/rperm-flow.svg',
    alt: 'Flow chart showing when to apply the parity algorithm',
    caption: 'Run the parity fix once right after finishing edge swaps.'
  },
  'yperm-sequence': {
    id: 'yperm-sequence',
    type: 'image',
    src: 'media/tutorial/yperm-sequence.svg',
    alt: 'Corner setup and Y-perm sequence for target letter K',
    caption: 'Corners use R/F/D setups before executing the modified Y-perm.'
  },
  'solve-checklist': {
    id: 'solve-checklist',
    type: 'image',
    src: 'media/tutorial/solve-checklist.svg',
    alt: 'Checklist summarizing pre-solve, memo, execution, parity, finish steps',
    caption: 'Review the checklist before removing the blindfold.'
  }
};

export const CALLOUT_CARDS: Record<string, CalloutCard> = {
  'mindset-reminder': {
    id: 'mindset-reminder',
    title: 'Mindset Matters',
    body: 'Blindfold solving is a learned skill. Slow practice with accurate memo beats rushed solves.',
    tone: 'info',
    icon: '🧠'
  },
  'buffer-warning': {
    id: 'buffer-warning',
    title: 'Protect the Buffer',
    body: 'Avoid moves that disturb UR during edge setups or UBL during corner setups — keep the buffer intact.',
    tone: 'warning',
    icon: '⚠️'
  },
  'parity-tip': {
    id: 'parity-tip',
    title: 'Parity Fix Timing',
    body: 'Only run the parity algorithm once per solve, right after the final edge letter if your edge memo length is odd.',
    tone: 'info',
    icon: '⏱️'
  },
  'story-tip': {
    id: 'story-tip',
    title: 'Make It Vivid',
    body: 'Pick a person for the first letter and an object for the second. Let them interact in exaggerated ways.',
    tone: 'success',
    icon: '🎨'
  }
};

export const QUIZ_BANK: Record<string, QuizDefinition> = {
  'buffer-locations': {
    id: 'buffer-locations',
    question: 'Which stickers serve as the fixed buffers in the Old Pochmann method?',
    options: [
      {
        id: 'option-a',
        label: 'UR edge and UBL corner',
        isCorrect: true,
        explanation: 'UR (b*) handles edges and UBL (A*) handles corners.'
      },
      {
        id: 'option-b',
        label: 'UF edge and UBR corner',
        isCorrect: false,
        explanation: 'UF and UBR are not the designated buffers — swaps would break memo consistency.'
      },
      {
        id: 'option-c',
        label: 'DF edge and DFR corner',
        isCorrect: false,
        explanation: 'DF/DFR belong to different pieces and would complicate tracing.'
      }
    ],
    successMessage: 'Exactly — always return the buffer piece to UR or UBL before moving on.',
    failureMessage: 'Check the buffer diagram: UR and UBL stay fixed throughout the solve.'
  },
  'first-cycle-rule': {
    id: 'first-cycle-rule',
    question: 'You traced a first edge cycle b* → m → f → j → (back to b*). What should your memo record?',
    options: [
      {
        id: 'option-a',
        label: 'm f j',
        isCorrect: true,
        explanation: 'Skip the buffer letter for the first cycle — just record the targets.'
      },
      {
        id: 'option-b',
        label: 'b m f j',
        isCorrect: false,
        explanation: 'Including the buffer letter wastes space; only later cycles write the closing letter.'
      },
      {
        id: 'option-c',
        label: 'm f j b',
        isCorrect: false,
        explanation: 'Appending the buffer is unnecessary for the opening cycle.'
      }
    ],
    successMessage: 'Correct — omit the buffer letter for the initial cycle.',
    failureMessage: 'Remember: the first cycle starts after the buffer and ends right before returning.'
  },
  'corner-cycle-stop': {
    id: 'corner-cycle-stop',
    question: 'Corner cycle starts at A* and visits V → K → ?. Which letter ends the cycle?',
    prompt: 'Hint: A shares a piece with E and R.',
    options: [
      {
        id: 'option-a',
        label: 'P',
        isCorrect: true,
        explanation: 'V-K-P belong to the same physical corner as A — return to any letter in that triplet.'
      },
      {
        id: 'option-b',
        label: 'A',
        isCorrect: false,
        explanation: 'You do not need to land exactly on A — any letter in the triplet ends the cycle.'
      },
      {
        id: 'option-c',
        label: 'R',
        isCorrect: false,
        explanation: 'R belongs to the A–E–R corner, not the V–K–P piece traced here.'
      }
    ],
    successMessage: 'Yes — once the path hits P you close the loop for that corner cycle.',
    failureMessage: 'Review the corner triplet table — any letter from the starting corner’s trio ends the cycle.'
  },
  'parity-check': {
    id: 'parity-check',
    question: 'Your edge memo contains 9 letters. What should you plan to do before solving corners?',
    options: [
      {
        id: 'option-a',
        label: 'Run the parity (R-perm) algorithm once',
        isCorrect: true,
        explanation: 'An odd count indicates parity; apply the R-perm immediately after edges.'
      },
      {
        id: 'option-b',
        label: 'Add a fake letter to make it even',
        isCorrect: false,
        explanation: 'Never fabricate memo letters — parity is resolved with the algorithm.'
      },
      {
        id: 'option-c',
        label: 'Do nothing and continue to corners',
        isCorrect: false,
        explanation: 'Skipping the parity fix leaves the cube unsolved.'
      }
    ],
    successMessage: 'Great call — parity fix keeps the cube solvable.',
    failureMessage: 'Parity is mandatory when the edge memo length is odd.'
  },
  'corner-setup': {
    id: 'corner-setup',
    question: 'Which setup keeps the UBL buffer safe when targeting letter K?',
    options: [
      {
        id: 'option-a',
        label: 'R F',
        isCorrect: true,
        explanation: 'R F brings K to the P position without disturbing the buffer.'
      },
      {
        id: 'option-b',
        label: 'U L',
        isCorrect: false,
        explanation: 'U moves affect the buffer directly — avoid them during corner setups.'
      },
      {
        id: 'option-c',
        label: 'B2',
        isCorrect: false,
        explanation: 'B2 reorients the buffer sticker — unsafe for corner execution.'
      }
    ],
    successMessage: 'Correct — R F is the safe setup for letter K.',
    failureMessage: 'Stick with R, F, or D moves when preparing corner swaps.'
  }
};

export const ONBOARDING_SCREENS: OnboardingScreen[] = [
  {
    id: 'welcome-overview',
    title: 'You Can Learn to Solve Blindfolded',
    content: `
      <div class="screen-body">
        <p>Old Pochmann is a reliable three-phase roadmap: trace the cube, memorize the letters, then execute swaps from your buffers.</p>
        <div class="callout-stack" data-callout="mindset-reminder"></div>
        <div class="media-frame" data-media="phases-overview"></div>
        <p class="screen-note">This interactive tutorial mirrors the steps in our training drills — move at your own pace.</p>
      </div>
    `,
    interactiveElements: [
      { type: 'button', id: 'start-tutorial', label: 'Begin Orientation', action: 'next' }
    ]
  },
  {
    id: 'orientation-buffers',
    title: 'Lock in Orientation & Buffers',
    content: `
      <div class="screen-body">
        <p>Always hold the cube <strong>white up</strong>, <strong>green front</strong>. The buffer pieces never move — only the stickers inside them change.</p>
        <div class="media-frame" data-media="orientation-basics"></div>
        <p class="screen-note">Every trace and algorithm begins from UR (edges) or UBL (corners).</p>
      </div>
    `,
    interactiveElements: [
      { type: 'quiz', id: 'buffer-quiz', action: 'quiz', data: { quizId: 'buffer-locations' } },
      { type: 'button', id: 'orientation-next', label: 'Got the Buffers', action: 'next' }
    ]
  },
  {
    id: 'lettering-scheme',
    title: 'Learn the Lettering Scheme',
    content: `
      <div class="screen-body">
        <p>Speffz gives every sticker a stable letter. Edges use lowercase, corners use uppercase.</p>
        <div class="media-toggle">
          <button class="media-toggle-btn" data-media="edge-letter-net">Edge Map</button>
          <button class="media-toggle-btn" data-media="corner-letter-net">Corner Map</button>
        </div>
        <div class="media-frame" data-media="edge-letter-net"></div>
        <p class="screen-note">Highlight your buffers — b* for edges, A* for corners — they anchor each memo cycle.</p>
      </div>
    `,
    interactiveElements: [
      { type: 'demo', id: 'notation-demo', action: 'demo', data: { quizId: 'buffer-locations', pieceType: 'edge' } },
      { type: 'button', id: 'lettering-next', label: 'Continue to Tracing', action: 'next' }
    ]
  },
  {
    id: 'tracing-intro',
    title: 'Tracing Turns Cube State into Letters',
    content: `
      <div class="screen-body">
        <p>Start at the buffer, follow where that piece belongs, and note the target’s letter. Keep hopping until you return.</p>
        <div class="media-frame" data-media="edge-cycle-animation"></div>
        <p class="screen-note">You never touch the cube during memo — tracing is done mentally or using the animation stepper.</p>
      </div>
    `,
    interactiveElements: [
      { type: 'demo', id: 'tracing-stepper', action: 'demo', data: { cycle: ['m', 'f', 'j'], buffer: 'b*' } },
      { type: 'quiz', id: 'first-cycle-quiz', action: 'quiz', data: { quizId: 'first-cycle-rule' } },
      { type: 'button', id: 'tracing-intro-next', label: 'Next: Cycle Rules', action: 'next' }
    ]
  },
  {
    id: 'tracing-rules',
    title: 'Finalize Each Cycle Correctly',
    content: `
      <div class="screen-body">
        <p>The first cycle skips the buffer letter. Any broken pieces left afterwards start a new cycle — write the closing letter to seal it.</p>
        <ul class="rule-list">
          <li><strong>Rule 1:</strong> Omit the buffer letter in the opening cycle.</li>
          <li><strong>Rule 2:</strong> Later cycles record their ending letter (buffer or pair).</li>
          <li><strong>Rule 3:</strong> Choose the next unsolved piece alphabetically.</li>
        </ul>
      </div>
    `,
    interactiveElements: [
      { type: 'quiz', id: 'cycle-rule-quiz', action: 'quiz', data: { quizId: 'first-cycle-rule' } },
      { type: 'button', id: 'tracing-rules-next', label: 'Start Corner Tracing', action: 'next' }
    ]
  },
  {
    id: 'tracing-corners',
    title: 'Trace Corners with Triplet Groups',
    content: `
      <div class="screen-body">
        <p>Corner cycles stop when you land on any letter in the same triplet. The buffer A* shares a piece with E and R.</p>
        <div class="media-frame" data-media="corner-cycle-animation"></div>
        <p class="screen-note">Track triplets using the reference table — it ensures each physical corner is solved.</p>
      </div>
    `,
    interactiveElements: [
      { type: 'quiz', id: 'corner-cycle-quiz', action: 'quiz', data: { quizId: 'corner-cycle-stop' } },
      { type: 'button', id: 'corner-next', label: 'Move to Memorization', action: 'next' }
    ]
  },
  {
    id: 'memo-chunking',
    title: 'Chunk Memo into Letter Pairs',
    content: `
      <div class="screen-body">
        <p>Group the traced letters into two-letter packets. If you have an odd count, the final letter stands alone until parity is fixed.</p>
        <div class="media-frame" data-media="memo-chunking"></div>
        <p class="screen-note">Chunking lowers working-memory load and primes you for imagery.</p>
      </div>
    `,
    interactiveElements: [
      { type: 'demo', id: 'chunking-workshop', action: 'demo', data: { sequence: ['m', 'f', 'j', 'r', 'k', 'e', 'r'] } },
      { type: 'quiz', id: 'parity-check-quiz', action: 'quiz', data: { quizId: 'parity-check' } },
      { type: 'button', id: 'memo-chunking-next', label: 'Build Images', action: 'next' }
    ]
  },
  {
    id: 'memory-images',
    title: 'Turn Letter Pairs into Images',
    content: `
      <div class="screen-body">
        <p>Assign a person to the first letter and an object to the second. The more vivid the interaction, the easier the recall.</p>
        <div class="media-frame" data-media="story-building"></div>
        <div class="callout-stack" data-callout="story-tip"></div>
      </div>
    `,
    interactiveElements: [
      { type: 'demo', id: 'image-journal', action: 'demo', data: { pairs: ['mf', 'jr', 'ke'] } },
      { type: 'button', id: 'memory-images-next', label: 'Parity & Execution', action: 'next' }
    ]
  },
  {
    id: 'parity-overview',
    title: 'Parity Check Before Execution',
    content: `
      <div class="screen-body">
        <p>An odd number of edge letters signals parity. Fix it immediately after edges using the R-perm before touching corners.</p>
        <div class="media-frame" data-media="parity-counter"></div>
        <div class="callout-stack" data-callout="parity-tip"></div>
      </div>
    `,
    interactiveElements: [
      { type: 'quiz', id: 'parity-quiz', action: 'quiz', data: { quizId: 'parity-check' } },
      { type: 'button', id: 'parity-next', label: 'Execute Edges', action: 'next' }
    ]
  },
  {
    id: 'execution-edges',
    title: 'Execute Edges with T-perm',
    content: `
      <div class="screen-body">
        <p>For each memo letter: perform a safe setup to bring the target to the swap position, run T-perm, undo the setup.</p>
        <div class="media-frame" data-media="tperm-sequence"></div>
        <div class="callout-stack" data-callout="buffer-warning"></div>
      </div>
    `,
    interactiveElements: [
      { type: 'demo', id: 'edge-sequence-demo', action: 'demo', data: { letter: 'j', setup: ['Dw2', 'L'], algorithm: 'T-perm' } },
      { type: 'button', id: 'execution-edges-next', label: 'Parity Fix', action: 'next' }
    ]
  },
  {
    id: 'execution-parity',
    title: 'Run the Parity Algorithm Once',
    content: `
      <div class="screen-body">
        <p>If your edge memo length was odd, execute the R-perm now. This swaps two edges and two corners, syncing cycles for the corner phase.</p>
        <div class="media-frame" data-media="rperm-parity"></div>
      </div>
    `,
    interactiveElements: [
      { type: 'button', id: 'parity-confirm', label: 'Parity Resolved', action: 'next' }
    ]
  },
  {
    id: 'execution-corners',
    title: 'Execute Corners with Modified Y-perm',
    content: `
      <div class="screen-body">
        <p>Use R, F, or D setups to bring the target corner to the P sticker. Execute the modified Y-perm, then undo the setup.</p>
        <div class="media-frame" data-media="yperm-sequence"></div>
      </div>
    `,
    interactiveElements: [
      { type: 'quiz', id: 'corner-setup-quiz', action: 'quiz', data: { quizId: 'corner-setup' } },
      { type: 'button', id: 'execution-corners-next', label: 'Review Checklist', action: 'next' }
    ]
  },
  {
    id: 'checklist-review',
    title: 'Run the Solve Checklist',
    content: `
      <div class="screen-body">
        <p>Walk through the checklist before you start the timer or remove the blindfold. Consistency builds accuracy.</p>
        <div class="media-frame" data-media="solve-checklist"></div>
        <ul class="checklist">
          <li>Orientation locked (white up, green front)</li>
          <li>Edge memo traced and chunked</li>
          <li>Parity decision made</li>
          <li>Corner memo prepared</li>
          <li>Algorithms rehearsed mentally</li>
        </ul>
      </div>
    `,
    interactiveElements: [
      { type: 'demo', id: 'checklist-toggles', action: 'demo', data: { checklist: ['Orientation', 'Edge memo', 'Parity', 'Corner memo', 'Algorithms'] } },
      { type: 'button', id: 'checklist-next', label: 'Finish Tutorial', action: 'next' }
    ]
  },
  {
    id: 'next-steps',
    title: 'Next Steps: Drill, Track, Celebrate',
    content: `
      <div class="screen-body">
        <p>You now know the full blindfold route. Keep practicing with flash drills, story building, and full cube simulations.</p>
        <p class="screen-note">Need visual aids? Download the diagram pack or revisit any section anytime.</p>
      </div>
    `,
    interactiveElements: [
      { type: 'button', id: 'launch-drill', label: 'Start Flash Pairs', action: 'demo' },
      { type: 'button', id: 'view-dashboard', label: 'Open Dashboard', action: 'demo' },
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
  [DrillType.EDGE_MEMORIZATION, {
    drillType: DrillType.EDGE_MEMORIZATION,
    samplePairs: ['a', 'b', 'c', 'd'],
    exampleStory: 'Memorize edge colors and recall as letters',
    difficultyLevel: 'intermediate',
    timeEstimate: '2-3 seconds per piece'
  }],
  [DrillType.CORNER_MEMORIZATION, {
    drillType: DrillType.CORNER_MEMORIZATION,
    samplePairs: ['A', 'B', 'C', 'D'],
    exampleStory: 'Memorize corner colors and recall as letters',
    difficultyLevel: 'intermediate',
    timeEstimate: '3-4 seconds per piece'
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
