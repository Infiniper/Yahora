import { supabase } from '../../config/supabaseClient.js';

// 1. Fetch all Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const { userId } = req.params;

        // A. Fetch Profile (Joining courses and specializations to get the actual names)
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select(`
                *,
                course:courses(name),
                specialization:specializations(name)
            `)
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        // B. Fetch User's Listings
        const { data: listings, error: listingsError } = await supabase
            .from('products')
            .select('id, title, price, status, image_urls, created_at')
            .eq('seller_id', userId)
            .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;

        // C. Fetch User's Purchases
        const { data: purchases, error: purchasesError } = await supabase
            .from('purchases')
            .select(`
                id,
                created_at,
                product:products(id, title, price, image_urls)
            `)
            .eq('buyer_id', userId)
            .order('created_at', { ascending: false });

        if (purchasesError) throw purchasesError;

        // Send everything formatted perfectly for the frontend
        res.status(200).json({
            profile: {
                ...profile,
                courseName: profile.course?.name,
                specializationName: profile.specialization?.name
            },
            listings: listings || [],
            purchases: purchases || []
        });

    } catch (error) {
        console.error('Dashboard Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data.' });
    }
};

// 2. Update Profile Details
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body; 
        
        // This accepts any field sent from the frontend (e.g., { bio: "New bio" } or { avatar_url: "..." })
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            message: 'Profile updated successfully!',
            userProfile: data
        });

    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
};