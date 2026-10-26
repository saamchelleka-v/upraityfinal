export interface ExperimentItem {
  id: string;
  title: string;
  studyNumber: string;
  material: string;
  description: string;
  status: string;
  image: string;
  extendedNotes?: string;
}

export const EXPERIMENTS_DATA: ExperimentItem[] = [
  {
    id: 'exp-01',
    title: 'Monolithic Cleft Finishes in Absolute Black Granite',
    studyNumber: 'EXP · 2024 / 01',
    material: 'African Nero Impala & Flamed Slate',
    description: 'Investigating high-contrast textures by juxtaposing mirror-honed faces with raw, hand-split rock borders that catch low cemetery sunlight.',
    status: 'Completed Prototype',
    image: '/gallery/20170711_122547.jpg',
    extendedNotes: 'Prototypes demonstrate that combining 600-grit honed inscriptions with hand-pitched rock edges reduces water pooling while maximizing letter contrast under overcast winter skies.',
  },
  {
    id: 'exp-02',
    title: 'Deep Shadow Relief Carvings & Micro-Stippling',
    studyNumber: 'EXP · 2024 / 02',
    material: 'Carrara Statuario & 23.5k Leaf',
    description: '3D shadow profiling that uses natural atmospheric angles rather than high-contrast enamels to define legible letterforms in overcast lighting.',
    status: 'In Workshop Review',
    image: '/gallery/20180527_153653.jpg',
    extendedNotes: 'By graduating the undercut depth from 8mm at the apex to 3mm at the baseline, character legibility increases by 40% without requiring artificial pigment infill.',
  },
  {
    id: 'exp-03',
    title: 'Biophilic Inset Terrariums for Full Kerb Enclosures',
    studyNumber: 'EXP · 2024 / 03',
    material: 'Welsh Heather Slate & Native Mosses',
    description: 'Enclosing sustainable, perennial micro-flora within reinforced stone kerb beds with integrated sub-drainage gravel reservoirs.',
    status: 'Field Testing',
    image: '/gallery/data-9-7-2021-3318.jpg',
    extendedNotes: 'Constructed with concealed bronze drainage weeps that cycle natural rainfall through crushed granite aggregate beds to sustain low-maintenance moss and alpine sedum.',
  },
  {
    id: 'exp-04',
    title: 'Precision Micro-Piercing for Modern Architectural Monuments',
    studyNumber: 'EXP · 2023 / 04',
    material: 'Swedish Imperial Red Granite',
    description: 'Laser-guided negative space apertures that allow dawn light to illuminate personalized commemorative poems on the back surface of the headstone.',
    status: 'Bespoke Commission Only',
    image: '/gallery/data-9-7-2021-4928.jpg',
    extendedNotes: 'Explores how natural daylight passes through calibrated negative space apertures to cast sharp solar silhouettes across the grave ledger at sunrise.',
  },
];
