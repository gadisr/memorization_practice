---
title: "Blindfold Solving – Step-by-Step Method"
subtitle: "Complete Guide: Trace → Memorize → Execute"
author: "By Blindfold Cubing"
logo: "logo-placeholder.png"
version: "1.0"
---

# Blindfold Solving – Step-by-Step Method
### *Complete Guide: Trace → Memorize → Execute*  
**By Blindfold Cubing**  
*Logo placeholder here*

---

## Table of Contents
1. **Introduction**
2. **How Blindfold Solving Works**
3. **Understanding Pieces and Buffers**
4. **Tracing – Finding Where Pieces Go**
   - 4.1 Edge Tracing
   - 4.2 Edge Tracing Example
   - 4.3 Closing Edge Cycles
   - 4.4 Circuit Breaking
   - 4.5 Corner Tracing
5. **Memorization**
   - 5.1 Why We Memorize in Letter Pairs
   - 5.2 Breaking Memo into Chunks
   - 5.3 Memory Techniques
6. **Execution**
   - 6.1 How Execution Works
   - 6.2 Safe Execution Rules
   - 6.3 Edge Execution – T-perm
   - 6.4 Edge Parity – R-perm
   - 6.5 Corner Execution – Y-perm
   - 6.6 Corner Orientation
   - 6.7 Full Execution Walkthrough
   - 6.8 Practice Execution with Drills
7. **Putting It All Together – Full Blindfold Solve Flow**

**Appendices**
- Appendix A – Lettering Maps
- Appendix B – Setup Move Cookbook
- Appendix C – Algorithm Reference Sheet
- Appendix D – Blindfold Solve Checklist

---

# 1. Introduction

Blindfold solving may look impossible, but it is a logical and learnable process. With the right method, anyone who can solve a Rubik’s Cube can also solve it **blindfolded**. This guide teaches you exactly how — step by step.

We will use a beginner-friendly and proven method called the **Old Pochmann Method**. It uses:
- **One algorithm for edges**
- **One algorithm for corners**
- **One parity algorithm** (used only if needed)

You don’t need advanced cube knowledge. Blindfold solving is about **thinking**, not speed. You solve the cube by:
✅ Tracing where pieces must go  
✅ Memorizing a simple letter sequence  
✅ Executing that sequence with your eyes closed  

No tricks. No guessing. Just logic.

---

# 2. How Blindfold Solving Works

Blindfold solving is always done in **three phases**:

| Phase | Goal | What Happens |
|--------|------|--------------|
| **Tracing** | Find where each piece belongs | Convert cube state into letters |
| **Memorization** | Remember the letter sequence | Use 2-letter chunks/story |
| **Execution** | Solve without looking | Use setups + safe algorithms |

---

### ✅ The Core Idea
Instead of solving the cube layer by layer, we **track where each piece needs to go** and move it there **one by one** *from a fixed starting point called a buffer*.

This means:
- We don’t solve based on current cube shape
- We solve based on **where each piece belongs**
- We solve **piece by piece**, in a **controlled order**

---

✅ **Next: Section 3 – Understanding Pieces and Buffers**  
*(Continue in Part 2/4)*  

# 3. Understanding Pieces and Buffers

Before we begin solving blindfolded, we must understand **how pieces move** and what a **buffer** is.

---

## 3.1 Edge and Corner Pieces

A 3×3 cube has:
- **12 edge pieces** → each has **2 stickers**
- **8 corner pieces** → each has **3 stickers**

Each piece always belongs to a **specific location** on a solved cube. Blindfold solving is about **sending every piece back to where it belongs**.

---

## 3.2 What Is a Buffer?

The **buffer** is the piece where every solve begins. We repeatedly swap pieces **with the buffer** until everything is back in place.

| Piece Type | Buffer Position | Letter |
|-------------|----------------|--------|
| Edges | **UR** | **b\*** |
| Corners | **UBL** | **A\*** |

The buffer never **moves from its location** during the solve — instead, other pieces are swapped through it.

