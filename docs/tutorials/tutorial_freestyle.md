Solve 3×3 Rubik’s Cube Blindfolded – Beginner Tutorial

---
**Version 1.0 • Last updated:** 2025-11-14  
*Prepared by Blindfold Cubing*

---

# Table of Contents
1. Introduction  
2. How Blindfold Solving Works  
3. Essential Prerequisites  
4. Lettering Scheme & Buffers  
5. Phase 1 – Tracing  
   5.1 Edge Tracing  
   5.2 Corner Tracing  
6. Phase 2 – Memorisation  
   6.1 Building Letter Pairs  
   6.2 Memory Systems (PAO, Story Chain, Journey)  
7. Phase 3 – Execution  
   7.1 Safe Execution Rules  
   7.2 Edge Execution (T-perm)  
   7.3 Parity Fix (R-perm)  
   7.4 Corner Execution (Modified Y-perm)  
8. Full Solve Walk-through  
9. Practice Plan & Drills  
10. Appendices  
   A. Letter Maps  
   B. Setup-Move Cookbook  
   C. Algorithm Reference  
   D. Solve Checklist

---

# 1  Introduction
Blindfold (“3BLD”) solving looks like magic, but it is a logical three-step process:

1. **Trace** where each piece belongs.  
2. **Memorise** the resulting letter sequence.  
3. **Execute** safe algorithms to swap pieces without ever looking.

Using the classic **Old Pochmann method** you only need:
* 1 algorithm for edges (T-perm)
* 1 algorithm for corners (Modified Y-perm)
* 1 parity algorithm (R-perm, used rarely)

If you can solve the cube normally, you can solve it blindfolded. The goal of this guide is to get your **first successful blindfold solve**.

---

# 2  How Blindfold Solving Works
Blindfold solving is done in three distinct phases:

| Phase | Goal | What you do |
|-------|------|------------|
| Tracing | Convert cube state → letters | Start at the buffer, follow piece cycles |
| Memorisation | Store the letter sequence | Group into pairs & vivid images |
| Execution | Solve with eyes closed | Setup → algorithm → undo, one letter at a time |

A **buffer** is a fixed piece that acts as the swap partner. Every swap moves a target piece into the buffer and the old buffer piece out to its home.

---

# 3  Essential Prerequisites
* Be able to solve a 3×3 regularly.  
* Know basic notation: R U F L D B, their primes (’) and 2-turns.  
* Choose and lock an orientation (this guide assumes **white U**, **green F**).  
* Print or keep handy the **letter maps** (Appendix A).

---

# 4  Lettering Scheme & Buffers
We use the popular **Speffz / Old Pochmann** scheme.

| Piece type | Buffer position | Buffer letter |
|-----------|----------------|---------------|
| Edges | UR | **b*** |
| Corners | UBL | **A*** |

Edges use **lowercase a–x** (24 stickers), corners use **uppercase A–X** (24 stickers).

---

# 5  Phase 1 – Tracing (Finding the Letters)

## 5.1  Edge Tracing
1. Look at the **buffer sticker (b)**.  
2. Ask *“Where should this sticker live on a solved cube?”*  
3. The answer is a letter (e.g., **m**). Write **m** as your first memo letter.  
4. Move to the sticker currently at **m** and repeat until you return to **b**.

This creates **one cycle**. If unsolved edges remain, start a **new cycle** at the first unsolved letter alphabetically. Separate cycles with a small pause or slash: `mfj / rker`.

## 5.2  Corner Tracing
After all edges are traced, repeat the same logic with corners using uppercase letters. The corner buffer is **A**.

Tip ▶️ Trace **edges first** then corners. That way parity (odd edge count) is obvious before executing.

---

# 6  Phase 2 – Memorisation
Raw strings like `m f j r k e r` are hard to remember. Convert them into **2-letter pairs**:

```
Edges: mf  jr  ke  r–
Corners: FU  CP  JC
```

