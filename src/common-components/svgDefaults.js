// HubSpot UI Extensions default font/color configuration. Used by SvgText and
// AvatarStack so inline SVGs (rendered via <Image>) visually match the rest of
// the UI. Override per-component via props when needed.

export const HS_FONT_FAMILY = '"Lexend Deca", Helvetica, Arial, sans-serif';
export const HS_TEXT_COLOR = "#33475b";           // primary body text
export const HS_SUBTLE_BG = "#F5F8FA";            // Tag variant="subtle" bg
export const HS_MUTED_TEXT = "#7C98B6";           // secondary / microcopy
export const HS_NEUTRAL_CHIP = "#CBD6E2";         // neutral chip background (e.g. "+N" overflow)
export const HS_TAG_SUBTLE_BORDER = "#7C98B6";    // subtle Tag border
export const HS_TAG_TEXT_COLOR = HS_TEXT_COLOR;   // subtle Tag text
export const HS_TAG_FONT_SIZE = 12;               // subtle Tag font size
export const HS_TAG_LINE_HEIGHT = 22;             // subtle Tag line-height / height
export const HS_TAG_PADDING_X = 8;                // subtle Tag inline padding
export const HS_TAG_PADDING_Y = 0;                // subtle Tag block padding
export const HS_TAG_BORDER_RADIUS = 0;            // subtle Tag radius
export const HS_TAG_BORDER_WIDTH = 1;             // subtle Tag border width

// SVG's <text> alignment-baseline="central" needs compensating for the way
// the glyph metrics land in the canvas. Exporting as a constant so SvgText
// and AvatarStack stay consistent.
export const DEFAULT_SVG_FONT_WEIGHT = 600;
