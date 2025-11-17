# Blindfold Solving: Complete Beginner's Guide
## *Solve the Rubik's Cube with Your Eyes Closed*

---

## Table of Contents

1. **Introduction**
2. **Before You Start: Prerequisites**
3. **The Three Phases**
4. **Phase 1: Tracing**
   - Understanding the System
   - Edge Tracing
   - Corner Tracing
5. **Phase 2: Memorization**
   - Converting Traces to Memory
   - Memorization Techniques
6. **Phase 3: Execution**
   - Executing Edges
   - Handling Parity
   - Executing Corners
7. **Practice Tips & Troubleshooting**
8. **Reference Materials**

---

## Introduction

**Blindfold solving is learnable—by anyone.**

Solving a Rubik's Cube blindfolded may seem like magic, but it's actually a **structured, logical process** that anyone can master with practice. You don't need to memorize dozens of algorithms or have a photographic memory. Instead, you'll use:

- **One simple system** to convert the cube into letters
- **Effective memory techniques** to remember sequences
- **Fixed algorithms** to execute your solution

With the **Old Pochmann Method** (the beginner-friendly standard), you can go from regular solving to blindfolded solving in weeks of consistent practice.

### Why Blindfold Solving is Possible

The key insight: Instead of solving the cube layer by layer, you **track where each piece belongs** and **move it there one-by-one** from a fixed starting point called a **buffer**. This way, you only disturb the pieces you intend to, and every move has a purpose.

---

## Before You Start: Prerequisites

You **must** already be comfortable with:

1. **Solving the Rubik's Cube normally** (sighted solving)
   - Know how the cube is constructed
   - Understand edges, corners, and centers
   - Be comfortable taking 2-5 minutes to solve

2. **Cube notation and moves**
   - U, D, L, R, F, B (and their inverses: U', D', etc.)
   - Wide moves: Uw, Dw, Lw, Rw, Fw, Bw
   - Rotations: x, y, z (though not used during execution)

3. **Patience and consistency**
   - Blindfold solving requires practice
   - Expect to take 10+ minutes for your first solve
   - Speed comes later; accuracy comes first

---

## The Three Phases

Blindfold solving **always** follows these three phases:

| Phase | Goal | Technique |
|:---:|:---:|:---|
| **1. Tracing** | Figure out where every piece belongs | Follow piece paths, convert to letters |
| **2. Memorization** | Remember the letter sequences | Use 2-letter chunks and stories |
| **3. Execution** | Solve without looking | Use fixed algorithms and setups |

Each phase builds on the last. You cannot skip or re-order them.

---

# Phase 1: Tracing
## Converting the Cube into Letters

**Tracing** is how you convert a scrambled cube into a sequence of letters that you'll later memorize and execute.

### Understanding the System: Orientation & Buffers

Before tracing, you must establish **consistent orientation**:

- **Hold the cube the same way every time**
  - WHITE center facing UP
  - GREEN center facing FRONT
  - This orientation must never change during the entire solve

### What is a Buffer?

The **buffer** is a fixed position on the cube where all tracing begins. It's the starting point for every solve.

| Piece Type | Buffer Position | Buffer Letter(s) |
|:---:|:---:|:---|
| **Edges** | **UR** (Up-Right corner) | **b*** (primary) / **m** (paired) |
| **Corners** | **UBL** (Up-Back-Left corner) | **A*** (primary) / **E, R** (paired) |

The buffer location **never moves**. Instead, we swap other pieces through it.

### Lettering Scheme: The Speffz System

Every sticker position on the cube gets a letter. This is how we "read" the cube without looking.

- **Edges** use lowercase letters: a, b, c, d, e, ... x (12 × 2 = 24 stickers)
- **Corners** use uppercase letters: A, B, C, D, E, ... X (8 × 3 = 24 stickers)

You'll receive a lettering map showing every position. Memorize it or keep it nearby.

### Key Concept: Letter Pairs & Triplets

- **Every edge piece has 2 letters** (a paired pair): one on each face
  - Example: Edge piece "b" has stickers at b and m
  - When tracing reaches either b or m, the cycle closes
  
