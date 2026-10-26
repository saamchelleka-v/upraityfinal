import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Pin from './models/Pin.js';
import Portfolio from './models/Portfolio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const sampleUsers = [
  {
    name: 'Demo Creator',
    username: 'democreator',
    email: 'demo@pinterest.local',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Visual curator, UI/UX enthusiast & coffee connoisseur. Collecting inspirations from around the globe.',
  },
  {
    name: 'Sophia Martinez',
    username: 'sophiadesign',
    email: 'sophia@pinterest.local',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Architect & Interior stylist. Lover of clean lines, wabi-sabi aesthetics, and natural sunlight.',
  },
  {
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@pinterest.local',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Travel photographer exploring quiet corners of the world. Capturing mood and texture.',
  },
];

const samplePinsData = [
  {
    title: 'Nordic Minimalist Living Lounge',
    description: 'Soft neutral tones, bouclé textures, and warm oak accents in this Scandinavian-inspired apartment.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.5,
    destinationLink: 'https://nordicspaces.design',
    tags: ['interior', 'minimalist', 'architecture', 'nordic'],
    authorIndex: 1,
    likesCount: 142,
    savesCount: 68,
  },
  {
    title: 'Brutalist Concrete Pavilion in Kyoto',
    description: 'Dramatic geometry and concrete lightwells casting poetic shadows during golden hour in Japan.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.6,
    destinationLink: 'https://archdaily.com',
    tags: ['architecture', 'minimalist', 'japan', 'brutalism'],
    authorIndex: 1,
    likesCount: 230,
    savesCount: 114,
  },
  {
    title: 'Artisan Matcha Latte & Ceramic Ritual',
    description: 'Ceremonial grade matcha whisked to velvet foam in a handmade stoneware chawan.',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.33,
    destinationLink: 'https://teacraft.club',
    tags: ['culinary', 'minimalist', 'tea', 'aesthetic'],
    authorIndex: 0,
    likesCount: 89,
    savesCount: 42,
  },
  {
    title: 'Misty Alpine Ridge at Sunrise',
    description: 'Layers of morning fog rolling through the Italian Dolomites peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.45,
    destinationLink: 'https://alpineroads.io',
    tags: ['nature', 'travel', 'photography', 'mountains'],
    authorIndex: 2,
    likesCount: 380,
    savesCount: 195,
  },
  {
    title: 'Neon Tokyo Rain Reflection',
    description: 'Shinjuku nightlife gleaming through rain-slicked pavement and vibrant neon reflections.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.7,
    destinationLink: 'https://tokyonights.art',
    tags: ['cyberpunk', 'photography', 'travel', 'japan'],
    authorIndex: 2,
    likesCount: 512,
    savesCount: 280,
  },
  {
    title: 'Organic Modern Kitchen with Travertine Island',
    description: 'Fluted white oak cabinets, honed travertine stone countertops, and sculptural brass fixtures.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.4,
    destinationLink: 'https://dwellinginspo.com',
    tags: ['interior', 'architecture', 'kitchen', 'minimalist'],
    authorIndex: 1,
    likesCount: 175,
    savesCount: 92,
  },
  {
    title: 'Monochrome Editorial Fashion Portrait',
    description: 'High-contrast studio lighting capturing silhouette, drape, and timeless tailoring.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.5,
    destinationLink: 'https://voguemood.com',
    tags: ['fashion', 'photography', 'editorial', 'minimalist'],
    authorIndex: 0,
    likesCount: 204,
    savesCount: 77,
  },
  {
    title: 'Handcrafted Sourdough with Crispy Ear',
    description: '78% hydration country loaf baked in a cast iron dutch oven with open crumb texture.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.35,
    destinationLink: 'https://bakingjournal.com',
    tags: ['culinary', 'baking', 'aesthetic'],
    authorIndex: 0,
    likesCount: 165,
    savesCount: 88,
  },
  {
    title: 'Futuristic Curved Architecture in Valencia',
    description: 'Santiago Calatrava’s City of Arts and Sciences mirroring in shallow crystal pools.',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.55,
    destinationLink: 'https://spainarch.org',
    tags: ['architecture', 'travel', 'design'],
    authorIndex: 1,
    likesCount: 310,
    savesCount: 160,
  },
  {
    title: 'Emerald Forest Waterfall in Iceland',
    description: 'Glacial meltwater plunging into a moss-covered basalt canyon under soft overcast skies.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.6,
    destinationLink: 'https://icelandtravel.org',
    tags: ['nature', 'travel', 'photography'],
    authorIndex: 2,
    likesCount: 420,
    savesCount: 215,
  },
  {
    title: 'Clay Pot Ceramic Collection',
    description: 'Earthy terracotta vessels and hand-thrown ceramic vases catching morning side-light.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.4,
    destinationLink: 'https://clayandpottery.store',
    tags: ['minimalist', 'interior', 'aesthetic', 'art'],
    authorIndex: 0,
    likesCount: 133,
    savesCount: 54,
  },
  {
    title: 'Cozy Rain Day Coffee & Journaling',
    description: 'Warm latte, fountain pen, and raindrops trickling down the cafe glass window.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    aspectRatio: 1.5,
    destinationLink: 'https://journaldaily.me',
    tags: ['aesthetic', 'culinary', 'photography'],
    authorIndex: 0,
    likesCount: 260,
    savesCount: 140,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pinterest_clone';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding.');

    // Clear old data
    await Pin.deleteMany({});
    await Board.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing users, pins, and boards.');

    // Create users
    const createdUsers = [];
    for (const u of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = await User.create({
        ...u,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (@${user.username})`);
    }

    // Follow each other
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id);
    createdUsers[1].followers.push(createdUsers[0]._id);
    createdUsers[2].followers.push(createdUsers[0]._id);
    await createdUsers[0].save();
    await createdUsers[1].save();
    await createdUsers[2].save();

    // Create Boards
    const sampleBoards = [
      {
        name: 'Modern Architecture & Concrete',
        description: 'Striking lines, brutalist elements, and airy living spaces.',
        user: createdUsers[1]._id,
        isPrivate: false,
      },
      {
        name: 'Minimalist Interior Inspo',
        description: 'Spaces that breathe: neutral tones, natural wood, and uncluttered serenity.',
        user: createdUsers[0]._id,
        isPrivate: false,
      },
      {
        name: 'Wanderlust & Mood Landscapes',
        description: 'Breathtaking places around planet Earth caught in poetic light.',
        user: createdUsers[2]._id,
        isPrivate: false,
      },
    ];

    const createdBoards = await Board.insertMany(sampleBoards);
    console.log(`Created ${createdBoards.length} boards.`);

    // Create Pins
    const createdPins = [];
    for (const p of samplePinsData) {
      const author = createdUsers[p.authorIndex || 0];
      const pin = await Pin.create({
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        aspectRatio: p.aspectRatio,
        destinationLink: p.destinationLink,
        tags: p.tags,
        user: author._id,
        likes: [createdUsers[(p.authorIndex + 1) % 3]._id],
        savesCount: p.savesCount,
        comments: [
          {
            user: createdUsers[(p.authorIndex + 2) % 3]._id,
            text: 'Absolutely stunning composition and aesthetic!',
          },
        ],
      });
      createdPins.push(pin);

      // Add to appropriate board
      if (p.tags.includes('architecture') && createdBoards[0]) {
        createdBoards[0].pins.push(pin._id);
        if (!createdBoards[0].coverImage) createdBoards[0].coverImage = pin.imageUrl;
      } else if (p.tags.includes('interior') && createdBoards[1]) {
        createdBoards[1].pins.push(pin._id);
        if (!createdBoards[1].coverImage) createdBoards[1].coverImage = pin.imageUrl;
      } else if (p.tags.includes('travel') && createdBoards[2]) {
        createdBoards[2].pins.push(pin._id);
        if (!createdBoards[2].coverImage) createdBoards[2].coverImage = pin.imageUrl;
      }
    }

    // Save boards
    for (const b of createdBoards) {
      await b.save();
    }

    // Demo creator saves first 4 pins
    createdUsers[0].savedPins = [createdPins[0]._id, createdPins[1]._id, createdPins[3]._id, createdPins[4]._id];
    await createdUsers[0].save();

    console.log(`✅ Successfully seeded ${createdPins.length} pins with tags, comments, and boards!`);

    // Seed Portfolio items from portfolioData.json
    const portfolioJsonPath = path.resolve(__dirname, './data/portfolioData.json');
    if (fs.existsSync(portfolioJsonPath)) {
      const portfolioItems = JSON.parse(fs.readFileSync(portfolioJsonPath, 'utf8'));
      await Portfolio.deleteMany({});
      await Portfolio.insertMany(portfolioItems);
      console.log(`✅ Successfully seeded ${portfolioItems.length} portfolio items from /gallery!`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedDatabase();