---

# 4. Tracing – Finding Where Pieces Go

Tracing is how we **convert the cube into letters** so we can memorize it. This is the **first phase** of blindfold solving.

During tracing:
- We start at the **buffer**
- We ask: **“Where does this piece belong?”**
- We follow the path until it returns to the buffer
- Each move is recorded as **a letter**

---

## 4.1 Edge Tracing

Edges use **lowercase letters (a–x)**.  
Every edge sticker has a letter assigned to it using the **letter map** (Appendix A).

**Example:**
- Buffer is **UR = b\***
- We look at which piece is currently at **UR**
- Suppose it belongs at sticker **m**
- That means our **first letter is m**

We continue:
- Now we look at the piece currently at **m**
- See where that piece belongs
- Continue until we return to **b** (buffer)

This creates a **cycle** of letters.

---

## 4.2 Edge Tracing Example (Simple)

*(Example scramble and image will be added later)*

Let’s say tracing edges gives us:
m → f → j → (returns to buffer)
We write that as:
mfj


That is **one complete edge path** (called a **cycle**).  
Later, we will learn how to trace all edges even if the buffer does not return immediately.

---

## 4.3 Closing Edge Cycles

Sometimes tracing does **not** return to the buffer cleanly.  
When we trace all edges connected to the buffer, but **some edges are still unsolved**, we **start a new cycle**.

Example:
First cycle: mfj
Second cycle: rker


To start a new cycle:
- Find the **first unsolved edge (alphabetically)**
- Begin tracing again from that piece

---

## 4.4 Circuit Breaking

This is how we handle **new cycles** during tracing.  
Think of tracing as following **connections**. When those are done, but pieces are left unsolved, we **“break into the circuit”** by forcing a new path.

We simply:
1. Find the **next unsolved letter**
2. Start tracing from there
3. Continue until it returns to the buffer *(or its paired letter)*

---

## 4.5 Corner Tracing

Corners are traced **after edges**.

- Corners use **uppercase letters (A–X)**
- Each corner has **3 letters** (one for each sticker)
- Corner cycles are similar to edge cycles

Example:
Corner memo sample: F U C P J C


Corners also return to the buffer **A** or one of its **pair letters**.

---

✅ Next: **Section 5 – Memorization**  
*(Continue in Part 3/4)*  

✅ Here is **Markdown Version – Part 3/4**
(Section 5 – Memorization + Section 6 – Execution)

---

```markdown
# 5. Memorization

Once tracing is done, we now have two letter sequences:

```

Edges: m f j   r k e r
Corners: F U   C P J C

```

We now **memorize** this letter sequence before execution.

---

## 5.1 Why We Memorize in Letter Pairs

Memorizing **single letters** is difficult and easy to forget.  
Instead, we **group letters into pairs** to form meaningful chunks.

Example:
```

mf  jr  ke  r_    → easier to remember

```

Chunking letters:
✅ Reduces memory load  
✅ Allows story-based memory  
✅ Supports reusable memory structure

---

## 5.2 Chunking into a Story

We use **2-letter combinations (pair chunks)** to build a **simple story**.

Example using **PAO (Person–Action–Object)** system:
```

mf → Magician + Flag
jr → Juggler + Rope
ke → King + Egg

```

Now create a **story**:
> "A magician waved a flag while a juggler tangled a rope around a king holding an egg."

This story is enough to remember all edges in order.

---

## 5.3 Memory Techniques

Different techniques can be used:

| Technique | Description |
|------------|-------------|
| **PAO system** ✅ | Person + Object for each 2-letter pair |
| **Keyword images** | Simple object-based memory |
| **Journey method** | Place objects along a mental path |
| **Linking method** | Connect events in a chain |
| **Audio memory** | Repeat rhythmically |

This guide uses **Person + Object** as the **default system**, but any consistent method works.

---

# 6. Execution

Execution is where we **solve the cube without looking** using **safe algorithms**.  
Each letter from your memo becomes **one swap** with the buffer.

There are no cube rotations during execution.  
Maintain orientation **white on top, green in front** the whole time.

---

## 6.1 How Execution Works

Execution follows this order:
```

