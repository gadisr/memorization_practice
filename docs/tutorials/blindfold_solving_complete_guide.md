---
title: "3×3 Rubik's Cube Blindfolded - Complete Solution Guide"
subtitle: "A Beginner's Guide to Blindfold Solving Using the Old Pochmann Method"
version: "1.0"
---

# 3×3 RUBIK'S CUBE BLINDFOLDED
## Complete Solution Guide for Beginners

---

## TABLE OF CONTENTS

### PART I: INTRODUCTION
1. Welcome to Blindfold Solving
2. How Blindfold Solving Works
3. Prerequisites & What You Need

### PART II: FUNDAMENTALS
4. Understanding the Cube
5. Orientation & Holding the Cube
6. The Buffer System
7. The Lettering Scheme

### PART III: THE THREE PHASES
8. **Phase 1: Tracing**
   - 8.1 Edge Tracing
   - 8.2 Edge Tracing Examples
   - 8.3 Closing Cycles & Circuit Breaking
   - 8.4 Corner Tracing
   - 8.5 Complete Tracing Example

9. **Phase 2: Memorization**
   - 9.1 Why Letter Pairs?
   - 9.2 Chunking Your Memo
   - 9.3 Memory Techniques (PAO System)
   - 9.4 Building Memory Stories
   - 9.5 Parity Detection

10. **Phase 3: Execution**
    - 10.1 Execution Overview
    - 10.2 Safe Execution Rules
    - 10.3 Edge Execution (T-Perm)
    - 10.4 Edge Setup Moves
    - 10.5 Parity Fix (R-Perm)
    - 10.6 Corner Execution (Y-Perm)
    - 10.7 Corner Setup Moves
    - 10.8 Complete Solve Walkthrough

### PART IV: PRACTICE & IMPROVEMENT
11. Practice Strategy
12. Common Mistakes & Troubleshooting
13. Tips for Success

### APPENDICES
- **Appendix A:** Complete Lettering Maps
- **Appendix B:** Edge Setup Move Reference
- **Appendix C:** Corner Setup Move Reference
- **Appendix D:** Algorithm Quick Reference
- **Appendix E:** Blindfold Solve Checklist
- **Appendix F:** Practice Drills

---

# PART I: INTRODUCTION

## 1. WELCOME TO BLINDFOLD SOLVING

Solving a Rubik's Cube blindfolded may seem impossible, but it is a **logical, learnable process** that anyone can master with patience and practice. This guide will teach you exactly how to do it, step by step.

### What You Will Learn

This guide uses the **Old Pochmann Method**, a beginner-friendly approach that requires learning only:
- ✅ **One algorithm for edges** (T-Perm)
- ✅ **One algorithm for corners** (Modified Y-Perm)
- ✅ **One parity algorithm** (R-Perm - used only when needed)
- ✅ **Setup moves** for each letter position

### The Core Concept

Blindfold solving is **not about memorizing algorithms**. It's about:
1. **Understanding** where each piece needs to go
2. **Memorizing** that information as a sequence of letters
3. **Executing** moves blindfolded using a fixed buffer system

### Mindset for Success

**You CAN do this!** Blindfold solving requires:
- ✅ Patience and persistence
- ✅ Willingness to practice
- ✅ Trust in the process
- ✅ Acceptance that mistakes are part of learning

Even if your first attempts don't succeed, each try builds your understanding. Most cubers succeed within their first 10-20 attempts.

---

## 2. HOW BLINDFOLD SOLVING WORKS

Unlike traditional layer-by-layer solving, blindfold solving happens in **three distinct phases**:

| Phase | What You Do | Key Concept | Time Spent |
|-------|-------------|-------------|------------|
| **1. Tracing** | Look at the scrambled cube and determine where every piece belongs | Convert the cube state into a sequence of letters | 40-50% |
| **2. Memorization** | Store the letter sequence in your memory using techniques | Create memorable stories or images from letter pairs | 30-40% |
| **3. Execution** | Put on blindfold and solve the cube using your memorized sequence | Swap pieces through a fixed buffer using algorithms | 20-30% |

### The Big Picture

Instead of solving the cube **layer by layer**, we:
1. Track where **each individual piece** needs to go (Tracing)
2. Remember that information as **letters** (Memorization)
3. Move pieces **one at a time** to their correct positions (Execution)

This approach works because:
- We solve **piece by piece** in a controlled order
- We use a **fixed starting point** (buffer) for all swaps
- We never disturb **already-solved** pieces
- We follow a **predetermined sequence** rather than reacting to the cube

---

## 3. PREREQUISITES & WHAT YOU NEED

### Before You Begin

To learn blindfold solving, you should:

✅ **Know how to solve a 3×3 cube normally** (any method)
- You need to understand what corners, edges, and centers are
- You should be comfortable holding and turning the cube
- You don't need to be fast—just consistent

✅ **Understand basic cube notation**
- R, U, F, L, D, B (face turns)
- Prime notation (R', U', etc. for counterclockwise)
- Double moves (R2, U2, etc.)
- Wide moves (Rw, Uw, Dw, etc.)

✅ **Be willing to practice regularly**
- Expect 5-10 hours of practice to get your first success
- Consistent 20-30 minute sessions work better than marathon sessions

### What You'll Need

**Physical Items:**
- A 3×3 Rubik's Cube (any standard cube works)
- A blindfold, sleeping mask, or towel to cover your eyes
- This guide (printed or on screen)
- Paper and pencil for practice

**Optional But Helpful:**
- Printout of lettering scheme (Appendix A)
- Setup moves reference sheet (Appendices B & C)
- Timer (for tracking progress, not speed)

---

# PART II: FUNDAMENTALS

## 4. UNDERSTANDING THE CUBE

### Cube Anatomy

A 3×3 Rubik's Cube has three types of pieces:

