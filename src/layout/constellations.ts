/**
 * Real constellations, as stick figures.
 *
 * Star positions are in a unit box (0..1 across the figure's width and height,
 * `w`/`h` give the box's aspect), with an approximate visual magnitude so the
 * brighter stars draw larger. Lines are index pairs into `stars`. `label` is
 * the star the name hangs off and the pixel offset from it.
 */
export interface Constellation {
  name: string;
  w: number;
  h: number;
  stars: [number, number, number][]; // x, y, magnitude (lower is brighter)
  lines: [number, number][];
  label: [number, number, number];
}

export const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Orion',
    w: 1,
    h: 1.25,
    stars: [
      [0.3, 0.0, 0.5], // Betelgeuse
      [0.78, 0.06, 1.6], // Bellatrix
      [0.4, 0.55, 1.7], // Alnitak
      [0.52, 0.53, 1.7], // Alnilam
      [0.64, 0.51, 2.2], // Mintaka
      [0.34, 1.25, 2.1], // Saiph
      [0.82, 1.18, 0.2], // Rigel
      [0.54, 0.75, 2.8], // sword
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [5, 6],
      [3, 7],
    ],
    label: [6, 12, 16],
  },
  {
    name: 'Ursa Major',
    w: 1.3,
    h: 0.5,
    stars: [
      [0.0, 0.02, 1.8], // Dubhe
      [0.03, 0.32, 2.4], // Merak
      [0.36, 0.4, 2.4], // Phecda
      [0.4, 0.12, 3.3], // Megrez
      [0.68, 0.08, 1.8], // Alioth
      [0.95, 0.0, 2.2], // Mizar
      [1.3, 0.18, 1.9], // Alkaid
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
    label: [6, 10, 14],
  },
  {
    name: 'Cassiopeia',
    w: 1.2,
    h: 0.5,
    stars: [
      [0.0, 0.3, 2.3], // Caph
      [0.28, 0.5, 2.2], // Schedar
      [0.58, 0.15, 2.5], // Gamma Cas
      [0.88, 0.45, 2.7], // Ruchbah
      [1.2, 0.05, 3.4], // Segin
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    label: [1, -10, 18],
  },
  {
    name: 'Cygnus',
    w: 1,
    h: 1.1,
    stars: [
      [0.52, 0.0, 1.3], // Deneb
      [0.5, 0.42, 2.2], // Sadr
      [0.46, 1.1, 3.1], // Albireo
      [0.05, 0.6, 2.5], // Gienah
      [0.95, 0.3, 2.9], // Delta Cyg
      [0.28, 0.52, 3.9],
      [0.75, 0.36, 3.9],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 5],
      [5, 1],
      [1, 6],
      [6, 4],
    ],
    label: [0, 10, -6],
  },
  {
    name: 'Lyra',
    w: 0.7,
    h: 0.9,
    stars: [
      [0.4, 0.0, 0.0], // Vega
      [0.2, 0.3, 3.9],
      [0.55, 0.28, 4.3],
      [0.18, 0.85, 3.5], // Sheliak
      [0.62, 0.9, 3.3], // Sulafat
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
    ],
    label: [0, 10, -6],
  },
  {
    name: 'Scorpius',
    w: 1,
    h: 1.3,
    stars: [
      [0.08, 0.0, 2.3],
      [0.0, 0.14, 2.6],
      [0.14, 0.2, 2.9],
      [0.3, 0.4, 1.0], // Antares
      [0.4, 0.55, 2.8],
      [0.47, 0.75, 2.3],
      [0.5, 0.95, 1.6],
      [0.58, 1.12, 2.4],
      [0.72, 1.3, 1.9], // Shaula
      [0.86, 1.24, 2.7],
    ],
    lines: [
      [0, 2],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
    ],
    label: [3, 12, 4],
  },
  {
    name: 'Leo',
    w: 1.3,
    h: 0.8,
    stars: [
      [0.2, 0.8, 1.4], // Regulus
      [0.22, 0.55, 3.5],
      [0.3, 0.35, 2.0], // Algieba
      [0.25, 0.18, 3.4],
      [0.1, 0.12, 3.9],
      [0.0, 0.3, 3.0],
      [0.72, 0.72, 3.3], // Chertan
      [0.78, 0.45, 2.6], // Zosma
      [1.3, 0.62, 2.1], // Denebola
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [0, 6],
      [6, 8],
      [8, 7],
      [7, 2],
    ],
    label: [0, -6, 18],
  },
  {
    name: 'Gemini',
    w: 0.9,
    h: 1.1,
    stars: [
      [0.3, 0.0, 1.6], // Castor
      [0.55, 0.08, 1.1], // Pollux
      [0.25, 0.45, 3.0],
      [0.55, 0.5, 3.5],
      [0.2, 0.85, 2.9],
      [0.6, 0.9, 3.6],
      [0.1, 1.1, 1.9], // Alhena
    ],
    lines: [
      [0, 2],
      [2, 4],
      [4, 6],
      [1, 3],
      [3, 5],
      [0, 1],
    ],
    label: [1, 10, -6],
  },
  {
    name: 'Aquila',
    w: 0.9,
    h: 1,
    stars: [
      [0.5, 0.3, 0.8], // Altair
      [0.5, 0.18, 2.7],
      [0.52, 0.44, 3.7],
      [0.1, 0.5, 3.0],
      [0.9, 0.55, 3.4],
      [0.4, 1.0, 2.9],
    ],
    lines: [
      [1, 0],
      [0, 2],
      [0, 3],
      [0, 4],
      [3, 5],
      [4, 5],
    ],
    label: [0, 10, -6],
  },
];
