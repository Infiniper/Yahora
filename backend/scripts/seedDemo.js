// backend/scripts/seedDemo.js
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
];

const DUMMY_PRODUCTS = [
  { title: 'MacBook Air M1 (Mint Condition)', price: 45000, category: 'Electronics', condition: 'Like New', desc: 'Used for coding and assignments. Battery health is excellent. Comes with original charger and box.', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { title: 'Dell XPS 13 Laptop', price: 52000, category: 'Electronics', condition: 'Good', desc: 'Premium ultrabook for design and development work. Very light and powerful.', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
  { title: 'IKEA Study Table (White)', price: 1200, category: 'Furniture', condition: 'Good', desc: 'Sturdy table ideal for hostel rooms. Minor marks from daily use.', img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
  { title: 'Ergonomic Office Chair', price: 2000, category: 'Furniture', condition: 'Like New', desc: 'Excellent back support for long study sessions and project work.', img: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80' },
  { title: 'Firefox Geared Bicycle', price: 4500, category: 'Vehicles', condition: 'Fair', desc: 'Perfect for campus travel. A little chain oil needed, otherwise rides well.', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { title: 'Casio fx-991EX Scientific Calculator', price: 600, category: 'Academics', condition: 'Good', desc: 'Fully functional calculator used for engineering math and exams.', img: 'https://images.unsplash.com/photo-1611078485603-9e1262ab0b03?auto=format&fit=crop&w=800&q=80' },
  { title: 'Data Structures & Algorithms in C++', price: 350, category: 'Academics', condition: 'Good', desc: 'Classic CS textbook with a few highlighted pages, still very readable.', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80' },
  { title: 'Apple iPad 10th Gen', price: 28000, category: 'Electronics', condition: 'Like New', desc: 'Great for note-taking, sketches, and presentations. Pencil can be added separately.', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
  { title: 'Yamaha F310 Acoustic Guitar', price: 5000, category: 'Hobbies', condition: 'Good', desc: 'Used for campus fests and practice sessions. Comes with padded carry bag.', img: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80' },
  { title: 'Mini Fridge (45L)', price: 3000, category: 'Appliances', condition: 'Good', desc: 'Perfect for hostel rooms. Cleaned, defrosted, and ready to use.', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80' },
  { title: 'Study Lamp with USB Port', price: 450, category: 'Hostel Essentials', condition: 'Like New', desc: 'Bright LED lamp with adjustable neck and phone charging port.', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { title: 'Mattress and Pillow Combo', price: 1800, category: 'Hostel Essentials', condition: 'Good', desc: 'Comfortable single bed mattress with matching pillow. Clean and well kept.', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
  { title: 'Bluetooth Speaker JBL Charge 5', price: 9000, category: 'Electronics', condition: 'Like New', desc: 'Powerful speaker with deep bass. Great for hostel events and gatherings.', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80' },
  { title: 'Physics Lab Coat', price: 300, category: 'Academics', condition: 'Good', desc: 'White lab coat used for practicals. Clean and in good condition.', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Logitech Wireless Mouse', price: 700, category: 'Accessories', condition: 'Like New', desc: 'Smooth performance, ideal for coding, presentations, and daily use.', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c2b6e?auto=format&fit=crop&w=800&q=80' },
  { title: 'Bulk Book Set: CSE Semester 4', price: 1400, category: 'Academics', condition: 'Fair', desc: 'Bundle of core semester books at a student-friendly price.', img: 'https://images.unsplash.com/photo-1455885666463-6f8c6d3f7f8a?auto=format&fit=crop&w=800&q=80' },
  { title: 'Tripod Stand for Camera / Phone', price: 650, category: 'Accessories', condition: 'Good', desc: 'Useful for content creation, presentations, and project recordings.', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
  { title: 'Shoe Rack for Hostel Room', price: 900, category: 'Furniture', condition: 'Good', desc: 'Compact and durable shoe rack with multiple shelves.', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { title: 'Fan Regulator + Extension Board', price: 250, category: 'Hostel Essentials', condition: 'Good', desc: 'Useful hostel utility combo item for everyday convenience.', img: 'https://images.unsplash.com/photo-1615224143859-5b0b4f1f80cb?auto=format&fit=crop&w=800&q=80' },
  { title: 'Sketchbook and Art Supplies Kit', price: 800, category: 'Creative', condition: 'Like New', desc: 'Ideal for design and art students. Includes pens, markers, and notebooks.', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
  { title: 'Gaming Keyboard RGB', price: 1600, category: 'Electronics', condition: 'Good', desc: 'Mechanical-feel RGB keyboard with excellent key response.', img: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80' },
  { title: 'Helmet for Bike / Cycle', price: 500, category: 'Vehicles', condition: 'Good', desc: 'Safe and comfortable helmet for daily campus commuting.', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
  { title: 'Whiteboard with Markers', price: 550, category: 'Study Tools', condition: 'Good', desc: 'Great for room study planning, to-do lists, and revision.', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
  { title: 'Winter Blanket Set', price: 1100, category: 'Hostel Essentials', condition: 'Good', desc: 'Warm and soft blanket set perfect for hostel life.', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80' },
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
  'This is exactly the kind of campus-only marketplace we needed.'
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
    if (
      error.message?.toLowerCase().includes('already registered') ||
      error.message?.toLowerCase().includes('already exists')
    ) {
      return await getAuthUserByEmail(user.email);
    }
    throw error;
  }

  return data.user;
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
          bio: u.role,
          is_profile_complete: true,
        },
        { onConflict: 'id' }
      );

      if (profileErr) throw profileErr;
      userIds.push(authUser.id);
    }

    console.log(`🛍️ Seeding ${DUMMY_PRODUCTS.length} demo products...`);
    for (let i = 0; i < DUMMY_PRODUCTS.length; i++) {
      const p = DUMMY_PRODUCTS[i];
      const sellerId = userIds[i % userIds.length];

      const exists = await maybeSingle(
        supabase.from('products').select('id').eq('title', p.title)
      );

      if (!exists) {
        const { error: prodErr } = await supabase.from('products').insert([{
          seller_id: sellerId,
          university_id: demoUniId,
          title: p.title,
          description: p.desc,
          price: p.price,
          category: p.category,
          condition: p.condition,
          image_urls: [p.img],
          status: 'available',
          location: 'Campus Main Gate',
          views: Math.floor(Math.random() * 400) + 20,
          likes_count: Math.floor(Math.random() * 70) + 5,
        }]);

        if (prodErr) throw prodErr;
      }
    }

    console.log(`💬 Seeding ${DUMMY_POSTS.length} community posts...`);
    for (let i = 0; i < DUMMY_POSTS.length; i++) {
      const content = DUMMY_POSTS[i];
      const authorId = userIds[(i + 2) % userIds.length];

      const exists = await maybeSingle(
        supabase.from('posts').select('id').eq('content', content)
      );

      if (!exists) {
        const { error: postErr } = await supabase.from('posts').insert([{
          author_id: authorId,
          university_id: demoUniId,
          content,
        }]);

        if (postErr) throw postErr;
      }
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