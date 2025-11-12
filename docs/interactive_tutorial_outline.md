# Interactive Tutorial Screen Flow (Draft)

This outline maps content from `docs/tutorial_materials.md` into sequential interactive onboarding screens for the blindfold solving tutorial.

1. **welcome-overview**
   - Goal: Inspire and set expectations.
   - Highlights: Mindset, three-phase structure (Tracing → Memorization → Execution).
   - Interaction: Start button advances to orientation.

2. **orientation-buffers**
   - Content: Standard cube orientation, buffer concept.
   - Visuals: Orientation diagram, buffer highlight.
   - Interaction: Hover/click to reveal buffer definitions; quick question asking which stickers are buffers.

3. **lettering-scheme**
   - Content: Speffz explanation, edges lowercase, corners uppercase.
   - Visuals: Edge map net, corner map net.
   - Interaction: Toggle between edge/corner maps; short quiz to match letter to sticker.

4. **tracing-intro**
   - Content: Definition of tracing cycles, stop condition rules, circuit breaking.
   - Visuals: Animated cycle path over cube.
   - Interaction: Step-through button to follow example `b* → m → f → j`; final prompt “Which letter closes the first cycle?”.

5. **tracing-edges-rules**
   - Content: Cycle writing rules (first cycle omit buffer, subsequent cycles include return letter).
   - Visuals: Table summarizing rules.
   - Interaction: Multiple-choice quiz on whether to include buffer letter in given scenario.

6. **tracing-corners**
   - Content: Corner buffer, triplet groups, stop condition.
   - Visuals: Corner highlight; group table excerpt.
   - Interaction: Select which letter completes sample corner cycle.

7. **memo-chunking**
   - Content: Convert sequences to two-letter chunks.
   - Visuals: Example edge memo chunked.
   - Interaction: Drag-and-drop letters into pairs; automated feedback on odd-length memo.

8. **memory-images**
   - Content: Person/Object associations, storytelling.
   - Visuals: Example images for pairs.
   - Interaction: Input personal image for given pair; reveal suggested imagery.

9. **parity-check**
   - Content: Detect parity by odd letter count.
   - Visuals: Counter widget.
   - Interaction: Quick question: “Edge memo length 9 – parity?” with explanation.

10. **execution-edges**
    - Content: Setup moves safety, T-perm algorithm recap.
    - Visuals: Animated T-perm showing swap.
    - Interaction: Step-through of setup → algorithm → undo for letter `j`.

11. **execution-parity**
    - Content: When to apply R-perm parity fix.
    - Visuals: Highlight of parity algorithm steps.
    - Interaction: Confirm trigger conditions before proceeding.

12. **execution-corners**
    - Content: Modified Y-perm usage, setup move constraints.
    - Visuals: Corner swap animation.
    - Interaction: Choose valid setup moves for letter `K`.

13. **checklist-review**
    - Content: Appendix checklist condensed.
    - Visuals: Progress checklist with toggles.
    - Interaction: Self-assessment toggles, optional download/print link.

14. **next-steps**
    - Content: Summary, reminder about needed diagrams, practice guidance, link to drills.
    - Interaction: Buttons for launching drills/dashboard; prompt to create account.

Open Questions:
- Final art assets pending: orientation diagram, buffer visuals, cycle animations, setup move charts.
- Decide whether parity section merges with edges or remains separate to reduce screen count if necessary.



