// backend/src/modules/product/products.controller.js
import { supabase } from '../../config/supabaseClient.js';

export const createProduct = async (req, res) => {
    try {
        const { seller_id, title, description, price, category } = req.body;
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
                price: parseFloat(price),
                category,
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
        const { title, description, price, category, condition, status } = req.body;

        // Update the product in the database
        const { data, error } = await supabase
            .from('products')
            .update({ 
                title, 
                description, 
                price: parseFloat(price), 
                category, 
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