1. Execute edges
2. Parity fix (if needed)
3. Execute corners

```

Each letter from your memo is solved using:
```

setup move → algorithm → undo setup

```

---

## 6.2 Safe Execution Rules

✅ Always undo every setup move  
✅ Never rotate the cube  
✅ Never execute the buffer letter (b or A)  
✅ Keep memo order  
✅ One letter = one swap  
✅ Stay calm, consistent

---

## 6.3 Edge Execution (T-perm)

Edges use **T-perm** to swap a target edge with the **buffer (b\*)**.

**T-perm:**
```

R U R’ U’ R’ F R2 U’ R’ U’ R U R’ F’

```

Every edge letter is executed:
```

setup → T-perm → undo

```

Example:
```

Letter j:
Setup: Dw2 L
T-perm
Undo: L' Dw2

```

---

## 6.4 Edge Parity (R-perm)

If your edge memo has **odd number of letters**, parity must be fixed.

**Parity algorithm (R-perm):**
```

R U R’ F’ R U2 R’ U2 R’ F R U R U2 R’ U’

```

✅ Apply **once**  
✅ No setup required  
✅ Only if edge memo length is odd

---

## 6.5 Corner Execution (Y-perm)

Corners use **modified Y-perm** to swap with buffer **A\***.

**Modified Y-perm:**
```

R U’ R’ U’ R U R’ F’ R U R’ U’ R’ F R

```

Same structure:
```

setup → Y-perm → undo

```

Example (letter K):
```

Setup: R F
Y-perm
Undo: F' R'

```

---

## 6.6 Corner Orientation

Corner orientation is solved **automatically** using this method.  
No separate algorithm is needed.

As long as:
- Setup moves are correct
- Cube stays oriented
- Setup moves are undone

✅ All corners will be correctly oriented.

---

*(Continue Section 6.7 and 6.8 in Part 4/4)*  
```

---

Continue to **Part 4/4 (final)**? 🚀


Perfect ✅ — I’ll continue with **Part 4/4 now**, and I’ll send it in **clean Markdown (no code blocks)** so it’s easy to copy-paste into a document.

---

### ✅ Markdown Version – Part 4/4

(Continues from Section 6.6)

---

## 6.7 Full Execution Walkthrough (Example)

Example memo:
Edges: m f j   r k e r
Corners: F U   C P J C

Execution flow:

1. Execute all edges in order using setup → T-perm → undo
2. Edge memo has 7 letters → odd → apply R-perm parity
3. Execute all corners using setup → Y-perm → undo
4. Done ✅

This walkthrough follows the full blindfold method.

---

## 6.8 Practice Execution with Drills

This website provides practical **blindfold training drills** for each phase:

* Edge tracing practice
* Corner tracing practice
* Memorization drills using letter pairs
* PAO memory builder
* Execution trainer (edges + corners)

Practice builds confidence. The key is consistency: trace cleanly, memorize clearly, and execute calmly.

---

# 7. Putting It All Together – Full Blindfold Solve Flow

Blindfold solving always follows this order:

1. Scramble the cube
2. Trace edges → build edge memo
3. Trace corners → build corner memo
4. Memorize full memo
5. Put on blindfold
6. Execute edges
7. Parity fix if needed
8. Execute corners
9. Cube solved ✅

Example full memo:
Edges: m f j   r k e r
Corners: F U   C P J C

---

## Solve Flow Summary

Memo → Execute edges → Parity if needed → Execute corners → Done.

---

## Solve Checklist

* Orientation locked: white on top, green in front
* No cube rotations
* Follow memo in order
* Setup → algorithm → undo
* One letter at a time
* Calm and consistent execution

---

# Appendix A – Lettering Maps

Every sticker has a letter so we can describe cube state blindfolded.

## A.1 Edge Letter Map

