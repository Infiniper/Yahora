// backend/src/modules/product/products.controller.js
import { supabase } from '../../config/supabaseClient.js';

export const createProduct = async (req, res) => {
    try {
        const { seller_id, title, description, price, category, location, condition } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required.' });
        }
        if (!title || !price || !category) {
            return res.status(400).json({ error: 'Title, price, and category are required.' });
        }

        // 1. Securely fetch the user's university_id to enforce multi-tenant isolation
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('university_id')
            .eq('id', seller_id)
            .single();

        if (userError || !user) throw new Error('Seller not found.');
        const university_id = user.university_id;

        // 2. Upload multiple images to Supabase 'products' bucket
        const imageUrls = [];
        for (const file of files) {
            const fileExt = file.originalname.split('.').pop();
            // Create a unique filename: sellerId-timestamp-randomString.ext
            const fileName = `${seller_id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            imageUrls.push(publicUrl);
        }

        // 3. Insert the new product into the database
        const { data: product, error: insertError } = await supabase
            .from('products')
            .insert([{
                seller_id,
                university_id,
                title,
                description,
                price: Number(price),
                category,
                location,  
                condition, 
                image_urls: imageUrls,
                status: 'available'
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        res.status(201).json({
            message: 'Product listed successfully!',
            product
        });

    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ error: 'Failed to create product listing.' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, condition, status, location } = req.body;

        // Update the product in the database
        const { data, error } = await supabase
            .from('products')
            .update({ 
                title, 
                description, 
                price: Number(price),
                category, 
                location,
                condition, 
                status 
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            message: 'Product updated successfully',
            product: data
        });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ error: 'Failed to update product.' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the product from the database
        // Note: For a production app, you might also want to delete the images from the Supabase storage bucket here to save space.
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { university_id, user_id } = req.query;

        if (!university_id) {
            return res.status(400).json({ error: 'university_id query parameter is required.' });
        }

        // 1. Fetch products for the requested campus
        const { data: products, error } = await supabase
            .from('products')
            .select(`
                *,
                seller:users!seller_id(id, full_name, avatar_url)
            `)
            .eq('university_id', university_id)
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. If a user is logged in, attach their specific 'liked' and 'saved' statuses
        if (user_id && products.length > 0) {
            const productIds = products.map(p => p.id);
            
            // Run both queries in parallel for performance
            const [likesRes, savesRes] = await Promise.all([
                supabase.from('product_likes').select('product_id').eq('user_id', user_id).in('product_id', productIds),
                supabase.from('product_saves').select('product_id').eq('user_id', user_id).in('product_id', productIds)
            ]);

            // Convert to Sets for instant O(1) lookups
            const likedSet = new Set(likesRes.data?.map(l => l.product_id) || []);
            const savedSet = new Set(savesRes.data?.map(s => s.product_id) || []);

            products.forEach(p => {
                p.is_liked = likedSet.has(p.id);
                p.is_saved = savedSet.has(p.id);
            });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ error: 'Failed to fetch marketplace feed.' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: product, error } = await supabase
            .from('products')
            .select(`
                *,
                seller:users!seller_id(id, full_name, avatar_url, department, year_of_study)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        
        // Optional: Increment view count every time a product is opened
        await supabase.rpc('increment_product_views', { p_id: id });

        res.status(200).json({ product });
    } catch (error) {
        console.error('Get Product By ID Error:', error);
        res.status(500).json({ error: 'Failed to fetch product details.' });
    }
};

export const toggleLikeProduct = async (req, res) => {
    try {
        const { id: product_id } = req.params;
        const { user_id } = req.body; 

        const { data: existingLike } = await supabase
            .from('product_likes')
            .select('*')
            .eq('user_id', user_id)
            .eq('product_id', product_id)
            .single();

        if (existingLike) {
            // Deleting the row will now AUTOMATICALLY fire the trigger and decrement the count!
            await supabase.from('product_likes').delete().match({ user_id, product_id });
            res.status(200).json({ message: 'Product unliked', is_liked: false });
        } else {
            // Inserting the row will now AUTOMATICALLY fire the trigger and increment the count!
            await supabase.from('product_likes').insert([{ user_id, product_id }]);
            res.status(200).json({ message: 'Product liked', is_liked: true });
        }
    } catch (error) {
        console.error('Toggle Like Error:', error);
        res.status(500).json({ error: 'Failed to toggle like status.' });
    }
};

export const toggleSaveProduct = async (req, res) => {
    try {
        const { id: product_id } = req.params;
        const { user_id } = req.body; 

        const { data: existingSave } = await supabase
            .from('product_saves')
            .select('*')
            .eq('user_id', user_id)
            .eq('product_id', product_id)
            .single();

        if (existingSave) {
            await supabase.from('product_saves').delete().match({ user_id, product_id });
            res.status(200).json({ message: 'Product removed from wishlist', is_saved: false });
        } else {
            await supabase.from('product_saves').insert([{ user_id, product_id }]);
            res.status(200).json({ message: 'Product saved to wishlist', is_saved: true });
        }
    } catch (error) {
        console.error('Toggle Save Error:', error);
        res.status(500).json({ error: 'Failed to toggle save status.' });
    }
};