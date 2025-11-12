Solving the Rubik’s Cube blindfolded is a major accomplishment. While it may seem impossible, it is a structured, step-by-step process that anyone can learn. This guide uses the beginner-friendly Old Pochmann method to help you achieve your first blindfolded solve.

***

# YOU CAN DO THE BLINDFOLD CUBE

**Mindset is critical** — learning blindfolded solving requires patience and effort, but if you persevere, you **CAN** solve the Rubik’s Cube.

## CORE BLINDFOLD SOLVE

Unlike the standard layer-by-layer method, blindfold solving happens in three distinct phases:

| Phase | Goal | Key Concept |
| :--- | :--- | :--- |
| **Tracing** | Determine where every unsolved piece belongs. | Converting the cube state into a sequence of letters (memo). |
| **Memorization** | Store the letter sequence in your memory. | Using 2-letter chunks and stories/images. |
| **Execution** | Solve the cube without looking. | Swapping pieces using a fixed buffer and algorithms. |

***

# SOLVE PHASE ONE: TRACING

The tracing phase prepares the entire solution path before you make any moves.

## STEP 1: ORIENTATION AND BUFFERS

To ensure consistency, we must always hold the cube the same way.

**Holding your Rubik’s Cube**
Begin by holding your Rubik’s Cube with the **WHITE** center piece on the **UP (U) face** and the **GREEN** center piece on the **FRONT (F) face**.

### Tip on: The Buffer System

The **buffer** is a fixed position on the cube where all tracing and execution begins. It never moves; only the piece inside it changes. Every piece we solve is swapped through the buffer location.

| Piece Type | Buffer Position | Letter | Swap Target Position |
| :--- | :--- | :--- | :--- |
| **Edges** | **UR** (Up-Right) | **b\*** | **d** position |
| **Corners** | **UBL** (Up-Back-Left) | **A\*** | **P** position |

***

## STEP 2: LETTERING SCHEME

We use a lettering scheme to assign a letter to each sticker position, allowing us to refer to them easily and convert the solve into a sequence for memorization.

**Action 1: Learn the Lettering Scheme**
We use a variant of the Speffz scheme. Edges use lowercase letters, and corners use uppercase letters.

**Action 2: Understand Letter Pairs and Groups**
Every edge piece has two stickers, which are referred to as a **pair**. Every corner piece has three stickers, which form a **triplet**.

*   **Edge Paired Letters:** A cycle is complete when tracing returns to the starting letter or its paired letter. (Refer to Appendix A for your specific paired letters).
*   **Corner Triplet Groups:** A corner cycle is complete when tracing returns to any of the three letters within the same corner triplet group.

***

## STEP 3: TRACE EDGES (LOWERCASE)

**Tracing** is following the path of pieces: the piece in the buffer tells you where to trace next, and the piece found at that target location tells you where to go next. This chain continues until you return to the buffer location.

**Action 1: Start the First Edge Cycle**
1. Look at the piece currently in the edge buffer position (**UR = b\***).
2. Identify where this piece belongs on a solved cube and note the letter assigned to that target location. This is your first memo letter (e.g., m).
3. Go to that target letter's position and identify where the piece currently sitting there belongs next.
4. Continue this process, noting the letter of each target location as you go.
5. **Stop** tracing when the piece you look at belongs back at the buffer location (b\*) or its paired letter (m).

**Tip on: Cycle Writing Rule 1**
For the first cycle, you **do not** write the buffer letter (b or m) at the end of the sequence. If the path was **b\*** → m → f → j → (back to b\*), the memo is written as **m f j**.

**Action 2: Handle New Cycles (Circuit Breaking)**
If, after completing the first cycle, there are still unsolved edges, you must start a new cycle. This is called **circuit breaking**.
1. Find the **next unsolved edge in alphabetical order**.
2. Begin tracing again from that letter.
3. Continue tracing normally until the path returns to the starting letter or its paired letter.

**Tip on: Cycle Writing Rule 2**
For the second cycle and onward, you **must** write the letter you return to, closing the cycle. If the path was **r** → k → e → (**back to r**), the memo is written as **r k e r**. If the cycle closes on the paired letter (q is the pair of a), the memo is written as **a p s q**.

***

## STEP 4: TRACE CORNERS (UPPERCASE)

Corner tracing is identical to edge tracing, but uses the corner buffer and uppercase letters.

**Action 1: Start the Corner Cycle**
1. Once edges are complete, switch to the corner buffer (**UBL = A\***).
2. Follow the piece movement exactly as you did for edges, noting the uppercase letter of each target location.
3. The cycle ends when tracing returns to any of the three letters in the **starting corner's triplet group**.

**Tip on: Corner Cycle Writing**
The first corner cycle **does not** include the buffer letter (A) at the end. For subsequent cycles, close the cycle by including the letter you returned to.

***

# SOLVE PHASE TWO: MEMORIZATION