Edges use lowercase letters (a–x).
Edge buffer = **b*** (UR).
[Insert edge lettering diagram here]

## A.2 Edge Letter Pairs

These pairs define edge identity:

a ↔ q  i ↔ c
b ↔ m  j ↔ p
d ↔ e  k ↔ u
f ↔ l  n ↔ t
g ↔ x  o ↔ v
h ↔ r  s ↔ w

## A.3 Corner Letter Map

Corners use uppercase letters (A–X).
Corner buffer = **A*** (UBL).
[Insert corner lettering diagram here]

## A.4 Corner Letter Groups

Each group is one physical corner:
A–E–R
B–Q–N
C–J–M
D–I–F
U–G–L
V–K–P
W–O–T
X–S–H

---

# Appendix B – Setup Move Cookbook

## B.1 Edge Setups (move to d)

| Letter | Setup      | Undo        |
| ------ | ---------- | ----------- |
| a      | Lw2 D' L2  | L2 D Lw2    |
| c      | Lw2 D L2   | L2 D' Lw2   |
| d      | –          | –           |
| e      | L' Dw L'   | L Dw' L     |
| f      | Dw' L      | L' Dw       |
| g      | L Dw L'    | L Dw' L'    |
| h      | Dw L'      | L Dw'       |
| i      | Lw D' L2   | L2 D Lw'    |
| j      | Dw2 L      | L' Dw2      |
| k      | Lw D L2    | L2 D' Lw'   |
| l      | L'         | L           |
| n      | Dw L       | L' Dw'      |
| o      | D' Lw D L2 | L2 D' Lw' D |
| p      | Dw' L'     | L Dw        |
| q      | Lw' D L2   | L2 D' Lw    |
| r      | L          | L'          |
| s      | Lw' D' L2  | L2 D Lw     |
| t      | Dw2 L'     | L Dw2       |
| u      | D' L2      | L2 D        |
| v      | D2 L2      | L2 D2       |
| w      | D L2       | L2 D'       |
| x      | L2         | L2          |

## B.2 Corner Setups (move to P)

| Letter | Setup | Undo  |
| ------ | ----- | ----- |
| B      | R D'  | D R'  |
| C      | F     | F'    |
| D      | F R'  | R F'  |
| F      | F2    | F2    |
| G      | D2 R  | R' D2 |
| H      | D2    | D2    |
| I      | F' D  | D' F  |
| J      | F2 D  | D' F2 |
| K      | D R   | R' D' |
| L      | D     | D'    |
| M      | R'    | R     |
| N      | R2    | R2    |
| O      | R     | R'    |
| P      | –     | –     |
| Q      | R' F  | F' R  |
| S      | D' R  | R' D  |
| T      | D'    | D     |
| U      | F'    | F     |
| V      | D' F' | F D   |
| W      | D2 F' | F D2  |
| X      | D F'  | F D'  |

---

# Appendix C – Algorithm Reference Sheet

T-perm (edges):
R U R’ U’ R’ F R2 U’ R’ U’ R U R’ F’

Modified Y-perm (corners):
R U’ R’ U’ R U R’ F’ R U R’ U’ R’ F R

Parity (R-perm):
R U R’ F’ R U2 R’ U2 R’ F R U R U2 R’ U’

---

# Appendix D – Blindfold Solve Checklist

### Pre-solve

* White top, green front
* Confirm buffers

### Memo

* Trace edges
* Trace corners
* Convert to letter pairs
* Memorize full sequence

### Execution

* Execute edges
* Parity if needed
* Execute corners

### Finish

* Last letter executed
* Remove blindfold
* Cube solved ✅

Stay calm – one letter at a time.

---

✅ End of document
Next step: I will now combine everything into a **single final `.md` file** and prepare the **HTML and PDF versions**.

Would you like me to now:
A. Send the **full clean Markdown as one message**
B. Package it as a **downloadable `.md` file**
C. Move to **HTML version next**
D. Move directly to **PDF layout**
