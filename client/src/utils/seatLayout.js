// Seat layout matching the hand-drawn floor plan of Lucky Reading Room
// A/C section: seats 1-58 | Non-A/C section: seats 59-96

export const SEAT_SECTIONS = {
  AC: 'AC',
  NON_AC: 'NON_AC',
};

// Each block: { label, rows: [[seat numbers]], section }
export const FLOOR_LAYOUT = [
  // ── TOP ROW (A/C) ────────────────────────────────────────────
  {
    id: 'top',
    label: 'Front Row (A/C)',
    section: 'AC',
    type: 'full-row',
    rows: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
  },

  // ── A/C SECTION – First cluster ──────────────────────────────
  {
    id: 'ac-left-1',
    label: 'A/C Left',
    section: 'AC',
    type: 'pod-left',
    rows: [
      [24, 23, 22, 21, 20, 19],
      [25, 26, 27, 28, 29, 30],
    ],
  },
  {
    id: 'ac-right-1',
    label: 'A/C Right',
    section: 'AC',
    type: 'pod-right',
    rows: [
      [18, 17, 16, 15, 14, 13],
      [31, 32, 33, 34, 35, 36],
    ],
  },

  // ── A/C SECTION – Second cluster ──────────────────────────────
  {
    id: 'ac-left-2',
    label: 'A/C Left',
    section: 'AC',
    type: 'pod-left',
    rows: [
      [48, 47, 46, 45, 44, 43],
      [49, 50, 51, 52, 53],
    ],
  },
  {
    id: 'ac-right-2',
    label: 'A/C Right',
    section: 'AC',
    type: 'pod-right',
    rows: [
      [42, 41, 40, 39, 38, 37],
      [54, 55, 56, 57, 58],
    ],
  },

  // ── NON-A/C SECTION – First cluster ───────────────────────────
  {
    id: 'nonac-left-1',
    label: 'Non-A/C Left',
    section: 'NON_AC',
    type: 'pod-left',
    rows: [
      [70, 69, 68, 67, 66, 65],
      [71, 72, 73, 74, 75, 76],
    ],
  },
  {
    id: 'nonac-right-1',
    label: 'Non-A/C Right',
    section: 'NON_AC',
    type: 'pod-right',
    rows: [
      [64, 63, 62, 61, 60, 59],
      [77, 78, 79, 80, 81, 82],
    ],
  },

  // ── BACK SECTION (Non-A/C) ────────────────────────────────────
  {
    id: 'back-left',
    label: 'Back Row',
    section: 'NON_AC',
    type: 'pod-left',
    rows: [
      [89, 90, 91, 92, 93],
    ],
  },
  {
    id: 'back-right',
    label: 'Back Row',
    section: 'NON_AC',
    type: 'pod-right',
    rows: [
      [83, 84, 85, 86, 87, 88],
      [94, 95, 96],
    ],
  },
];

// Cluster rows for the floor plan grid
// Returns groups: [left-block, right-block] or [single-full-row]
export const FLOOR_CLUSTERS = [
  { type: 'full', blocks: ['top'] },
  { type: 'split', left: 'ac-left-1', right: 'ac-right-1', divider: 'A/C' },
  { type: 'split', left: 'ac-left-2', right: 'ac-right-2', divider: null },
  { type: 'split', left: 'nonac-left-1', right: 'nonac-right-1', divider: 'Non A/C' },
  { type: 'split', left: 'back-left', right: 'back-right', divider: 'Back Row' },
];

export function getSeatSection(seatNumber) {
  return seatNumber <= 58 ? 'AC' : 'NON_AC';
}
