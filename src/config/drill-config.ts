/**
 * Drill configuration data for all training modes
 */

import { DrillType, QualityMetric, DrillConfig } from '../types.js';

/**
 * General introduction to BLD memorization technique
 */
export const BLD_TECHNIQUE_INTRO = `
<h3>About Blindfold Cubing Memorization</h3>
<p>Blindfold (BLD) cubing requires memorizing the cube's state using a letter-pair system (typically Speffz notation). 
Each piece position is assigned a letter, and the solution is encoded as a sequence of letter pairs representing 
piece swaps or cycles.</p>

<p><strong>The Challenge:</strong> A 3x3 BLD solve requires memorizing ~20 letter pairs (edges + corners) in under 
a minute, then recalling them accurately during execution. Success depends on three key skills:</p>

<ul>
  <li><strong>Speed:</strong> Convert letters to vivid mental images instantly</li>
  <li><strong>Story Building:</strong> Chain images into memorable narratives</li>
  <li><strong>Recall Accuracy:</strong> Retrieve the sequence without errors under pressure</li>
</ul>

<p>This trainer develops these skills progressively through targeted drills, from individual pair recognition 
to full cube simulation.</p>
`;

export const DRILL_CONFIGS: Map<DrillType, DrillConfig> = new Map([
  [DrillType.FLASH_PAIRS, {
    type: DrillType.FLASH_PAIRS,
    defaultPairCount: 30,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Display single letter pairs randomly - Fast image association',
    introduction: 'Flash Pairs presents individual letter pairs one at a time at your own pace. Each pair should trigger an immediate mental image based on your memorization system.',
    howItHelps: 'This drill builds the foundational skill of instant letter-to-image conversion. During a BLD solve, you need to convert each letter pair to a vivid mental image in under 1 second. Flash Pairs trains raw visualization speed and image clarity, which directly impacts your overall memorization speed. The vividness rating helps you identify weak pairs that need more practice or better imagery.'
  }],
  [DrillType.TWO_PAIR_FUSION, {
    type: DrillType.TWO_PAIR_FUSION,
    defaultPairCount: 10,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Show 2 pairs → form single mini-scene - Small scene building',
    introduction: 'Two-Pair Fusion displays pairs of letter pairs (4 letters total). Your task is to combine both images into a single coherent mini-scene or interaction.',
    howItHelps: 'BLD memorization isn\'t just about individual images—you need to connect them. This drill teaches the critical skill of image fusion: making two separate images interact in a memorable way. For example, if you get pairs "AB" and "CD", you combine their images into one scene. This reduces cognitive load (remembering one scene instead of two separate images) and makes recall more reliable. It\'s the bridge between isolated images and full story building.'
  }],
  [DrillType.THREE_PAIR_CHAIN, {
    type: DrillType.THREE_PAIR_CHAIN,
    defaultPairCount: 5,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Sequentially add 3 pairs into same story - Progressive chaining',
    introduction: 'Three-Pair Chain reveals pairs sequentially (one at a time), and you must build them into a continuous story. Each new pair extends the narrative you\'re creating.',
    howItHelps: 'This drill simulates the actual BLD memo process where pairs arrive sequentially as you track the cube. You can\'t see all pairs at once—you must build your story on the fly. Three-Pair Chain trains progressive story construction: starting with a scene and smoothly adding new elements. This teaches narrative flow and prevents story "breaks" where you can\'t connect the next image. It\'s essential for maintaining coherent stories during fast memo phases.'
  }],
  [DrillType.EIGHT_PAIR_CHAIN, {
    type: DrillType.EIGHT_PAIR_CHAIN,
    defaultPairCount: 8,
    qualityMetric: QualityMetric.FLOW,
    description: 'Sequential story of 8 pairs - Continuous scene building',
    introduction: 'Eight-Pair Chain presents 8 pairs sequentially, requiring you to build one continuous story or scene. The focus shifts from vividness to story flow and coherence.',
    howItHelps: 'A typical BLD edge memo contains 8-12 pairs, all needing to fit into one story location. This drill trains extended narrative construction without breaking into multiple scenes. The flow rating measures how smoothly your story progresses—do the images connect naturally, or are there awkward transitions? Good flow means faster recall with fewer errors. This directly prepares you for edge memorization, where you need one cohesive story for ~10 pairs.'
  }],
  [DrillType.JOURNEY_MODE, {
    type: DrillType.JOURNEY_MODE,
    defaultPairCount: 15,
    qualityMetric: QualityMetric.FLOW,
    description: 'Multi-scene (3-5 rooms) practice - Memory Palace chaining',
    introduction: 'Journey Mode gives you 15+ pairs to distribute across multiple locations (rooms) in your memory palace. You decide when to transition between locations.',
    howItHelps: 'Full BLD solves require 15-20 pairs total (edges + corners), too many for a single location. Journey Mode trains memory palace navigation—placing stories in different locations and recalling them in sequence. You learn optimal story lengths (usually 5-8 pairs per location) and smooth location transitions. This drill bridges the gap between single-location practice and full cube simulation. It teaches mental organization skills essential for sub-60 second memo times.'
  }],
  [DrillType.FULL_CUBE_SIMULATION, {
    type: DrillType.FULL_CUBE_SIMULATION,
    defaultPairCount: 20,
    qualityMetric: QualityMetric.FLOW,
    description: 'Edge + Corner sequence simulation - Realistic BLD memo practice',
    introduction: 'Full Cube Simulation mimics a real BLD solve by giving you ~20 pairs (representing edges and corners). This is your complete memorization practice under realistic conditions.',
    howItHelps: 'This is the ultimate test of all your skills combined: instant image conversion, story building, location management, and full-sequence recall. It simulates actual solve conditions, including the mental fatigue of maintaining 20+ images. Regular practice here builds solve consistency and reveals weak points in your complete system. Use this drill to practice your actual solve routine, including the specific memory palace locations you use during competitions. Success here translates directly to successful BLD solves.'
  }],
  [DrillType.EDGE_NOTATION_DRILL, {
    type: DrillType.EDGE_NOTATION_DRILL,
    defaultPairCount: 24,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Recognize Speffz notation from 2-color edge pieces - Accuracy & Speed',
    introduction: 'Edge Notation Drill shows you cube edge pieces (2 colors) and asks you to identify the correct Speffz letter. You must know which letter corresponds to each color combination and orientation.',
    howItHelps: 'Before you can memorize, you must accurately and quickly identify pieces using Speffz notation. Mistakes in notation = memorizing the wrong solution. This drill trains automatic piece recognition, reducing the time spent identifying letters during memo. It also reinforces the physical letter scheme, making the conversion from physical piece → letter → image completely automatic. Fast, accurate notation reading is the foundation that everything else builds on.'
  }],
  [DrillType.CORNER_NOTATION_DRILL, {
    type: DrillType.CORNER_NOTATION_DRILL,
    defaultPairCount: 24,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Recognize Speffz notation from 3-color corner pieces - Accuracy & Speed',
    introduction: 'Corner Notation Drill displays corner pieces (3 colors) and asks for the Speffz letter. Corners are more complex than edges due to three stickers and multiple possible orientations.',
    howItHelps: 'Corner notation is trickier than edges because you must identify which of the three stickers is the "reference" sticker in your scheme. This drill builds automatic corner recognition, preventing notation errors that would ruin your solve. Like edge notation, speed here directly reduces your memo time. Mastering both edge and corner notation means you can focus entirely on memorization during actual solves, rather than struggling to identify pieces.'
  }],
  [DrillType.CORNER_TRACING_DRILL, {
    type: DrillType.CORNER_TRACING_DRILL,
    defaultPairCount: 1,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Trace corner cycles from scramble string',
    introduction: 'Corner Tracing Drill presents you with a scramble string and asks you to trace the corner cycles, inputting the correct letter sequence that represents the corner movements.',
    howItHelps: 'This drill trains the core skill of corner tracing - following how corner pieces move through cycles during a scramble. It builds the foundation for corner memorization by teaching you to track piece movements and convert them to letter sequences. This is essential for BLD corner memorization where you must trace and memorize corner cycles accurately.'
  }],
  [DrillType.EDGE_TRACING_DRILL, {
    type: DrillType.EDGE_TRACING_DRILL,
    defaultPairCount: 1,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Trace edge cycles from scramble string',
    introduction: 'Edge Tracing Drill presents you with a scramble string and asks you to trace the edge cycles, inputting the correct letter sequence that represents the edge movements.',
    howItHelps: 'This drill trains the core skill of edge tracing - following how edge pieces move through cycles during a scramble. It builds the foundation for edge memorization by teaching you to track piece movements and convert them to letter sequences. This is essential for BLD edge memorization where you must trace and memorize edge cycles accurately.'
  }]
]);

export function getDrillConfig(type: DrillType): DrillConfig | undefined {
  return DRILL_CONFIGS.get(type);
}

export function getAllDrillConfigs(): DrillConfig[] {
  return Array.from(DRILL_CONFIGS.values());
}


