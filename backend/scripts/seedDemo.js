import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const DEMO_DOMAIN = 'demo.yahora.com';
const DEMO_UNI_NAME = 'Yahora University (Demo)';

const makeImg = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/700`;

const DUMMY_USERS = [
  { email: 'rahul.senior@demo.yahora.com', name: 'Rahul Sharma', role: 'B.Tech CSE, Final Year', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  { email: 'priya.alumni@demo.yahora.com', name: 'Priya Verma', role: 'MBA Graduate', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { email: 'amit.tech@demo.yahora.com', name: 'Amit Gupta', role: 'M.Tech Electronics', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80' },
  { email: 'sarah.design@demo.yahora.com', name: 'Sarah Khan', role: 'B.Des 2nd Year', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
  { email: 'nikhil.dev@demo.yahora.com', name: 'Nikhil Bansal', role: 'B.Tech AI & DS', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { email: 'meera.hostel@demo.yahora.com', name: 'Meera Joshi', role: 'B.Tech ECE', avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=150&q=80' },
  { email: 'arjun.campus@demo.yahora.com', name: 'Arjun Singh', role: 'B.Tech IT', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
  { email: 'ananya.books@demo.yahora.com', name: 'Ananya Roy', role: 'B.Sc Mathematics', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=150&q=80' },
  { email: 'karthik.mech@demo.yahora.com', name: 'Karthik Reddy', role: 'B.Tech Mechanical', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { email: 'tanya.creative@demo.yahora.com', name: 'Tanya Singh', role: 'BBA 3rd Year', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { email: 'rohan.cycles@demo.yahora.com', name: 'Rohan Patel', role: 'Diploma Student', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
  { email: 'isha.hostel@demo.yahora.com', name: 'Isha Malhotra', role: 'B.Tech Civil', avatar: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?auto=format&fit=crop&w=150&q=80' },
  { email: 'vedant.gaming@demo.yahora.com', name: 'Vedant Soni', role: 'B.Tech CSE', avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=150&q=80' },
  { email: 'pallavi.sports@demo.yahora.com', name: 'Pallavi Jain', role: 'BCA Final Year', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
  { email: 'devansh.startup@demo.yahora.com', name: 'Devansh Agarwal', role: 'B.Tech IT', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
  { email: 'nisha.uiux@demo.yahora.com', name: 'Nisha Mehta', role: 'B.Des Final Year', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=150&q=80' },
];

const DUMMY_PRODUCTS = [
  { title: 'MacBook Air M1 (Mint Condition)', price: 45000, category: 'Electronics', condition: 'Like New', status: 'available', desc: 'Used for coding and assignments. Battery health is excellent. Comes with original charger and box.', img: makeImg('macbook-air-m1') },
  { title: 'Dell XPS 13 Laptop', price: 52000, category: 'Electronics', condition: 'Good', status: 'reserved', desc: 'Premium ultrabook for design and development work. Very light and powerful.', img: makeImg('dell-xps-13') },
  { title: 'Apple iPad 10th Gen', price: 28000, category: 'Electronics', condition: 'Like New', status: 'sold', desc: 'Great for note-taking, sketches, and presentations. Pencil can be added separately.', img: makeImg('ipad-10th-gen') },
  { title: 'Bluetooth Speaker JBL Charge 5', price: 9000, category: 'Electronics', condition: 'Like New', status: 'available', desc: 'Powerful speaker with deep bass. Great for hostel events and gatherings.', img: makeImg('jbl-charge-5') },
  { title: 'Gaming Keyboard RGB', price: 1600, category: 'Electronics', condition: 'Good', status: 'available', desc: 'Mechanical-feel RGB keyboard with excellent key response.', img: makeImg('gaming-keyboard-rgb') },
  { title: 'Logitech Wireless Mouse', price: 700, category: 'Accessories', condition: 'Like New', status: 'sold', desc: 'Smooth performance, ideal for coding, presentations, and daily use.', img: makeImg('logitech-wireless-mouse') },

  { title: 'IKEA Study Table (White)', price: 1200, category: 'Furniture', condition: 'Good', status: 'available', desc: 'Sturdy table ideal for hostel rooms. Minor marks from daily use.', img: makeImg('ikea-study-table-white') },
  { title: 'Ergonomic Office Chair', price: 2000, category: 'Furniture', condition: 'Like New', status: 'reserved', desc: 'Excellent back support for long study sessions and project work.', img: makeImg('ergonomic-office-chair') },
  { title: 'Shoe Rack for Hostel Room', price: 900, category: 'Furniture', condition: 'Good', status: 'available', desc: 'Compact and durable shoe rack with multiple shelves.', img: makeImg('shoe-rack-hostel') },
  { title: 'Whiteboard with Markers', price: 550, category: 'Study Tools', condition: 'Good', status: 'available', desc: 'Great for room study planning, to-do lists, and revision.', img: makeImg('whiteboard-markers') },
  { title: 'Study Lamp with USB Port', price: 450, category: 'Hostel Essentials', condition: 'Like New', status: 'available', desc: 'Bright LED lamp with adjustable neck and phone charging port.', img: makeImg('study-lamp-usb') },
  { title: 'Winter Blanket Set', price: 1100, category: 'Hostel Essentials', condition: 'Good', status: 'reserved', desc: 'Warm and soft blanket set perfect for hostel life.', img: makeImg('winter-blanket-set') },
  { title: 'Mattress and Pillow Combo', price: 1800, category: 'Hostel Essentials', condition: 'Good', status: 'sold', desc: 'Comfortable single bed mattress with matching pillow. Clean and well kept.', img: makeImg('mattress-pillow-combo') },
  { title: 'Mini Fridge (45L)', price: 3000, category: 'Appliances', condition: 'Good', status: 'available', desc: 'Perfect for hostel rooms. Cleaned, defrosted, and ready to use.', img: makeImg('mini-fridge-45l') },
  { title: 'Fan Regulator + Extension Board', price: 250, category: 'Hostel Essentials', condition: 'Good', status: 'available', desc: 'Useful hostel utility combo item for everyday convenience.', img: makeImg('fan-regulator-extension-board') },

  { title: 'Casio fx-991EX Scientific Calculator', price: 600, category: 'Academics', condition: 'Good', status: 'available', desc: 'Fully functional calculator used for engineering math and exams.', img: makeImg('casio-fx-991ex') },
  { title: 'Bulk Book Set: CSE Semester 4', price: 1400, category: 'Academics', condition: 'Fair', status: 'reserved', desc: 'Bundle of core semester books at a student-friendly price.', img: makeImg('cse-semester-4-book-set') },
  { title: 'Data Structures & Algorithms in C++', price: 350, category: 'Academics', condition: 'Good', status: 'sold', desc: 'Classic CS textbook with a few highlighted pages, still very readable.', img: makeImg('dsa-in-cpp') },
  { title: 'Physics Lab Coat', price: 300, category: 'Academics', condition: 'Good', status: 'available', desc: 'White lab coat used for practicals. Clean and in good condition.', img: makeImg('physics-lab-coat') },
  { title: 'Bulk Notes: AI & DS Core Subjects', price: 500, category: 'Academics', condition: 'Fair', status: 'available', desc: 'Handwritten and printed notes for important subjects in one bundle.', img: makeImg('ai-ds-core-notes') },

  { title: 'Firefox Geared Bicycle', price: 4500, category: 'Vehicles', condition: 'Fair', status: 'available', desc: 'Perfect for campus travel. A little chain oil needed, otherwise rides well.', img: makeImg('firefox-geared-bicycle') },
  { title: 'Helmet for Bike / Cycle', price: 500, category: 'Vehicles', condition: 'Good', status: 'sold', desc: 'Safe and comfortable helmet for daily campus commuting.', img: makeImg('bike-cycle-helmet') },
  { title: 'Cycle Chain Lock', price: 350, category: 'Vehicles', condition: 'Like New', status: 'available', desc: 'Strong lock for securing cycles in hostel parking areas.', img: makeImg('cycle-chain-lock') },

  { title: 'Yamaha F310 Acoustic Guitar', price: 5000, category: 'Hobbies', condition: 'Good', status: 'available', desc: 'Used for campus fests and practice sessions. Comes with padded carry bag.', img: makeImg('yamaha-f310-guitar') },
  { title: 'Sketchbook and Art Supplies Kit', price: 800, category: 'Creative', condition: 'Like New', status: 'reserved', desc: 'Ideal for design and art students. Includes pens, markers, and notebooks.', img: makeImg('sketchbook-art-supplies-kit') },
  { title: 'Tripod Stand for Camera / Phone', price: 650, category: 'Accessories', condition: 'Good', status: 'available', desc: 'Useful for content creation, presentations, and project recordings.', img: makeImg('tripod-stand') },
  { title: 'Logitech Webcam HD', price: 2200, category: 'Accessories', condition: 'Like New', status: 'available', desc: 'Great for online classes, interviews, and portfolio recordings.', img: makeImg('logitech-webcam-hd') },
  { title: 'Bulk Stationery Set', price: 420, category: 'Study Tools', condition: 'Good', status: 'sold', desc: 'Pens, highlighters, sticky notes, and folders bundled together.', img: makeImg('bulk-stationery-set') },
  { title: 'Desk Organizer + Pen Stand', price: 280, category: 'Study Tools', condition: 'Like New', status: 'available', desc: 'Keeps the study desk neat and tidy with multiple sections.', img: makeImg('desk-organizer-pen-stand') },
  { title: 'Portable Laundry Basket', price: 260, category: 'Hostel Essentials', condition: 'Good', status: 'available', desc: 'Lightweight basket for hostel room laundry and storage.', img: makeImg('portable-laundry-basket') },
  { title: 'Electric Kettle 1.5L', price: 750, category: 'Appliances', condition: 'Good', status: 'reserved', desc: 'Handy kettle for tea, coffee, and quick instant meals.', img: makeImg('electric-kettle') },
  { title: 'Board Game Set for Hostel Nights', price: 999, category: 'Hobbies', condition: 'Like New', status: 'available', desc: 'A fun set for group hangouts, farewell nights, and breaks.', img: makeImg('board-game-set') },
  { title: 'Sports T-Shirt Bundle', price: 650, category: 'Sports', condition: 'Fair', status: 'available', desc: 'Set of athletic T-shirts ideal for sports day and campus events.', img: makeImg('sports-tshirt-bundle') },
  { title: 'Umbrella and Raincoat Combo', price: 320, category: 'Hostel Essentials', condition: 'Good', status: 'sold', desc: 'Useful rainy-season combo for hostel students.', img: makeImg('umbrella-raincoat-combo') },
  { title: 'Power Bank 20000mAh', price: 1500, category: 'Electronics', condition: 'Good', status: 'available', desc: 'Long backup power bank for phones and tablets. Great for campus use.', img: makeImg('power-bank-20000mah') },
  { title: 'Ceramic Mug Set', price: 240, category: 'Hostel Essentials', condition: 'Like New', status: 'available', desc: 'Clean mug set for hostel rooms and quick beverage use.', img: makeImg('ceramic-mug-set') },
];

const DUMMY_POSTS = [
  'Just submitted my final year project. Freedom feels real now 🎉',
  'Tip for sellers: clear photos and honest condition details help listings sell faster.',
  'Anyone selling a decent second-hand bicycle near the hostel gate?',
  'Need a lab coat urgently for tomorrow’s practical. Please DM if available.',
  'Small reminder: mark your items as Sold once the deal is done.',
  'The campus marketplace feels so much better when everything is verified and local.',
  'Looking for a scientific calculator in good condition. Budget friendly only.',
  'If you are moving out, post your furniture early so juniors can buy in time.',
  'Got my hostel room set up almost entirely through reused items. Saved a lot.',
  'Selling a mini fridge and study table bundle. Great for a fresh hostel room setup.',
  'Any design students interested in a sketchbook and art supplies combo?',
  'This is exactly the kind of campus-only marketplace we needed.',
  'The best part is seeing only students from my own college in the feed.',
  'Reserved items should stay visible so buyers know what has already moved.',
  'Campus resale is honestly the easiest way to save money during semester changes.'
];

async function maybeSingle(query) {
  const { data, error } = await query.maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function getAuthUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data?.users?.find((u) => u.email === email) ?? null;
}

async function getOrCreateAuthUser(user) {
  const existing = await getAuthUserByEmail(user.email);
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: 'Password123!',
    email_confirm: true,
    user_metadata: { full_name: user.name },
  });

  if (error) {
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return await getAuthUserByEmail(user.email);
    }
    throw error;
  }

  return data.user;
}

async function upsertDemoProduct(product, universityId, sellerId) {
  const existing = await maybeSingle(
    supabase.from('products').select('id, image_urls').eq('title', product.title)
  );

  const payload = {
    seller_id: sellerId,
    university_id: universityId,
    title: product.title,
    description: product.desc,
    price: product.price,
    category: product.category,
    condition: product.condition,
    image_urls: [product.img],
    status: product.status,
    likes_count: Math.floor(Math.random() * 70) + 5,
  };

  if (!existing) {
    const { error } = await supabase.from('products').insert([payload]);
    if (error) throw error;
    return;
  }

  const currentImages = Array.isArray(existing.image_urls) ? existing.image_urls : [];
  const needsImageFix = currentImages.length === 0 || !currentImages[0];

  const { error } = await supabase
    .from('products')
    .update(needsImageFix ? payload : { ...payload, image_urls: currentImages })
    .eq('id', existing.id);

  if (error) throw error;
}

async function upsertDemoPost(content, universityId, authorId) {
  const existing = await maybeSingle(
    supabase.from('posts').select('id').eq('content', content)
  );

  if (!existing) {
    const { error } = await supabase.from('posts').insert([{
      author_id: authorId,
      university_id: universityId,
      content,
    }]);
    if (error) throw error;
  }
}

async function seedSandbox() {
  console.log('🌱 Starting Yahora sandbox seed...');

  try {
    const uniData = await maybeSingle(
      supabase.from('universities').select('id').eq('domain', DEMO_DOMAIN)
    );

    let demoUniId = uniData?.id;

    if (!demoUniId) {
      console.log('🏫 Creating demo university...');
      const { data: newUni, error: uniErr } = await supabase
        .from('universities')
        .insert([{ name: DEMO_UNI_NAME, domain: DEMO_DOMAIN }])
        .select('id')
        .single();

      if (uniErr) throw uniErr;
      demoUniId = newUni.id;
    } else {
      console.log('✅ Demo university already exists.');
    }

    const userIds = [];

    console.log(`👥 Seeding ${DUMMY_USERS.length} demo users...`);
    for (const u of DUMMY_USERS) {
      const authUser = await getOrCreateAuthUser(u);
      if (!authUser?.id) continue;

      const { error: profileErr } = await supabase.from('users').upsert(
        {
          id: authUser.id,
          university_id: demoUniId,
          full_name: u.name,
          avatar_url: u.avatar,
          qualification: u.role,
        },
        { onConflict: 'id' }
      );

      if (profileErr) throw profileErr;
      userIds.push(authUser.id);
    }

    console.log(`🛍️ Seeding ${DUMMY_PRODUCTS.length} demo products...`);
    for (let i = 0; i < DUMMY_PRODUCTS.length; i++) {
      const product = DUMMY_PRODUCTS[i];
      const sellerId = userIds[i % userIds.length];
      await upsertDemoProduct(product, demoUniId, sellerId);
    }

    console.log(`💬 Seeding ${DUMMY_POSTS.length} community posts...`);
    for (let i = 0; i < DUMMY_POSTS.length; i++) {
      const content = DUMMY_POSTS[i];
      const authorId = userIds[(i + 2) % userIds.length];
      await upsertDemoPost(content, demoUniId, authorId);
    }

    console.log('🎉 Demo seeding completed successfully.');
    console.log(`University: ${DEMO_UNI_NAME}`);
    console.log(`Users added: ${DUMMY_USERS.length}`);
    console.log(`Products added: ${DUMMY_PRODUCTS.length}`);
    console.log(`Posts added: ${DUMMY_POSTS.length}`);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    if (err.details) console.error('Details:', err.details);
    if (err.hint) console.error('Hint:', err.hint);
    if (err.code) console.error('Code:', err.code);
  }
}

seedSandbox();