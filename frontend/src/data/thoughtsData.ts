export interface ThoughtArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content?: string[];
}

export const THOUGHTS_DATA: ThoughtArticle[] = [
  {
    slug: 'permanence-of-welsh-slate',
    title: 'The Permanence of Welsh Slate & Carrara Marble',
    excerpt: 'Examining two centuries of weathering in humid churchyards: why fine-grained slate preserves sharp V-cut lettering longer than any synthetic composite.',
    category: 'Material Study',
    date: 'Autumn 2024',
    readTime: '4 min read',
    image: '/gallery/2400.jpg',
    content: [
      'In the humid churchyards of Britain and continental Europe, stone tells the unvarnished truth of time. When inspecting memorials erected in the early 19th century, one material unfailingly retains the crisp, razor-sharp edge of the stonemason’s chisel: Welsh slate.',
      'Unlike porous sedimentary sandstones or synthetic composites that blister under winter freeze-thaw cycles, fine-grained slate possesses a dense geological cleavage plane. Rainwater cannot penetrate its microscopic structure.',
      'Alongside slate, Carrara marble offers a warmth and sculptural translucency prized across four centuries of monumental art. When carved with traditional rounded serifs and protected with a slight chamfered wash, marble develops an irreplaceable antique patina that breathes with dignity.',
      'At Upraity And Son, every quarry slab is inspected by eye and sound. A light strike of the hammer reveals hidden fissures before a single inscription begins.',
    ],
  },
  {
    slug: 'roman-inscriptions-golden-proportion',
    title: 'Roman Inscriptions and the Golden Proportion',
    excerpt: 'The Trajan column taught stonemasons that beauty in stone is not decoration, but the negative space carved between serifs and letter stems.',
    category: 'Typography & Lettering',
    date: 'Summer 2024',
    readTime: '6 min read',
    image: '/gallery/data-9-7-2021-6701.jpg',
    content: [
      'When carving commemorative inscriptions into polished stone, computer fonts and automated vinyl cutters flatten character dignity into monotonous vectors.',
      'The classical Roman letterform—mastered at the base of the Trajan Column in 113 AD—was conceived specifically for the medium of light and shadow. The mason cuts a true V-groove at exactly 45 to 60 degrees.',
      'As the sun travels across the cemetery throughout the morning and afternoon, the changing cast shadow creates an animated legibility that no surface paint can duplicate.',
      'We calculate every kerning distance by hand, spacing vowels and ascenders according to classical optical balance rather than mechanical grid spacing.',
    ],
  },
  {
    slug: 'foundations-the-invisible-soul',
    title: 'Why Reinforced Piers Are the Invisible Soul of a Memorial',
    excerpt: 'When a headstone tilts forty years after dedication, the stone didn’t fail — the sub-surface foundation did. How our multi-tier ground leveling protects the grave.',
    category: 'Engineering & Groundwork',
    date: 'Spring 2024',
    readTime: '5 min read',
    image: '/gallery/20170711_122547.jpg',
    content: [
      'The true longevity of any monument is decided six feet below the surface. Over decades, subsoil water tables shift, tree roots expand, and ground settlement threatens the vertical alignment of monolithic stonework.',
      'When an upright headstone tilts twenty or fifty years after dedication, it is rarely a failure of the stone slab itself. The failure occurred beneath the turf: shallow precast slabs laid directly on topsoil without sub-piers.',
      'Upraity And Son utilizes a reinforced subterranean anchor system conforming to strict NAMM and BRAMM structural standards. Ground dowels forged from marine-grade 316 stainless steel join the headstone, base, and subterranean concrete pier.',
      'We level every installation using dual-axis laser verification, ensuring the memorial stands plumb for generations.',
    ],
  },
  {
    slug: 'gold-leaf-against-one-hundred-winters',
    title: '23.5-Carat English Gold Leaf Against One Hundred Winters',
    excerpt: 'Synthetic paints blister under UV frost. Genuine hand-beaten gold leaf forms a micro-molecular bond with stone that reflects light for a lifetime.',
    category: 'Craftsmanship',
    date: 'Winter 2023',
    readTime: '3 min read',
    image: '/gallery/data-9-7-2021-4928.jpg',
    content: [
      'Enamel paints and synthetic metallic lacquers begin oxidizing within three to seven years under open rain, atmospheric soot, and direct UV radiation.',
      'Pure gold, by physical nature, is chemically inert. It does not tarnish, rust, or dissolve in rainwater.',
      'Our gilding process relies upon 23.5-carat English double-weight transfer gold leaf, beaten to a fraction of a micron. After carving the V-groove incision, three coats of slow-drying oil gold size are hand-brushed into the stone tooth.',
      'At the precise moment of tackiness—known by the artisan by the whisper of the sable brush—the gold leaf is laid and burnished with cotton velvet.',
    ],
  },
  {
    slug: 'the-slow-hammer',
    title: 'The Slow Hammer: Hand Finishing in an Age of Automated CNC',
    excerpt: 'A CNC router cuts coordinates; a master mason reads the natural grain, soft inclusions, and bedding plane of raw quarried blocks.',
    category: 'Philosophy',
    date: 'Autumn 2023',
    readTime: '5 min read',
    image: '/gallery/20180527_153653.jpg',
    content: [
      'Modern industrial stonework is dominated by automated diamond wire saws and 5-axis computer numerical control (CNC) mills. While efficient for commercial floor tiling, algorithmic cutting ignores the living character of natural stone.',
      'A machine cuts blind to mineral inclusions and bedding planes. A master stonemason, however, reads the stone before striking: tapping the surface, feeling the humidity in the quarry skin, and adjusting hammer angle by micro-fractions.',
      'Hand-finishing imparts a subtle tactile texture that catches ambient cemetery light with warmth rather than sterile glass-like reflection.',
      'At Upraity And Son, four generations of family hands have held the chisel. That continuous physical muscle memory is embedded in every finished monument.',
    ],
  },
];
