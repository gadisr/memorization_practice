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
    defaultPairCount: 12,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Display single letter pairs randomly - Fast image association',
    introduction: 'Flash Pairs presents individual letter pairs one at a time at your own pace. Each pair should trigger an immediate mental image based on your memorization system.',
    howItHelps: 'This drill builds the foundational skill of instant letter-to-image conversion. During a BLD solve, you need to convert each letter pair to a vivid mental image in under 1 second. Flash Pairs trains raw visualization speed and image clarity, which directly impacts your overall memorization speed. The vividness rating helps you identify weak pairs that need more practice or better imagery.'
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
  }],
  [DrillType.EDGE_MEMORIZATION, {
    type: DrillType.EDGE_MEMORIZATION,
    defaultPairCount: 12,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Memorize edge colors and recall as letters - Color to letter memorization',
    introduction: 'Edge Memorization shows you edge pieces (2 colors) one at a time. Your task is to memorize the colors, convert them to Speffz letters in your mind, and then recall the letters in sequence at the end.',
    howItHelps: 'This drill bridges the gap between recognizing piece colors and memorizing letter sequences. You practice the full workflow: see colors → identify notation → memorize as letters → recall. This trains the complete memorization process from visual piece recognition to letter recall, which is exactly what you do during a real BLD solve. It builds automatic color-to-letter conversion while also training memorization and recall skills.'
  }],
  [DrillType.CORNER_MEMORIZATION, {
    type: DrillType.CORNER_MEMORIZATION,
    defaultPairCount: 12,
    qualityMetric: QualityMetric.VIVIDNESS,
    description: 'Memorize corner colors and recall as letters - Color to letter memorization',
    introduction: 'Corner Memorization displays corner pieces (3 colors) one at a time. Your task is to memorize the colors, convert them to Speffz letters in your mind, and then recall the letters in sequence at the end.',
    howItHelps: 'Like Edge Memorization, this drill trains the complete workflow from visual piece recognition to letter recall. Corners are more challenging due to three stickers and multiple orientations. This drill builds automatic corner color-to-letter conversion while training memorization and ordered recall. Mastering this means you can seamlessly go from seeing a scrambled corner to memorizing and recalling its letter notation during actual solves.'
  }]
]);

export function getDrillConfig(type: DrillType): DrillConfig | undefined {
  return DRILL_CONFIGS.get(type);
}

export function getAllDrillConfigs(): DrillConfig[] {
  return Array.from(DRILL_CONFIGS.values());
}