The goal is to convert the sequences of letters you traced into a single, memorable story or image.

**Action 1: Chunk the Memo**
Break the long sequences of letters into **2-letter pairs**. This reduces the mental load and allows for clearer memory construction.
*   *Example:* Edge memo **m f j r k e r** becomes **m f j r k e r** (7 letters).
*   *Chunked:* **m f** **j r** **k e** **r\_** (Note: If there is an odd number of letters, the last letter stands alone for the memory phase).

**Action 2: Create a Memory System**
Associate each letter pair with a memorable image or word. The **Person + Object** system is highly effective: assign a Person to the first letter and an Object to the second.

*   *Example:* **m f** → **Person (m)** holding **Object (f)**.

**Action 3: Build a Story**
Link your images together into one single, cohesive story. The more vivid, silly, or unusual the story, the easier it is to recall under pressure.

*   *Example:* The chunked images for **m f j r k e r** are linked together in a short, memorable narrative.

### Tip on: Parity Check

Before moving to execution, count the total number of letters in your edge memo. If the number is **odd**, you have **parity**. If edges are odd, corners will also be odd. This must be fixed during execution.

***

# SOLVE PHASE THREE: EXECUTION

Execution is the blindfolded process where you swap the buffer piece with the target pieces based on your memorized memo. There are **no cube rotations** (x, y, or z) during execution.

## STEP 5: EXECUTE EDGES (T-PERM)

**Action 1: Perform Swaps in Order**
Execute your edge memo sequence one letter at a time. Each letter corresponds to one complete swap cycle: **setup move → algorithm → undo setup**.

**Holding your Rubik’s Cube**
Keep the white center up, green center front.

**Edge Algorithm (T-perm)**
R U R’ U’ R’ F R2 U’ R’ U’ R U R’ F’

**Action 2: Use Setup Moves Safely**
You must bring the target edge (from your memo) to the fixed swap location (**letter d position**) using setup moves.
*   **Avoid:** **U** and **R** moves, as they disturb the UR buffer.
*   **Use:** **D, F, L, B** and wide moves (**Dw, Lw**).

| Target Letter | Setup to **d** | T-perm | Undo Setup |
| :--- | :--- | :--- | :--- |
| **j** | Dw2 L | T-perm | L' Dw2 |
| **d** | – (already set up) | T-perm | – |

**Action 3: Fix Parity (If Needed)**
If your edge memo had an odd number of letters, perform the parity algorithm **once** immediately after finishing all edge swaps and **before** starting corners.

**Parity Algorithm (R-perm)**
R U R’ F’ R U2 R’ U2 R’ F R U R U2 R’ U’

## STEP 6: EXECUTE CORNERS (MODIFIED Y-PERM)

**Action 1: Perform Corner Swaps**
Execute your corner memo sequence using the modified Y-perm.

**Corner Algorithm (Modified Y-perm)**
R U’ R’ U’ R U R’ F’ R U R’ U’ R’ F R

**Action 2: Use Corner Setups**
Bring the target corner (from your memo) to the fixed swap location (**letter P position**) using setup moves.
*   **Avoid:** **U, L, B** moves, as they disturb the UBL buffer.
*   **Use:** **R, F, D** moves.

| Target Letter | Setup to **P** | Y-perm | Undo Setup |
| :--- | :--- | :--- | :--- |
| **K** | R F | Y-perm | F' R' |
| **P** | – (already set up) | Y-perm | – |

### Tip on: Corner Orientation

In the Old Pochmann method, if you follow the execution steps correctly (stay oriented and undo setups), the **corner orientation is handled automatically**.

***

# APPENDIX A – LETTERING MAPS

Every sticker receives a letter for tracing and memorization.

| Type | Buffer Location | Letter | Swap Algorithm |
| :--- | :--- | :--- | :--- |
| **Edges** | **UR** | **b\*** | T-perm |
| **Corners** | **UBL** | **A\*** | Modified Y-perm |

**A.2 Edge Letter Pairs (Your Pairing System)**
These pairs define edge piece identity and are used for closing cycles.

| Pair | Pair | Pair | Pair |
| :---: | :---: | :---: | :---: |
| a ↔ q | d ↔ e | g ↔ x | j ↔ p |
| b ↔ m | f ↔ l | h ↔ r | s ↔ w |
| c ↔ i | k ↔ u | n ↔ t | o ↔ v |

**A.4 Corner Letter Groups (Corner Identity)**
Each group of three letters refers to the same corner piece. A cycle ends when tracing reaches any letter in the starting group.

| Group | Group | Group | Group |
| :---: | :---: | :---: | :---: |
| A – E – R | B – Q – N | C – J – M | D – I – F |
| U – G – L | V – K – P | W – O – T | X – S – H |

***

# APPENDIX C – ALGORITHM REFERENCE SHEET