- **Every corner piece has 3 letters** (a triplet): one on each face
  - Example: Corner piece "A" has stickers at A, E, and R
  - When tracing reaches any of A, E, or R, the cycle closes

---

## Step 1: Trace Edges (Lowercase Letters)

**Edges must be traced before corners.**

### How Tracing Works

Tracing is **following a path**:

1. Look at the piece currently in the **edge buffer (UR position)**
2. Identify where that piece **belongs on a solved cube**
3. Note that location's letter (this is your first memo letter)
4. Move to that letter's position and see what piece is there
5. Repeat: where does that piece belong?
6. Continue until you return to the buffer (b or its pair m)
7. Write down all letters except the final buffer letter

### Example: First Edge Cycle

Let's say tracing the edge buffer gives us:

```
Buffer (b) contains a piece that belongs at position m
Position m contains a piece that belongs at position f
Position f contains a piece that belongs at position j
Position j contains a piece that belongs back at position b (buffer)
```

**We write this cycle as: m f j** (not including the final b)

### Handling Multiple Cycles: Circuit Breaking

If after completing the first cycle there are still unsolved edges, you must start a new cycle—this is called **circuit breaking**.

**Steps:**
1. Find the **next unsolved edge in alphabetical order** (e.g., if a, b, m, f, j are done, check c next)
2. Begin tracing from that letter
3. Continue until the path returns to the starting letter or its pair

**For subsequent cycles, you DO include the final letter.**