| Piece Type | Count | Stickers Each | Total Stickers | Movement |
|------------|-------|---------------|----------------|----------|
| **Centers** | 6 | 1 | 6 | Fixed position (define cube faces) |
| **Edges** | 12 | 2 | 24 | Can move to any edge position |
| **Corners** | 8 | 3 | 24 | Can move to any corner position |

### Important Concepts

**1. Piece Identity vs. Position**
- Each piece has a **fixed identity** (the colors it has)
- But pieces can be in **different positions**
- Blindfold solving is about returning each piece to its correct position

**2. Pieces Move Together**
- When you turn a face, multiple pieces move
- But pieces maintain their orientation relative to each other
- Understanding piece movement is crucial for tracing

**3. Centers Never Move**
- The center pieces define which color belongs to which face
- In this guide, we use **white up, green front** as standard
- Centers provide reference points for all other pieces

---

## 5. ORIENTATION & HOLDING THE CUBE

### The Golden Rule: Consistent Orientation

**CRITICAL:** For blindfold solving to work, you must **ALWAYS** hold the cube the same way.

**Standard Orientation:**
```
WHITE center on UP (U) face
GREEN center on FRONT (F) face
```

This means:
- **Yellow** is on the bottom (D face)
- **Blue** is on the back (B face)
- **Red** and **Orange** are on the sides (R and L faces)

### Why Orientation Matters

1. **Letter assignments are position-based** - Each letter refers to a specific physical location
2. **Setup moves assume fixed orientation** - They only work if the cube stays oriented
3. **Muscle memory depends on consistency** - Your fingers learn where positions are
4. **No rotations during execution** - We never rotate the cube (no x, y, or z moves)

### Checking Your Orientation

Before every solve (and throughout execution):
1. Feel for the **UP face** - should have the center color you designated as up
2. Feel for the **FRONT face** - should have the center color you designated as front
3. If you lose track, **stop and reorient** before continuing

---

## 6. THE BUFFER SYSTEM

### What is a Buffer?

The **buffer** is a fixed position on the cube where all solving begins and returns. Think of it as a "home base" or "hub" through which all pieces pass during the solve.

**Key Buffer Principle:**
- The buffer **position never moves**
- We repeatedly **swap pieces through the buffer**
- Each swap solves one piece and brings a new piece to the buffer
- This continues until all pieces are solved

### Our Buffer Positions

| Piece Type | Buffer Position | Buffer Letter | Target Swap Position | Target Letter |
|------------|-----------------|---------------|----------------------|---------------|
| **Edges** | UR (Up-Right edge) | **b\*** | DF position | **d** |
| **Corners** | UBL (Up-Back-Left corner) | **A\*** | DFR position | **P** |

**Diagram Description Needed:**
- Image showing 3D cube with UR edge highlighted and labeled "b*"
- Image showing 3D cube with UBL corner highlighted and labeled "A*"

### How the Buffer System Works