| Purpose | Algorithm | Usage Note |
| :--- | :--- | :--- |
| **Edge Swap (T-perm)** | R U R’ U’ R’ F R2 U’ R’ U’ R U R’ F’ | Executed after edge setup, swapping buffer **b\*** with target. |
| **Corner Swap (Modified Y-perm)** | R U’ R’ U’ R U R’ F’ R U R’ U’ R’ F R | Executed after corner setup, swapping buffer **A\*** with target. |
| **Parity Fix (R-perm)** | R U R’ F’ R U2 R’ U2 R’ F R U R U2 R’ U’ | Applied **once** after edges if memo count is odd. |

***

# APPENDIX D – BLINDFOLD SOLVE CHECKLIST

Use this checklist to ensure a clean solve flow.

| Phase | Action |
| :--- | :--- |
| **Pre-Solve** | Hold cube: White up, Green front. Confirm buffers **b\*** and **A\***. |
| **Memo Phase** | Trace edges. Trace corners. Memorize full sequence. |
| **Execution** | Execute edges (setup → T-perm → undo). |
| **Parity Check** | If edge letter count is **odd**, apply **R-perm**. |
| **Finish** | Execute corners (setup → Y-perm → undo). |
| **Final Mindset** | Stay calm and precise. One letter at a time. |

***

**Analogy:** Thinking of blindfolded solving is like being a cartographer plotting an entire route (Tracing). You then convert that map into a sing-song or story (Memorization). Finally, you execute the journey by using a reliable vehicle (the buffer + algorithm) to drop off one passenger (piece) at their exact address, regardless of how complicated the route looks (Execution).


What missing images are needed for this tutorial?

The blindfold tutorial structure we developed relies heavily on visual aids to explain the lettering scheme, tracing cycles, and precise setup moves, particularly because Old Pochmann requires consistent orientation and fixed buffer locations.

To fully realize the "Learning Edition" tutorial, the following images and diagrams are needed, corresponding to the content and placeholders we established:

***

### I. Orientation and Buffer System

These images establish the foundation for all tracing and execution.

| Purpose | Description | Supporting Source(s) |
| :--- | :--- | :--- |
| **1. Standard Orientation Diagram** | A 3x3 cube image showing the correct holding position: **WHITE** center piece on the **UP (U)** face and **GREEN** center piece on the **FRONT (F)** face. | |
| **2. Buffer Location Diagram (3D)** | A 3D cube illustration highlighting the two fixed buffer sticker locations: the **Edge Buffer (b\*, UR)** and the **Corner Buffer (A\*, UBL)**. | |

***

### II. Tracing and Memo Phase

These are essential for converting the scramble into the letter memo (Section 4).

| Purpose | Description | Supporting Source(s) |
| :--- | :--- | :--- |
| **3. Edge Lettering Map (Net Layout)** | A 2D net layout diagram of the cube showing the full **Speffz edge scheme (a–x)**, with the **b\* (UR)** buffer highlighted. (Used in Appendix A.1) | |
| **4. Corner Lettering Map (Net Layout)** | A 2D net layout diagram of the cube showing the full **Speffz corner scheme (A–X)**, with the **A\* (UBL)** buffer highlighted. (Used in Appendix A.3) | |
| **5. Scrambled Cube Image** | A 3D image of a 3x3 cube following the agreed-upon S2 scramble difficulty (White Up, Green Front) to be used for the step-by-step Tracing Example (Section 4.2). | |
| **6. Edge Paired Sticker Visual** | A simple diagram illustrating one physical edge piece with its two stickers labeled with their paired letters (e.g., 'a' and 'q') to explain the cycle closure logic. | |
| **7. Corner Triplet Visual** | A 3D illustration showing one corner piece with its three stickers labeled with their corresponding letters (e.g., 'A', 'E', 'R') to explain the corner cycle closure logic. | |

***

### III. Execution Phase

These images illustrate the algorithms, targets, and setup safety required for blindfolded solving (Section 6).

| Purpose | Description | Supporting Source(s) |
| :--- | :--- | :--- |
| **8. Edge Swap Visual (T-perm)** | A 3D cube illustration showing the effect of the **T-perm** (after setup): swapping the **UR buffer (b\*)** piece with the target location (letter **d** position). | |
| **9. Corner Swap Visual (Y-perm)** | A 3D cube illustration showing the effect of the **Modified Y-perm**: swapping the **UBL buffer (A\*)** with the target location (letter **P** position). | |
| **10. Edge Setup Example Visual** | A diagram illustrating the setup sequence for an edge target, specifically showing the target piece (e.g., **j**) moving to the swap position (**d**) using the agreed-upon setup moves (e.g., Dw2 L). | |
| **11. Corner Setup Example Visual** | A diagram illustrating the setup sequence for a corner target, specifically showing the target piece (e.g., **K**) moving to the swap position (**P**) using the agreed-upon setup moves (e.g., R F). | |