Example second cycle: Starting at r (which hasn't been traced yet)

```
r → k → e → (back to r)
```

**We write this as: r k e r** (including the final r)

### Tips for Edge Tracing

- ✅ Always keep the cube oriented (white up, green front)
- ✅ Trace slowly and carefully—accuracy is more important than speed
- ✅ Write down each letter as you go
- ✅ If confused, restart from the beginning
- ✅ Mark solved letters so you don't re-trace them

---

## Step 2: Trace Corners (Uppercase Letters)

**Corner tracing works identically to edge tracing—just with uppercase letters.**

### Steps for Corner Tracing

1. Switch focus to the **corner buffer (UBL position)** with letter **A***
2. Follow the same tracing method:
   - Where does this corner belong?
   - What's at that location?
   - Continue until returning to the buffer or one of its paired letters
3. For the first corner cycle, **do not include the final buffer letter**
4. For subsequent cycles, **do include the final letter**

### Example: Corner Cycles

First corner cycle: **F U C P** (starting at A, ends back at one of A's trio)

If more corners remain unsolved, find the next alphabetically and start a new cycle:

Second corner cycle: **J C D J** (starts at J, ends at J)

### Important: Corner Triplets

Remember that each corner has **3 stickers with 3 different letters**. The cycle ends when you return to **any** of those three letters, not just the starting one.

For example, corner piece A has letters {A, E, R}. Your cycle could be:

```
Starting at A → ... → returns to E
```

This still closes the cycle, even though we returned to E instead of A.

---

# Phase 2: Memorization
## Converting Letters into Memory

Now you have two letter sequences:

```
Edges:    m f j   r k e r
Corners:  F U   C P J C
```

Before executing, you must **memorize these sequences** so you can recall them blindfolded.

---

## Step 1: Chunk the Letters into Pairs

**Don't try to memorize individual letters.** Instead, group them into **2-letter chunks** (pairs).

Example:

```
Edges (7 letters):    m f j r k e r
Chunked into pairs:   mf  jr  ke  r_
```

Notice: The last letter stands alone if you have an **odd number of letters**.

### Why Chunking Works

✅ Reduces mental load (pairs are easier than 7 single letters)  
✅ Creates natural groupings for storytelling  
✅ Mirrors how memory systems work  

---

## Step 2: Build Memory Associations

Convert each 2-letter pair into something memorable using the **Person + Object System** (or any consistent system).

### Example Using Person + Object

For edges `mf jr ke r_`:

- **mf** → "**M**agician with a **F**lag"
- **jr** → "**J**uggler with a **R**ope"
- **ke** → "**K**ing with an **E**gg"
- **r_** → "**R**... Robot" (single letter, just remember the object)

### Create a Story

Link all your images into **one cohesive, vivid story**:

> "A **magician waved a flag** while a **juggler tangled a rope** around a **king holding an egg** and a **robot**."

The more unusual, silly, or exaggerated, the easier it sticks in your memory.

### Other Memory Systems

You can also use:
- **Keyword images**: Just visualize the object
- **Journey method**: Place each image along a mental path (your home, a road, etc.)
- **Linking method**: Connect each image directly to the previous one
- **Audio memory**: Rhythmically repeat the pairs

**Choose one system and stick with it.**

---

## Step 3: Check for Parity

Before moving to execution, **count the total number of letters in your edge memo**.

- **Even number of letters** → No parity, proceed directly to execution
- **Odd number of letters** → You have **parity**, will need a special fix during execution

For example:
- m f j r k e r = 7 letters = **ODD** = **PARITY**
- m f j r k e = 6 letters = **EVEN** = **NO PARITY**

**Important:** If edges have odd parity, corners will also have odd parity. You'll need to apply the **parity algorithm** after executing edges.

---

# Phase 3: Execution
## Solving Without Looking

With your memo memorized, you're ready to **execute the solve blindfolded**.

### Key Rules Before You Start

✅ **Keep consistent orientation** (white up, green front) throughout  
✅ **Never rotate the cube** (x, y, z moves forbidden)  
✅ **Execute in order**: edges first → parity fix (if needed) → corners  
✅ **One letter at a time** (no skipping or re-ordering)  
✅ **Always undo setup moves** (this is critical)  
✅ **Never execute the buffer letter** (skip b and A)

---

## Step 1: Execute Edges (T-perm Algorithm)

### The Edge Swap Algorithm (T-perm)

```
R U R' U' R' F R2 U' R' U' R U R' F'
```

This algorithm swaps the piece in the **UR buffer (b)** with a piece in the **d position**.

### How Edge Execution Works

For each letter in your edge memo:

1. **Setup**: Use setup moves to bring the target letter's piece to the **d position**
   - Can use: D, Dw, F, L, Lw, B moves
   - Avoid: U and R (they disturb the buffer)

2. **Execute**: Perform the T-perm algorithm

3. **Undo**: Reverse the setup moves in opposite order

**One letter = one setup → T-perm → undo sequence**

### Setup Moves Reference (Common Targets)

| Letter | Setup | T-perm | Undo |
|:---:|:---:|:---:|:---:|
| **d** | – (none) | T-perm | – |
| **j** | Dw2 L | T-perm | L' Dw2 |
| **f** | Dw' L | T-perm | L' Dw |
| **l** | L' | T-perm | L |
| **r** | L | T-perm | L' |

*See Appendix B for complete setup move table*

### Example Edge Execution

If your edge memo is: **mf jr**

1. Letter **m**: (setup) → T-perm → (undo)
2. Letter **f**: (setup) → T-perm → (undo)
3. Letter **j**: (setup) → T-perm → (undo)
4. Letter **r**: (setup) → T-perm → (undo)

After all edges, one piece will automatically move into the buffer for the next memo letter.

---

## Step 2: Check Parity & Fix If Needed

If your **edge memo had an odd number of letters**, you must apply the **parity fix algorithm** **immediately after finishing all edges** and **before starting corners**.

### Parity Fix Algorithm (R-perm)

```
R U R' F' R U2 R' U2 R' F R U R U2 R' U'
```

**Apply this algorithm exactly once. No setup needed.**

### When to Use Parity

- ✅ Edge memo count is odd → Apply parity once
- ❌ Edge memo count is even → Skip parity, go directly to corners

---

## Step 3: Execute Corners (Modified Y-perm)

### The Corner Swap Algorithm (Modified Y-perm)

```
R U' R' U' R U R' F' R U R' U' R' F R
```

This algorithm swaps the piece in the **UBL buffer (A)** with a piece in the **P position**.

### How Corner Execution Works

Same structure as edges:

1. **Setup**: Bring the target letter's piece to the **P position**
   - Can use: R, F, D moves
   - Avoid: U, L, B (they disturb the buffer)

2. **Execute**: Perform the Modified Y-perm

3. **Undo**: Reverse the setup moves

### Setup Moves Reference (Common Corner Targets)

| Letter | Setup | Y-perm | Undo |
|:---:|:---:|:---:|:---:|
| **P** | – (none) | Y-perm | – |
| **K** | R F | Y-perm | F' R' |
| **C** | F | Y-perm | F' |
| **M** | R' | Y-perm | R |
| **B** | R D' | Y-perm | D R' |

*See Appendix C for complete corner setup move table*

### Example Corner Execution

If your corner memo is: **FU CP**

1. Letter **F**: (setup) → Y-perm → (undo)
2. Letter **U**: (setup) → Y-perm → (undo)
3. Letter **C**: (setup) → Y-perm → (undo)
4. Letter **P**: (setup) → Y-perm → (undo)

---

## Step 4: You're Done!

Once you've executed all corners, **remove the blindfold**.

✅ The cube should be **completely solved**.  
✅ Congratulations on your first blindfolded solve!

If something is out of place, review:
- Was tracing accurate?
- Was memorization correct?
- Were setup moves correct?
- Did you undo all setups?

---

# Practice Tips & Troubleshooting

### Getting Started

1. **Start small**: Trace and solve a cube with only 2-3 cycles total (maybe 3-4 memo letters each)
2. **Build confidence**: Once you can solve with 8-10 total letters, increase gradually
3. **Review after each solve**: What went wrong? Tracing? Memory? Execution?
4. **Practice regularly**: Even 10 minutes a day builds muscle memory

### Memory Tips

- ✅ Convert letters into vivid, unusual, exaggerated images
- ✅ Create stories, not just lists
- ✅ Practice memorization separately (trace, then memorize without solving)
- ✅ Review the story once before executing

### Tracing Accuracy

- ✅ Go slowly—accuracy beats speed
- ✅ Double-check which piece belongs where
- ✅ Keep orientation consistent
- ✅ Restart if confused

### Execution Checklist

Before each solve:
- [ ] Cube is oriented (white up, green front)
- [ ] I've memorized my memo
- [ ] I know whether I have parity
- [ ] I'm ready to follow my memo letter by letter

### Common Mistakes

| Problem | Solution |
|:---|:---|
| Memo was wrong | Trace more slowly, double-check positions |
| Forgot memo | Convert to images earlier, build story better |
| Setup moves wrong | Reference the setup table, practice setups separately |
| Didn't undo setup | Always undo—this is critical for proper piece placement |
| Rotated cube | Keep orientation locked throughout |

---

# Reference Materials

## Appendix A: Lettering Maps

### A.1 Edge Letters (Lowercase a–x)

The edge buffer is **b*** at the **UR position**.

The edge letters are paired:
- a ↔ q
- b ↔ m (buffer pair)
- c ↔ i
- d ↔ e
- f ↔ l
- g ↔ x
- h ↔ r
- j ↔ p
- k ↔ u
- n ↔ t
- o ↔ v
- s ↔ w

### A.2 Corner Letters (Uppercase A–X)

The corner buffer is **A*** at the **UBL position**.

Corner letters are grouped by physical corner (triplets):
- A – E – R (buffer piece)
- B – Q – N
- C – J – M
- D – I – F
- U – G – L
- V – K – P
- W – O – T
- X – S – H

---

## Appendix B: Edge Setup Move Table

Complete reference for all edge target positions:

| Letter | Setup | Undo |
|:---:|:---:|:---:|
| a | Lw2 D' L2 | L2 D Lw2 |
| c | Lw2 D L2 | L2 D' Lw2 |
| d | – | – |
| e | L' Dw L' | L Dw' L |
| f | Dw' L | L' Dw |
| g | L Dw L' | L Dw' L' |
| h | Dw L' | L Dw' |
| i | Lw D' L2 | L2 D Lw' |
| j | Dw2 L | L' Dw2 |
| k | Lw D L2 | L2 D' Lw' |
| l | L' | L |
| n | Dw L | L' Dw' |
| o | D' Lw D L2 | L2 D' Lw' D |
| p | Dw' L' | L Dw |
| q | Lw' D L2 | L2 D' Lw |
| r | L | L' |
| s | Lw' D' L2 | L2 D Lw |
| t | Dw2 L' | L Dw2 |
| u | D' L2 | L2 D |
| v | D2 L2 | L2 D2 |
| w | D L2 | L2 D' |
| x | L2 | L2 |

---

## Appendix C: Corner Setup Move Table

Complete reference for all corner target positions:

| Letter | Setup | Undo |
|:---:|:---:|:---:|
| A | – | – |
| B | R D' | D R' |
| C | F | F' |
| D | F R' | R F' |
| E | (part of buffer group) | |
| F | F2 | F2 |
| G | D2 R | R' D2 |
| H | D2 | D2 |
| I | F' D | D' F |
| J | F2 D | D' F2 |
| K | D R | R' D' |
| L | D | D' |
| M | R' | R |
| N | R2 | R2 |
| O | R | R' |
| P | – | – |
| Q | R' F | F' R |
| R | (part of buffer group) | |
| S | D' R | R' D |
| T | D' | D |
| U | F' | F |
| V | D' F' | F D |
| W | D2 F' | F D2 |
| X | D F' | F D' |

---

## Appendix D: Algorithm Reference

### Edge Swap (T-perm)
```
R U R' U' R' F R2 U' R' U' R U R' F'
```
Used for every edge in the memo.

### Corner Swap (Modified Y-perm)
```
R U' R' U' R U R' F' R U R' U' R' F R
```
Used for every corner in the memo.

### Parity Fix (R-perm)
```
R U R' F' R U2 R' U2 R' F R U R U2 R' U'
```
Apply **once** after edges if edge memo count is odd. No setup needed.

---

## Appendix E: Pre-Solve Checklist

Use this before every blindfold attempt:

**Setup:**
- [ ] White center facing UP
- [ ] Green center facing FRONT
- [ ] Cube is scrambled
- [ ] I have no blindfold on yet

**Memo Phase:**
- [ ] Traced all edges carefully
- [ ] Traced all corners carefully
- [ ] Converted memo to 2-letter pairs
- [ ] Built a memorable story
- [ ] Checked parity (odd or even edge count?)

**Execution:**
- [ ] Blindfold is secure
- [ ] Ready to follow memo letter-by-letter
- [ ] Remember: setup → algorithm → undo

**After:**
- [ ] Executed all edges
- [ ] Applied parity (if needed)
- [ ] Executed all corners
- [ ] Removed blindfold
- [ ] Cube is solved! ✅

---

## Final Tips for Success

1. **Consistency is key**: Practice the same way every time
2. **Accuracy before speed**: A slow, accurate solve beats a fast mistake
3. **Start small**: Begin with 4-6 memo letters, increase gradually
4. **Review your mistakes**: Every error teaches you something
5. **Use the website drills**: Practice each phase separately
6. **Be patient**: Your first solve might take 20 minutes—that's okay!
7. **Celebrate small wins**: First successful edge cycle? Great! First parity fix? Excellent!

---

## Summary: Three Phases, Three Algorithms

| Phase | What You Do | Keys to Success |
|:---:|:---|:---|
| **Tracing** | Convert scrambled cube to letters | Go slowly, stay oriented, double-check |
| **Memorization** | Convert letters to memorable story | Use vivid images, create narrative, link them |
| **Execution** | Solve using algorithms blindfolded | Setup → algorithm → undo for each letter |

---

**You've got this. One letter at a time, you'll solve the cube.**

🎉 Welcome to the world of blindfold cubing!

---

*Last Updated: 2025*  
*Method: Old Pochmann Beginner*  
*Based on community standards and proven techniques*

