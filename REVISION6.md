# Menu design revision 6 - 2026-10-29

**Current tab shape (2026-10-30): 32px wide by 24px high.** Page-tab art is stretched 2x horizontally and 1.5x vertically. Seven tabs start x=36 with 36px pitch, y=206..229, fitting between the unchanged L/R. Separate width and height drive prototype hit regions. Prior square-scale examples remain references. L/R pixel regions compared identical before/after across all 61 mockups; user prompt inputs unchanged.

Mockups only. Still 61 native 320x240 renders plus 3x copies, twelve contact
sheets and 88 proposed route/state records. Prior pass preserved in
`v5-compact-social/`. No game code, ROM, saves, SDK build or emulator changes.

[Gallery](index.html) | [Items](01-items-3x.png) |
[Trinket equipment](equipment-trinket-unlocked-3x.png) |
[All equipment states](equipment-pages.png) | [Prototype](prototype.html)

- **Tabs restored to original 16px size**, keeping the original Items icon.
  Seven root tabs start x=80 with 24px pitch, y=214..229, flat against y=230.
  Prior larger-scale comparisons remain references, not the selected default.
- **L/R keep their bottom placement and 24px size**, but use original blank-tab
  art from Cursors `(16,368,16,16)`, rotated clockwise for L and counterclockwise
  for R. The original open bottom faces left and right respectively. Lettering
  stays upright. After the 2026-10-30 spacing follow-up, positions and touch
  targets are now `(8,206,24,24)` and `(288,206,24,24)`: two successive 1px
  outward adjustments. Latest equal-spacing pass moves letter centers to x=20/x=300.
- **Defense and immunity separated** at center x=72 and x=248, y=163, instead
  of one combined center line. This leaves the center open for a lower trinket.
  Regular equipment states use the same separated stat positions.
- **Trinket slot lowered** from y=120 to y=147, still 30x30, with label above
  at y=131. The label and slot fit between farmer frame and button prompts.
  Breadcrumb remains unobscured at y=35.
- **Farmer frame enlarged** from 68x59 to 76x74 at `(122,57)`. Farmer artwork
  draws at integer 2x, 32x64 at `(144,62)`, replacing the smaller 24x48 draw.
  This avoids the uneven 1.5x pixel scaling that made that preview look odd.
- The user's 18px prompt files remain untouched and draw at the selected 16px.
  Official social tracking/current-location design and inventory remain as reviewed.

Renderer and mockup link checks pass with the restored tab geometry and relocated
trinket hotspot. Reviewed enlarged Items, regular equipment and trinket equipment.
No overlap observed between breadcrumb, farmer frame, trinket label/slot, side
stats or prompt row. Checks concern design artifacts, not a 3DS renderer/GPU or
runtime equipment system. User review and remaining unrendered states are still
required before implementation. Birthday discovery remains proposed.

2026-10-30 follow-up: crafting's Need 26 more frame and text moved up 4px,
from y=151 to y=147 (134x20), leaving space above the larger item frame's
bottom border. No inventory/content/scale changes. Renderer/navigation and
user prompt preservation checks rerun for this follow-up; native/enlarged
crafting and side-frame alignment reviewed.

Latest 2026-10-30 corner follow-up: footer prompt row moved down 6px, y=178 to
y=184 (16px glyphs at y=186..201). L/R moved one further pixel outward. Their
lower horizontal edges no longer close as separate boxes: source face/border
strips continue downward and bend into the outer bottom rail, mirrored for R.
This interprets the requested corner connector as one continuous side-to-bottom
frame. The bend extends 3px inward as decoration; button targets remain 24px.
Top-navigation reference keeps its rotated frame without a bottom-rail connector.
Prior drawing saved in v6-before-corner-connectors. Existing inventory/equipment,
tab/prompt sizes and user input assets preserved. Reviewed Items/trinket examples.

2026-10-30 correction: user clarified the joins must be right angles. Removed
the stepped/inward bend and its 3px decoration. The inner vertical border now
continues straight to the horizontal outer bottom rail, forming a square 90-degree
junction. Frames/targets remain 24px, x=10/x=286; prompt row stays y=184.

2026-10-30 wide-tab follow-up: renderer/navigation PASS including touches in the new right half of tab hitboxes. Reviewed enlarged Items and native Tools. Tool tab labels moved alongside wider icons to preserve spacing. All game code, ROM, saves and L/R art/geometry untouched.

2026-10-30 height trial: retained 32px width and raised page-tab height to 24px, keeping baseline y=230. Updated prototype height; upper-strip tap checks PASS. Reviewed enlarged Items. L/R regions pixel-identical across all 61 renders; prompt inputs unchanged. Prior 32x16 Items retained in v6-tabs-32x16. No gameplay changes.

2026-10-30 equal-spacing follow-up: moved only L/R frames, upright letters and touch regions outward 2px, to x=8/x=288. First tab starts x=36; last tab ends x=284 exclusive. The resulting 4px outer gaps match the 4px gaps between page tabs. Page tabs remain 32x24 at x=36/pitch=36. Renderer/navigation PASS; all pixels outside L/R compare unchanged across 61 mockups (non-navigation-before-spacing.json). Reviewed enlarged Items. No game changes.

2026-10-30 fill correction: after the outward move, the open-side tan paper overlapped the outer wood rail. Clipped the two source parchment colors in the six outer columns of each expanded 24px navigation frame, mirrored for R, preserving the original outer border underneath. Wood joins, letters, x=8/x=288 positions, targets, page tabs and four-pixel gaps remain unchanged. Renderer/navigation PASS; enlarged Items reviewed. All pixels outside L/R and ten prompt inputs remain unchanged.