**Example - Edge Solving:**
1. Start: A piece is at buffer position **b*** (UR)
2. We identify where that piece belongs (let's say position **m**)
3. We swap buffer piece with the piece at position **m**
4. Result: The first piece is now solved, and position **m**'s piece is now at buffer
5. Repeat: We now swap the new buffer piece with the next target
6. Continue until all pieces are solved

**Why This Works:**
- Each swap **solves exactly one piece** (the piece that was at buffer)
- Each swap **brings the next unsolved piece** to buffer
- We never disturb **already-solved pieces**
- The buffer position itself gets solved last (automatically)

---

## 7. THE LETTERING SCHEME

### Why We Use Letters

To blindfold solve, we need a way to **refer to each sticker position** without looking at the cube. We assign each sticker a unique letter.

### Letter Assignment System

We use a modified **Speffz lettering scheme**:

**For Edges:**
- Use **lowercase letters: a, b, c, d, ... x** (24 letters for 24 edge stickers)
- Buffer position UR = **b\***
- Letters assigned clockwise around each face

**For Corners:**
- Use **UPPERCASE letters: A, B, C, D, ... X** (24 letters for 24 corner stickers)
- Buffer position UBL = **A\***
- Letters assigned clockwise around each face

**Diagram Description Needed:**
- 2D net layout of cube showing all lowercase edge letters (a-x)
- 2D net layout of cube showing all UPPERCASE corner letters (A-X)
- Both diagrams with buffer positions highlighted

### Letter Pairs and Groups

**Edge Pairs:**
Every edge piece has **two stickers** (on opposite sides of the piece). These stickers are assigned **paired letters**.

Example edge pairs:
- a ↔ q (same physical piece, different stickers)
- b ↔ m (same physical piece, different stickers)
- c ↔ i (same physical piece, different stickers)

**Corner Triplets:**
Every corner piece has **three stickers**. These stickers form a **letter triplet group**.

Example corner groups:
- A–E–R (same physical corner, three different stickers)
- B–Q–N (same physical corner, three different stickers)
- C–J–M (same physical corner, three different stickers)

**Why Pairs/Groups Matter:**
- They tell us when a **cycle is complete** during tracing
- When tracing returns to a paired/grouped letter, that cycle ends
- This is crucial for correctly building your memorization sequence

**Diagram Description Needed:**
- One edge piece shown with both stickers labeled (e.g., 'a' and 'q')
- One corner piece shown with all three stickers labeled (e.g., 'A', 'E', 'R')

---

# PART III: THE THREE PHASES

## 8. PHASE 1: TRACING

Tracing is the process of **converting the scrambled cube into a sequence of letters** that tells you where each piece needs to go.

### The Tracing Process

**Tracing means:**
1. Start at the buffer position
2. Look at which piece is currently there
3. Identify where that piece **belongs** on a solved cube
4. Note the letter of that target position
5. Go to that target position and repeat steps 2-4
6. Continue until you return to the buffer (or its paired letter)

**Think of tracing like following a trail:**
- Each piece tells you where to look next
- You're building a map of where pieces need to go
- The trail eventually leads back to where you started

---

## 8.1 EDGE TRACING

Edge tracing creates your **edge memorization sequence** using lowercase letters.

### Step-by-Step Edge Tracing

**Setup:**
- Hold cube with **white up, green front**
- Start at edge buffer position: **UR = b\***

**Tracing Steps:**

**1. Look at the buffer piece**
   - Identify the two stickers on the piece currently at UR position
   - Ask: "Where does this piece belong on a solved cube?"

**2. Note the target letter**
   - Find where this piece belongs
   - Write down the **letter of that target position**
   - This is your first memo letter

**3. Follow the chain**
   - Go to that target position
   - Look at the piece currently there
   - Where does **that** piece belong?
   - Note its target letter

**4. Continue tracing**
   - Keep following the chain
   - Each piece tells you where to go next
   - Keep writing down target letters

**5. Recognize cycle completion**
   - Stop when the chain leads back to:
     - The buffer position (**b**)
     - OR the buffer's paired letter (**m**)
   - This completes one cycle

---

## 8.2 EDGE TRACING EXAMPLES

### Example 1: Simple Single Cycle

**Scenario:** Scrambled cube with edges displaced

**Tracing:**
1. Buffer (b*) piece belongs at position **m**
   - Write: m
2. Position **m** piece belongs at position **f**
   - Write: m f
3. Position **f** piece belongs at position **j**
   - Write: m f j
4. Position **j** piece belongs back at buffer (**b**)
   - Cycle complete! Don't write **b**

**Edge Memo:** `m f j`

**Cycle Writing Rule 1:**
For the **first cycle**, do NOT write the buffer letter at the end. The cycle completion is implied.

---

### Example 2: Multiple Cycles

**Scenario:** First cycle doesn't solve all edges

**First Cycle:**
- Trace: b → m → f → j → back to b
- Write: `m f j`

**Check:** Are all edges solved?
- No! Some edges are still unsolved
- Need to start a new cycle (called "circuit breaking")

**Second Cycle:**
1. Find the **first unsolved edge** (alphabetically): suppose it's **r**
2. Start tracing from **r**
   - Position **r** piece belongs at **k**
   - Position **k** piece belongs at **e**
   - Position **e** piece belongs back at **r**
3. Write the complete cycle: `r k e r`

**Cycle Writing Rule 2:**
For the **second cycle onward**, DO write the closing letter (the letter you return to).

**Complete Edge Memo:** `m f j | r k e r`
- Total: 7 letters
- Two separate cycles

---

## 8.3 CLOSING CYCLES & CIRCUIT BREAKING

### When Does a Cycle End?

A cycle is complete when tracing returns to:
1. The starting position of **that cycle** (for cycles 2+)
2. The **paired letter** of the starting position
3. For first cycle: when it returns to buffer (**b** or **m**)

### Circuit Breaking (Starting New Cycles)

**When to circuit break:**
- After completing a cycle, check if all pieces are solved
- If unsolved pieces remain, start a new cycle

**How to circuit break:**
1. Scan the cube for **unsolved edges**
2. Find the **first unsolved edge alphabetically** (a, then c, then d, etc.)
   - Skip **b** and **m** (these are buffer positions)
3. Begin tracing from that letter
4. Continue until returning to that letter or its pair
5. Write the complete cycle including the closing letter

**Why This Works:**
- Circuit breaking "forces" a new swap chain
- It ensures we eventually solve all pieces
- The order (alphabetical) keeps it systematic

**Example:**
```
First cycle:   m f j         (returns to buffer - don't write b)
Second cycle:  r k e r       (returns to r - write closing r)
Third cycle:   n t           (returns to n's pair t - write t)
```

---

## 8.4 CORNER TRACING

Corner tracing works **identically to edge tracing**, but with these differences:

### Key Differences

| Aspect | Edges | Corners |
|--------|-------|---------|
| **Letters** | lowercase (a-x) | UPPERCASE (A-X) |
| **Buffer** | UR = b* | UBL = A* |
| **Pairs/Groups** | 2-letter pairs | 3-letter triplets |
| **Cycle End** | Return to buffer or pair | Return to buffer or any letter in its triplet |

### Corner Tracing Steps

**Setup:**
- **After completing all edge tracing**
- Still holding: white up, green front
- Start at corner buffer: **UBL = A\***

**Tracing:**
1. Look at the piece at buffer corner (A*)
2. Identify where this corner belongs
3. Note the target letter (first corner memo letter)
4. Go to that position, repeat
5. Stop when returning to:
   - Buffer position **A**
   - OR any letter in the A-group: **E** or **R**

**Cycle Completion Example:**
```
Trace: A → F → U → C → J → back to buffer (A)
Write: F U C J     (don't write A at end)
```

**Corner Circuit Breaking:**
Same as edges:
1. If corners remain unsolved after first cycle
2. Find first unsolved corner alphabetically
3. Start tracing from there
4. Write complete cycle including closing letter

---

## 8.5 COMPLETE TRACING EXAMPLE

### Full Solve Tracing

**Given:** A scrambled cube (specific scramble)

**Step 1: Edge Tracing**
```
Orientation: White up, Green front
Buffer: UR = b*

Cycle 1:
- Buffer piece belongs at: m
- Piece at m belongs at: f
- Piece at f belongs at: j
- Piece at j belongs at: b (buffer)
Edge memo so far: m f j

Check: Unsolved edges remain (including r, k, e)

Cycle 2:
- Start at first unsolved: r
- Piece at r belongs at: k
- Piece at k belongs at: e
- Piece at e belongs at: r
Edge memo complete: m f j | r k e r
```

**Step 2: Corner Tracing**
```
Buffer: UBL = A*

Cycle 1:
- Buffer piece belongs at: F
- Piece at F belongs at: U
- Piece at U belongs at: C
- Piece at C belongs at: P
- Piece at P belongs at: J
- Piece at J belongs at: M
- Piece at M belongs at: A (buffer)
Corner memo: F U C P J M
```

**Final Memo:**
```
Edges:   m f j | r k e r     (7 letters)
Corners: F U C P J M         (6 letters)
```

---

## 9. PHASE 2: MEMORIZATION

Now that tracing is complete, we have a sequence of letters to memorize. Memorization converts these abstract letters into **memorable images and stories**.

---

## 9.1 WHY LETTER PAIRS?

### The Problem with Single Letters

Memorizing single letters is:
- ❌ Difficult to recall under pressure
- ❌ Easy to forget the order
- ❌ Hard to distinguish similar letters
- ❌ Provides no meaningful structure

### The Solution: Chunking

**Chunking** means grouping letters into **2-letter pairs** (chunks). This:
- ✅ Reduces cognitive load
- ✅ Creates meaningful units
- ✅ Enables story-based memory
- ✅ Follows how memory naturally works

**Example:**
```
Raw:     m f j r k e r
Chunked: [mf] [jr] [ke] [r]
```

Notice: 7 letters become 3 pairs + 1 single (much easier!)

---

## 9.2 CHUNKING YOUR MEMO

### How to Chunk

**Step 1: Break into pairs**
Take your traced letter sequence and group into consecutive pairs

**Example - Edges:**
```
Traced:  m f j | r k e r
Remove separator: m f j r k e r
Pair up: (mf) (jr) (ke) (r)
```

**Step 2: Handle odd-length sequences**
If you have an **odd number of letters**, the last letter stands alone

```
7 letters: (mf) (jr) (ke) (r)  — r is alone
8 letters: (mf) (jr) (ke) (rt) — all paired
```

**Step 3: Separate edges and corners**
- Chunk edges separately
- Chunk corners separately
- You'll have two memory sequences

**Example:**
```
Edges:   (mf) (jr) (ke) (r)
Corners: (FU) (CP) (JM)
```

---

## 9.3 MEMORY TECHNIQUES (PAO SYSTEM)

The most effective technique for blindfold solving is the **Person-Action-Object (PAO)** system, simplified to **Person + Object** for beginners.

### Person + Object System

**Concept:**
- First letter of pair = **Person/Character**
- Second letter of pair = **Object**
- Create an **image** of that person holding/using that object

### Building Your System

**Step 1: Create letter-to-person associations**

Example person assignments:
```
a = Alice          n = Ninja
b = Batman         o = Optimus Prime
c = Clown          p = Pirate
d = Doctor         q = Queen
e = Einstein       r = Robot
f = Firefighter    s = Superman
g = Gandhi         t = Teacher
h = Hero           u = Uncle
i = Iron Man       v = Vampire
j = Joker          w = Wizard
k = King           x = X-Man
l = Lion           y = Yogi
m = Magician       z = Zombie
```

**Step 2: Create letter-to-object associations**

Example object assignments:
```
a = Apple          n = Nail
b = Ball           o = Orange
c = Cat            p = Piano
d = Door           q = Quilt
e = Egg            r = Rope
f = Flag           s = Sword
g = Guitar         t = Table
h = Hammer         u = Umbrella
i = Ice cream      v = Violin
j = Jar            w = Watch
k = Kite           x = Xylophone
l = Ladder         y = Yo-yo
m = Mirror         z = Zebra
```

**Step 3: Combine into images**

For pair **"mf":**
- m = Magician (person)
- f = Flag (object)
- **Image:** A magician waving a flag

For pair **"jr":**
- j = Joker (person)
- r = Rope (object)
- **Image:** Joker tangled in rope

---

## 9.4 BUILDING MEMORY STORIES

### Creating a Story

Once you have images for each pair, link them into a **single flowing story**.

**Example:**
```
Memo: (mf) (jr) (ke)

Images:
- mf = Magician waving Flag
- jr = Joker tangled in Rope
- ke = King holding Egg

Story:
"A MAGICIAN waved a FLAG while the JOKER got tangled in ROPE,
then a KING carefully held an EGG."
```

### Story-Building Tips

✅ **Make it vivid** - Use strong sensory details
✅ **Make it unusual** - Bizarre images stick better than normal ones
✅ **Use action** - Things happening are more memorable
✅ **Keep it flowing** - Each image should lead naturally to the next
✅ **Personalize it** - Use places and people you know
✅ **Practice it** - Rehearse the story several times before executing

### Journey Method (Alternative)

Instead of a story, place your images along a **familiar route**:

1. Choose a route you know well (your home, school, etc.)
2. Place each pair's image at successive locations
3. During execution, mentally walk the route
4. "Pick up" each image as you pass it

**Example:**
```
mf = Front door: Magician waving Flag
jr = Living room: Joker in Rope
ke = Kitchen: King with Egg
```

---

## 9.5 PARITY DETECTION

### What is Parity?

**Parity** is a special case that occurs when edge tracing produces an **odd number of letters**. When this happens, you need to apply an extra algorithm during execution.

### Detecting Parity

**Simple Rule:**
```
Count your edge memo letters:
- EVEN number (2, 4, 6, 8, ...) = NO parity
- ODD number (3, 5, 7, 9, ...) = PARITY!
```

**Example:**
```
Edge memo: m f j | r k e r
Count: 7 letters
7 is odd → PARITY!
```

### When to Check

Check for parity **after completing your edge tracing**, before you start memorizing.

### What Parity Means

If you have parity:
- ✅ Trace normally
- ✅ Memorize normally
- ✅ **During execution:** Apply R-Perm algorithm after all edge swaps
- ✅ Corner memo will ALSO be odd (edges and corners have opposite parity)

### Remembering Parity

**Add parity to your story:**
- If odd edges: Add a **flag** or **marker** to your story
- Example: "Everything happened during a RED sunset" (red = parity)
- Or: Remember the last single letter as your parity reminder

---

## 10. PHASE 3: EXECUTION

Execution is where you **solve the cube blindfolded** using your memorized sequence. This phase requires precision, calmness, and trust in your preparation.

---

## 10.1 EXECUTION OVERVIEW

### The Execution Sequence

```
1. Complete tracing and memorization (eyes open)
2. Put on blindfold
3. Execute all edges (one letter at a time)
4. Apply parity fix (if edge count was odd)
5. Execute all corners (one letter at a time)
6. Remove blindfold
7. Cube is solved! ✅
```

### The Execution Formula

For **each letter** in your memo, you perform:

```
SETUP MOVE → ALGORITHM → UNDO SETUP
```

This formula:
- Brings the target piece to the swap position
- Swaps it with the buffer
- Returns everything else to where it was

**Key principle:** Each letter solves exactly one piece.

---

## 10.2 SAFE EXECUTION RULES

Follow these rules to avoid breaking your solve:

### Rule 1: Never Rotate the Cube
- ❌ No x, y, or z rotations
- ❌ No reorienting to "make moves easier"
- ✅ Keep white up, green front **always**

### Rule 2: Always Undo Setup Moves
- Every setup move **must** be undone
- Undo in **reverse order**
- If setup was `D F`, undo is `F' D'`

### Rule 3: Never Execute Buffer Letters
- ❌ Don't execute **b** or **m** for edges
- ❌ Don't execute **A**, **E**, or **R** for corners
- These are buffer positions—they get solved automatically

### Rule 4: Maintain Orientation Awareness
- Use your **fingers** to feel the cube
- Locate the centers to verify orientation
- If unsure, **stop and check** (better to peek than to DNF)

### Rule 5: Stay Calm and Methodical
- ✅ One letter at a time
- ✅ Say the letter out loud or in your head
- ✅ Complete the full formula for each letter
- ✅ Don't rush—accuracy over speed

---

## 10.3 EDGE EXECUTION (T-PERM)

### Edge Algorithm: T-Perm

```
R U R' U' R' F R2 U' R' U' R U R' F'
```

**What it does:**
- Swaps the piece at **UR (buffer)** with the piece at **UF**
- After setup moves, effectively swaps buffer with target position **d**

### Edge Execution Steps

**For each letter in your edge memo:**

**1. Identify the target letter**
   - Get the next letter from your memorized sequence
   - Example: First letter is **m**

**2. Perform setup moves**
   - Look up setup moves for that letter (see Appendix B)
   - Bring target position to the **d** position
   - Example: For letter **j**, setup is `Dw2 L`

**3. Execute T-Perm**
   - Perform the full T-Perm algorithm
   - This swaps buffer with target

**4. Undo setup moves**
   - Reverse the setup moves in reverse order
   - Example: Undo for **j** is `L' Dw2`

**5. Move to next letter**
   - Repeat steps 1-4 for each edge letter

### Example: Solving Letter "j"

```
Letter: j
Setup: Dw2 L
Algorithm: R U R' U' R' F R2 U' R' U' R U R' F'
Undo: L' Dw2
```

**Result:** The piece that was at buffer is now solved, and the next piece is now at buffer.

---

## 10.4 EDGE SETUP MOVES

Setup moves bring the target position to location **d** (where the algorithm expects it).

### Setup Move Principles

**Safe moves for edges:**
- ✅ D, D', D2 (bottom face)
- ✅ F, F', F2 (front face)
- ✅ L, L', L2 (left face)
- ✅ Dw, Dw', Dw2 (wide bottom)
- ✅ Lw, Lw', Lw2 (wide left)

**Unsafe moves for edges:**
- ❌ Avoid U, U', U2 (disturbs buffer)
- ❌ Avoid R, R', R2 (disturbs buffer)

### Common Edge Setups

See **Appendix B** for complete setup move table.

**Quick reference:**
```
d = (no setup needed)
e = L' Dw L'
f = Dw' L
j = Dw2 L
l = L'
r = L
```

---

## 10.5 PARITY FIX (R-PERM)

### When to Apply Parity

Apply the parity algorithm if:
- ✅ Your edge memo had an **odd** number of letters
- ✅ You've finished executing all edge letters
- ✅ Before starting corner execution

### Parity Algorithm: R-Perm

```
R U R' F' R U2 R' U2 R' F R U R U2 R' U'
```

**What it does:**
- Fixes the parity misalignment between edges and corners
- Allows corners to solve correctly

### When to Execute

```
1. Execute all edges
2. Count edge letters (if odd, continue)
3. Apply R-Perm once (no setup/undo needed)
4. Proceed to corners
```

### No Setup Needed

The parity algorithm is applied **directly** without setup moves:
- Just execute the algorithm
- No undo needed
- Only do it **once**

---

## 10.6 CORNER EXECUTION (Y-PERM)

### Corner Algorithm: Modified Y-Perm

```
R U' R' U' R U R' F' R U R' U' R' F R
```

**What it does:**
- Swaps the piece at **UBL (buffer)** with the piece at **DFR**
- After setup moves, effectively swaps buffer with target position **P**

### Corner Execution Steps

**For each letter in your corner memo:**

**1. Identify the target letter**
   - Get the next letter from your memorized corner sequence
   - Example: First letter is **F**

**2. Perform setup moves**
   - Look up setup moves for that letter (see Appendix C)
   - Bring target position to the **P** position
   - Example: For letter **K**, setup is `D R`

**3. Execute Modified Y-Perm**
   - Perform the full Y-Perm algorithm
   - This swaps buffer with target

**4. Undo setup moves**
   - Reverse the setup moves in reverse order
   - Example: Undo for **K** is `R' D'`

**5. Move to next letter**
   - Repeat steps 1-4 for each corner letter

### Example: Solving Letter "K"

```
Letter: K
Setup: D R
Algorithm: R U' R' U' R U R' F' R U R' U' R' F R
Undo: R' D'
```

---

## 10.7 CORNER SETUP MOVES

Setup moves bring the target corner to position **P** (where the algorithm expects it).

### Setup Move Principles

**Safe moves for corners:**
- ✅ R, R', R2 (right face)
- ✅ F, F', F2 (front face)
- ✅ D, D', D2 (bottom face)

**Unsafe moves for corners:**
- ❌ Avoid U, U', U2 (disturbs buffer)
- ❌ Avoid L, L', L2 (disturbs buffer)
- ❌ Avoid B, B', B2 (disturbs buffer)

### Common Corner Setups

See **Appendix C** for complete setup move table.

**Quick reference:**
```
P = (no setup needed)
C = F
F = F2
K = D R
M = R'
O = R
U = F'
```

### Corner Orientation

**Good news:** With this method, corner orientation is handled **automatically**!

As long as you:
- ✅ Maintain cube orientation (white up, green front)
- ✅ Undo all setup moves correctly
- ✅ Don't rotate the cube

Then **all corners will be correctly oriented** at the end.

---

## 10.8 COMPLETE SOLVE WALKTHROUGH

### Full Example Execution

**Given Memo:**
```
Edges:   (mf) (jr) (ke) (r)     — 7 letters (ODD → PARITY!)
Corners: (FU) (CP) (JM)         — 6 letters
```

### Execution Flow

**Phase 1: Put on Blindfold**
- Ensure white is up, green is front
- Cover your eyes
- Take a breath—you've got this!

**Phase 2: Execute Edges**

```
Letter m:
- Setup: (look up m setup)
- T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
- Undo setup

Letter f:
- Setup: (look up f setup)
- T-Perm
- Undo setup

Letter j:
- Setup: Dw2 L
- T-Perm
- Undo: L' Dw2

Letter r:
- Setup: L
- T-Perm
- Undo: L'

Letter k:
- Setup: (look up k setup)
- T-Perm
- Undo setup

Letter e:
- Setup: L' Dw L'
- T-Perm
- Undo: L Dw' L

Letter r:
- Setup: L
- T-Perm
- Undo: L'
```

**Phase 3: Parity Fix**
```
Edge count was 7 (odd) → Apply parity!
Execute once: R U R' F' R U2 R' U2 R' F R U R U2 R' U'
```

**Phase 4: Execute Corners**

```
Letter F:
- Setup: F2
- Y-Perm: R U' R' U' R U R' F' R U R' U' R' F R
- Undo: F2

Letter U:
- Setup: F'
- Y-Perm
- Undo: F

Letter C:
- Setup: F
- Y-Perm
- Undo: F'

Letter P:
- Setup: (none needed)
- Y-Perm
- Undo: (none)

Letter J:
- Setup: F2 D
- Y-Perm
- Undo: D' F2

Letter M:
- Setup: R'
- Y-Perm
- Undo: R
```

**Phase 5: Remove Blindfold**
- All pieces solved!
- Cube is complete!

---

# PART IV: PRACTICE & IMPROVEMENT

## 11. PRACTICE STRATEGY

### Your First Solves

**Expectations:**
- First successful solve typically happens within 5-20 attempts
- Early solves may take 10-30 minutes
- Mistakes are part of the learning process

### Recommended Practice Path

**Stage 1: Learn the Pieces (Days 1-3)**
- Memorize the letter scheme
- Practice identifying where pieces belong
- Use the cube to follow pieces without tracing

**Stage 2: Tracing Practice (Days 4-7)**
- Trace edges only (write down sequences)
- Trace corners only
- Practice circuit breaking
- Verify your tracing by checking where pieces actually are

**Stage 3: Memorization Practice (Days 8-12)**
- Practice converting letters to images
- Build short stories (start with 6-8 letters)
- Practice recalling sequences without the cube

**Stage 4: Execution Practice (Days 13-20)**
- Execute edges only (with memo written down)
- Execute corners only
- Practice setup moves for each letter
- Learn algorithms to muscle memory

**Stage 5: Full Attempts (Days 21+)**
- Complete blindfolded solves
- Trace → Memorize → Execute
- Don't worry about speed yet
- Focus on success rate

### Daily Practice Routine

**20-30 minutes per day:**
```
5 min:  Letter scheme review
10 min: Tracing practice (2-3 scrambles)
10 min: Memorization practice
5 min:  Algorithm practice
```

---

## 12. COMMON MISTAKES & TROUBLESHOOTING

### Issue: Cube Almost Solved But a Few Pieces Wrong

**Possible Causes:**
- ❌ Missed a circuit break during tracing
- ❌ Forgot to apply parity
- ❌ Executed a letter twice or skipped a letter
- ❌ Did setup but forgot undo (or vice versa)

**Solutions:**
- ✅ Double-check tracing: are all pieces accounted for?
- ✅ Count edge letters: odd = parity needed
- ✅ During execution, mark off letters as you complete them
- ✅ Practice setup/undo as one unit

### Issue: Many Pieces Wrong After Solve

**Possible Causes:**
- ❌ Lost cube orientation during execution
- ❌ Performed algorithm incorrectly
- ❌ Used wrong setup moves

**Solutions:**
- ✅ Practice maintaining orientation: feel centers frequently
- ✅ Practice algorithms separately until muscle memory
- ✅ Print setup move reference sheet
- ✅ Go slower—accuracy over speed

### Issue: Can't Remember Memo During Execution

**Possible Causes:**
- ❌ Story not vivid enough
- ❌ Too many letters at once
- ❌ Didn't rehearse enough before blindfold

**Solutions:**
- ✅ Make images more unusual and exaggerated
- ✅ Start with shorter sequences
- ✅ Rehearse story 3-5 times before execution
- ✅ Practice memory techniques separately

### Issue: Getting Lost During Tracing

**Possible Causes:**
- ❌ Confusion about letter pairs/triplets
- ❌ Not sure where pieces belong on solved cube
- ❌ Tracing from wrong position

**Solutions:**
- ✅ Keep solved cube nearby for reference
- ✅ Review letter scheme daily
- ✅ Practice "where does this piece go?" drill
- ✅ Write down each step as you trace

---

## 13. TIPS FOR SUCCESS

### Mindset Tips

✅ **Be patient with yourself** - This is a complex skill
✅ **Celebrate small wins** - Correct tracing is progress!
✅ **Learn from failures** - Each mistake teaches you something
✅ **Stay consistent** - 20 min daily beats 3-hour marathons
✅ **Don't compare** - Everyone learns at their own pace

### Tracing Tips

✅ **Write everything down** - Don't rely on memory during tracing
✅ **Say letters out loud** - Verbal reinforcement helps
✅ **Use different colors** - Color-code cycles
✅ **Verify cycles** - Check that pieces form actual cycles
✅ **Start with easy scrambles** - Build confidence before harder ones

### Memorization Tips

✅ **Create your own associations** - Personal images stick better
✅ **Make it ridiculous** - Weird stories are more memorable
✅ **Use locations you know** - Journey method with familiar places
✅ **Practice without the cube** - Pure memorization drills
✅ **Rehearse immediately** - Review memo right after creating it

### Execution Tips

✅ **Go slow** - Speed comes with time, accuracy is everything
✅ **Verbalize letters** - Say each letter before executing
✅ **Feel the cube** - Use tactile feedback
✅ **Pause between letters** - Complete one before starting next
✅ **Trust your preparation** - If memo was solid, execution will work

### Setup Move Tips

✅ **Learn in groups** - Similar letters often have similar setups
✅ **Practice without blindfold first** - Build muscle memory
✅ **Always undo immediately** - Make it one smooth motion
✅ **Create flashcards** - Letter on front, setup on back
✅ **Start with common letters** - Master a, d, e, f, j, k, l, r first

---

# APPENDICES

## APPENDIX A: COMPLETE LETTERING MAPS

### A.1 Edge Lettering Map (Lowercase)

**Net Layout Description:**
```
        [i][c][a]
        [h][U][b]
        [g][r][q]

[d][e][b][m][q][a][i][c]
[x][L][f][F][n][R][t][B]
[w][l][j][p][v][o][s][u]

        [j][p][m]
        [n][D][f]
        [t][o][l]
```

**Buffer:** b* (UR edge)

### A.2 Edge Letter Pairs

Every edge piece has two stickers. These are the pairs:

| Pair | Pair | Pair | Pair |
|------|------|------|------|
| a ↔ q | d ↔ e | g ↔ x | j ↔ p |
| b ↔ m | f ↔ l | h ↔ r | k ↔ u |
| c ↔ i | n ↔ t | o ↔ v | s ↔ w |

### A.3 Corner Lettering Map (UPPERCASE)

**Net Layout Description:**
```
        [D][I][C]
        [F][U][J]
        [E][A][M]

[E][A][M][Q][M][C][D][I]
[R][L][B][F][N][R][J][B]
[L][U][G][P][V][O][W][X]

        [G][P][N]
        [K][D][V]
        [H][T][S]
```

**Buffer:** A* (UBL corner)

### A.4 Corner Letter Groups (Triplets)

Every corner piece has three stickers. These are the triplet groups:

| Group | Group | Group | Group |
|-------|-------|-------|-------|
| A–E–R | B–Q–N | C–J–M | D–I–F |
| G–L–U | H–S–X | K–P–V | O–T–W |

**Note:** When tracing returns to **any letter** in the starting group, that cycle is complete.

---

## APPENDIX B: EDGE SETUP MOVE REFERENCE

Setup moves bring target edge to position **d** for T-Perm swap.

| Letter | Setup to d | Undo Setup | Notes |
|--------|-----------|------------|-------|
| **a** | Lw2 D' L2 | L2 D Lw2 | Complex |
| **b** | (buffer) | (buffer) | Never execute |
| **c** | Lw2 D L2 | L2 D' Lw2 | Complex |
| **d** | — | — | Already at d |
| **e** | L' Dw L' | L Dw' L | Common |
| **f** | Dw' L | L' Dw | Simple |
| **g** | L Dw L' | L Dw' L' | |
| **h** | Dw L' | L Dw' | Simple |
| **i** | Lw D' L2 | L2 D Lw' | |
| **j** | Dw2 L | L' Dw2 | Common |
| **k** | Lw D L2 | L2 D' Lw' | |
| **l** | L' | L | Very simple |
| **m** | (buffer pair) | (buffer pair) | Never execute |
| **n** | Dw L | L' Dw' | Simple |
| **o** | D' Lw D L2 | L2 D' Lw' D | Complex |
| **p** | Dw' L' | L Dw | Simple |
| **q** | Lw' D L2 | L2 D' Lw | |
| **r** | L | L' | Very simple |
| **s** | Lw' D' L2 | L2 D Lw | |
| **t** | Dw2 L' | L Dw2 | Common |
| **u** | D' L2 | L2 D | |
| **v** | D2 L2 | L2 D2 | |
| **w** | D L2 | L2 D' | |
| **x** | L2 | L2 | |

**Legend:**
- **Dw** = Wide D move (D + E slice)
- **Lw** = Wide L move (L + M slice)
- **—** = No setup needed

---

## APPENDIX C: CORNER SETUP MOVE REFERENCE

Setup moves bring target corner to position **P** for Y-Perm swap.

| Letter | Setup to P | Undo Setup | Notes |
|--------|-----------|------------|-------|
| **A** | (buffer) | (buffer) | Never execute |
| **B** | R D' | D R' | |
| **C** | F | F' | Simple |
| **D** | F R' | R F' | |
| **E** | (buffer group) | (buffer group) | Never execute |
| **F** | F2 | F2 | Simple |
| **G** | D2 R | R' D2 | |
| **H** | D2 | D2 | |
| **I** | F' D | D' F | |
| **J** | F2 D | D' F2 | |
| **K** | D R | R' D' | Common |
| **L** | D | D' | Very simple |
| **M** | R' | R | Very simple |
| **N** | R2 | R2 | Simple |
| **O** | R | R' | Very simple |
| **P** | — | — | Already at P |
| **Q** | R' F | F' R | |
| **R** | (buffer group) | (buffer group) | Never execute |
| **S** | D' R | R' D | |
| **T** | D' | D | Very simple |
| **U** | F' | F | Very simple |
| **V** | D' F' | F D | |
| **W** | D2 F' | F D2 | |
| **X** | D F' | F D' | |

**Note:** Letters in the buffer triplet (A-E-R) should never be executed.

---

## APPENDIX D: ALGORITHM QUICK REFERENCE

### Edge Algorithm: T-Perm
```
R U R' U' R' F R2 U' R' U' R U R' F'
```
**Effect:** Swaps UR (buffer b*) with UF (position d after setup)

---

### Corner Algorithm: Modified Y-Perm
```
R U' R' U' R U R' F' R U R' U' R' F R
```
**Effect:** Swaps UBL (buffer A*) with DFR (position P after setup)

---

### Parity Algorithm: R-Perm
```
R U R' F' R U2 R' U2 R' F R U R U2 R' U'
```
**When:** After all edges, if edge count was odd  
**Setup:** None needed—execute directly

---

## APPENDIX E: BLINDFOLD SOLVE CHECKLIST

### Pre-Solve Setup
- [ ] Cube scrambled
- [ ] Orientation: White up, Green front
- [ ] Buffer positions confirmed (UR = b*, UBL = A*)
- [ ] Paper and pencil ready (for memo)

### Phase 1: Tracing
- [ ] Edge tracing complete
- [ ] Edge cycles closed properly
- [ ] Edge memo written down: _____________
- [ ] Edge count: _____ (odd = parity!)
- [ ] Corner tracing complete
- [ ] Corner cycles closed properly
- [ ] Corner memo written down: _____________

### Phase 2: Memorization
- [ ] Edge memo chunked into pairs
- [ ] Edge story/images created
- [ ] Edge memo rehearsed 3+ times
- [ ] Corner memo chunked into pairs
- [ ] Corner story/images created
- [ ] Corner memo rehearsed 3+ times
- [ ] Parity remembered (if needed)

### Phase 3: Execution
- [ ] Blindfold on
- [ ] Orientation verified (white up, green front)
- [ ] All edges executed (setup → algorithm → undo)
- [ ] Parity applied (if edge count was odd)
- [ ] All corners executed (setup → algorithm → undo)
- [ ] Blindfold removed
- [ ] Cube solved! ✅

### Post-Solve Review
- [ ] If failed: Identify what went wrong
  - [ ] Tracing error?
  - [ ] Memo forgotten?
  - [ ] Execution mistake?
- [ ] If succeeded: Celebrate! 🎉
- [ ] Record time: _____
- [ ] Notes for next solve: _____________

---

## APPENDIX F: PRACTICE DRILLS

### Drill 1: Letter Recognition (5 min)
**Goal:** Instantly recognize letter for any sticker

1. Have lettering scheme visible
2. Point to random stickers on cube
3. Say the letter out loud
4. Repeat until automatic

---

### Drill 2: Piece Identification (5 min)
**Goal:** Know where each piece belongs

1. Scramble cube
2. Point to any piece
3. Say where it belongs (which letter)
4. Verify by checking solved cube
5. Repeat with 10-15 pieces

---

### Drill 3: Tracing Without Writing (10 min)
**Goal:** Build tracing speed and accuracy

1. Start at buffer
2. Trace aloud: "Buffer goes to m, m goes to f, f goes to j..."
3. Don't write anything
4. When cycle complete, verify by checking

---

### Drill 4: Setup Move Practice (10 min)
**Goal:** Memorize setup moves

1. Pick 5 random letters
2. For each: perform setup, check position, undo
3. Repeat until smooth
4. Next session: pick 5 different letters

---

### Drill 5: Memo Creation (10 min)
**Goal:** Fast memorization

1. Generate random letter sequence (8-10 letters)
2. Chunk into pairs
3. Create story
4. Time how long to memorize
5. Try to beat your time

---

### Drill 6: Execution Without Memo (10 min)
**Goal:** Algorithm muscle memory

1. Have memo written down
2. Execute with blindfold
3. Can look at memo between letters
4. Focus on smooth setup → alg → undo

---

### Drill 7: Full Solve with Pauses
**Goal:** Build confidence

1. Trace and memo normally
2. Blindfold on
3. Execute, but **pause** after each letter
4. Take time to verify orientation
5. Continue to completion

---

## FINAL NOTES

### You've Got This!

Blindfold solving is a journey, not a destination. Every cuber who can do this started exactly where you are now—confused, uncertain, but curious.

**Remember:**
- Your first success will feel amazing
- Each failure teaches you something valuable
- The community is supportive and helpful
- There's no timeline—go at your own pace

### Next Steps

1. **Memorize the letter scheme** (Appendix A)
2. **Practice tracing** with simple scrambles
3. **Learn the algorithms** until they're automatic
4. **Start with short sequences** (6-8 letters)
5. **Gradually increase difficulty**

### Additional Resources

- **Online practice tools:** Use the drills on this website
- **Community forums:** Ask questions, share progress
- **Video tutorials:** Watch examples of tracing and execution
- **Cube timers:** Track your progress

### Good Luck!

Your first blindfolded solve is closer than you think. Trust the process, stay patient, and enjoy the journey!

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Method:** Old Pochmann  
**License:** Free for personal and educational use  

---