Now transform pairs into images using one of the following systems:

| System | Example for `mf` | Notes |
|--------|------------------|-------|
| **PAO** (Person-Action-Object) | *Magician waving a Flag* | Most popular |
| Keyword | *Muffin* | Simple objects |
| Journey | Place *muffin* on front door | Place images along a path |

Create a vivid, silly **story** linking all images in order. During execution you will replay the story to recall letters.

---

# 7  Phase 3 – Execution (Blindfold On)

## 7.1  Safe Execution Rules
✅ Keep cube oriented (white U, green F).  
✅ Never rotate the cube.  
✅ Undo **every** setup move.  
✅ One letter = one swap.  
✅ Skip buffer letters (`b`, `A`).  
✅ Stay calm and go slowly.

## 7.2  Edge Execution – T-perm
For each edge letter:
1. Perform the **setup moves** (Appendix B.1) to bring the target edge to position **d**.  
2. Perform **T-perm**:  
`R U R’ U’ R’ F R2 U’ R’ U’ R U R’ F’`  
3. Undo the setup moves.

## 7.3  Parity Fix – R-perm
If your edge memo has an **odd** number of letters, execute the parity algorithm **once** after finishing edges:
`R U R’ F’ R U2 R’ U2 R’ F R U R U2 R’ U’`

## 7.4  Corner Execution – Modified Y-perm
Similar procedure using corner setups (Appendix B.2) and the modified Y-perm:
`R U’ R’ U’ R U R’ F’ R U R’ U’ R’ F R`

---

# 8  Full Solve Walk-through (Example)
**Edge memo:** `m f j   r k e r`  
**Corner memo:** `F U   C P J C`

1. Execute edges `m f j`, realise 3 letters → **odd count so far** but don’t parity yet.  
2. Execute next cycle `r k e r`. Total edges = 7 (odd). Apply **parity**.  
3. Execute corner sequence using setups + Y-perm.  
4. Cube solved ✅.

---

# 9  Practice Plan & Drills
* **Day 1–2:** Memorise letter maps. Drill locating any sticker’s letter in < 2 s.  
* **Day 3–4:** Edge tracing only – speak letters aloud.  
* **Day 5–6:** Build PAO images for 50 random edge pairs.  
* **Day 7:** First full blindfold attempt with only 4–6 edge letters.  
* **Week 2:** Gradually increase to full edge + corner solves.  
* Use online trainers or the drills on blindfoldcubing.com for targeted practice.

---

# 10  Appendices

## Appendix A – Letter Maps
(Insert edge and corner diagrams here.)

## Appendix B – Setup-Move Cookbook
### B.1  Edge Setups (move target sticker to **d**)
| Letter | Setup | Undo |
|--------|-------|------|
| a | Lw2 D’ L2 | L2 D Lw2 |
| b | – | – |
| c | Lw2 D L2 | L2 D’ Lw2 |
| … | … | … |

### B.2  Corner Setups (move target sticker to **P**)
| Letter | Setup | Undo |
|--------|-------|------|
| B | R D’ | D R’ |
| C | F | F’ |
| … | … | … |

## Appendix C – Algorithm Reference
* **T-perm:** `R U R’ U’ R’ F R2 U’ R’ U’ R U R’ F’`  
* **Modified Y-perm:** `R U’ R’ U’ R U R’ F’ R U R’ U’ R’ F R`  
* **Parity (R-perm):** `R U R’ F’ R U2 R’ U2 R’ F R U R U2 R’ U’`

## Appendix D – Solve Checklist
✓ Orientation locked  
✓ Letter maps memorised  
✓ Edge memo traced  
✓ Corner memo traced  
✓ Story vivid  
✓ Blindfold on  
✓ Execute edges → parity? → corners  
✓ Cube solved

---

> *“Slow is smooth, smooth is fast.”* – Focus on accuracy first; speed comes naturally with practice.
